'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://electra-dashboard-steel.vercel.app/api';

export default function CadastroResgatista() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpf: '', cnh: '', veiculo_modelo: '', veiculo_placa: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const cadastrar = async () => {
    if (!form.nome || !form.email || !form.cpf) {
      setErro('Nome, email e CPF são obrigatórios.');
      return;
    }
    setLoading(true); setErro('');
    try {
      const r = await fetch(API + '/resgatistas/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.ok) setOk(true);
      else setErro(d.error || 'Erro ao cadastrar.');
    } catch { setErro('Sem conexão. Tente novamente.'); }
    setLoading(false);
  };

  if (ok) return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Cadastro enviado!</h2>
      <p style={{ fontSize: 14, color: 'rgba(238,242,247,0.5)', lineHeight: 1.7, marginBottom: 24, maxWidth: 300 }}>
        Sua solicitação foi enviada para aprovação. Você receberá uma senha provisória por e-mail após a aprovação pela equipe ELECTRA.
      </p>
      <button onClick={() => router.push('/login')} style={{ padding: '13px 32px', background: '#FF3B5C', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        Ir para o Login
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1E25', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(238,242,247,0.6)', fontSize: 18, cursor: 'pointer' }}>←</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>🚐 Solicitar Cadastro</h2>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', marginTop: 2 }}>Resgatista ELECTRA · Aprovação obrigatória</p>
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px' }}>
        {[
          { label: 'Nome completo *', key: 'nome', type: 'text', ph: 'Seu nome completo' },
          { label: 'E-mail *', key: 'email', type: 'email', ph: 'seu@email.com' },
          { label: 'Telefone', key: 'telefone', type: 'tel', ph: '(51) 99999-9999' },
          { label: 'CPF *', key: 'cpf', type: 'text', ph: '000.000.000-00' },
          { label: 'CNH', key: 'cnh', type: 'text', ph: 'Número da CNH' },
          { label: 'Veículo (modelo)', key: 'veiculo_modelo', type: 'text', ph: 'Ex: Fiat Ducato 2023' },
          { label: 'Placa do veículo', key: 'veiculo_placa', type: 'text', ph: 'ABC-1234' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: 'rgba(238,242,247,0.38)', fontFamily: 'monospace', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{f.label.toUpperCase()}</label>
            <input
              type={f.type}
              placeholder={f.ph}
              value={form[f.key as keyof typeof form]}
              onChange={e => set(f.key, e.target.value)}
              style={{ width: '100%', padding: '13px 14px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 11, color: '#EEF2F7', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}

        <div style={{ background: 'rgba(255,59,92,0.05)', border: '1px solid rgba(255,59,92,0.15)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.45)', lineHeight: 1.65 }}>
            Ao solicitar cadastro, você concorda com os <span style={{ color: '#FF3B5C' }}>Termos de Uso</span> e a <span style={{ color: '#FF3B5C' }}>Política de Privacidade</span> da ELECTRA, em conformidade com a <strong style={{ color: '#EEF2F7' }}>LGPD (Lei 13.709/2018)</strong>.
          </p>
        </div>

        {erro && <p style={{ color: '#FF3B5C', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{erro}</p>}

        <button onClick={cadastrar} disabled={loading} style={{ width: '100%', padding: 15, background: '#FF3B5C', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 0 24px rgba(255,59,92,0.25)' }}>
          {loading ? 'Enviando...' : '📋 Enviar solicitação'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(238,242,247,0.35)', marginTop: 16 }}>
          Já aprovado? <span onClick={() => router.push('/login')} style={{ color: '#FF3B5C', cursor: 'pointer' }}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}
