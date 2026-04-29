import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Chamado {
  id: string;
  latitude: number;
  longitude: number;
  endereco: string;
  veiculo: string;
  bateria_nivel: number;
  status: string;
  valor: number;
  created_at: string;
  resgatista_id: string | null;
}

export function useChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchChamados();

    // Realtime
    const channel = supabase
      .channel('rescue_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rescue_requests' }, () => {
        fetchChamados();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchChamados = async () => {
    const { data } = await supabase
      .from('rescue_requests')
      .select('*')
      .eq('status', 'aguardando')
      .order('created_at', { ascending: false });

    if (data) setChamados(data);
    setLoading(false);
  };

  const aceitarChamado = async (id: string, resgatista_id: string) => {
    const { data, error } = await supabase
      .from('rescue_requests')
      .update({ status: 'aceito', resgatista_id, accepted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  };

  const concluirChamado = async (id: string) => {
    await supabase
      .from('rescue_requests')
      .update({ status: 'concluido', completed_at: new Date().toISOString() })
      .eq('id', id);
  };

  return { chamados, loading, aceitarChamado, concluirChamado, refresh: fetchChamados };
}
