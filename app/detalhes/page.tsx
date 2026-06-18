'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import 'leaflet/dist/leaflet.css';

const API = 'https://electra-dashboard-steel.vercel.app/api';

function DetalhesChamadoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');
  const mapRef = useRef<{map: any; L: any} | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [chamado, setChamado] = useState<any>(null);
  const [timer, setTimer] = useState(30);
  const [aceitando, setAceitando] = useState(false);
  const [recusando, setRecusando] = useState(false);
  const [expirado, setExpirado] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!id) { router.replace('/dashboard'); return; }
    const token = localStorage.getItem('rescue_token');
    if (!token) { router.replace('/login'); return; }
    // Busca detalhes do chamado
    fetch(API + '/sos', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => {
        if (d.requests) {
          const c = d.requests.find((x: any) => x.id === id);
          if (c) setChamado(c);
        }
      });
  }, [id, router]);

  // Timer regressivo 30s
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
      const map = L.map(mapDivRef.current!, { zoomControl: false, attributionControl: false })
        .setView([chamado.latitude || -30.0346, chamado.longitude || -51.2177], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const style = document.createElement('style');
      style.textContent = '.leaflet-tile{filter:brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.55)!important;}';
      document.head.appendChild(style);
      // Pin cliente
      const clienteIcon = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 12px #FF3B5C88;"></div>', iconSize: [16,16], iconAnchor: [8,8] });
      L.marker([chamado.latitude || -30.0346, chamado.longitude || -51.2177], { icon: clienteIcon }).addTo(map);
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
        body: JSON.stringify({ sosId: id, driverId: driver.id }),
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
    router.replace('/dashboard');
  };

  const urgCor = (u: string) => u === 'high' ? '#FF3B5C' : u === 'medium' ? '#FFB800' : '#00E5FF';

  if (!chamado) return (
    <div style={{ height: '100vh', background: '#070B14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EEF2F7' }}>Carregando...</div>
  );

  if (expirado) return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Chamado não disponível</h2>
      <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.4)', marginBottom: 24 }}>Outro resgatista aceitou primeiro.</p>
      <button onClick={() => router.replace('/dashboard')} style={{ padding: '12px 28px', background: '#FF3B5C', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Ver outros chamados</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 17, fontWeight: 700, flex: 1 }}>Detalhes do Chamado</h2>
        {/* Timer */}
        <div style={{ background: timer <= 10 ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${timer <= 10 ? 'rgba(255,59,92,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '6px 12px', transform: `scale(${timer <= 10 && pulse ? 1.05 : 1})`, transition: 'transform 0.3s' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: timer <= 10 ? '#FF3B5C' : '#EEF2F7' }}>⏱ {timer}s</span>
        </div>
      </div>

      {/* Badge urgência */}
      <div style={{ margin: '0 16px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: urgCor(chamado.urgencyLevel) + '22', border: `1px solid ${urgCor(chamado.urgencyLevel)}44`, borderRadius: 20, padding: '4px 12px', fontSize: 11, color: urgCor(chamado.urgencyLevel), fontFamily: 'monospace' }}>
          {chamado.urgencyLevel === 'high' ? '🔴 SOS EMERGENCIAL' : chamado.urgencyLevel === 'medium' ? '🟡 RECARGA PADRÃO' : '🔵 NORMAL'}
        </span>
      </div>

      <div style={{ padding: '0 16px', paddingBottom: 160 }}>
        {/* Mini mapa */}
        <div style={{ height: 180, borderRadius: 14, overflow: 'hidden', marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Localização */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8 }}>LOCALIZAÇÃO</p>
          <p style={{ fontSize: 14, color: '#EEF2F7', marginBottom: 4 }}>📍 {chamado.address || 'Localização do cliente'}</p>
          {chamado.description && <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', fontStyle: 'italic', marginTop: 8, padding: '8px 12px', background: 'rgba(255,184,0,0.05)', borderLeft: '2px solid #FFB800', borderRadius: '0 8px 8px 0' }}>&#34;{chamado.description}&#34;</p>}
        </div>

        {/* Resumo */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 10 }}>
          {[['Tipo de chamado', chamado.urgencyLevel === 'high' ? 'SOS Emergencial' : 'Recarga Padrão', '#EEF2F7'],
            ['Tempo estimado', '~8 minutos', '#00FF87'],
            ['Ganho estimado', chamado.urgencyLevel === 'high' ? 'R$ 85,00' : 'R$ 45,00', '#00E5FF']
          ].map(([l,v,c]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)' }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botões fixos */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, background: '#070B14', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {!recusando ? (
          <>
            <button onClick={aceitar} disabled={aceitando} style={{ width: '100%', padding: 16, background: '#00FF87', border: 'none', borderRadius: 14, color: '#070B14', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10, boxShadow: '0 0 24px rgba(0,255,135,0.3)' }}>
              {aceitando ? 'Aceitando...' : '✅ Aceitar Chamado'}
            </button>
            <button onClick={() => setRecusando(true)} style={{ width: '100%', padding: 13, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(238,242,247,0.5)', fontSize: 15, cursor: 'pointer' }}>✕ Recusar</button>
          </>
        ) : (
          <div>
            <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', marginBottom: 10, textAlign: 'center' }}>Por que está recusando?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Muito longe', 'Fora da minha rota', 'Valor insuficiente', 'Problema no veículo', 'Outro motivo'].map(m => (
                <button key={m} onClick={() => recusar(m)} style={{ padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(238,242,247,0.7)', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>{m}</button>
              ))}
            </div>
            <button onClick={() => setRecusando(false)} style={{ width: '100%', marginTop: 10, padding: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(238,242,247,0.4)', fontSize: 13, cursor: 'pointer' }}>Voltar e aceitar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DetalhesChamado() {
  return <Suspense fallback={<div style={{height:'100vh',background:'#070B14'}}/>}><DetalhesChamadoContent /></Suspense>;
}
