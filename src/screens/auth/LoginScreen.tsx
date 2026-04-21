import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;

  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:600, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:600, useNativeDriver:true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue:1, duration:2000, useNativeDriver:true }),
      Animated.timing(glowAnim, { toValue:0, duration:2000, useNativeDriver:true }),
    ])).start();
  }, []);

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha para continuar.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1500);
  };

  const glowOpacity = glowAnim.interpolate({ inputRange:[0,1], outputRange:[0.05, 0.15] });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />

      {/* Glow */}
      <Animated.View style={[s.glow, { opacity: glowOpacity }]} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <View style={s.vanMini}>
            <Text style={s.vanMiniIcon}>🚐</Text>
          </View>
          <View style={s.headerText}>
            <Text style={s.headerLabel}>ELECTRA RESCUE</Text>
            <Text style={s.headerTitle}>Área do Resgatista</Text>
            <Text style={s.headerSub}>Acesso exclusivo para operadores certificados</Text>
          </View>
        </Animated.View>

        {/* Badge */}
        <Animated.View style={[s.badgeWrap, { opacity:fadeAnim }]}>
          <View style={s.badge}>
            <Text style={s.badgeDot}>●</Text>
            <Text style={s.badgeText}>Sistema online — Resgatistas disponíveis</Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[s.form, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
          <Text style={s.formTitle}>Entrar na plataforma</Text>

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>E-MAIL OPERACIONAL</Text>
            <View style={[s.inputWrap, emailFocus && s.inputFocused]}>
              <Text style={s.inputIcon}>✉</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="rgba(240,244,255,0.2)"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>SENHA</Text>
            <View style={[s.inputWrap, senhaFocus && s.inputFocused]}>
              <Text style={s.inputIcon}>🔒</Text>
              <TextInput
                style={s.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••"
                placeholderTextColor="rgba(240,244,255,0.2)"
                secureTextEntry={!showSenha}
                onFocus={() => setSenhaFocus(true)}
                onBlur={() => setSenhaFocus(false)}
              />
              <TouchableOpacity onPress={() => setShowSenha(s => !s)} hitSlop={{top:10,bottom:10,left:10,right:10}}>
                <Text style={s.showSenha}>{showSenha ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Esqueci senha */}
          <TouchableOpacity style={s.forgotWrap}>
            <Text style={s.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Botão login */}
          <TouchableOpacity
            style={[s.btnLogin, loading && s.btnLoading]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={s.btnLoginText}>
              {loading ? 'Autenticando...' : '→  Entrar como Resgatista'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>ou</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Biometria */}
          <TouchableOpacity style={s.btnBio} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={s.btnBioIcon}>👆</Text>
            <Text style={s.btnBioText}>Entrar com biometria</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Info segurança */}
        <Animated.View style={[s.secInfo, { opacity:fadeAnim }]}>
          <Text style={s.secIcon}>🛡</Text>
          <Text style={s.secText}>
            Acesso monitorado e criptografado. Apenas resgatistas certificados pela ELECTRA podem acessar esta plataforma.
          </Text>
        </Animated.View>

        {/* Suporte */}
        <Animated.View style={[s.supportWrap, { opacity:fadeAnim }]}>
          <Text style={s.supportText}>Problemas para entrar? </Text>
          <TouchableOpacity>
            <Text style={s.supportLink}>Contactar suporte</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{height:40}} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex:1, backgroundColor:'#070B14' },
  scroll: { flexGrow:1, paddingHorizontal:24, paddingTop:60 },
  glow:   { position:'absolute', width:300, height:300, borderRadius:150, backgroundColor:'rgba(255,59,92,0.2)', top:0, alignSelf:'center' },

  header:     { flexDirection:'row', alignItems:'center', gap:16, marginBottom:20 },
  vanMini:    { width:56, height:56, borderRadius:16, backgroundColor:'rgba(255,59,92,0.1)', borderWidth:1.5, borderColor:'rgba(255,59,92,0.3)', alignItems:'center', justifyContent:'center' },
  vanMiniIcon:{ fontSize:28 },
  headerText: { flex:1 },
  headerLabel:{ fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(255,59,92,0.6)', letterSpacing:3, marginBottom:2 },
  headerTitle:{ fontFamily:'Syne-Bold', fontSize:22, color:'#F0F4FF', lineHeight:26 },
  headerSub:  { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', marginTop:2 },

  badgeWrap: { marginBottom:24 },
  badge:     { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(0,255,135,0.06)', borderWidth:1, borderColor:'rgba(0,255,135,0.15)', borderRadius:20, paddingHorizontal:12, paddingVertical:6, alignSelf:'flex-start' },
  badgeDot:  { fontSize:8, color:'#00FF87' },
  badgeText: { fontFamily:'JetBrainsMono-Regular', fontSize:10, color:'rgba(0,255,135,0.7)', letterSpacing:1 },

  form:      { backgroundColor:'#111827', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:24, padding:20, marginBottom:16 },
  formTitle: { fontFamily:'Syne-Bold', fontSize:18, color:'#F0F4FF', marginBottom:20 },

  fieldWrap:   { marginBottom:14 },
  fieldLabel:  { fontFamily:'JetBrainsMono-Regular', fontSize:9, color:'rgba(240,244,255,0.35)', letterSpacing:2, marginBottom:6 },
  inputWrap:   { flexDirection:'row', alignItems:'center', height:52, backgroundColor:'#0D1320', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:14, paddingHorizontal:14, gap:10 },
  inputFocused:{ borderColor:'#FF3B5C' },
  inputIcon:   { fontSize:16, color:'rgba(240,244,255,0.3)' },
  input:       { flex:1, fontFamily:'DMSans-Regular', fontSize:15, color:'#F0F4FF' },
  showSenha:   { fontSize:16, padding:4 },

  forgotWrap: { alignItems:'flex-end', marginBottom:20, marginTop:-4 },
  forgotText: { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(255,59,92,0.6)' },

  btnLogin:     { height:54, backgroundColor:'#FF3B5C', borderRadius:16, alignItems:'center', justifyContent:'center', marginBottom:16 },
  btnLoading:   { opacity:0.7 },
  btnLoginText: { fontFamily:'Syne-Bold', fontSize:15, color:'#fff', letterSpacing:0.5 },

  dividerRow:  { flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  dividerLine: { flex:1, height:1, backgroundColor:'rgba(255,255,255,0.06)' },
  dividerText: { fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.25)' },

  btnBio:     { height:50, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.1)', borderRadius:16, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10 },
  btnBioIcon: { fontSize:20 },
  btnBioText: { fontFamily:'DMSans-Regular', fontSize:14, color:'rgba(240,244,255,0.6)' },

  secInfo:  { flexDirection:'row', alignItems:'flex-start', gap:10, backgroundColor:'rgba(255,59,92,0.04)', borderWidth:1, borderColor:'rgba(255,59,92,0.1)', borderRadius:14, padding:14, marginBottom:16 },
  secIcon:  { fontSize:16 },
  secText:  { flex:1, fontFamily:'DMSans-Regular', fontSize:12, color:'rgba(240,244,255,0.4)', lineHeight:19 },

  supportWrap: { flexDirection:'row', justifyContent:'center', alignItems:'center' },
  supportText: { fontFamily:'DMSans-Regular', fontSize:13, color:'rgba(240,244,255,0.3)' },
  supportLink: { fontFamily:'Syne-Bold', fontSize:13, color:'#FF3B5C' },
});
