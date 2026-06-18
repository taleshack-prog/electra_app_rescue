'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

const API = 'https://electra-dashboard-steel.vercel.app/api';

const MOCK_DB: Record<string, any> = {
  '1': { id:'1', address:'Av. Paulista, 900 — Bela Vista', description:'Carro parou no acostamento. Pisca alerta ligado.', urgencyLevel:'high', latitude:-30.0346, longitude:-51.2177, cliente:'Marina Costa', veiculo:'Tesla Model 3', bateria:'8%', valor:'R$ 85,00', dist:'1,2 km', eta:4 },
  '2': { id:'2', address:'R. Augusta, 400 — Consolação', description:'Preciso de recarga para chegar em casa.', urgencyLevel:'medium', latitude:-30.0280, longitude:-51.2100, cliente:'João Silva', veiculo:'BYD Dolphin', bateria:'22%', valor:'R$ 45,00', dist:'2,8 km', eta:9 },
  '3': { id:'3', address:'R. Oscar Freire, 200 — Jardins', description:'', urgencyLevel:'low', latitude:-30.0200, longitude:-51.2050, cliente:'Ana Souza', veiculo:'Fiat 500e', bateria:'18%', valor:'R$ 40,00', dist:'4,1 km', eta:13 },
  '4': { id:'4', address:'Av. Faria Lima, 3000 — Itaim', description:'Bateria morreu na rampa do shopping.', urgencyLevel:'high', latitude:-30.0150, longitude:-51.2000, cliente:'Pedro Lima', veiculo:'Hyundai IONIQ', bateria:'5%', valor:'R$ 90,00', dist:'3,5 km', eta:11 },
  '5': { id:'5', address:'Av. Ipiranga, 500 — Centro', description:'', urgencyLevel:'low', latitude:-30.0300, longitude:-51.2200, cliente:'Carla Mendes', veiculo:'BYD Seal', bateria:'31%', valor:'R$ 38,00', dist:'6,2 km', eta:19 },
};

function DetalhesChamadoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id') || '1';
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{map: any; L: any} | null>(null);
  const [chamado, setChamado] = useState<any>(null);
  const [timer, setTimer] = useState(30);
  const [aceitando, setAceitando] = useState(false);
  const [recusando, setRecusando] = useState(false);
  const [expirado, setExpirado] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Primeiro tenta dados reais, senão usa mock
    fetch(API + '/sos')
      .then(r => r.json())
      .then(d => {
        if (d.requests) {
          const real = d.requests.find((x: any) => x.id === id);
          if (real) { setChamado(real); return; }
        }
        // Usa mock
        setChamado(MOCK_DB[id] || MOCK_DB['1']);
      })
      .catch(() => setChamado(MOCK_DB[id] || MOCK_DB['1']));
  }, [id]);

  // Timer 30s
  useEffect(() => {
    const t = setInterval(() => {
      setTimer(s => {
        if (s <= 1) { clearInterval(t); setExpirado(true); return 0; }
        return s - 1;
      });
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Mapa Leaflet
  useEffect(() => {
    if (!chamado || !mapDivRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      const lat = chamado.latitude || -30.0346;
      const lng = chamado.longitude || -51.2177;
      const map = L.map(mapDivRef.current!, { zoomControl: false, attributionControl: false })
        .setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const style = document.createElement('style');
      style.textContent = '.leaflet-tile{filter:brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.55)!important;} .leaflet-popup-content-wrapper{background:rgba(13,19,32,0.97);border:1px solid rgba(255,59,92,0.25);border-radius:12px;} .leaflet-popup-content{margin:10px 14px;} .leaflet-popup-tip{background:rgba(13,19,32,0.97);}';
      document.head.appendChild(style);
      // Pin cliente vermelho
      const ci = L.divIcon({ className: '', html: `<div style="width:18px;height:18px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 16px #FF3B5C88;"></div>`, iconSize: [18,18], iconAnchor: [9,9], popupAnchor: [0,-12] });
      L.marker([lat, lng], { icon: ci }).addTo(map)
        .bindPopup(`<div style="color:#EEF2F7;font-family:sans-serif;font-size:12px;"><strong>${chamado.cliente || 'Cliente'}</strong><br/>${chamado.veiculo || '—'} · 🔋 ${chamado.bateria || '—'}</div>`)
        .openPopup();
      // Pin resgatista verde
      const ri = L.divIcon({ className: '', html: `<div style="background:#111827;border:2px solid #00FF87;border-radius:8px;padding:3px 6px;font-size:16px;">🚐</div>`, iconSize: [36,28], iconAnchor: [18,14] });
      L.marker([lat - 0.015, lng - 0.012], { icon: ri }).addTo(map);
      // Rota tracejada
      L.polyline([[lat - 0.015, lng - 0.012], [lat, lng]], { color: '#00E5FF', weight: 2.5, dashArray: '8,6', opacity: 0.7 }).addTo(map);
      map.fitBounds([[lat - 0.015, lng - 0.012], [lat, lng]], { padding: [40, 40] });
      mapRef.current = { map, L };
    });
  }, [chamado]);

  const aceitar = async () => {
    setAceitando(true);
    const token = localStorage.getItem('rescue_token');
    const driver = JSON.parse(localStorage.getItem('rescue_driver') || '{}');
    try {
      await fetch(API + '/sos/aceitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ sosId: id, driverId: driver.id || 'demo' }),
      });
    } catch {}
    router.push('/atendimento?id=' + id);
  };

  const recusar = async (motivo: string) => {
    const token = localStorage.getItem('rescue_token');
    try {
      await fetch(API + '/sos/recusar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ sosId: id, motivo }),
      });
    } catch {}
    router.replace('/chamados');
  };

  const urgCor = (u: string) => u === 'high' || u === 'alta' ? '#FF3B5C' : u === 'medium' || u === 'media' ? '#FFB800' : '#00E5FF';
  const urgLabel = (u: string) => u === 'high' || u === 'alta' ? '🔴 SOS EMERGENCIAL' : u === 'medium' || u === 'media' ? '🟡 RECARGA PADRÃO' : '🔵 NORMAL';

  if (expirado) return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Chamado não disponível</h2>
      <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.4)', marginBottom: 24 }}>Outro resgatista aceitou primeiro.</p>
      <button onClick={() => router.replace('/chamados')} style={{ padding: '12px 28px', background: '#FF3B5C', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Ver outros chamados</button>
    </div>
  );

  if (!chamado) return (
    <div style={{ height: '100vh', background: '#070B14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(238,242,247,0.4)' }}>Carregando...</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 17, fontWeight: 700, flex: 1 }}>Detalhes do Chamado</h2>
        {/* Timer */}
        <div style={{ background: timer <= 10 ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${timer <= 10 ? '#FF3B5C' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '6px 14px', transform: `scale(${timer <= 10 && pulse ? 1.06 : 1})`, transition: 'transform 0.3s' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: timer <= 10 ? '#FF3B5C' : '#EEF2F7' }}>⏱ {timer}s</span>
        </div>
      </div>

      {/* Badge urgência */}
      <div style={{ margin: '0 16px 14px' }}>
        <span style={{ background: urgCor(chamado.urgencyLevel || chamado.urgencia) + '22', border: `1px solid ${urgCor(chamado.urgencyLevel || chamado.urgencia)}44`, borderRadius: 20, padding: '5px 14px', fontSize: 11, color: urgCor(chamado.urgencyLevel || chamado.urgencia), fontFamily: 'monospace' }}>
          {urgLabel(chamado.urgencyLevel || chamado.urgencia)}
        </span>
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 180 }}>
        {/* KPIs decisão */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, borderLeft: '3px solid #00E5FF' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#EEF2F7' }}>📍 {chamado.dist || '— km'}</div>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>~{chamado.eta || '—'} min ETA</div>
          </div>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, borderLeft: '3px solid #00FF87' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#00FF87' }}>{chamado.valor || (chamado.urgencyLevel === 'high' ? 'R$ 85,00' : 'R$ 45,00')}</div>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>estimado</div>
          </div>
        </div>

        {/* Mini mapa */}
        <div style={{ height: 180, borderRadius: 14, overflow: 'hidden', marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Card cliente */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16, marginBottom: 10 }}>
          <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 10 }}>CLIENTE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{chamado.cliente || 'Cliente'}</p>
              <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>⭐ 4.8 · {chamado.veiculo || '—'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <span style={{ background: 'rgba(255,59,92,0.12)', color: '#FF3B5C', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontFamily: 'monospace' }}>🔋 {chamado.bateria || '—'}</span>
          </div>
          <p style={{ fontSize: 13, color: '#EEF2F7', marginBottom: 4 }}>📍 {chamado.address || 'Localização do cliente'}</p>
          {(chamado.description || chamado.observacao) && (
            <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.5)', fontStyle: 'italic', marginTop: 8, padding: '8px 12px', background: 'rgba(255,184,0,0.05)', borderLeft: '2px solid #FFB800', borderRadius: '0 8px 8px 0' }}>
              &#34;{chamado.description || chamado.observacao}&#34;
            </p>
          )}
        </div>

        {/* Política */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)' }}>⚠️ Após aceitar, cancelamentos afetam sua avaliação.</p>
        </div>
      </div>

      {/* Botões fixos */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 20px', background: '#070B14', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {!recusando ? (
          <>
            <button onClick={aceitar} disabled={aceitando} style={{ width: '100%', padding: 16, background: '#00FF87', border: 'none', borderRadius: 14, color: '#070B14', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10, boxShadow: '0 0 24px rgba(0,255,135,0.3)', opacity: aceitando ? 0.7 : 1 }}>
              {aceitando ? 'Aceitando...' : '✅ Aceitar Chamado'}
            </button>
            <button onClick={() => setRecusando(true)} style={{ width: '100%', padding: 13, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(238,242,247,0.5)', fontSize: 15, cursor: 'pointer' }}>✕ Recusar</button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', marginBottom: 10, textAlign: 'center' }}>Por que está recusando?</p>
            {['Muito longe', 'Fora da minha rota', 'Valor insuficiente', 'Problema no veículo', 'Outro motivo'].map(m => (
              <button key={m} onClick={() => recusar(m)} style={{ width: '100%', padding: '11px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(238,242,247,0.7)', fontSize: 14, cursor: 'pointer', textAlign: 'left', marginBottom: 7 }}>{m}</button>
            ))}
            <button onClick={() => setRecusando(false)} style={{ width: '100%', padding: 11, background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, color: 'rgba(238,242,247,0.4)', fontSize: 13, cursor: 'pointer' }}>← Voltar e aceitar</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DetalhesChamado() {
  return <Suspense fallback={<div style={{height:'100vh',background:'#070B14'}}/>}><DetalhesChamadoContent /></Suspense>;
}
