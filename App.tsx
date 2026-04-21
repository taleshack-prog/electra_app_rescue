import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={s.root}>
      <Text style={s.icon}>🚐</Text>
      <Text style={s.title}>ELECTRA RESCUE</Text>
      <Text style={s.sub}>App Resgatista</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex:1, backgroundColor:'#070B14', alignItems:'center', justifyContent:'center' },
  icon:  { fontSize:64, marginBottom:16 },
  title: { fontFamily:'Syne-Bold', fontSize:28, color:'#FF3B5C' },
  sub:   { fontFamily:'JetBrainsMono-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', marginTop:8 },
});
