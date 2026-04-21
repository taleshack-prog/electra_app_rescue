import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const CHAMADOS_DB: Record<string, any> = {
  '1': { tipo:'SOS Emergencial', valor:'R$ 85,00', bateria:'8%', cliente:'Marina Costa', rating:4.8, atendimentos:67, veiculo:'Tesla Model 3', endereco:'Av. Paulista, 900 — Bela Vista', cidade:'São Paulo, SP', observacao:'Carro parou no acostamento. Pisca alerta ligado.', dist:'1,2 km', eta:'~4 min', urgencia:'alta' },
  '2': { tipo:'Recarga Padrão',  valor:'R$ 45,00', bateria:'22%', cliente:'João Silva',   rating:4.5, atendimentos:23, veiculo:'BYD Dolphin',   endereco:'R. Augusta, 400 — Consolação',   cidade:'São Paulo, SP', observacao:'Preciso de recarga para chegar em casa.', dist:'2,8 km', eta:'~9 min', urgencia:'media' },
  '3': { tipo:'Recarga Padrão',  valor:'R$ 40,00', bateria:'18%', cliente:'Ana Souza',    rating:5.0, atendimentos:12, veiculo:'Fiat 500e',     endereco:'R. Oscar Freire, 200 — Jardins',  cidade:'São Paulo, SP', observacao:'', dist:'4,1 km', eta:'~13 min', urgencia:'baixa' },
  '4': { tipo:'SOS Emergencial', valor:'R$ 90,00', bateria:'5%',  cliente:'Pedro Lima',   rating:4.2, atendimentos:8,  veiculo:'Hyundai IONIQ', endereco:'Av. Faria Lima, 3000 — Itaim',    cidade:'São Paulo, SP', observacao:'Bateria morreu na rampa do shopping.', dist:'3,5 km', eta:'~11 min', urgencia:'alta' },
};

