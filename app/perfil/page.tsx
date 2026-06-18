'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PerfilRescue() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('rescue_token');
    if (!token) { router.replace('/login'); return; }
    const d = localStorage.getItem('rescue_driver');
    if (d) setDriver(JSON.parse(d));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('rescue_token');
    localStorage.removeItem('rescue_driver');
    router.replace('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>👤 Meu Perfil</h2>
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 100 }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,59,92,0.15)', border: '2px solid rgba(255,59,92,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 }}>🚐</div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{driver?.name || 'Resgatista'}</h3>
          <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>{driver?.email}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.2)', borderRadius: 20, padding: '4px 12px', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#FF3B5C', fontFamily: 'monospace' }}>⭐ 4.9 · Nível Ouro</span>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[['34','Atendimentos'],['4.9','Avaliação'],['R$2.8k','Este mês']].map(([v,l]) => (
            <div key={l} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#FF3B5C' }}>{v}</p>
              <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{l}</p>
            </div>
          ))}
        </div>
        {/* Menu */}
        {[['🚐','Meu Veículo'],['📋','Histórico completo'],['🔔','Notificações'],['⚙️','Configurações']].map(([icon,label]) => (
          <div key={label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
            <span style={{ color: 'rgba(238,242,247,0.25)', fontSize: 16 }}>›</span>
          </div>
        ))}
        <button onClick={logout} style={{ width: '100%', padding: 14, background: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.3)', borderRadius: 12, color: '#FF3B5C', fontSize: 15, fontWeight: 600, marginTop: 8, cursor: 'pointer' }}>Sair da Conta</button>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {[['🏠','Dashboard','/dashboard'],['📋','Chamados','/chamados'],['💰','Ganhos','/ganhos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href==='/perfil'?'#FF3B5C':'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
