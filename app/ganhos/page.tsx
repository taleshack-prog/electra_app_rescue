'use client';
import { useRouter } from 'next/navigation';

export default function GanhosPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '16px 16px 0', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>💰 Ganhos</h2>
      </div>
      <div style={{ padding: '0 16px', paddingBottom: 80 }}>
        {/* Saldo */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,255,135,0.1), rgba(0,229,255,0.05))', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.4)', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 8 }}>GANHOS DO MÊS</p>
          <p style={{ fontSize: 52, fontWeight: 800, color: '#00FF87' }}>R$ 2.840</p>
          <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)', marginTop: 4 }}>34 atendimentos · Média R$ 83,52</p>
        </div>
        {/* Meta */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>Meta mensal</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#00FF87' }}>R$ 2.840 / R$ 4.000</p>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '71%', height: '100%', background: '#00FF87', borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', marginTop: 6 }}>71% da meta · Faltam R$ 1.160</p>
        </div>
        {/* Histórico */}
        <p style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12 }}>ÚLTIMOS ATENDIMENTOS</p>
        {[
          { data: 'Hoje 14:32', tipo: 'SOS Emergencial', val: 'R$ 85,00', cor: '#FF3B5C' },
          { data: 'Hoje 11:15', tipo: 'Recarga Padrão', val: 'R$ 45,00', cor: '#FFB800' },
          { data: 'Ontem 19:48', tipo: 'SOS Emergencial', val: 'R$ 90,00', cor: '#FF3B5C' },
          { data: 'Ontem 15:22', tipo: 'Recarga Padrão', val: 'R$ 40,00', cor: '#FFB800' },
        ].map((a, i) => (
          <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '13px 16px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{a.tipo}</p>
              <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.38)', marginTop: 2 }}>{a.data}</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#00FF87' }}>{a.val}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '8px 0 10px', maxWidth: 430, margin: '0 auto', zIndex: 100 }}>
        {[['🏠','Dashboard','/dashboard'],['📋','Chamados','/chamados'],['💰','Ganhos','/ganhos'],['👤','Perfil','/perfil']].map(([icon,label,href]) => (
          <button key={href} onClick={() => router.push(href as string)} style={{ flex: 1, background: 'transparent', border: 'none', color: href==='/ganhos'?'#FF3B5C':'rgba(238,242,247,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
