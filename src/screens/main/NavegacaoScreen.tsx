import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const CHAMADOS_DB: Record<string, any> = {
  '1': { cliente:'Marina Costa', veiculo:'Tesla Model 3', bateria:'8%', endereco:'Av. Paulista, 900', dist:'1,2 km', eta:4, valor:'R$ 85,00', urgencia:'alta' },
  '2': { cliente:'João Silva',   veiculo:'BYD Dolphin',   bateria:'22%', endereco:'R. Augusta, 400',  dist:'2,8 km', eta:9, valor:'R$ 45,00', urgencia:'media' },
  '3': { cliente:'Ana Souza',    veiculo:'Fiat 500e',     bateria:'18%', endereco:'R. Oscar Freire, 200', dist:'4,1 km', eta:13, valor:'R$ 40,00', urgencia:'baixa' },
  '4': { cliente:'Pedro Lima',   veiculo:'Hyundai IONIQ', bateria:'5%',  endereco:'Av. Faria Lima, 3000', dist:'3,5 km', eta:11, valor:'R$ 90,00', urgencia:'alta' },
};

export default function NavegacaoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const { chamadoId } = route.params;
  const chamado = CHAMADOS_DB[chamadoId] || CHAMADOS_DB['1'];

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const vanAnim    = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;

  const [etaAtual, setEtaAtual] = useState(chamado.eta);
  const [distAtual, setDistAtual] = useState(parseFloat(chamado.dist));
  const [chegou, setChegou] = useState(false);
  const [passo, setPasso] = useState<'navegando'|'chegando'|'chegou'>('navegando');

  const urgenciaCor = chamado.urgencia==='alta' ? '#FF3B5C' : chamado.urgencia==='media' ? '#FFB800' : '#00E5FF';

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:500, useNativeDriver:true }).start();

    // Van se move na tela
    Animated.loop(Animated.sequence([
      Animated.timing(vanAnim, { toValue:1, duration:2000, useNativeDriver:true }),
      Animated.timing(vanAnim, { toValue:0, duration:2000, useNativeDriver:true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.1, duration:800, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,   duration:800, useNativeDriver:true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue:1, duration:1500, useNativeDriver:true }),
      Animated.timing(glowAnim, { toValue:0, duration:1500, useNativeDriver:true }),
    ])).start();

    // Simula aproximação
    const interval = setInterval(() => {
      setEtaAtual(e => {
        if (e <= 1) {
          setChegou(true);
          setPasso('chegou');
          clearInterval(interval);
          return 0;
        }
        if (e <= 2) setPasso('chegando');
        return e - 1;
      });
      setDistAtual(d => Math.max(0, parseFloat((d - 0.05).toFixed(2))));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleChegou = () => {
    navigation.replace('Atendimento', { chamadoId });
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar atendimento?',
      'Cancelamentos afetam sua avaliação. Tem certeza?',
      [
        { text:'Continuar navegando', style:'cancel' },
        { text:'Cancelar', style:'destructive', onPress:() => navigation.navigate('Dashboard' as any) },
      ]
    );
  };

  const vanX = vanAnim.interpolate({ inputRange:[0,1], outputRange:[-10, 10] });
  const glowOpacity = glowAnim.interpolate({ inputRange:[0,1], outputRange:[0.2, 0.6] });

  const INSTRUCOES = [
    { icone:'↑', desc:'Siga em frente por 400m', ativo:true },
    { icone:'→', desc:'Vire à direita na Av. Paulista', ativo:false },
    { icone:'↑', desc:'Siga por 600m', ativo:false },
    { icone:'📍', desc:'Destino à esquerda', ativo:false },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <Animated.View style={[s.container, { opacity:fadeAnim }]}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={handleCancelar}>
            <Text style={s.backArrow}>✕</Text>
          </TouchableOpacity>
          <View style={{flex:1, alignItems:'center'}}>
            <Text style={s.headerLabel}>EM ROTA</Text>
            <Text style={s.headerTitle}>{chamado.cliente}</Text>
          </View>
          <View style={[s.urgenciaDot, { backgroundColor: urgenciaCor }]} />
        </View>

        {/* Mapa simulado */}
        <View style={s.mapaWrap}>
          {/* Grade de rua */}
          <View style={s.mapaGrid}>
            {[0,1,2,3,4].map(i => (
              <View key={`h${i}`} style={[s.gridLine, s.gridH, { top:`${20*i}%` as any }]} />
            ))}
            {[0,1,2,3,4].map(i => (
              <View key={`v${i}`} style={[s.gridLine, s.gridV, { left:`${25*i}%` as any }]} />
            ))}
          </View>

          {/* Rota */}
          <View style={s.rotaLine} />

          {/* Van animada */}
          <Animated.View style={[s.vanPin, { transform:[{translateX:vanX}] }]}>
            <Text style={s.vanEmoji}>🚐</Text>
            <View style={s.vanPinDot} />
          </Animated.View>

          {/* Pin cliente */}
          <Animated.View style={[s.clientePin, { transform:[{scale:pulseAnim}] }]}>
            <Text style={{fontSize:20}}>📍</Text>
            <View style={[s.clientePinRing, { opacity: glowOpacity, borderColor: urgenciaCor }]} />
          </Animated.View>

          {/* ETA overlay */}
          <View style={s.etaOverlay}>
            <Text style={s.etaValor}>{etaAtual} min</Text>
            <Text style={s.etaDist}>{distAtual.toFixed(1)} km restantes</Text>
          </View>
        </View>

        {/* Status chegada */}
        {passo === 'chegando' && (
          <Animated.View style={[s.chegandoAlert, { transform:[{scale:pulseAnim}] }]}>
            <Text style={s.chegandoText}>🎯 Chegando ao destino...</Text>
          </Animated.View>
        )}

        {/* Próxima instrução */}
        <View style={s.instrucaoBox}>
          <View style={s.instrucaoIcon}>
            <Text style={s.instrucaoSeta}>{INSTRUCOES[0].icone}</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={s.instrucaoText}>{INSTRUCOES[0].desc}</Text>
            <Text style={s.instrucaoSub}>Próximo: {INSTRUCOES[1].desc}</Text>
          </View>
        </View>

        {/* Info cliente */}
        <View style={s.clienteCard}>
          <View style={s.clienteInfo}>
            <View style={s.clienteAvatar}>
              <Text style={s.clienteAvatarText}>{chamado.cliente.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={s.clienteNome}>{chamado.cliente}</Text>
              <Text style={s.clienteVeiculo}>{chamado.veiculo} · 🔋 {chamado.bateria}</Text>
              <Text style={s.clienteEndereco}>📍 {chamado.endereco}</Text>
            </View>
            <View style={{alignItems:'flex-end'}}>
              <Text style={s.clienteValor}>{chamado.valor}</Text>
              <TouchableOpacity style={s.chatBtn}>
                <Text style={s.chatBtnText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botão chegou */}
        <TouchableOpacity
          style={[s.btnChegou, chegou && s.btnChegouAtivo]}
          onPress={handleChegou}
          activeOpacity={0.85}
        >
          <Text style={s.btnChegouText}>
            {chegou ? '✅  Confirmar Chegada' : '📍  Cheguei ao Local'}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex:1, backgroundColor:'#070B14' },
  container: { flex:1 },

  header:      { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingTop:16, paddingBottom:8 },
  backBtn:     { width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center' },
  backArrow:   { fontSize:16, color:'#FF3B5C' },
  headerLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.4)', letterSpacing:3 },
  headerTitle: { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF' },
  urgenciaDot: { width:10, height:10, borderRadius:5 },

  mapaWrap:  { flex:1, backgroundColor:'#0D1520', margin:12, borderRadius:20, overflow:'hidden', position:'relative', minHeight:200 },
  mapaGrid:  { ...StyleSheet.absoluteFillObject },
  gridLine:  { position:'absolute', backgroundColor:'rgba(255,255,255,0.04)' },
  gridH:     { left:0, right:0, height:1 },
  gridV:     { top:0, bottom:0, width:1 },
  rotaLine:  { position:'absolute', top:'50%', left:'15%', right:'25%', height:3, backgroundColor:'rgba(255,59,92,0.4)', borderRadius:2 },

  vanPin:     { position:'absolute', top:'43%', left:'20%', alignItems:'center' },
  vanEmoji:   { fontSize:28 },
  vanPinDot:  { width:6, height:6, borderRadius:3, backgroundColor:'#00FF87', marginTop:2 },

  clientePin:     { position:'absolute', top:'35%', right:'20%', alignItems:'center' },
  clientePinRing: { position:'absolute', width:50, height:50, borderRadius:25, borderWidth:2 },

  etaOverlay: { position:'absolute', top:12, left:12, backgroundColor:'rgba(13,21,32,0.9)', borderRadius:12, padding:10, borderWidth:1, borderColor:'rgba(255,255,255,0.1)' },
  etaValor:   { fontFamily:'Syne-Bold', fontSize:22, color:'#F0F4FF' },
  etaDist:    { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.5)' },

  chegandoAlert: { marginHorizontal:12, backgroundColor:'rgba(0,255,135,0.1)', borderWidth:1, borderColor:'rgba(0,255,135,0.3)', borderRadius:12, padding:10, alignItems:'center', marginBottom:4 },
  chegandoText:  { fontFamily:'Syne-Bold', fontSize:14, color:'#00FF87' },

  instrucaoBox:  { flexDirection:'row', alignItems:'center', gap:12, marginHorizontal:12, backgroundColor:'#111827', borderRadius:16, padding:14, marginBottom:8, borderWidth:1, borderColor:'rgba(255,255,255,0.07)' },
  instrucaoIcon: { width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,59,92,0.15)', alignItems:'center', justifyContent:'center' },
  instrucaoSeta: { fontFamily:'Syne-Bold', fontSize:22, color:'#FF3B5C' },
  instrucaoText: { fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  instrucaoSub:  { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },

  clienteCard:   { marginHorizontal:12, backgroundColor:'#111827', borderRadius:16, padding:14, marginBottom:8, borderWidth:1, borderColor:'rgba(255,255,255,0.07)' },
  clienteInfo:   { flexDirection:'row', alignItems:'center', gap:12 },
  clienteAvatar: { width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center' },
  clienteAvatarText:{ fontFamily:'Syne-Bold', fontSize:16, color:'#FF3B5C' },
  clienteNome:   { fontFamily:'Syne-Bold', fontSize:14, color:'#F0F4FF' },
  clienteVeiculo:{ fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },
  clienteEndereco:{ fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', marginTop:2 },
  clienteValor:  { fontFamily:'Syne-Bold', fontSize:16, color:'#00FF87', marginBottom:6 },
  chatBtn:       { width:32, height:32, borderRadius:16, backgroundColor:'rgba(0,229,255,0.1)', borderWidth:1, borderColor:'rgba(0,229,255,0.2)', alignItems:'center', justifyContent:'center' },
  chatBtnText:   { fontSize:16 },

  btnChegou:     { marginHorizontal:12, marginBottom:16, height:54, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1.5, borderColor:'rgba(255,255,255,0.15)', borderRadius:16, alignItems:'center', justifyContent:'center' },
  btnChegouAtivo:{ backgroundColor:'#00FF87', borderColor:'#00FF87' },
  btnChegouText: { fontFamily:'Syne-Bold', fontSize:15, color:'#000' },
});
