import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top'|'bottom'|'left'|'right')[];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children, scroll = false, keyboardAware = false, style, contentStyle, edges = ['top','bottom'],
}) => {
  const { colors } = useTheme();
  const content = scroll
    ? <ScrollView contentContainerStyle={[{ flexGrow: 1 }, contentStyle]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    : <View style={[{ flex: 1 }, contentStyle]}>{children}</View>;
  const wrapped = keyboardAware
    ? <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>{content}</KeyboardAvoidingView>
    : content;
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {wrapped}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
