import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const CHAMADOS_DB: Record<string, any> = {
  '1': { cliente:'Marina Costa', veiculo:'Tesla Model 3', bateria:'8%',  valor:'R$ 85,00', tipo:'SOS Emergencial', urgencia:'alta' },
  '2': { cliente:'João Silva',   veiculo:'BYD Dolphin',   bateria:'22%', valor:'R$ 45,00', tipo:'Recarga Padrão',  urgencia:'media' },
  '3': { cliente:'Ana Souza',    veiculo:'Fiat 500e',     bateria:'18%', valor:'R$ 40,00', tipo:'Recarga Padrão',  urgencia:'baixa' },
  '4': { cliente:'Pedro Lima',   veiculo:'Hyundai IONIQ', bateria:'5%',  valor:'R$ 90,00', tipo:'SOS Emergencial', urgencia:'alta' },
};

export default function AtendimentoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { chamadoId } = route.params;
  const chamado = CHAMADOS_DB[chamadoId] || CHAMADOS_DB['1'];

  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [fase, setFase]           = useState<'conectando'|'carregando'|'concluindo'>('conectando');
  const [kwh, setKwh]             = useState(0);
  const [tempo, setTempo]         = useState(0);
  const [bateriaAtual, setBateriaAtual] = useState(parseInt(chamado.bateria));
  const [observacao, setObservacao]     = useState('');
  const [podeConcluir, setPodeConcluir] = useState(false);

  const urgenciaCor = chamado.urgencia==='alta' ? '#FF3B5C' : chamado.urgencia==='media' ? '#FFB800' : '#00E5FF';
  const bateriaColor = bateriaAtual >= 50 ? '#00FF87' : bateriaAtual >= 25 ? '#FFB800' : '#FF3B5C';

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:500, useNativeDriver:true }).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.1, duration:800, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,   duration:800, useNativeDriver:true }),
    ])).start();

    const t1 = setTimeout(() => setFase('carregando'), 2000);
    const t2 = setTimeout(() => { setPodeConcluir(true); setFase('concluindo'); }, 10000);

    const interval = setInterval(() => {
      setTempo(t => t + 1);
      setKwh(k => parseFloat((k + 0.08).toFixed(2)));
      setBateriaAtual(b => Math.min(b + 0.3, 80));
    }, 1000);

    Animated.timing(progressAnim, { toValue:1, duration:10000, useNativeDriver:false }).start();

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, []);

  const formatTempo = (s: number) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const handleConcluir = () => {
    Alert.alert('Concluir atendimento?', `${kwh.toFixed(1)} kWh · ${Math.round(bateriaAtual)}% bateria`, [
      { text:'Continuar', style:'cancel' },
      { text:'Concluir', onPress: () => navigation.replace('Concluido', {
        chamadoId, kwh: kwh.toFixed(1), tempo, bateriaFinal: Math.round(bateriaAtual), valor: chamado.valor
      })},
    ]);
  };

  const progressWidth = progressAnim.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim }]}>
          <View style={[s.statusBadge, { backgroundColor: urgenciaCor+'22', borderColor: urgenciaCor+'44' }]}>
            <Animated.View style={[s.statusDot, { backgroundColor: urgenciaCor, transform:[{scale:pulseAnim}] }]} />
            <Text style={[s.statusText, { color: urgenciaCor }]}>
              {fase==='conectando' ? 'CONECTANDO' : fase==='carregando' ? 'CARREGANDO' : 'PRONTO'}
            </Text>
          </View>
          <Text style={s.timerText}>{formatTempo(tempo)}</Text>
        </Animated.View>

        {/* Bateria */}
        <Animated.View style={[s.bateriaCard, { opacity:fadeAnim }]}>
          <View style={s.bateriaTop}>
            <Text style={s.bateriaLabel}>Bateria do veículo</Text>
            <Text style={[s.bateriaVal, { color: bateriaColor }]}>{Math.round(bateriaAtual)}%</Text>
          </View>
          <View style={s.bateriaTrack}>
            <View style={[s.bateriaFill, { width:`${Math.round(bateriaAtual)}%` as any, backgroundColor: bateriaColor }]} />
          </View>
          <View style={s.bateriaLegend}>
            <Text style={s.bateriaStart}>Início: {chamado.bateria}</Text>
            <Text style={[s.bateriaMeta, { color: bateriaColor }]}>Meta: 80% ✓</Text>
          </View>
        </Animated.View>

        {/* Métricas */}
        <Animated.View style={[s.metricsGrid, { opacity:fadeAnim }]}>
          {[
            { icon:'⚡', val:`${kwh.toFixed(1)} kWh`, label:'Energia entregue' },
            { icon:'⏱',  val:formatTempo(tempo),      label:'Tempo de serviço' },
            { icon:'💰', val:chamado.valor,            label:'Valor do chamado' },
            { icon:'🔋', val:`+${Math.round(bateriaAtual - parseInt(chamado.bateria))}%`, label:'Ganho bateria' },
          ].map((m,i) => (
            <View key={i} style={s.metricCard}>
              <Text style={s.metricIcon}>{m.icon}</Text>
              <Text style={s.metricVal}>{m.val}</Text>
              <Text style={s.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Progresso */}
        <Animated.View style={[s.fasesCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>PROGRESSO</Text>
          {[
            { key:'conectando', label:'Conectando carregador' },
            { key:'carregando', label:'Carregamento em andamento' },
            { key:'concluindo', label:'Pronto para concluir' },
          ].map((f, i) => (
            <View key={f.key} style={s.faseItem}>
              <View style={[s.faseDot,
                fase > f.key ? { backgroundColor:'#00FF87' } :
                fase === f.key ? { backgroundColor: urgenciaCor } :
                { backgroundColor:'transparent', borderWidth:1.5, borderColor:'rgba(255,255,255,0.2)' }
              ]}>
                {fase > f.key && <Text style={{fontSize:8,color:'#000'}}>✓</Text>}
              </View>
              <Text style={[s.faseLabel, { color: fase===f.key ? '#F0F4FF' : 'rgba(240,244,255,0.3)' }]}>{f.label}</Text>
            </View>
          ))}
          <View style={s.progressTrack}>
            <Animated.View style={[s.progressFill, { width: progressWidth }]} />
          </View>
        </Animated.View>

        {/* Cliente */}
        <Animated.View style={[s.clienteCard, { opacity:fadeAnim }]}>
          <Text style={s.sectionLabel}>VEÍCULO EM ATENDIMENTO</Text>
          <View style={s.clienteRow}>
            <View style={s.clienteAvatar}>
              <Text style={s.clienteAvatarText}>{chamado.cliente.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={s.clienteNome}>{chamado.cliente}</Text>
              <Text style={s.clienteVeiculo}>{chamado.veiculo}</Text>
            </View>
            <TouchableOpacity style={s.chatBtn}>
              <Text style={{fontSize:18}}>💬</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Observações */}
        <Animated.View style={[{ opacity:fadeAnim, marginBottom:16 }]}>
          <Text style={s.sectionLabel}>OBSERVAÇÕES</Text>
          <TextInput
            style={s.obsInput}
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Anote detalhes do atendimento..."
            placeholderTextColor="rgba(240,244,255,0.2)"
            multiline numberOfLines={3}
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Botão concluir */}
        <Animated.View style={[{ opacity:fadeAnim, marginBottom:40 }]}>
          <TouchableOpacity
            style={[s.btnConcluir, podeConcluir && s.btnConcluirAtivo, !podeConcluir && {opacity:0.5}]}
            onPress={podeConcluir ? handleConcluir : undefined}
            activeOpacity={podeConcluir ? 0.85 : 1}
          >
            <Text style={[s.btnConcluirText, podeConcluir && {color:'#000'}]}>
              {podeConcluir ? '✅  Concluir Atendimento' : '⏳  Aguarde...'}
            </Text>
          </TouchableOpacity>
          {!podeConcluir && <Text style={s.btnHint}>Botão liberado em alguns segundos</Text>}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:16 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  statusBadge: { flexDirection:'row', alignItems:'center', gap:8, borderWidth:1, borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  statusDot:   { width:8, height:8, borderRadius:4 },
  statusText:  { fontFamily:'JetBrainsMono-Regular', fontSize:11, letterSpacing:1 },
  timerText:   { fontFamily:'JetBrainsMono-Regular', fontSize:20, color:'#F0F4FF' },
  bateriaCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:20, padding:16, marginBottom:12 },
  bateriaTop:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  bateriaLabel: { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.5)' },
  bateriaVal:   { fontFamily:'Syne-Bold', fontSize:32 },
  bateriaTrack: { height:10, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:5, overflow:'hidden', marginBottom:8 },
  bateriaFill:  { height:10, borderRadius:5 },
  bateriaLegend:{ flexDirection:'row', justifyContent:'space-between' },
  bateriaStart: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.35)' },
  bateriaMeta:  { fontFamily:'Syne-Bold', fontSize:12 },
  metricsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:12 },
  metricCard:  { width:'48%', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14 },
  metricIcon:  { fontSize:20, marginBottom:6 },
  metricVal:   { fontFamily:'Syne-Bold', fontSize:18, color:'#F0F4FF', marginBottom:2 },
  metricLabel: { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)' },
  fasesCard:    { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:12 },
  sectionLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:12 },
  faseItem:     { flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  faseDot:      { width:20, height:20, borderRadius:10, alignItems:'center', justifyContent:'center' },
  faseLabel:    { fontFamily:'DMSans-Regular', fontSize:14, flex:1 },
  progressTrack:{ height:3, backgroundColor:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden', marginTop:4 },
  progressFill: { height:3, backgroundColor:'#00FF87', borderRadius:2 },
  clienteCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, padding:16, marginBottom:12 },
  clienteRow:   { flexDirection:'row', alignItems:'center', gap:12 },
  clienteAvatar:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center' },
  clienteAvatarText:{ fontFamily:'Syne-Bold', fontSize:16, color:'#FF3B5C' },
  clienteNome:  { fontFamily:'Syne-Bold', fontSize:15, color:'#F0F4FF' },
  clienteVeiculo:{ fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  chatBtn:      { width:36, height:36, borderRadius:18, backgroundColor:'rgba(0,229,255,0.1)', borderWidth:1, borderColor:'rgba(0,229,255,0.2)', alignItems:'center', justifyContent:'center' },
  obsInput:     { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:14, padding:14, fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF', minHeight:80 },
  btnConcluir:     { height:56, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1.5, borderColor:'rgba(255,255,255,0.15)', borderRadius:16, alignItems:'center', justifyContent:'center', marginBottom:8 },
  btnConcluirAtivo:{ backgroundColor:'#00FF87', borderColor:'#00FF87' },
  btnConcluirText: { fontFamily:'Syne-Bold', fontSize:16, color:'rgba(240,244,255,0.5)' },
  btnHint:         { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.25)', textAlign:'center' },
});
