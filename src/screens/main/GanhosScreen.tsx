import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function GanhosScreen() {
  return (
    <View style={s.root}>
      <Text style={s.text}>GanhosScreen</Text>
      <Text style={s.sub}>Em construção</Text>
    </View>
  );
}
const s = StyleSheet.create({ root:{ flex:1, backgroundColor:'#070B14', alignItems:'center', justifyContent:'center' }, text:{ fontFamily:'Syne-Bold', fontSize:18, color:'#FF3B5C' }, sub:{ fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.4)', marginTop:8 } });
