import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label, error, iconLeft, iconRight, secureTextEntry, containerStyle, style, ...props
}) => {
  const { colors, radius, dimensions } = useTheme();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const borderColor = error ? colors.red : focused ? colors.cyan : colors.bd2;
  const shadowStyle = focused && !error
    ? { shadowColor: colors.cyan, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 3 }
    : {};

  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      {label && <Typography variant="label" color="t3" style={{ marginBottom: 7 }}>{label}</Typography>}
      <View style={[
        styles.container,
        { height: dimensions.inputHeight, borderRadius: radius.md, backgroundColor: colors.s2, borderColor, ...shadowStyle },
      ]}>
        {iconLeft && <View style={{ marginRight: 10 }}>{iconLeft}</View>}
        <TextInput
          placeholderTextColor={colors.t4}
          selectionColor={colors.cyan}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry && !visible}
          style={[{ flex: 1, height: '100%', color: colors.t1, fontFamily: 'DMSans-Regular', fontSize: 14, paddingVertical: 0 }, style]}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={{ marginLeft: 10 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Typography variant="caption" color="t3">{visible ? '👁' : '👁‍🗨'}</Typography>
          </TouchableOpacity>
        )}
        {iconRight && !secureTextEntry && <View style={{ marginLeft: 10 }}>{iconRight}</View>}
      </View>
      {error && <Typography variant="caption" color="red" style={{ marginTop: 5 }}>{error}</Typography>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 16 },
});

export default Input;
