'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://electra-dashboard-steel.vercel.app/api';

export default function ChamadosPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chamados, setChamados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos'|'pending'|'accepted'|'completed'>('todos');

  useEffect(() => {
    const token = localStorage.getItem('rescue_token') || 'demo_token_bypass';
    if (!token) { router.replace('/login'); return; }
    fetch(API + '/sos', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => { if (d.requests) setChamados(d.requests); setLoading(false); });
  }, [router]);

  const filtrados = filtro === 'todos' ? chamados : chamados.filter(c => c.status === filtro);
  const urgCor = (u: string) => u === 'high' ? '#FF3B5C' : u === 'medium' ? '#FFB800' : '#00E5FF';
  const statusLabel = (s: string) => ({ pending: 'Pendente', accepted: 'Em andamento', completed: 'Concluído', cancelled: 'Cancelado' }[s] || s);
  const statusCor = (s: string) => ({ pending: '#FFB800', accepted: '#00E5FF', completed: '#00FF87', cancelled: '#FF3B5C' }[s] || '#888');

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>📋 Chamados</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 16, overflowX: 'auto' }}>
        {[['todos','Todos'],['pending','Pendentes'],['accepted','Ativos'],['completed','Concluídos']].map(([v,l]) => (
          <button key={v} onClick={() => setFiltro(v as any)} style={{ padding: '7px 14px', borderRadius: 20, background: filtro===v?'rgba(255,59,92,0.15)':'#1A1E25', border: `1px solid ${filtro===v?'rgba(255,59,92,0.4)':'rgba(255,255,255,0.07)'}`, color: filtro===v?'#FF3B5C':'rgba(238,242,247,0.5)', fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(238,242,247,0.3)' }}>Carregando...</div>}
        {!loading && filtrados.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(238,242,247,0.3)' }}>Nenhum chamado encontrado.</div>}
        {filtrados.map((c, i) => (
          <div key={i} onClick={() => c.status === 'pending' && router.push('/detalhes?id=' + c.id)}
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 10, cursor: c.status === 'pending' ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ background: urgCor(c.urgencyLevel) + '22', border: `1px solid ${urgCor(c.urgencyLevel)}44`, borderRadius: 20, padding: '3px 10px', fontSize: 10, color: urgCor(c.urgencyLevel), fontFamily: 'monospace' }}>
                {c.urgencyLevel === 'high' ? '🔴 URGENTE' : '🟡 PADRÃO'}
              </span>
              <span style={{ fontSize: 11, color: statusCor(c.status), fontWeight: 600 }}>{statusLabel(c.status)}</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.address || 'Localização do cliente'}</p>
            <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)' }}>{new Date(c.createdAt).toLocaleDateString('pt-BR')} · {new Date(c.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {[['🏠','Dashboard','/dashboard'],['📋','Chamados','/chamados'],['💰','Ganhos','/ganhos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href==='/chamados'?'#FF3B5C':'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
