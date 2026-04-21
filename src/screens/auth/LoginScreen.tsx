import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function LoginScreen() {
  return (
    <View style={s.root}>
      <Text style={s.text}>LoginScreen</Text>
    </View>
  );
}
const s = StyleSheet.create({ root:{ flex:1, backgroundColor:'#070B14', alignItems:'center', justifyContent:'center' }, text:{ fontFamily:'Syne-Bold', fontSize:18, color:'#FF3B5C' } });
