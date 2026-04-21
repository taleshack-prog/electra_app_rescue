import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function ConcluidoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { chamadoId, kwh, tempo, bateriaFinal, valor } = route.params || {};

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.5)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue:1, friction:4, tension:60, useNativeDriver:true }),
        Animated.timing(fadeAnim,  { toValue:1, duration:400, useNativeDriver:true }),
      ]),
      Animated.timing(slideAnim, { toValue:0, duration:400, useNativeDriver:true }),
    ]).start();
  }, []);

  const formatTempo = (s: number) => {
    if (!s) return '00:00';
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const [avaliacao, setAvaliacao] = React.useState(0);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Check animado */}
        <Animated.View style={[s.checkWrap, { opacity:fadeAnim, transform:[{scale:scaleAnim}] }]}>
          <View style={s.checkCircle}>
            <Text style={s.checkIcon}>✅</Text>
          </View>
          <Text style={s.checkTitle}>Atendimento Concluído!</Text>
          <Text style={s.checkSub}>Ótimo trabalho, resgatista!</Text>
        </Animated.View>

        {/* Resumo financeiro */}
        <Animated.View style={[s.valorCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.valorLabel}>VOCÊ GANHOU</Text>
          <Text style={s.valorNum}>{valor || 'R$ 85,00'}</Text>
          <Text style={s.valorSub}>Crédito em até 1 hora na sua carteira</Text>
        </Animated.View>

        {/* Stats do atendimento */}
        <Animated.View style={[s.statsGrid, { opacity:fadeAnim }]}>
          {[
            { icon:'⚡', label:'Energia entregue', val:`${kwh || '4.2'} kWh` },
            { icon:'⏱',  label:'Duração',          val:formatTempo(tempo || 0) },
            { icon:'🔋', label:'Bateria final',     val:`${bateriaFinal || 42}%` },
            { icon:'⭐', label:'Bônus pontualidade', val:'+ R$ 5,00' },
          ].map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Avaliação do cliente */}
        <Animated.View style={[s.avaliacaoCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>COMO FOI O ATENDIMENTO?</Text>
          <Text style={s.avaliacaoSub}>Sua avaliação ajuda a melhorar o serviço</Text>
          <View style={s.estrelasRow}>
            {[1,2,3,4,5].map(i => (
              <TouchableOpacity key={i} onPress={() => setAvaliacao(i)} activeOpacity={0.7}>
                <Text style={[s.estrela, i<=avaliacao && s.estrelaAtiva]}>{i<=avaliacao ? '★' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Meta do dia */}
        <Animated.View style={[s.metaCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>META DO DIA</Text>
          <View style={s.metaRow}>
            <Text style={s.metaVal}>R$ 369</Text>
            <Text style={s.metaTarget}>/ R$ 400</Text>
          </View>
          <View style={s.metaTrack}>
            <View style={[s.metaFill, { width:'92%' }]} />
          </View>
          <Text style={s.metaSub}>92% da meta — Faltam R$ 31 para bater a meta! 🎯</Text>
        </Animated.View>

        {/* Botões */}
        <Animated.View style={[s.btns, { opacity:fadeAnim }]}>
          <TouchableOpacity
            style={s.btnProximo}
            onPress={() => navigation.navigate('Dashboard' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.btnProximoText}>→  Próximo chamado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnGanhos}
            onPress={() => navigation.navigate('Ganhos' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.btnGanhosText}>💰  Ver meus ganhos</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{height:40}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:40 },

  checkWrap:   { alignItems:'center', marginBottom:24 },
  checkCircle: { width:100, height:100, borderRadius:50, backgroundColor:'rgba(0,255,135,0.15)', borderWidth:2, borderColor:'rgba(0,255,135,0.4)', alignItems:'center', justifyContent:'center', marginBottom:16 },
  checkIcon:   { fontSize:48 },
  checkTitle:  { fontFamily:'Syne-Bold', fontSize:24, color:'#F0F4FF', marginBottom:6 },
  checkSub:    { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.4)' },

  valorCard:   { backgroundColor:'rgba(0,255,135,0.08)', borderWidth:1.5, borderColor:'rgba(0,255,135,0.3)', borderRadius:22, padding:20, alignItems:'center', marginBottom:16 },
  valorLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(0,255,135,0.6)', letterSpacing:3, marginBottom:8 },
  valorNum:    { fontFamily:'Syne-Bold', fontSize:48, color:'#00FF87', letterSpacing:-2 },
  valorSub:    { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:6 },

  statsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 },
  statCard:  { width:'48%', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },
  statIcon:  { fontSize:20, marginBottom:6 },
  statVal:   { fontFamily:'Syne-Bold', fontSize:18, color:'#F0F4FF', marginBottom:2 },
  statLabel: { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)' },

  avaliacaoCard: { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:12, alignItems:'center' },
  sectionLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:6 },
  avaliacaoSub:  { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', marginBottom:14 },
  estrelasRow:   { flexDirection:'row', gap:8 },
  estrela:       { fontSize:36, color:'rgba(240,244,255,0.2)' },
  estrelaAtiva:  { color:'#FFB800' },

  metaCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:16 },
  metaRow:   { flexDirection:'row', alignItems:'flex-end', gap:6, marginVertical:8 },
  metaVal:   { fontFamily:'Syne-Bold', fontSize:28, color:'#00FF87' },
  metaTarget:{ fontFamily:'DMSans-Regular', fontSize:16, color:'rgba(240,244,255,0.3)', marginBottom:4 },
  metaTrack: { height:6, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden', marginBottom:8 },
  metaFill:  { height:6, backgroundColor:'#00FF87', borderRadius:3 },
  metaSub:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)' },

  btns:         { gap:10 },
  btnProximo:   { height:54, backgroundColor:'#FF3B5C', borderRadius:16, alignItems:'center', justifyContent:'center' },
  btnProximoText:{ fontFamily:'Syne-Bold', fontSize:15, color:'#fff' },
  btnGanhos:    { height:50, backgroundColor:'rgba(0,255,135,0.1)', borderWidth:1, borderColor:'rgba(0,255,135,0.3)', borderRadius:16, alignItems:'center', justifyContent:'center' },
  btnGanhosText:{ fontFamily:'Syne-Bold', fontSize:14, color:'#00FF87' },
});
