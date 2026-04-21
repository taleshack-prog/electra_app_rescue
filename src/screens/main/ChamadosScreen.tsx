import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const CHAMADOS = [
  { id:'1', tipo:'SOS Emergencial', dist:'1,2 km', eta:'~4 min',  valor:'R$ 85',  bateria:'8%',  cliente:'Marina Costa', veiculo:'Tesla Model 3',  urgencia:'alta',  status:'disponivel', hora:'14:32' },
  { id:'2', tipo:'Recarga Padrão',  dist:'2,8 km', eta:'~9 min',  valor:'R$ 45',  bateria:'22%', cliente:'João Silva',   veiculo:'BYD Dolphin',   urgencia:'media', status:'disponivel', hora:'14:28' },
  { id:'3', tipo:'Recarga Padrão',  dist:'4,1 km', eta:'~13 min', valor:'R$ 40',  bateria:'18%', cliente:'Ana Souza',   veiculo:'Fiat 500e',     urgencia:'baixa', status:'disponivel', hora:'14:25' },
  { id:'4', tipo:'SOS Emergencial', dist:'3,5 km', eta:'~11 min', valor:'R$ 90',  bateria:'5%',  cliente:'Pedro Lima',  veiculo:'Hyundai IONIQ', urgencia:'alta',  status:'disponivel', hora:'14:20' },
  { id:'5', tipo:'Recarga Padrão',  dist:'6,2 km', eta:'~19 min', valor:'R$ 38',  bateria:'31%', cliente:'Carla Mendes',veiculo:'BYD Seal',      urgencia:'baixa', status:'disponivel', hora:'14:15' },
  { id:'6', tipo:'Recarga Padrão',  dist:'1,8 km', eta:'~6 min',  valor:'R$ 42',  bateria:'25%', cliente:'Lucas Rocha', veiculo:'Chevrolet Bolt', urgencia:'media', status:'aceito',     hora:'14:10' },
  { id:'7', tipo:'SOS Emergencial', dist:'2,2 km', eta:'~7 min',  valor:'R$ 95',  bateria:'3%',  cliente:'Beatriz Cruz', veiculo:'Kia EV6',      urgencia:'alta',  status:'concluido',  hora:'13:45' },
];

type Filtro = 'todos' | 'sos' | 'padrao' | 'aceito' | 'concluido';

