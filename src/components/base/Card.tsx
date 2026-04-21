import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default'|'cyan'|'red'|'green'|'purple'|'glass';
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({ children, onPress, variant = 'default', style, padding }) => {
  const { colors, radius, spacing } = useTheme();
  const variantStyle: Record<string, ViewStyle> = {
    default: { backgroundColor: colors.s2,      borderColor: colors.bd },
    cyan:    { backgroundColor: colors.cyanBg,   borderColor: 'rgba(0,229,255,0.2)' },
    red:     { backgroundColor: colors.redBg,    borderColor: 'rgba(255,59,92,0.2)' },
    green:   { backgroundColor: colors.greenBg,  borderColor: 'rgba(0,255,135,0.2)' },
    purple:  { backgroundColor: colors.purpleBg, borderColor: 'rgba(124,58,237,0.25)' },
    glass:   { backgroundColor: 'rgba(13,19,32,0.85)', borderColor: colors.bd2 },
  };
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.8 } : {};
  return (
    <Container {...containerProps}
      style={[{ borderRadius: radius['2xl'], padding: padding ?? spacing[4], borderWidth: 1, marginBottom: 10, ...variantStyle[variant] }, style]}>
      {children}
    </Container>
  );
};

interface PillProps { label: string; variant?: 'cyan'|'green'|'red'|'amber'|'purple'|'neutral'; dot?: boolean; style?: ViewStyle; }
export const Pill: React.FC<PillProps> = ({ label, variant = 'neutral', dot = false, style }) => {
  const { colors, radius } = useTheme();
  const map = {
    cyan:    { bg: colors.cyanBg,   color: colors.cyan },
    green:   { bg: colors.greenBg,  color: colors.green },
    red:     { bg: colors.redBg,    color: colors.red },
    amber:   { bg: colors.amberBg,  color: colors.amber },
    purple:  { bg: colors.purpleBg, color: '#A78BFA' },
    neutral: { bg: colors.s3,       color: colors.t3 },
  };
  const { bg, color } = map[variant];
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, backgroundColor: bg, alignSelf: 'flex-start', gap: 5 }, style]}>
      {dot && <View style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: color }} />}
      <Typography variant="label" style={{ color, fontSize: 10 }}>{label}</Typography>
    </View>
  );
};

interface DividerProps { style?: ViewStyle; }
export const Divider: React.FC<DividerProps> = ({ style }) => {
  const { colors } = useTheme();
  return <View style={[{ height: 1, backgroundColor: colors.bd3, marginVertical: 8 }, style]} />;
};

export default Card;
