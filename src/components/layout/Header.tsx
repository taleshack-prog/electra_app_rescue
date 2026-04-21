import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { Typography } from '../base/Typography';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title, showBack = true, onBack, rightAction, transparent = false, style,
}) => {
  const { colors, spacing, radius, dimensions } = useTheme();
  const navigation = useNavigation();
  const handleBack = () => onBack ? onBack() : navigation.canGoBack() && navigation.goBack();
  return (
    <View style={[
      { height: dimensions.headerHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[5], backgroundColor: transparent ? 'transparent' : colors.bg },
      style,
    ]}>
      <View style={{ width: 44, alignItems: 'flex-start' }}>
        {showBack && (
          <TouchableOpacity onPress={handleBack}
            style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.s3, borderRadius: radius.full, borderWidth: 1, borderColor: colors.bd }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <View style={{ width: 8, height: 8, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.t2, transform: [{ rotate: '45deg' }, { translateX: 1 }] }} />
          </TouchableOpacity>
        )}
      </View>
      {title && <Typography variant="h3" color="t1" center style={{ flex: 1, textAlign: 'center', fontSize: 17 }}>{title}</Typography>}
      <View style={{ width: 44, alignItems: 'flex-end' }}>{rightAction}</View>
    </View>
  );
};

export default Header;
