import React from 'react';
import { TouchableOpacity, View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

type Variant = 'primary'|'ghost'|'danger'|'success';
type Size = 'sm'|'md'|'lg';

interface ButtonProps {
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress, variant = 'primary', size = 'lg', label,
  loading = false, disabled = false, icon, iconRight, fullWidth = true, style,
}) => {
  const { colors, radius, dimensions, shadows } = useTheme();

  const heights: Record<Size, number> = { sm: dimensions.buttonHeightSm, md: 46, lg: dimensions.buttonHeight };

  const variantStyle: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.cyan,  ...(shadows.cyan  as ViewStyle) },
    ghost:   { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.bd2 },
    danger:  { backgroundColor: colors.red,   ...(shadows.red   as ViewStyle) },
    success: { backgroundColor: colors.green, ...(shadows.green as ViewStyle) },
  };

  const textColor: Record<Variant, 't1'|'white'|'t2'> = {
    primary: 'white', ghost: 't2', danger: 'white', success: 'white',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        { height: heights[size], borderRadius: radius.lg, ...variantStyle[variant] },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'ghost' ? colors.t2 : colors.black} size="small" />
        : <View style={styles.inner}>
            {icon && <View style={{ marginRight: 2 }}>{icon}</View>}
            <Typography variant="body" bold color={textColor[variant]}
              style={{ fontFamily: 'Syne-Bold', fontSize: 15, letterSpacing: 0.2 }}>
              {label}
            </Typography>
            {iconRight && <View style={{ marginLeft: 2 }}>{iconRight}</View>}
          </View>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:      { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.45 },
  inner:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default Button;
