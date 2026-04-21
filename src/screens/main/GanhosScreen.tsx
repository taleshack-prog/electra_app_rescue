import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity,
} from 'react-native';

type Periodo = 'hoje' | 'semana' | 'mes';

const DADOS: Record<Periodo, any> = {
  hoje: {
    total: 'R$ 369,00', resgates: 5, km: 67, horas: '6h 20min',
    meta: 400, atual: 369,
    transacoes: [
      { hora:'14:32', cliente:'Marina Costa', tipo:'SOS', val:'R$ 85,00', bonus:'R$ 5,00' },
      { hora:'13:45', cliente:'Beatriz Cruz',  tipo:'SOS', val:'R$ 95,00', bonus:'R$ 5,00' },
      { hora:'12:20', cliente:'João Silva',    tipo:'Padrão', val:'R$ 45,00', bonus:'' },
      { hora:'11:10', cliente:'Ana Souza',     tipo:'Padrão', val:'R$ 40,00', bonus:'' },
      { hora:'09:55', cliente:'Pedro Lima',    tipo:'SOS', val:'R$ 90,00', bonus:'R$ 10,00' },
    ],
  },
  semana: {
    total: 'R$ 1.847,00', resgates: 24, km: 312, horas: '31h 45min',
    meta: 2000, atual: 1847,
    transacoes: [
      { hora:'Seg', cliente:'8 atendimentos', tipo:'Mix', val:'R$ 420,00', bonus:'R$ 25,00' },
      { hora:'Ter', cliente:'5 atendimentos', tipo:'Mix', val:'R$ 285,00', bonus:'R$ 10,00' },
      { hora:'Qua', cliente:'6 atendimentos', tipo:'Mix', val:'R$ 340,00', bonus:'R$ 15,00' },
      { hora:'Qui', cliente:'5 atendimentos', tipo:'Mix', val:'R$ 802,00', bonus:'R$ 20,00' },
    ],
  },
  mes: {
    total: 'R$ 7.240,00', resgates: 98, km: 1247, horas: '124h 30min',
    meta: 8000, atual: 7240,
    transacoes: [
      { hora:'Sem 1', cliente:'22 atendimentos', tipo:'Mix', val:'R$ 1.840,00', bonus:'R$ 80,00' },
      { hora:'Sem 2', cliente:'25 atendimentos', tipo:'Mix', val:'R$ 1.920,00', bonus:'R$ 95,00' },
      { hora:'Sem 3', cliente:'28 atendimentos', tipo:'Mix', val:'R$ 2.100,00', bonus:'R$ 110,00' },
      { hora:'Sem 4', cliente:'23 atendimentos', tipo:'Mix', val:'R$ 1.380,00', bonus:'R$ 70,00' },
    ],
  },
};