export default function ChamadosScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [filtro, setFiltro] = useState<Filtro>('todos');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.15, duration:700, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,    duration:700, useNativeDriver:true }),
    ])).start();
  }, []);

  const chamadosFiltrados = CHAMADOS.filter(c => {
    if (filtro === 'todos')    return c.status === 'disponivel';
    if (filtro === 'sos')      return c.tipo === 'SOS Emergencial' && c.status === 'disponivel';
    if (filtro === 'padrao')   return c.tipo === 'Recarga Padrão' && c.status === 'disponivel';
    if (filtro === 'aceito')   return c.status === 'aceito';
    if (filtro === 'concluido')return c.status === 'concluido';
    return true;
  });

  const urgenciaCor = (u: string) => u==='alta' ? '#FF3B5C' : u==='media' ? '#FFB800' : '#00E5FF';
  const statusCor   = (s: string) => s==='disponivel' ? '#00FF87' : s==='aceito' ? '#FFB800' : '#808080';
  const statusLabel = (s: string) => s==='disponivel' ? 'Disponível' : s==='aceito' ? 'Em andamento' : 'Concluído';

  const FILTROS: { key: Filtro; label: string }[] = [
    { key:'todos',     label:'Disponíveis' },
    { key:'sos',       label:'🆘 SOS' },
    { key:'padrao',    label:'⚡ Padrão' },
    { key:'aceito',    label:'Em andamento' },
    { key:'concluido', label:'Concluídos' },
  ];

  const countDisp = CHAMADOS.filter(c => c.status==='disponivel').length;
  const countSOS  = CHAMADOS.filter(c => c.tipo==='SOS Emergencial' && c.status==='disponivel').length;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View>
            <Text style={s.headerTitle}>Chamados</Text>
            <Text style={s.headerSub}>{countDisp} disponíveis · {countSOS} urgentes</Text>
          </View>
          {countSOS > 0 && (
            <Animated.View style={[s.sosBadge, { transform:[{scale:pulseAnim}] }]}>
              <Text style={s.sosBadgeText}>🆘 {countSOS}</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Filtros */}
        <Animated.View style={[{ opacity:fadeAnim }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtrosScroll} contentContainerStyle={s.filtrosContent}>
            {FILTROS.map(f => (
              <TouchableOpacity key={f.key}
                style={[s.filtroChip, filtro===f.key && s.filtroChipActive]}
                onPress={() => setFiltro(f.key)}>
                <Text style={[s.filtroText, filtro===f.key && s.filtroTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Lista */}
        <Animated.View style={{ opacity:fadeAnim }}>
          {chamadosFiltrados.length === 0 ? (
            <View style={s.emptyWrap}>
              <Text style={s.emptyIcon}>📭</Text>
              <Text style={s.emptyTitle}>Nenhum chamado aqui</Text>
              <Text style={s.emptySub}>Aguarde novos chamados na sua área</Text>
            </View>
          ) : (
            chamadosFiltrados.map(c => (
              <TouchableOpacity key={c.id} style={[s.chamadoCard, c.urgencia==='alta' && s.chamadoCardUrgente]}
                onPress={() => c.status==='disponivel' && navigation.navigate('DetalhesChamado', { chamadoId: c.id })}
                activeOpacity={0.85}>

                {/* Top row */}
                <View style={s.chamadoTop}>
                  <View style={[s.urgenciaBadge, { backgroundColor: urgenciaCor(c.urgencia)+'22', borderColor: urgenciaCor(c.urgencia)+'44' }]}>
                    <Text style={[s.urgenciaText, { color: urgenciaCor(c.urgencia) }]}>
                      {c.urgencia==='alta' ? '🔴 SOS URGENTE' : c.urgencia==='media' ? '🟡 Padrão' : '🔵 Normal'}
                    </Text>
                  </View>
                  <View style={s.topRight}>
                    <Text style={[s.statusLabel, { color: statusCor(c.status) }]}>{statusLabel(c.status)}</Text>
                    <Text style={s.horaText}>{c.hora}</Text>
                  </View>
                </View>

                {/* Info */}
                <View style={s.chamadoInfo}>
                  <View style={{flex:1}}>
                    <Text style={s.clienteNome}>{c.cliente}</Text>
                    <Text style={s.veiculoText}>{c.veiculo}</Text>
                    <View style={s.bateriaRow}>
                      <Text style={[s.bateriaText, { color: parseInt(c.bateria) <= 10 ? '#FF3B5C' : '#FFB800' }]}>
                        🔋 {c.bateria}
                      </Text>
                      <Text style={s.tipoText}>{c.tipo}</Text>
                    </View>
                  </View>
                  <View style={s.metaInfo}>
                    <Text style={s.valorText}>{c.valor}</Text>
                    <Text style={s.distText}>📍 {c.dist}</Text>
                    <Text style={s.etaText}>⏱ {c.eta}</Text>
                  </View>
                </View>

                {/* CTA */}
                {c.status === 'disponivel' && (
                  <TouchableOpacity style={[s.verBtn, { backgroundColor: urgenciaCor(c.urgencia) }]}
                    onPress={() => navigation.navigate('DetalhesChamado', { chamadoId: c.id })}>
                    <Text style={s.verBtnText}>Ver detalhes →</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}
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
  headerSub:   { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', marginTop:2 },
  sosBadge:    { backgroundColor:'rgba(255,59,92,0.15)', borderWidth:1.5, borderColor:'rgba(255,59,92,0.4)', borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  sosBadgeText:{ fontFamily:'Syne-Bold', fontSize:14, color:'#FF3B5C' },

  filtrosScroll:   { marginBottom:16 },
  filtrosContent:  { gap:8, paddingRight:16 },
  filtroChip:      { paddingHorizontal:14, paddingVertical:7, backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.08)', borderRadius:20 },
  filtroChipActive:{ backgroundColor:'rgba(255,59,92,0.15)', borderColor:'rgba(255,59,92,0.4)' },
  filtroText:      { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)' },
  filtroTextActive:{ fontFamily:'Syne-Bold', color:'#FF3B5C' },

  chamadoCard:        { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:20, padding:16, marginBottom:12 },
  chamadoCardUrgente: { borderColor:'rgba(255,59,92,0.3)' },
  chamadoTop:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  urgenciaBadge:      { borderWidth:1, borderRadius:20, paddingHorizontal:10, paddingVertical:3 },
  urgenciaText:       { fontFamily:'JetBrainsMono-Regular', fontSize:10 },
  topRight:           { alignItems:'flex-end' },
  statusLabel:        { fontFamily:'JetBrainsMono-Regular', fontSize:10 },
  horaText:           { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.3)', marginTop:2 },

  chamadoInfo:  { flexDirection:'row', alignItems:'flex-start', marginBottom:12 },
  clienteNome:  { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF' },
  veiculoText:  { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.5)', marginTop:2 },
  bateriaRow:   { flexDirection:'row', alignItems:'center', gap:8, marginTop:4 },
  bateriaText:  { fontFamily:'JetBrainsMono-Regular', fontSize:12 },
  tipoText:     { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)' },
  metaInfo:     { alignItems:'flex-end' },
  valorText:    { fontFamily:'Syne-Bold', fontSize:20, color:'#00FF87' },
  distText:     { fontFamily:'JetBrainsMono-Regular', fontSize:12, color:'rgba(240,244,255,0.6)', marginTop:4 },
  etaText:      { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },

  verBtn:     { height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  verBtnText: { fontFamily:'Syne-Bold', fontSize:13, color:'#000' },

  emptyWrap:  { alignItems:'center', paddingVertical:60 },
  emptyIcon:  { fontSize:48, marginBottom:12 },
  emptyTitle: { fontFamily:'Syne-Bold', fontSize:18, color:'rgba(240,244,255,0.5)' },
  emptySub:   { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.3)', marginTop:6 },
});
