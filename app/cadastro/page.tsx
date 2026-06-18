'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const cadastrar = async () => {
    setLoading(true); setErro('');
    try {
      const r = await fetch('https://electra-dashboard-steel.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, password: senha, phone: telefone }),
      });
      const d = await r.json();
      if (d.ok) {
        localStorage.setItem('electra_token', d.token);
        localStorage.setItem('electra_user', JSON.stringify(d.user));
        router.push('/home');
      } else {
        setErro(d.error || 'Erro ao cadastrar');
      }
    } catch { setErro('Erro de conexão'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
      <h1 style={{ color: '#00E5FF', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Criar Conta</h1>
      <p style={{ color: 'rgba(238,242,247,0.4)', fontSize: 13, marginBottom: 32 }}>ELECTRA — EV Charging</p>

      <div style={{ width: '100%', maxWidth: 380 }}>
        {[
          { placeholder: 'Nome completo', value: nome, onChange: setNome, type: 'text' },
          { placeholder: 'E-mail', value: email, onChange: setEmail, type: 'email' },
          { placeholder: 'Telefone (opcional)', value: telefone, onChange: setTelefone, type: 'tel' },
          { placeholder: 'Senha', value: senha, onChange: setSenha, type: 'password' },
        ].map((f, i) => (
          <input key={i} type={f.type} placeholder={f.placeholder} value={f.value}
            onChange={e => f.onChange(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', background: '#111620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#EEF2F7', fontSize: 15, marginBottom: 12 }}
          />
        ))}
        {erro && <p style={{ color: '#FF3B5C', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{erro}</p>}
        <button onClick={cadastrar} disabled={loading}
          style={{ width: '100%', padding: 16, background: '#00E5FF', borderRadius: 12, color: '#070B14', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
        <button onClick={() => router.push('/login')}
          style={{ width: '100%', padding: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(238,242,247,0.6)', fontSize: 15 }}>
          Já tenho conta
        </button>
      </div>
    </div>
  );
}
