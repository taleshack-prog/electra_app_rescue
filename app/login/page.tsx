'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://electra-dashboard-steel.vercel.app/api';

export default function LoginRescue() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const login = async () => {
    if (!email || !senha) { setErro('Preencha email e senha.'); return; }
    setLoading(true); setErro('');
    try {
      const r = await fetch(API + '/resgatistas/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });
      const d = await r.json();
      if (d.token) {
        localStorage.setItem('rescue_token', d.token);
        localStorage.setItem('rescue_driver', JSON.stringify(d.driver));
        router.push('/dashboard');
      } else { setErro(d.error || 'Erro ao entrar.'); }
    } catch { setErro('Sem conexão.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, maxWidth: 430, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <svg width="56" height="56" viewBox="0 0 40 40" style={{ marginBottom: 12 }}>
          <rect width="40" height="40" rx="10" fill="#FF3B5C" opacity="0.15"/>
          <polygon points="23,5 12,22 19,22 17,35 28,18 21,18" fill="#FF3B5C"/>
        </svg>
        <h1 style={{ fontFamily: 'sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>ELECTRA <span style={{ color: '#FF3B5C' }}>Rescue</span></h1>
        <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.4)' }}>Portal do Resgatista</p>
      </div>

      <div style={{ width: '100%' }}>
        {[{ label: 'E-MAIL', val: email, set: setEmail, type: 'email', ph: 'seu@email.com' }, { label: 'SENHA', val: senha, set: setSenha, type: 'password', ph: 'Sua senha' }].map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
              style={{ width: '100%', padding: '13px 14px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#EEF2F7', fontSize: 15, outline: 'none' }} />
          </div>
        ))}
        {erro && <p style={{ color: '#FF3B5C', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{erro}</p>}
        <button onClick={login} disabled={loading} style={{ width: '100%', padding: 15, background: '#FF3B5C', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 0 30px rgba(255,59,92,0.3)' }}>
          {loading ? 'Entrando...' : '🚐 Entrar'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(238,242,247,0.35)', marginTop: 16 }}>
          Novo resgatista? <span onClick={() => router.push('/cadastro')} style={{ color: '#FF3B5C', cursor: 'pointer' }}>Solicitar cadastro</span>
        </p>
      </div>
    </div>
  );
}
