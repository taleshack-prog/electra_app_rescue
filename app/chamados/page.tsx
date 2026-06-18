'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://electra-dashboard-steel.vercel.app/api';

interface Chamado {
  id: string;
  tipo: string;
  dist: string;
  eta: string;
  valor: string;
  bateria: string;
  cliente: string;
  veiculo: string;
  urgencia: string;
  status: string;
  hora: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

type Filtro = 'todos' | 'sos' | 'padrao' | 'aceito' | 'concluido';

const MOCK: Chamado[] = [
  { id:'1', tipo:'SOS Emergencial', dist:'1,2 km', eta:'~4 min',  valor:'R$ 85',  bateria:'8%',  cliente:'Marina Costa',  veiculo:'Tesla Model 3',   urgencia:'alta',  status:'disponivel', hora:'14:32' },
  { id:'2', tipo:'Recarga Padrão',  dist:'2,8 km', eta:'~9 min',  valor:'R$ 45',  bateria:'22%', cliente:'João Silva',    veiculo:'BYD Dolphin',     urgencia:'media', status:'disponivel', hora:'14:28' },
  { id:'3', tipo:'Recarga Padrão',  dist:'4,1 km', eta:'~13 min', valor:'R$ 40',  bateria:'18%', cliente:'Ana Souza',     veiculo:'Fiat 500e',       urgencia:'baixa', status:'disponivel', hora:'14:25' },
  { id:'4', tipo:'SOS Emergencial', dist:'3,5 km', eta:'~11 min', valor:'R$ 90',  bateria:'5%',  cliente:'Pedro Lima',    veiculo:'Hyundai IONIQ',   urgencia:'alta',  status:'disponivel', hora:'14:20' },
  { id:'5', tipo:'Recarga Padrão',  dist:'6,2 km', eta:'~19 min', valor:'R$ 38',  bateria:'31%', cliente:'Carla Mendes',  veiculo:'BYD Seal',        urgencia:'baixa', status:'disponivel', hora:'14:15' },
  { id:'6', tipo:'Recarga Padrão',  dist:'1,8 km', eta:'~6 min',  valor:'R$ 42',  bateria:'25%', cliente:'Lucas Rocha',   veiculo:'Chevrolet Bolt',  urgencia:'media', status:'aceito',     hora:'14:10' },
  { id:'7', tipo:'SOS Emergencial', dist:'2,2 km', eta:'~7 min',  valor:'R$ 95',  bateria:'3%',  cliente:'Beatriz Cruz',  veiculo:'Kia EV6',         urgencia:'alta',  status:'concluido',  hora:'13:45' },
];

export default function ChamadosPage() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [chamados, setChamados] = useState<Chamado[]>(MOCK);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Busca chamados reais do Neon e mistura com mock
    fetch(API + '/sos')
      .then(r => r.json())
      .then(d => {
        if (d.requests && d.requests.length > 0) {
          const reais: Chamado[] = d.requests.map((c: any) => ({
            id: c.id,
            tipo: c.urgencyLevel === 'high' ? 'SOS Emergencial' : 'Recarga Padrão',
            dist: '— km',
            eta: '— min',
            valor: c.urgencyLevel === 'high' ? 'R$ 85' : 'R$ 45',
            bateria: '—%',
            cliente: c.address || 'Localização do cliente',
            veiculo: c.description || '—',
            urgencia: c.urgencyLevel === 'high' ? 'alta' : c.urgencyLevel === 'medium' ? 'media' : 'baixa',
            status: c.status === 'pending' ? 'disponivel' : c.status === 'accepted' ? 'aceito' : 'concluido',
            hora: new Date(c.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            address: c.address,
            latitude: c.latitude,
            longitude: c.longitude,
          }));
          setChamados(reais);
        }
      }).catch(() => {});

    const p = setInterval(() => setPulse(x => !x), 700);
    return () => clearInterval(p);
  }, []);

  const urgCor = (u: string) => u === 'alta' ? '#FF3B5C' : u === 'media' ? '#FFB800' : '#00E5FF';
  const statusCor = (s: string) => s === 'disponivel' ? '#00FF87' : s === 'aceito' ? '#FFB800' : '#808080';
  const statusLabel = (s: string) => s === 'disponivel' ? 'Disponível' : s === 'aceito' ? 'Em andamento' : 'Concluído';

  const FILTROS: { key: Filtro; label: string }[] = [
    { key: 'todos', label: 'Disponíveis' },
    { key: 'sos', label: '🆘 SOS' },
    { key: 'padrao', label: '⚡ Padrão' },
    { key: 'aceito', label: 'Em andamento' },
    { key: 'concluido', label: 'Concluídos' },
  ];

  const filtrados = chamados.filter(c => {
    if (filtro === 'todos') return c.status === 'disponivel';
    if (filtro === 'sos') return c.tipo === 'SOS Emergencial' && c.status === 'disponivel';
    if (filtro === 'padrao') return c.tipo === 'Recarga Padrão' && c.status === 'disponivel';
    if (filtro === 'aceito') return c.status === 'aceito';
    if (filtro === 'concluido') return c.status === 'concluido';
    return true;
  });

  const countDisp = chamados.filter(c => c.status === 'disponivel').length;
  const countSOS = chamados.filter(c => c.urgencia === 'alta' && c.status === 'disponivel').length;

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>Chamados</h2>
            <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)' }}>{countDisp} disponíveis · {countSOS} urgentes</p>
          </div>
          {countSOS > 0 && (
            <div style={{ background: 'rgba(255,59,92,0.15)', border: '1.5px solid rgba(255,59,92,0.4)', borderRadius: 20, padding: '6px 12px', transform: `scale(${pulse ? 1.08 : 1})`, transition: 'transform 0.3s' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FF3B5C' }}>🆘 {countSOS}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }}>
        {FILTROS.map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)} style={{ padding: '7px 14px', borderRadius: 20, background: filtro === f.key ? 'rgba(255,59,92,0.15)' : '#111827', border: `1px solid ${filtro === f.key ? 'rgba(255,59,92,0.4)' : 'rgba(255,255,255,0.08)'}`, color: filtro === f.key ? '#FF3B5C' : 'rgba(238,242,247,0.5)', fontSize: 13, fontWeight: filtro === f.key ? 700 : 400, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>{f.label}</button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', paddingBottom: 90 }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'rgba(238,242,247,0.5)' }}>Nenhum chamado aqui</p>
            <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.3)', marginTop: 6 }}>Aguarde novos chamados na sua área</p>
          </div>
        ) : filtrados.map(c => (
          <div key={c.id} onClick={() => c.status === 'disponivel' && router.push('/detalhes?id=' + c.id)}
            style={{ background: '#111827', border: `1px solid ${c.urgencia === 'alta' ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 20, padding: 16, marginBottom: 12, cursor: c.status === 'disponivel' ? 'pointer' : 'default' }}>
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ background: urgCor(c.urgencia) + '22', border: `1px solid ${urgCor(c.urgencia)}44`, borderRadius: 20, padding: '3px 10px', fontSize: 10, color: urgCor(c.urgencia), fontFamily: 'monospace' }}>
                {c.urgencia === 'alta' ? '🔴 SOS URGENTE' : c.urgencia === 'media' ? '🟡 Padrão' : '🔵 Normal'}
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: statusCor(c.status), fontFamily: 'monospace' }}>{statusLabel(c.status)}</div>
                <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.3)', marginTop: 2 }}>{c.hora}</div>
              </div>
            </div>
            {/* Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{c.cliente}</p>
                <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', marginBottom: 4 }}>{c.veiculo}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: parseInt(c.bateria) <= 10 ? '#FF3B5C' : '#FFB800', fontFamily: 'monospace' }}>🔋 {c.bateria}</span>
                  <span style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>{c.tipo}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#00FF87', marginBottom: 4 }}>{c.valor}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.6)', fontFamily: 'monospace' }}>📍 {c.dist}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', marginTop: 2 }}>⏱ {c.eta}</div>
              </div>
            </div>
            {/* CTA */}
            {c.status === 'disponivel' && (
              <button onClick={() => router.push('/detalhes?id=' + c.id)} style={{ width: '100%', padding: '10px', background: urgCor(c.urgencia), border: 'none', borderRadius: 12, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Ver detalhes →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {[['🏠','Home','/dashboard'],['📋','Chamados','/chamados'],['💰','Ganhos','/ganhos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href === '/chamados' ? '#FF3B5C' : 'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
