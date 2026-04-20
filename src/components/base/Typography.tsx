import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Variant = 'display'|'h1'|'h2'|'h3'|'body'|'bodyLg'|'bodySm'|'label'|'mono'|'monoLg'|'monoXl'|'caption';
type ColorKey = 't1'|'t2'|'t3'|'t4'|'cyan'|'green'|'red'|'amber'|'white';

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: ColorKey;
  bold?: boolean;
  center?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body', color = 't1', bold = false, center = false, style, children, ...props
}) => {
  const { colors, fontFamily, fontSize } = useTheme();

  const v: Record<Variant, object> = {
    display: { fontFamily: fontFamily.display, fontSize: fontSize['5xl'], lineHeight: fontSize['5xl'] * 1.15, letterSpacing: -0.5 },
    h1:      { fontFamily: fontFamily.display, fontSize: fontSize['4xl'], lineHeight: fontSize['4xl'] * 1.15, letterSpacing: -0.5 },
    h2:      { fontFamily: fontFamily.display, fontSize: fontSize['2xl'], lineHeight: fontSize['2xl'] * 1.2,  letterSpacing: -0.5 },
    h3:      { fontFamily: fontFamily.display, fontSize: fontSize.xl,    lineHeight: fontSize.xl * 1.25,    letterSpacing: -0.5 },
    body:    { fontFamily: bold ? fontFamily.sansBd : fontFamily.sans, fontSize: fontSize.base, lineHeight: fontSize.base * 1.55 },
    bodyLg:  { fontFamily: bold ? fontFamily.sansBd : fontFamily.sans, fontSize: fontSize.md,  lineHeight: fontSize.md  * 1.5  },
    bodySm:  { fontFamily: bold ? fontFamily.sansBd : fontFamily.sans, fontSize: fontSize.sm,  lineHeight: fontSize.sm  * 1.5  },
    label:   { fontFamily: fontFamily.monoMd, fontSize: fontSize.xs, letterSpacing: 2, textTransform: 'uppercase' as const },
    mono:    { fontFamily: fontFamily.mono,   fontSize: fontSize.base, lineHeight: fontSize.base * 1.4 },
    monoLg:  { fontFamily: fontFamily.mono,   fontSize: fontSize.lg,  lineHeight: fontSize.lg  * 1.3 },
    monoXl:  { fontFamily: fontFamily.display, fontSize: fontSize['6xl'], lineHeight: fontSize['6xl'], letterSpacing: -0.5 },
    caption: { fontFamily: fontFamily.sans,   fontSize: fontSize.xs,  lineHeight: fontSize.xs  * 1.5 },
  };

  return (
    <Text style={[v[variant], { color: colors[color] }, center && { textAlign: 'center' }, style]} {...props}>
      {children}
    </Text>
  );
};

export default Typography;