export default function DetalhesChamadoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { chamadoId } = route.params;
  const chamado = CHAMADOS_DB[chamadoId] || CHAMADOS_DB['1'];

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  const [timer, setTimer] = useState(300); // 5 minutos
  const [expirado, setExpirado] = useState(false);
  const [recusando, setRecusando] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');

  const urgenciaCor = chamado.urgencia==='alta' ? '#FF3B5C' : chamado.urgencia==='media' ? '#FFB800' : '#00E5FF';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:400, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:400, useNativeDriver:true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.1, duration:800, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,   duration:800, useNativeDriver:true }),
    ])).start();

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { setExpirado(true); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulsa vermelho quando timer crítico
  useEffect(() => {
    if (timer <= 120) {
      Animated.loop(Animated.sequence([
        Animated.timing(timerAnim, { toValue:0.4, duration:500, useNativeDriver:true }),
        Animated.timing(timerAnim, { toValue:1,   duration:500, useNativeDriver:true }),
      ])).start();
    }
  }, [timer <= 120]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${m}:${String(sec).padStart(2,'0')}`;
  };

  const handleAceitar = () => {
    Alert.alert('Aceitar chamado?', `Você irá até ${chamado.cliente} — ${chamado.endereco}`, [
      { text:'Cancelar', style:'cancel' },
      { text:'Aceitar', onPress: () => navigation.replace('Navegacao', { chamadoId }) },
    ]);
  };

  const handleRecusar = () => setRecusando(true);

  const confirmarRecusa = (motivo: string) => {
    setMotivoRecusa(motivo);
    navigation.goBack();
  };

  const MOTIVOS = ['Muito longe', 'Fora da minha rota', 'Valor insuficiente', 'Problema no veículo', 'Outro motivo'];

  if (expirado) {
    return (
      <View style={[s.root, { alignItems:'center', justifyContent:'center' }]}>
        <Text style={{fontSize:48, marginBottom:16}}>⚡</Text>
        <Text style={[s.headerTitle, {textAlign:'center', marginBottom:8}]}>Chamado expirado</Text>
        <Text style={[s.sub, {textAlign:'center', marginBottom:24}]}>Outro resgatista aceitou primeiro.</Text>
        <TouchableOpacity style={s.btnAceitar} onPress={() => navigation.goBack()}>
          <Text style={s.btnAceitarText}>Ver outros chamados</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Bottom sheet recusa */}
      {recusando && (
        <View style={s.recusaOverlay}>
          <TouchableOpacity style={s.recusaBackdrop} onPress={() => setRecusando(false)} />
          <View style={s.recusaSheet}>
            <View style={s.recusaHandle} />
            <Text style={s.recusaTitle}>Por que está recusando?</Text>
            {MOTIVOS.map(m => (
              <TouchableOpacity key={m} style={s.recusaItem} onPress={() => confirmarRecusa(m)}>
                <Text style={s.recusaItemText}>{m}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.btnVoltar} onPress={() => setRecusando(false)}>
              <Text style={s.btnVoltarText}>Voltar e aceitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Detalhes do Chamado</Text>
          <View style={{width:36}} />
        </Animated.View>

        {/* Badge urgência + timer */}
        <Animated.View style={[s.urgenciaRow, { opacity:fadeAnim }]}>
          <Animated.View style={[s.urgenciaBadge, { backgroundColor: urgenciaCor+'22', borderColor: urgenciaCor+'66', transform:[{scale: chamado.urgencia==='alta' ? pulseAnim : new Animated.Value(1)}] }]}>
            <Text style={[s.urgenciaText, { color: urgenciaCor }]}>
              {chamado.urgencia==='alta' ? '🔴 SOS EMERGENCIAL' : chamado.urgencia==='media' ? '🟡 RECARGA PADRÃO' : '🔵 RECARGA NORMAL'}
            </Text>
          </Animated.View>
          <Animated.View style={[s.timerBox, timer<=120 && { borderColor:'#FF3B5C', opacity:timerAnim }]}>
            <Text style={[s.timerText, { color: timer<=120 ? '#FF3B5C' : 'rgba(240,244,255,0.6)' }]}>
              ⏱ {formatTimer(timer)}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* KPIs decisão */}
        <Animated.View style={[s.kpiRow, { opacity:fadeAnim }]}>
          <View style={s.kpiCard}>
            <Text style={s.kpiIcon}>📍</Text>
            <Text style={s.kpiVal}>{chamado.dist}</Text>
            <Text style={s.kpiEta}>{chamado.eta} ETA</Text>
            <Text style={s.kpiLabel}>Distância</Text>
          </View>
          <View style={[s.kpiCard, { borderLeftWidth:3, borderLeftColor:'#00FF87' }]}>
            <Text style={s.kpiIcon}>💰</Text>
            <Text style={[s.kpiVal, { color:'#00FF87' }]}>{chamado.valor}</Text>
            <Text style={s.kpiEta}>estimado</Text>
            <Text style={s.kpiLabel}>Ganho</Text>
          </View>
        </Animated.View>

        {/* Mapa placeholder */}
        <Animated.View style={[s.mapaBox, { opacity:fadeAnim }]}>
          <View style={s.mapaContent}>
            <View style={s.mapaPinVoce}>
              <Text style={{fontSize:10, color:'#00FF87', fontFamily:'JetBrainsMono-Regular'}}>VOCÊ</Text>
            </View>
            <View style={s.mapaRota} />
            <View style={s.mapaPinCliente}>
              <Text style={{fontSize:10, color:'#FF3B5C', fontFamily:'JetBrainsMono-Regular'}}>CLIENT</Text>
            </View>
          </View>
          <Text style={s.mapaLabel}>Toque para abrir mapa completo</Text>
        </Animated.View>

        {/* Cliente */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>CLIENTE</Text>
          <View style={s.card}>
            <View style={s.clienteRow}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{chamado.cliente.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={s.clienteNome}>{chamado.cliente}</Text>
                <Text style={s.clienteRating}>★ {chamado.rating} · {chamado.atendimentos} atendimentos</Text>
              </View>
              <View style={[s.bateriaBadge, { backgroundColor: parseInt(chamado.bateria)<=10 ? 'rgba(255,59,92,0.15)' : 'rgba(255,184,0,0.15)' }]}>
                <Text style={[s.bateriaText, { color: parseInt(chamado.bateria)<=10 ? '#FF3B5C' : '#FFB800' }]}>🔋 {chamado.bateria}</Text>
              </View>
            </View>
            <View style={s.divider} />
            <Text style={s.veiculoText}>🚗 {chamado.veiculo}</Text>
          </View>
        </Animated.View>

        {/* Localização */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>LOCALIZAÇÃO</Text>
          <View style={s.card}>
            <Text style={s.enderecoText}>📍 {chamado.endereco}</Text>
            <Text style={s.cidadeText}>{chamado.cidade}</Text>
            {chamado.observacao !== '' && (
              <View style={s.obsBox}>
                <Text style={s.obsText}>📝 "{chamado.observacao}"</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Tipo serviço */}
        <Animated.View style={[s.section, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>TIPO DE SERVIÇO</Text>
          <View style={s.card}>
            <Text style={s.tipoText}>⚡ {chamado.tipo}</Text>
            <Text style={s.tipoSub}>Carga mínima para chegar à estação mais próxima</Text>
          </View>
        </Animated.View>

        {/* Política */}
        <Animated.View style={[s.politicaBox, { opacity:fadeAnim }]}>
          <Text style={s.politicaText}>⚠ Após aceitar, cancelamentos afetam sua avaliação.</Text>
        </Animated.View>

        {/* CTAs */}
        <Animated.View style={[s.ctaWrap, { opacity:fadeAnim }]}>
          <TouchableOpacity style={s.btnAceitar} onPress={handleAceitar} activeOpacity={0.85}>
            <Text style={s.btnAceitarText}>✅  Aceitar Chamado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnRecusar} onPress={handleRecusar} activeOpacity={0.85}>
            <Text style={s.btnRecusarText}>✕  Recusar</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{height:40}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:16 },
  sub:    { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.4)' },

  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 },
  backBtn:     { width:36, height:36, borderRadius:18, backgroundColor:'#1A2236', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },
  backArrow:   { fontSize:18, color:'rgba(240,244,255,0.6)' },
  headerTitle: { fontFamily:'Syne-Bold', fontSize:17, color:'#F0F4FF' },

  urgenciaRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  urgenciaBadge: { borderWidth:1, borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  urgenciaText:  { fontFamily:'JetBrainsMono-Regular', fontSize:11 },
  timerBox:      { borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  timerText:     { fontFamily:'JetBrainsMono-Regular', fontSize:13 },

  kpiRow:   { flexDirection:'row', gap:10, marginBottom:16 },
  kpiCard:  { flex:1, backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },
  kpiIcon:  { fontSize:20, marginBottom:4 },
  kpiVal:   { fontFamily:'Syne-Bold', fontSize:26, color:'#F0F4FF' },
  kpiEta:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginBottom:4 },
  kpiLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.3)', letterSpacing:1 },

  mapaBox:     { backgroundColor:'#0D1520', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, height:160, marginBottom:16, overflow:'hidden', alignItems:'center', justifyContent:'center' },
  mapaContent: { flexDirection:'row', alignItems:'center', gap:16 },
  mapaPinVoce: { width:44, height:44, borderRadius:22, backgroundColor:'rgba(0,255,135,0.15)', borderWidth:1.5, borderColor:'#00FF87', alignItems:'center', justifyContent:'center' },
  mapaRota:    { flex:1, height:2, backgroundColor:'rgba(255,59,92,0.4)', marginHorizontal:8 },
  mapaPinCliente:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1.5, borderColor:'#FF3B5C', alignItems:'center', justifyContent:'center' },
  mapaLabel:   { position:'absolute', bottom:10, fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.3)' },

  section:      { marginBottom:12 },
  sectionLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:8 },
  card:         { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },

  clienteRow:   { flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  avatar:       { width:48, height:48, borderRadius:24, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center' },
  avatarText:   { fontFamily:'Syne-Bold', fontSize:16, color:'#FF3B5C' },
  clienteNome:  { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF' },
  clienteRating:{ fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  bateriaBadge: { borderRadius:10, paddingHorizontal:8, paddingVertical:4 },
  bateriaText:  { fontFamily:'JetBrainsMono-Regular', fontSize:11 },
  divider:      { height:1, backgroundColor:'rgba(255,255,255,0.06)', marginBottom:10 },
  veiculoText:  { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.6)' },

  enderecoText: { fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF', marginBottom:4 },
  cidadeText:   { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', marginBottom:8 },
  obsBox:       { backgroundColor:'rgba(255,184,0,0.08)', borderLeftWidth:3, borderLeftColor:'#FFB800', borderRadius:4, padding:10, marginTop:4 },
  obsText:      { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.6)', fontStyle:'italic' },

  tipoText: { fontFamily:'Syne-Bold', fontSize:15, color:'#F0F4FF', marginBottom:4 },
  tipoSub:  { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)' },

  politicaBox:  { backgroundColor:'rgba(255,255,255,0.03)', borderRadius:12, padding:12, marginBottom:16 },
  politicaText: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.35)', textAlign:'center' },

  ctaWrap:      { gap:10, marginBottom:8 },
  btnAceitar:   { height:56, backgroundColor:'#00FF87', borderRadius:16, alignItems:'center', justifyContent:'center' },
  btnAceitarText:{ fontFamily:'Syne-Bold', fontSize:16, color:'#000' },
  btnRecusar:   { height:50, borderWidth:1.5, borderColor:'rgba(255,255,255,0.15)', borderRadius:16, alignItems:'center', justifyContent:'center' },
  btnRecusarText:{ fontFamily:'Syne-Bold', fontSize:15, color:'rgba(240,244,255,0.5)' },

  recusaOverlay:  { position:'absolute', inset:0, zIndex:100, justifyContent:'flex-end' } as any,
  recusaBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.6)' },
  recusaSheet:    { backgroundColor:'#111827', borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, paddingBottom:36 },
  recusaHandle:   { width:40, height:4, backgroundColor:'rgba(255,255,255,0.15)', borderRadius:2, alignSelf:'center', marginBottom:16 },
  recusaTitle:    { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF', marginBottom:14 },
  recusaItem:     { paddingVertical:14, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.06)' },
  recusaItemText: { fontFamily:'DMSans-Regular', fontSize:15, color:'rgba(240,244,255,0.7)' },
  btnVoltar:      { height:48, backgroundColor:'rgba(0,255,135,0.1)', borderWidth:1, borderColor:'rgba(0,255,135,0.3)', borderRadius:14, alignItems:'center', justifyContent:'center', marginTop:16 },
  btnVoltarText:  { fontFamily:'Syne-Bold', fontSize:14, color:'#00FF87' },
});
