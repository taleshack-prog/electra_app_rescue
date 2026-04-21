import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

import SplashScreen       from '../screens/auth/SplashScreen';
import LoginScreen        from '../screens/auth/LoginScreen';
import DashboardScreen    from '../screens/main/DashboardScreen';
import ChamadosScreen     from '../screens/main/ChamadosScreen';
import GanhosScreen       from '../screens/main/GanhosScreen';
import PerfilScreen       from '../screens/main/PerfilScreen';
import DetalhesChamadoScreen from '../screens/main/DetalhesChamadoScreen';
import NavegacaoScreen    from '../screens/main/NavegacaoScreen';
import AtendimentoScreen  from '../screens/main/AtendimentoScreen';
import ConcluidoScreen    from '../screens/main/ConcluidoScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  DetalhesChamado: { chamadoId: string };
  Navegacao: { chamadoId: string };
  Atendimento: { chamadoId: string };
  Concluido: { chamadoId: string };
};

export type TabParamList = {
  Dashboard: undefined;
  Chamados: undefined;
  Ganhos: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

function TabBar({ state, navigation }: any) {
  const { colors } = useTheme();
  const tabs = [
    { name: 'Dashboard', icon: '⊞', label: 'Central' },
    { name: 'Chamados',  icon: '🆘', label: 'Chamados' },
    { name: 'Ganhos',    icon: '💰', label: 'Ganhos' },
    { name: 'Perfil',    icon: '○',  label: 'Perfil' },
  ];
  return (
    <View style={[styles.tabBar, { backgroundColor:'rgba(13,19,32,0.97)', borderTopColor: colors.bd }]}>
      {tabs.map((tab, i) => {
        const focused = state.index === i;
        return (
          <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} style={styles.tabItem} activeOpacity={0.8}>
            <Text style={[styles.tabIcon, { color: focused ? '#FF3B5C' : colors.t3 }]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color: focused ? '#FF3B5C' : colors.t3, fontWeight: focused ? '700' : '400' }]}>{tab.label}</Text>
            {focused && <View style={[styles.tabDot, { backgroundColor: '#FF3B5C' }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Chamados"  component={ChamadosScreen} />
      <Tab.Screen name="Ganhos"    component={GanhosScreen} />
      <Tab.Screen name="Perfil"    component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Splash"   component={SplashScreen} />
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetalhesChamado" component={DetalhesChamadoScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Navegacao"   component={NavegacaoScreen} />
        <Stack.Screen name="Atendimento" component={AtendimentoScreen} />
        <Stack.Screen name="Concluido"   component={ConcluidoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar:   { height:72, flexDirection:'row', borderTopWidth:1, paddingBottom:8 },
  tabItem:  { flex:1, alignItems:'center', justifyContent:'center', gap:2 },
  tabIcon:  { fontSize:20 },
  tabLabel: { fontSize:10 },
  tabDot:   { width:4, height:4, borderRadius:2, marginTop:2 },
});
