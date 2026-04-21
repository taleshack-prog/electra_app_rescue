import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;

  const [online, setOnline]   = useState(true);
  const [chamadoNovo, setChamadoNovo] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.08, duration:1000, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,    duration:1000, useNativeDriver:true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue:1, duration:1500, useNativeDriver:true }),
      Animated.timing(glowAnim, { toValue:0, duration:1500, useNativeDriver:true }),
    ])).start();

    // Simula novo chamado após 3s
    const timer = setTimeout(() => setChamadoNovo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange:[0,1], outputRange:[0.3, 1] });

  const STATS = [
    { label:'Ganhos hoje',    val:'R$ 284',  icon:'💰', cor:'#00FF87' },
    { label:'Resgates hoje',  val:'4',       icon:'🆘', cor:'#FF3B5C' },
    { label:'Avaliação',      val:'4.9★',    icon:'⭐', cor:'#FFB800' },
    { label:'Km rodados',     val:'67 km',   icon:'📍', cor:'#00E5FF' },
  ];

  const CHAMADOS_PROXIMOS = [
    { id:'1', tipo:'SOS Emergencial', dist:'1,2 km', eta:'~4 min', valor:'R$ 85', bateria:'8%', cliente:'Marina Costa', veiculo:'Tesla Model 3', urgencia:'alta' },
    { id:'2', tipo:'Recarga Padrão',  dist:'2,8 km', eta:'~9 min', valor:'R$ 45', bateria:'22%', cliente:'João Silva',   veiculo:'BYD Dolphin',  urgencia:'media' },
    { id:'3', tipo:'Recarga Padrão',  dist:'4,1 km', eta:'~13 min',valor:'R$ 40', bateria:'18%', cliente:'Ana Souza',    veiculo:'Fiat 500e',    urgencia:'baixa' },
  ];

  const urgenciaCor = (u: string) => u==='alta' ? '#FF3B5C' : u==='media' ? '#FFB800' : '#00E5FF';
  const urgenciaLabel = (u: string) => u==='alta' ? '🔴 URGENTE' : u==='media' ? '🟡 Padrão' : '🔵 Normal';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View>
            <Text style={s.headerLabel}>BOA TARDE</Text>
            <Text style={s.headerName}>Carlos Resgatista</Text>
            <Text style={s.headerSub}>ID: RES-2847 · Nível Ouro</Text>
          </View>
          <View style={s.avatarWrap}>
            <Text style={s.avatarText}>CR</Text>
            <View style={[s.avatarDot, { backgroundColor: online ? '#00FF87' : '#FF3B5C' }]} />
          </View>
        </Animated.View>

        {/* Toggle Online/Offline */}
        <Animated.View style={[s.statusCard, { opacity:fadeAnim, borderColor: online ? 'rgba(0,255,135,0.3)' : 'rgba(255,59,92,0.3)' }]}>
          <Animated.View style={[s.statusDot, { backgroundColor: online ? '#00FF87' : '#FF3B5C', transform:[{scale: online ? pulseAnim : new Animated.Value(1)}], opacity: online ? glowOpacity : new Animated.Value(0.5) }]} />
          <View style={{flex:1}}>
            <Text style={[s.statusTitle, { color: online ? '#00FF87' : '#FF3B5C' }]}>
              {online ? '● ONLINE — Recebendo chamados' : '○ OFFLINE — Indisponível'}
            </Text>
            <Text style={s.statusSub}>
              {online ? 'Você está visível para chamados na sua área' : 'Ative para começar a receber chamados'}
            </Text>
          </View>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false:'rgba(255,59,92,0.3)', true:'rgba(0,255,135,0.3)' }}
            thumbColor={online ? '#00FF87' : '#FF3B5C'}
          />
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[s.statsGrid, { opacity:fadeAnim }]}>
          {STATS.map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={[s.statVal, { color: st.cor }]}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Novo chamado alert */}
        {chamadoNovo && online && (
          <Animated.View style={[s.alertCard, { opacity:fadeAnim }]}>
            <Animated.View style={[s.alertDot, { transform:[{scale:pulseAnim}] }]} />
            <View style={{flex:1}}>
              <Text style={s.alertTitle}>🆘 Novo chamado urgente!</Text>
              <Text style={s.alertSub}>SOS Emergencial · 1,2km · R$ 85,00</Text>
            </View>
            <TouchableOpacity style={s.alertBtn} onPress={() => navigation.navigate('DetalhesChamado', { chamadoId:'1' })}>
              <Text style={s.alertBtnText}>Ver →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Chamados próximos */}
        <Animated.View style={[{ opacity:fadeAnim }]}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionLabel}>CHAMADOS PRÓXIMOS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chamados' as any)}>
              <Text style={s.sectionLink}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          {CHAMADOS_PROXIMOS.map(c => (
            <TouchableOpacity key={c.id} style={s.chamadoCard}
              onPress={() => navigation.navigate('DetalhesChamado', { chamadoId: c.id })}
              activeOpacity={0.85}>
              <View style={s.chamadoTop}>
                <View style={[s.urgenciaBadge, { backgroundColor: urgenciaCor(c.urgencia) + '22', borderColor: urgenciaCor(c.urgencia) + '44' }]}>
                  <Text style={[s.urgenciaText, { color: urgenciaCor(c.urgencia) }]}>{urgenciaLabel(c.urgencia)}</Text>
                </View>
                <Text style={s.chamadoValor}>{c.valor}</Text>
              </View>
              <View style={s.chamadoInfo}>
                <View style={{flex:1}}>
                  <Text style={s.chamadoCliente}>{c.cliente}</Text>
                  <Text style={s.chamadoVeiculo}>{c.veiculo} · 🔋 {c.bateria}</Text>
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <Text style={s.chamadoDist}>📍 {c.dist}</Text>
                  <Text style={s.chamadoEta}>⏱ {c.eta}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Meta do dia */}
        <Animated.View style={[s.metaCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>META DO DIA</Text>
          <View style={s.metaRow}>
            <Text style={s.metaVal}>R$ 284</Text>
            <Text style={s.metaTarget}>/ R$ 400</Text>
          </View>
          <View style={s.metaTrack}>
            <View style={[s.metaFill, { width:'71%' }]} />
          </View>
          <Text style={s.metaSub}>71% da meta diária atingida · Faltam R$ 116</Text>
        </Animated.View>

        <View style={{height:100}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:16 },

  header:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  headerLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(255,59,92,0.6)', letterSpacing:3 },
  headerName: { fontFamily:'Syne-Bold', fontSize:22, color:'#F0F4FF', marginTop:2 },
  headerSub:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  avatarWrap: { width:48, height:48, borderRadius:24, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1.5, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center', position:'relative' },
  avatarText: { fontFamily:'Syne-Bold', fontSize:16, color:'#FF3B5C' },
  avatarDot:  { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, borderWidth:2, borderColor:'#070B14' },

  statusCard:  { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'#111827', borderWidth:1, borderRadius:18, padding:14, marginBottom:16 },
  statusDot:   { width:10, height:10, borderRadius:5 },
  statusTitle: { fontFamily:'Syne-Bold', fontSize:13 },
  statusSub:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },

  statsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 },
  statCard:  { width:'48%', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14, alignItems:'flex-start' },
  statIcon:  { fontSize:20, marginBottom:6 },
  statVal:   { fontFamily:'Syne-Bold', fontSize:22, marginBottom:2 },
  statLabel: { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)' },

  alertCard: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,59,92,0.1)', borderWidth:1.5, borderColor:'rgba(255,59,92,0.4)', borderRadius:16, padding:14, marginBottom:16 },
  alertDot:  { width:10, height:10, borderRadius:5, backgroundColor:'#FF3B5C' },
  alertTitle:{ fontFamily:'Syne-Bold', fontSize:14, color:'#FF3B5C' },
  alertSub:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.5)', marginTop:2 },
  alertBtn:  { backgroundColor:'#FF3B5C', borderRadius:10, paddingHorizontal:12, paddingVertical:6 },
  alertBtnText:{ fontFamily:'Syne-Bold', fontSize:13, color:'#fff' },

  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  sectionLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2 },
  sectionLink:   { fontFamily:'DMSans-Regular', fontSize:13, color:'#FF3B5C' },

  chamadoCard:   { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:14, marginBottom:10 },
  chamadoTop:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  urgenciaBadge: { borderWidth:1, borderRadius:20, paddingHorizontal:10, paddingVertical:3 },
  urgenciaText:  { fontFamily:'JetBrainsMono-Regular', fontSize:10 },
  chamadoValor:  { fontFamily:'Syne-Bold', fontSize:18, color:'#00FF87' },
  chamadoInfo:   { flexDirection:'row', alignItems:'center' },
  chamadoCliente:{ fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  chamadoVeiculo:{ fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  chamadoDist:   { fontFamily:'JetBrainsMono-Regular', fontSize:12, color:'rgba(240,244,255,0.6)' },
  chamadoEta:    { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },

  metaCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginTop:6 },
  metaRow:   { flexDirection:'row', alignItems:'flex-end', gap:6, marginVertical:8 },
  metaVal:   { fontFamily:'Syne-Bold', fontSize:28, color:'#00FF87' },
  metaTarget:{ fontFamily:'DMSans-Regular', fontSize:16, color:'rgba(240,244,255,0.3)', marginBottom:4 },
  metaTrack: { height:6, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden', marginBottom:8 },
  metaFill:  { height:6, backgroundColor:'#00FF87', borderRadius:3 },
  metaSub:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)' },
});
