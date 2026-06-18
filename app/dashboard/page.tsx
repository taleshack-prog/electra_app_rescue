'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://electra-dashboard-steel.vercel.app/api';

interface SosRequest {
  id: string;
  address: string;
  description: string;
  urgencyLevel: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  userName?: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
}

export default function DashboardRescue() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [online, setOnline] = useState(true);
  const [chamados, setChamados] = useState<SosRequest[]>([]);
  const [pulse, setPulse] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('rescue_token');
    const d = localStorage.getItem('rescue_driver');
    if (!token) { router.replace('/login'); return; }
    if (d) setDriver(JSON.parse(d));
    carregarChamados(token);
    // Polling a cada 10s para novos chamados
    pollRef.current = setInterval(() => carregarChamados(token), 10000);
    // Pulso visual
    const p = setInterval(() => setPulse(x => !x), 800);
    return () => { if (pollRef.current) clearInterval(pollRef.current); clearInterval(p); };
  }, [router]);

  const carregarChamados = async (token: string) => {
    try {
      const r = await fetch(API + '/sos', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const d = await r.json();
      if (d.requests) {
        const pendentes = d.requests.filter((x: SosRequest) => x.status === 'pending');
        setChamados(pendentes);
      }
    } catch {}
  };

  const urgCor = (u: string) => u === 'high' ? '#FF3B5C' : u === 'medium' ? '#FFB800' : '#00E5FF';
  const urgLabel = (u: string) => u === 'high' ? '🔴 URGENTE' : u === 'medium' ? '🟡 Padrão' : '🔵 Normal';

  const logout = () => {
    localStorage.removeItem('rescue_token');
    localStorage.removeItem('rescue_driver');
    router.replace('/login');
  };

  const tempoAtras = (dt: string) => {
    const diff = Math.floor((Date.now() - new Date(dt).getTime()) / 1000);
    if (diff < 60) return diff + 's atrás';
    return Math.floor(diff / 60) + 'min atrás';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,59,92,0.6)', fontFamily: 'monospace', letterSpacing: 3 }}>RESGATISTA</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{driver?.name?.split(' ')[0] || 'Olá'} 🚐</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,59,92,0.15)', border: '1.5px solid rgba(255,59,92,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }} onClick={() => router.push('/perfil')}>👤</div>
        </div>
      </div>

      {/* Toggle Online */}
      <div style={{ margin: '0 16px 16px', background: '#111827', border: `1px solid ${online ? 'rgba(0,255,135,0.3)' : 'rgba(255,59,92,0.3)'}`, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: online ? '#00FF87' : '#FF3B5C', transform: `scale(${pulse && online ? 1.3 : 1})`, transition: 'transform 0.3s', boxShadow: online ? '0 0 8px #00FF87' : 'none' }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: online ? '#00FF87' : '#FF3B5C' }}>{online ? '● ONLINE — Recebendo chamados' : '○ OFFLINE — Indisponível'}</p>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>{online ? 'Visível para chamados na sua área' : 'Ative para receber chamados'}</p>
        </div>
        <div onClick={() => setOnline(o => !o)} style={{ width: 48, height: 26, borderRadius: 13, background: online ? 'rgba(0,255,135,0.3)' : 'rgba(255,59,92,0.3)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
          <div style={{ position: 'absolute', top: 3, left: online ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: online ? '#00FF87' : '#FF3B5C', transition: 'left 0.2s' }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 16px', marginBottom: 16 }}>
        {[['💰','Ganhos hoje','R$ 284','#00FF87'],['🆘','Chamados hoje','4','#FF3B5C'],['⭐','Avaliação','4.9★','#FFB800'],['📍','Km rodados','67 km','#00E5FF']].map(([icon,label,val,cor]) => (
          <div key={label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: cor as string, marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.4)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chamados pendentes */}
      <div style={{ padding: '0 16px', paddingBottom: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 2 }}>CHAMADOS PENDENTES</p>
          <span style={{ background: chamados.length > 0 ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.05)', color: chamados.length > 0 ? '#FF3B5C' : 'rgba(238,242,247,0.3)', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>{chamados.length} abertos</span>
        </div>

        {chamados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(238,242,247,0.25)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚐</div>
            <p style={{ fontSize: 14 }}>{online ? 'Aguardando chamados...' : 'Fique online para receber chamados'}</p>
          </div>
        )}

        {chamados.map((c) => (
          <div key={c.id} onClick={() => router.push('/detalhes?id=' + c.id)} style={{ background: '#111827', border: `1px solid ${urgCor(c.urgencyLevel)}33`, borderRadius: 18, padding: 16, marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ background: urgCor(c.urgencyLevel) + '22', border: `1px solid ${urgCor(c.urgencyLevel)}44`, borderRadius: 20, padding: '3px 10px', fontSize: 10, color: urgCor(c.urgencyLevel), fontFamily: 'monospace' }}>{urgLabel(c.urgencyLevel)}</span>
              <span style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)' }}>{tempoAtras(c.createdAt)}</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.address || 'Localização do cliente'}</p>
            {c.description && <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginBottom: 8 }}>{c.description}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.5)' }}>📍 Ver detalhes</span>
              <span style={{ background: '#FF3B5C', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: '#fff' }}>Ver →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {[['🏠','Dashboard','/dashboard'],['📋','Chamados','/chamados'],['💰','Ganhos','/ganhos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href === '/dashboard' ? '#FF3B5C' : 'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