export default function GanhosScreen() {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [periodo, setPeriodo] = useState<Periodo>('hoje');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const dados = DADOS[periodo];
  const pct = Math.round((dados.atual / dados.meta) * 100);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.headerTitle}>Meus Ganhos</Text>
          <View style={s.nivelBadge}>
            <Text style={s.nivelText}>⭐ Nível Ouro</Text>
          </View>
        </Animated.View>

        {/* Filtro período */}
        <Animated.View style={[s.filtroRow, { opacity:fadeAnim }]}>
          {(['hoje','semana','mes'] as Periodo[]).map(p => (
            <TouchableOpacity key={p} style={[s.filtroBtn, periodo===p && s.filtroBtnActive]} onPress={() => setPeriodo(p)}>
              <Text style={[s.filtroText, periodo===p && s.filtroTextActive]}>
                {p==='hoje' ? 'Hoje' : p==='semana' ? 'Semana' : 'Mês'}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Total */}
        <Animated.View style={[s.totalCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.totalLabel}>TOTAL {periodo.toUpperCase()}</Text>
          <Text style={s.totalVal}>{dados.total}</Text>

          {/* Barra meta */}
          <View style={s.metaRow}>
            <Text style={s.metaText}>Meta: R$ {dados.meta.toLocaleString('pt-BR')}</Text>
            <Text style={[s.metaPct, { color: pct>=100 ? '#00FF87' : pct>=75 ? '#FFB800' : '#FF3B5C' }]}>{pct}%</Text>
          </View>
          <View style={s.metaTrack}>
            <View style={[s.metaFill, {
              width:`${Math.min(pct,100)}%` as any,
              backgroundColor: pct>=100 ? '#00FF87' : pct>=75 ? '#FFB800' : '#FF3B5C'
            }]} />
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[s.statsGrid, { opacity:fadeAnim }]}>
          {[
            { icon:'🆘', label:'Resgates',  val:dados.resgates.toString() },
            { icon:'📍', label:'Km rodados', val:`${dados.km} km` },
            { icon:'⏱',  label:'Horas ativas', val:dados.horas },
            { icon:'💰', label:'Média/resgate', val:`R$ ${Math.round(dados.atual/dados.resgates)}` },
          ].map((st,i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Histórico */}
        <Animated.View style={[{ opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>HISTÓRICO DE PAGAMENTOS</Text>
          <View style={s.historicoCard}>
            {dados.transacoes.map((t: any, i: number) => (
              <View key={i}>
                <View style={s.transacaoItem}>
                  <View style={s.transacaoLeft}>
                    <Text style={s.transacaoHora}>{t.hora}</Text>
                    <Text style={s.transacaoCliente}>{t.cliente}</Text>
                    <View style={s.tipoBadge}>
                      <Text style={[s.tipoText, { color: t.tipo==='SOS' ? '#FF3B5C' : '#00E5FF' }]}>
                        {t.tipo==='SOS' ? '🔴 SOS' : '🔵 Padrão'}
                      </Text>
                    </View>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={s.transacaoVal}>{t.val}</Text>
                    {t.bonus !== '' && (
                      <Text style={s.transacaoBonus}>+{t.bonus} bônus</Text>
                    )}
                  </View>
                </View>
                {i < dados.transacoes.length-1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Saque */}
        <Animated.View style={[s.saqueCard, { opacity:fadeAnim }]}>
          <View style={{flex:1}}>
            <Text style={s.saqueTitle}>Saldo disponível</Text>
            <Text style={s.saqueVal}>R$ 2.840,00</Text>
            <Text style={s.saqueSub}>Próximo saque automático: 25/04</Text>
          </View>
          <TouchableOpacity style={s.saqueBtn}>
            <Text style={s.saqueBtnText}>Sacar agora</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{height:100}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:16 },

  header:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  headerTitle: { fontFamily:'Syne-Bold', fontSize:24, color:'#F0F4FF' },
  nivelBadge:  { backgroundColor:'rgba(255,184,0,0.15)', borderRadius:20, paddingHorizontal:12, paddingVertical:5, borderWidth:1, borderColor:'rgba(255,184,0,0.3)' },
  nivelText:   { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'#FFB800' },

  filtroRow:       { flexDirection:'row', backgroundColor:'#111827', borderRadius:14, padding:4, marginBottom:16, borderWidth:1, borderColor:'rgba(255,255,255,0.06)' },
  filtroBtn:       { flex:1, paddingVertical:9, alignItems:'center', borderRadius:10 },
  filtroBtnActive: { backgroundColor:'#00FF87' },
  filtroText:      { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)' },
  filtroTextActive:{ fontFamily:'Syne-Bold', fontSize:13, color:'#000' },

  totalCard:  { backgroundColor:'rgba(0,255,135,0.08)', borderWidth:1.5, borderColor:'rgba(0,255,135,0.25)', borderRadius:22, padding:18, marginBottom:16 },
  totalLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(0,255,135,0.6)', letterSpacing:3, marginBottom:6 },
  totalVal:   { fontFamily:'Syne-Bold', fontSize:40, color:'#00FF87', letterSpacing:-1, marginBottom:16 },
  metaRow:    { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  metaText:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)' },
  metaPct:    { fontFamily:'Syne-Bold', fontSize:12 },
  metaTrack:  { height:6, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' },
  metaFill:   { height:6, borderRadius:3 },

  statsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 },
  statCard:  { width:'48%', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },
  statIcon:  { fontSize:20, marginBottom:6 },
  statVal:   { fontFamily:'Syne-Bold', fontSize:18, color:'#F0F4FF', marginBottom:2 },
  statLabel: { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)' },

  sectionLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:10 },
  historicoCard: { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:14, marginBottom:16 },
  transacaoItem: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', paddingVertical:10 },
  transacaoLeft: { flex:1 },
  transacaoHora: { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', marginBottom:2 },
  transacaoCliente:{ fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF', marginBottom:4 },
  tipoBadge:     { alignSelf:'flex-start' },
  tipoText:      { fontFamily:'JetBrainsMono-Regular', fontSize:10 },
  transacaoVal:  { fontFamily:'Syne-Bold', fontSize:16, color:'#00FF87' },
  transacaoBonus:{ fontFamily:'DMSans-Regular', fontSize:11, color:'#FFB800', marginTop:2 },
  divider:       { height:1, backgroundColor:'rgba(255,255,255,0.04)' },

  saqueCard:  { flexDirection:'row', alignItems:'center', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:8 },
  saqueTitle: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginBottom:4 },
  saqueVal:   { fontFamily:'Syne-Bold', fontSize:22, color:'#F0F4FF', marginBottom:2 },
  saqueSub:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.3)' },
  saqueBtn:   { backgroundColor:'#00FF87', borderRadius:12, paddingHorizontal:16, paddingVertical:10 },
  saqueBtnText:{ fontFamily:'Syne-Bold', fontSize:13, color:'#000' },
});
