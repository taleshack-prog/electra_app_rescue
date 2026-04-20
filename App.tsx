import React, { useRef, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const ring1Scale = useRef(new Animated.Value(0.8)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ring1Opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(ring1Scale,   { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={styles.root}>
            {/* Glow */}
            <View style={styles.glow} />

            {/* Anéis */}
            <Animated.View style={[styles.ring, styles.ring1, { opacity: ring1Opacity, transform: [{ scale: ring1Scale }] }]} />
            <Animated.View style={[styles.ring, styles.ring2, { opacity: ring1Opacity }]} />

            {/* Van futurista SVG-like com Views */}
            <Animated.View style={[styles.vanWrap, { opacity: fadeAnim, transform: [{ scale: pulseAnim }] }]}>
              {/* Corpo principal */}
              <View style={styles.vanBody}>
                {/* Janela dianteira */}
                <View style={styles.vanWindshield} />
                {/* Janela lateral */}
                <View style={styles.vanWindow} />
                {/* Faixa lateral */}
                <View style={styles.vanStripe} />
                {/* Logo ⚡ */}
                <View style={styles.vanLogo}>
                  <Text style={styles.vanLogoText}>⚡</Text>
                </View>
                {/* Luzes frente */}
                <View style={styles.lightFront} />
                {/* Luzes traseira */}
                <View style={styles.lightBack} />
              </View>
              {/* Rodas */}
              <View style={styles.wheelsRow}>
                <View style={styles.wheel}>
                  <View style={styles.wheelInner} />
                </View>
                <View style={styles.wheel}>
                  <View style={styles.wheelInner} />
                </View>
              </View>
              {/* Efeito de velocidade */}
              <View style={styles.speedLines}>
                {[0,1,2,3].map(i => (
                  <View key={i} style={[styles.speedLine, { width: 20 + i * 12, opacity: 0.3 - i * 0.05, top: 10 + i * 8 }]} />
                ))}
              </View>
            </Animated.View>

            {/* Texto */}
            <Animated.View style={[styles.textArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.label}>ELECTRA</Text>
              <Text style={styles.title}>RESCUE</Text>
              <Text style={styles.sub}>App do Resgatista</Text>
            </Animated.View>

            {/* Status */}
            <Animated.View style={[styles.statusWrap, { opacity: fadeAnim }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Sistema inicializando...</Text>
            </Animated.View>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor:'#070B14', alignItems:'center', justifyContent:'center' },

  glow:  { position:'absolute', width:300, height:300, borderRadius:150, backgroundColor:'rgba(255,59,92,0.06)', top: height*0.2 },

  ring:  { position:'absolute', borderRadius:999, borderWidth:1 },
  ring1: { width:260, height:260, borderColor:'rgba(255,59,92,0.1)' },
  ring2: { width:180, height:180, borderColor:'rgba(255,59,92,0.15)' },

  vanWrap: { marginBottom:32, alignItems:'center' },

  vanBody: {
    width:160, height:80,
    backgroundColor:'#1A2236',
    borderRadius:12,
    borderWidth:1.5,
    borderColor:'rgba(255,59,92,0.4)',
    position:'relative',
    overflow:'hidden',
  },
  vanWindshield: {
    position:'absolute', top:8, right:12,
    width:40, height:36,
    backgroundColor:'rgba(0,229,255,0.15)',
    borderRadius:6,
    borderWidth:1, borderColor:'rgba(0,229,255,0.3)',
  },
  vanWindow: {
    position:'absolute', top:8, right:60,
    width:28, height:24,
    backgroundColor:'rgba(0,229,255,0.1)',
    borderRadius:4,
    borderWidth:1, borderColor:'rgba(0,229,255,0.2)',
  },
  vanStripe: {
    position:'absolute', bottom:20, left:0, right:0,
    height:2, backgroundColor:'rgba(255,59,92,0.6)',
  },
  vanLogo: {
    position:'absolute', top:8, left:12,
    width:32, height:32,
    backgroundColor:'rgba(255,59,92,0.15)',
    borderRadius:8, borderWidth:1, borderColor:'rgba(255,59,92,0.4)',
    alignItems:'center', justifyContent:'center',
  },
  vanLogoText: { fontSize:16 },
  lightFront: {
    position:'absolute', right:0, top:16,
    width:6, height:20,
    backgroundColor:'#FFB800',
    borderRadius:3,
  },
  lightBack: {
    position:'absolute', left:0, top:16,
    width:6, height:20,
    backgroundColor:'#FF3B5C',
    borderRadius:3,
  },

  wheelsRow: { flexDirection:'row', justifyContent:'space-between', width:140, marginTop:4 },
  wheel: {
    width:28, height:28, borderRadius:14,
    backgroundColor:'#1A2236',
    borderWidth:2, borderColor:'rgba(255,59,92,0.5)',
    alignItems:'center', justifyContent:'center',
  },
  wheelInner: {
    width:12, height:12, borderRadius:6,
    backgroundColor:'rgba(255,59,92,0.3)',
    borderWidth:1, borderColor:'rgba(255,59,92,0.6)',
  },

  speedLines: { position:'absolute', left:-40, top:20 },
  speedLine:  { height:2, backgroundColor:'#FF3B5C', borderRadius:1, marginBottom:4 },

  textArea: { alignItems:'center', marginBottom:24 },
  label:    { fontFamily:'JetBrainsMono-Regular', fontSize:12, color:'rgba(255,59,92,0.7)', letterSpacing:6, marginBottom:4 },
  title:    { fontFamily:'Syne-Bold', fontSize:42, color:'#FF3B5C', letterSpacing:-1, lineHeight:44 },
  sub:      { fontFamily:'JetBrainsMono-Regular', fontSize:11, color:'rgba(240,244,255,0.35)', letterSpacing:3, marginTop:8 },

  statusWrap: { flexDirection:'row', alignItems:'center', gap:8 },
  statusDot:  { width:6, height:6, borderRadius:3, backgroundColor:'#00FF87' },
  statusText: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(240,244,255,0.3)', letterSpacing:1 },
});
