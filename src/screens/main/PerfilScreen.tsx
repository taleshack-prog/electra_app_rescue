import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';

export default function PerfilScreen() {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [online, setOnline]   = useState(true);
  const [notifs, setNotifs]   = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair da conta?', 'Você será desconectado.', [
      { text:'Cancelar', style:'cancel' },
      { text:'Sair', style:'destructive', onPress:() => {} },
    ]);
  };

  const MENU = [
    { icon:'🚐', label:'Meu veículo',        sub:'Van ELECTRA · Placa XYZ-9876' },
    { icon:'📄', label:'Documentos',          sub:'CNH, Certificado ELECTRA' },
    { icon:'💳', label:'Dados bancários',     sub:'Banco Itaú · Ag 0001 · CC 12345-6' },
    { icon:'🏆', label:'Minhas conquistas',   sub:'12 badges desbloqueados' },
    { icon:'📊', label:'Relatório de desempenho', sub:'Ver histórico completo' },
    { icon:'🛡', label:'Seguro do veículo',   sub:'Cobertura ELECTRA ativa' },
    { icon:'❓', label:'Suporte',             sub:'Chat e FAQ' },
    { icon:'📄', label:'Termos de uso',       sub:'Versão 2.1' },
  ];

  const STATS = [
    { val:'4.9', label:'Avaliação', icon:'⭐' },
    { val:'98',  label:'Resgates',  icon:'🆘' },
    { val:'92%', label:'Aceite',    icon:'✅' },
    { val:'Ouro',label:'Nível',     icon:'🥇' },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header perfil */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View style={s.avatarWrap}>
            <Text style={s.avatarText}>CR</Text>
            <View style={[s.avatarDot, { backgroundColor: online ? '#00FF87' : '#FF3B5C' }]} />
          </View>
          <View style={{flex:1}}>
            <Text style={s.nome}>Carlos Resgatista</Text>
            <Text style={s.id}>ID: RES-2847 · São Paulo, SP</Text>
            <Text style={s.membro}>Membro desde Janeiro 2024</Text>
          </View>
        </Animated.View>

        {/* Toggle online */}
        <Animated.View style={[s.onlineCard, { opacity:fadeAnim, borderColor: online ? 'rgba(0,255,135,0.3)' : 'rgba(255,59,92,0.3)' }]}>
          <View style={{flex:1}}>
            <Text style={[s.onlineTitle, { color: online ? '#00FF87' : '#FF3B5C' }]}>
              {online ? '● Online — Recebendo chamados' : '○ Offline — Indisponível'}
            </Text>
            <Text style={s.onlineSub}>Altere quando não estiver disponível</Text>
          </View>
          <Switch
            value={online} onValueChange={setOnline}
            trackColor={{ false:'rgba(255,59,92,0.3)', true:'rgba(0,255,135,0.3)' }}
            thumbColor={online ? '#00FF87' : '#FF3B5C'}
          />
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[s.statsRow, { opacity:fadeAnim }]}>
          {STATS.map((st,i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        <Animated.View style={[s.menuCard, { opacity:fadeAnim }]}>
          {MENU.map((item, i) => (
            <View key={i}>
              <TouchableOpacity style={s.menuItem} activeOpacity={0.7}>
                <View style={s.menuIcon}>
                  <Text style={{fontSize:18}}>{item.icon}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Text style={s.menuSub}>{item.sub}</Text>
                </View>
                <Text style={s.menuArrow}>›</Text>
              </TouchableOpacity>
              {i < MENU.length-1 && <View style={s.divider} />}
            </View>
          ))}
        </Animated.View>

        {/* Notificações */}
        <Animated.View style={[s.notifCard, { opacity:fadeAnim }]}>
          <View style={{flex:1}}>
            <Text style={s.notifTitle}>Notificações de chamados</Text>
            <Text style={s.notifSub}>Alertas de novos resgates próximos</Text>
          </View>
          <Switch
            value={notifs} onValueChange={setNotifs}
            trackColor={{ false:'#1A2236', true:'rgba(0,229,255,0.4)' }}
            thumbColor={notifs ? '#00E5FF' : '#4A5568'}
          />
        </Animated.View>

        {/* Logout */}
        <Animated.View style={[{ opacity:fadeAnim, marginBottom:40 }]}>
          <TouchableOpacity style={s.btnLogout} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={s.btnLogoutText}>Sair da conta</Text>
          </TouchableOpacity>
          <Text style={s.versao}>ELECTRA Rescue v1.0.0 · Build 2024</Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:16, paddingTop:16 },

  header:     { flexDirection:'row', alignItems:'center', gap:14, marginBottom:16 },
  avatarWrap: { width:64, height:64, borderRadius:32, backgroundColor:'rgba(255,59,92,0.15)', borderWidth:2, borderColor:'rgba(255,59,92,0.4)', alignItems:'center', justifyContent:'center', position:'relative' },
  avatarText: { fontFamily:'Syne-Bold', fontSize:22, color:'#FF3B5C' },
  avatarDot:  { position:'absolute', bottom:2, right:2, width:14, height:14, borderRadius:7, borderWidth:2, borderColor:'#070B14' },
  nome:       { fontFamily:'Syne-Bold', fontSize:20, color:'#F0F4FF' },
  id:         { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },
  membro:     { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.3)', marginTop:2 },

  onlineCard:  { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'#111827', borderWidth:1, borderRadius:18, padding:14, marginBottom:16 },
  onlineTitle: { fontFamily:'Syne-Bold', fontSize:13 },
  onlineSub:   { fontFamily:'DMSans-Regular', fontSize:11, color:'rgba(240,244,255,0.4)', marginTop:2 },

  statsRow:  { flexDirection:'row', gap:8, marginBottom:16 },
  statCard:  { flex:1, backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:12, alignItems:'center' },
  statIcon:  { fontSize:18, marginBottom:4 },
  statVal:   { fontFamily:'Syne-Bold', fontSize:16, color:'#F0F4FF', marginBottom:2 },
  statLabel: { fontFamily:'DMSans-Regular', fontSize:10, color:'rgba(240,244,255,0.4)', textAlign:'center' },

  menuCard:  { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', marginBottom:12 },
  menuItem:  { flexDirection:'row', alignItems:'center', padding:14, gap:12 },
  menuIcon:  { width:38, height:38, borderRadius:10, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  menuLabel: { fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF' },
  menuSub:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.35)', marginTop:2 },
  menuArrow: { fontSize:22, color:'rgba(240,244,255,0.2)' },
  divider:   { height:1, backgroundColor:'rgba(255,255,255,0.04)', marginLeft:64 },

  notifCard:  { flexDirection:'row', alignItems:'center', backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:16, padding:14, marginBottom:12 },
  notifTitle: { fontFamily:'DMSans-Regular', fontSize:14, color:'#F0F4FF' },
  notifSub:   { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },

  btnLogout:     { height:50, borderWidth:1, borderColor:'rgba(255,59,92,0.3)', borderRadius:14, alignItems:'center', justifyContent:'center', marginBottom:10 },
  btnLogoutText: { fontFamily:'Syne-Bold', fontSize:14, color:'rgba(255,59,92,0.7)' },
  versao:        { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.2)', textAlign:'center' },
});
