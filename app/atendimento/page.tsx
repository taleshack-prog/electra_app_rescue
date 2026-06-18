'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import 'leaflet/dist/leaflet.css';

function AtendimentoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<{map: any; L: any} | null>(null);
  const [eta, setEta] = useState(8);
  const [fase, setFase] = useState<'navegando'|'chegou'|'concluido'>('navegando');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('rescue_token');
    if (!token) { router.replace('/login'); return; }
    const p = setInterval(() => setPulse(x => !x), 600);
    const e = setInterval(() => setEta(t => Math.max(0, t - 1)), 60000);
    return () => { clearInterval(p); clearInterval(e); };
  }, [router]);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      const map = L.map(mapDivRef.current!, { zoomControl: false, attributionControl: false })
        .setView([-30.0300, -51.2150], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const style = document.createElement('style');
      style.textContent = '.leaflet-tile{filter:brightness(0.85) saturate(0.7) hue-rotate(180deg) invert(1) brightness(0.55)!important;}';
      document.head.appendChild(style);
      // Pin cliente (vermelho)
      const ci = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:50%;background:#FF3B5C;border:3px solid #070B14;box-shadow:0 0 12px #FF3B5C88;"></div>', iconSize: [16,16], iconAnchor: [8,8] });
      L.marker([-30.0346, -51.2177], { icon: ci }).addTo(map);
      // Pin resgatista (verde)
      const ri = L.divIcon({ className: '', html: '<div style="background:#111827;border:2px solid #00FF87;border-radius:8px;padding:3px 6px;font-size:16px;">🚐</div>', iconSize: [36,28], iconAnchor: [18,14] });
      const rm = L.marker([-30.0200, -51.2100], { icon: ri }).addTo(map);
      // Rota
      L.polyline([[-30.0200,-51.2100],[-30.0346,-51.2177]], { color: '#00FF87', weight: 2.5, dashArray: '8,6', opacity: 0.7 }).addTo(map);
      // Anima resgatista
      const steps = [[-30.0200,-51.2100],[-30.0250,-51.2130],[-30.0300,-51.2155],[-30.0346,-51.2177]];
      let s = 0;
      setInterval(() => { if (s < steps.length-1) { s++; rm.setLatLng(steps[s] as any); } }, 5000);
      map.fitBounds([[-30.0200,-51.2100],[-30.0346,-51.2177]], { padding: [40,40] });
      mapRef.current = { map, L };
    });
  }, []);

  const concluir = async () => {
    const token = localStorage.getItem('rescue_token');
    const driver = JSON.parse(localStorage.getItem('rescue_driver') || '{}');
    try {
      await fetch('https://electra-dashboard-steel.vercel.app/api/sos/concluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ sosId: id, driverId: driver.id, kwhEntregue: 15, observacao: 'Atendimento concluído' }),
      });
    } catch {}
    router.push('/dashboard');
  };

  return (
    <div style={{ height: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)', borderRadius: 20, padding: '5px 14px', width: 'fit-content' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FF87', transform: `scale(${pulse ? 1.3 : 1})`, transition: 'transform 0.3s' }} />
          <span style={{ fontSize: 12, color: '#00FF87', fontWeight: 600, fontFamily: 'monospace' }}>ATENDIMENTO ATIVO</span>
        </div>
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, #070B14)', pointerEvents: 'none' }} />
      </div>

      {/* Card info */}
      <div style={{ padding: '12px 16px 20px', flexShrink: 0 }}>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>A caminho do cliente</p>
              <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>Siga a rota indicada</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00FF87' }}>{eta}</div>
              <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)' }}>min</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setFase('chegou')} style={{ flex: 1, padding: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 12, color: '#00E5FF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📍 Cheguei</button>
            <button onClick={() => window.open('tel:+5551999999999')} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(238,242,247,0.6)', fontSize: 13, cursor: 'pointer' }}>📞 Ligar</button>
          </div>
        </div>

        {fase === 'chegou' && (
          <button onClick={concluir} style={{ width: '100%', padding: 15, background: '#00FF87', border: 'none', borderRadius: 14, color: '#070B14', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(0,255,135,0.3)' }}>
            ✅ Concluir Atendimento
          </button>
        )}
      </div>
    </div>
  );
}

export default function AtendimentoPage() {
  return <Suspense fallback={<div style={{height:'100vh',background:'#070B14'}}/>}><AtendimentoContent /></Suspense>;
}
