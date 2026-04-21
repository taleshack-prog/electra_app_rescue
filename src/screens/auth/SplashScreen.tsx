import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(40)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const ring1Scale  = useRef(new Animated.Value(0.6)).current;
  const ring1Opac   = useRef(new Animated.Value(0)).current;
  const ring2Scale  = useRef(new Animated.Value(0.6)).current;
  const ring2Opac   = useRef(new Animated.Value(0)).current;
  const vanSlide    = useRef(new Animated.Value(-200)).current;
  const vanOpac     = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;
  const progressAnim= useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações
    Animated.sequence([
      // 1. Anéis aparecem
      Animated.parallel([
        Animated.timing(ring1Opac,  { toValue:1, duration:600, useNativeDriver:true }),
        Animated.spring(ring1Scale, { toValue:1, friction:5, tension:60, useNativeDriver:true }),
      ]),
      // 2. Van entra da esquerda
      Animated.parallel([
        Animated.timing(vanOpac,  { toValue:1, duration:400, useNativeDriver:true }),
        Animated.spring(vanSlide, { toValue:0, friction:6, tension:50, useNativeDriver:true }),
        Animated.timing(ring2Opac,  { toValue:1, duration:400, useNativeDriver:true }),
        Animated.spring(ring2Scale, { toValue:1, friction:5, tension:60, useNativeDriver:true }),
      ]),
      // 3. Texto aparece
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue:1, duration:500, useNativeDriver:true }),
        Animated.timing(slideAnim, { toValue:0, duration:500, useNativeDriver:true }),
      ]),
    ]).start();

    // Pulso contínuo na van
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue:1.06, duration:900, useNativeDriver:true }),
      Animated.timing(pulseAnim, { toValue:1,    duration:900, useNativeDriver:true }),
    ])).start();

    // Glow pulsante
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue:1, duration:1200, useNativeDriver:true }),
      Animated.timing(glowAnim, { toValue:0, duration:1200, useNativeDriver:true }),
    ])).start();

    // Barra de progresso
    Animated.timing(progressAnim, { toValue:1, duration:3000, useNativeDriver:false }).start();

    // Navega para Login após 3.5s
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange:[0,1], outputRange:[0.15, 0.5] });
  const progressWidth = progressAnim.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Glow de fundo */}
      <Animated.View style={[s.glow, { opacity: glowOpacity }]} />

      {/* Anéis */}
      <Animated.View style={[s.ring, s.ring1, { opacity: ring1Opac, transform:[{scale:ring1Scale}] }]} />
      <Animated.View style={[s.ring, s.ring2, { opacity: ring2Opac, transform:[{scale:ring2Scale}] }]} />
      <Animated.View style={[s.ring, s.ring3, { opacity: ring2Opac }]} />

      {/* Van futurista */}
      <Animated.View style={[s.vanWrap, { opacity:vanOpac, transform:[{translateX:vanSlide}, {scale:pulseAnim}] }]}>
        {/* Linhas de velocidade */}
        <View style={s.speedLines}>
          {[0,1,2,3,4].map(i => (
            <Animated.View key={i} style={[s.speedLine, {
              width: 30 + i*15,
              opacity: glowAnim.interpolate({ inputRange:[0,1], outputRange:[0.1+i*0.05, 0.3+i*0.05] }),
              top: 8 + i*10,
            }]} />
          ))}
        </View>

        {/* Corpo da van */}
        <View style={s.vanBody}>
          {/* Teto */}
          <View style={s.vanRoof} />
          {/* Janela dianteira */}
          <View style={s.vanWindshield} />
          {/* Janela lateral */}
          <View style={s.vanWindow} />
          {/* Faixa lateral */}
          <View style={s.vanStripe} />
          {/* Logo ⚡ */}
          <View style={s.vanLogo}>
            <Text style={s.vanLogoText}>⚡</Text>
          </View>
          {/* Luzes dianteiras */}
          <Animated.View style={[s.lightFront, { opacity: glowAnim.interpolate({inputRange:[0,1],outputRange:[0.6,1]}) }]} />
          {/* Luzes traseiras */}
          <View style={s.lightBack} />
          {/* Grade dianteira */}
          <View style={s.vanGrill}>
            {[0,1,2].map(i => <View key={i} style={s.grillLine} />)}
          </View>
        </View>

        {/* Rodas */}
        <View style={s.wheelsRow}>
          <Animated.View style={[s.wheel, { transform:[{rotate: pulseAnim.interpolate({inputRange:[1,1.06],outputRange:['0deg','20deg']})}] }]}>
            <View style={s.wheelInner} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'0deg'}]}]} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'60deg'}]}]} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'120deg'}]}]} />
          </Animated.View>
          <Animated.View style={[s.wheel, { transform:[{rotate: pulseAnim.interpolate({inputRange:[1,1.06],outputRange:['0deg','20deg']})}] }]}>
            <View style={s.wheelInner} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'0deg'}]}]} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'60deg'}]}]} />
            <View style={[s.wheelSpoke, {transform:[{rotate:'120deg'}]}]} />
          </Animated.View>
        </View>

        {/* Sombra no chão */}
        <View style={s.vanShadow} />
      </Animated.View>

      {/* Texto */}
      <Animated.View style={[s.textArea, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
        <Text style={s.labelTop}>ELECTRA ECOSYSTEM</Text>
        <Text style={s.title}>RESCUE</Text>
        <Text style={s.titleSub}>FORCE</Text>
        <Text style={s.sub}>Plataforma de Resgate Elétrico</Text>
      </Animated.View>

      {/* Barra de progresso */}
      <Animated.View style={[s.progressWrap, { opacity:fadeAnim }]}>
        <View style={s.progressTrack}>
          <Animated.View style={[s.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={s.progressLabel}>Inicializando sistema...</Text>
      </Animated.View>

      {/* Status dot */}
      <Animated.View style={[s.statusRow, { opacity:fadeAnim }]}>
        <Animated.View style={[s.statusDot, { opacity: glowAnim.interpolate({inputRange:[0,1],outputRange:[0.5,1]}) }]} />
        <Text style={s.statusText}>Sistema operacional ativo</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex:1, backgroundColor:'#070B14', alignItems:'center', justifyContent:'center' },

  glow: { position:'absolute', width:350, height:350, borderRadius:175, backgroundColor:'rgba(255,59,92,0.08)', top:height*0.15 },

  ring:  { position:'absolute', borderRadius:999, borderWidth:1 },
  ring1: { width:280, height:280, borderColor:'rgba(255,59,92,0.12)' },
  ring2: { width:200, height:200, borderColor:'rgba(255,59,92,0.18)' },
  ring3: { width:130, height:130, borderColor:'rgba(255,59,92,0.1)' },

  vanWrap:   { marginBottom:32, alignItems:'center', position:'relative' },
  speedLines:{ position:'absolute', left:-70, top:15 },
  speedLine: { height:2, backgroundColor:'#FF3B5C', borderRadius:1, marginBottom:6 },

  vanBody: {
    width:190, height:90,
    backgroundColor:'#111827',
    borderRadius:14,
    borderWidth:1.5,
    borderColor:'rgba(255,59,92,0.5)',
    position:'relative',
    overflow:'hidden',
  },
  vanRoof: {
    position:'absolute', top:-18, left:30, right:20,
    height:22,
    backgroundColor:'#111827',
    borderTopLeftRadius:10,
    borderTopRightRadius:8,
    borderWidth:1.5,
    borderColor:'rgba(255,59,92,0.4)',
    borderBottomWidth:0,
  },
  vanWindshield: {
    position:'absolute', top:8, right:14,
    width:44, height:40,
    backgroundColor:'rgba(0,229,255,0.12)',
    borderRadius:6,
    borderWidth:1, borderColor:'rgba(0,229,255,0.3)',
  },
  vanWindow: {
    position:'absolute', top:8, right:66,
    width:30, height:28,
    backgroundColor:'rgba(0,229,255,0.08)',
    borderRadius:4,
    borderWidth:1, borderColor:'rgba(0,229,255,0.2)',
  },
  vanStripe: {
    position:'absolute', bottom:22, left:0, right:0,
    height:2, backgroundColor:'rgba(255,59,92,0.7)',
  },
  vanLogo: {
    position:'absolute', top:10, left:14,
    width:34, height:34,
    backgroundColor:'rgba(255,59,92,0.15)',
    borderRadius:8, borderWidth:1, borderColor:'rgba(255,59,92,0.4)',
    alignItems:'center', justifyContent:'center',
  },
  vanLogoText: { fontSize:18 },
  lightFront: {
    position:'absolute', right:-2, top:14,
    width:8, height:24,
    backgroundColor:'#FFB800',
    borderRadius:4,
    shadowColor:'#FFB800', shadowOpacity:0.8, shadowRadius:6,
  },
  lightBack: {
    position:'absolute', left:-2, top:14,
    width:6, height:20,
    backgroundColor:'#FF3B5C',
    borderRadius:3,
  },
  vanGrill: {
    position:'absolute', right:0, top:40,
    width:6, height:30,
    justifyContent:'space-around',
    paddingVertical:3,
  },
  grillLine: { height:1.5, backgroundColor:'rgba(255,184,0,0.5)', borderRadius:1 },

  wheelsRow: { flexDirection:'row', justifyContent:'space-between', width:160, marginTop:4 },
  wheel: {
    width:32, height:32, borderRadius:16,
    backgroundColor:'#1A2236',
    borderWidth:2, borderColor:'rgba(255,59,92,0.6)',
    alignItems:'center', justifyContent:'center',
  },
  wheelInner: {
    width:14, height:14, borderRadius:7,
    backgroundColor:'rgba(255,59,92,0.2)',
    borderWidth:1.5, borderColor:'rgba(255,59,92,0.7)',
  },
  wheelSpoke: {
    position:'absolute',
    width:1.5, height:12,
    backgroundColor:'rgba(255,59,92,0.4)',
    borderRadius:1,
  },
  vanShadow: {
    width:180, height:8, borderRadius:100,
    backgroundColor:'rgba(255,59,92,0.15)',
    marginTop:4,
  },

  textArea:  { alignItems:'center', marginBottom:40 },
  labelTop:  { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(255,59,92,0.5)', letterSpacing:4, marginBottom:4 },
  title:     { fontFamily:'Syne-Bold', fontSize:52, color:'#FF3B5C', letterSpacing:-2, lineHeight:54 },
  titleSub:  { fontFamily:'Syne-Bold', fontSize:28, color:'rgba(255,59,92,0.5)', letterSpacing:8, lineHeight:32 },
  sub:       { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'rgba(240,244,255,0.3)', letterSpacing:2, marginTop:12 },

  progressWrap:  { width:width*0.6, marginBottom:12 },
  progressTrack: { height:2, backgroundColor:'rgba(255,59,92,0.15)', borderRadius:1, overflow:'hidden', marginBottom:6 },
  progressFill:  { height:2, backgroundColor:'#FF3B5C', borderRadius:1 },
  progressLabel: { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.2)', letterSpacing:2, textAlign:'center' },

  statusRow: { flexDirection:'row', alignItems:'center', gap:6 },
  statusDot: { width:6, height:6, borderRadius:3, backgroundColor:'#00FF87' },
  statusText:{ fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.25)', letterSpacing:1 },
});
