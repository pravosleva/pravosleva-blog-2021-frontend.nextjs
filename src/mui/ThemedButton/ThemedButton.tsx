import React from 'react'
import { withStyles, WithStyles } from '@mui/styles';
import { Styles } from '@mui/styles/withStyles';
import Button, { ButtonProps } from '@mui/material/Button';
import clsx from 'clsx';
import { EPartnerCode } from './types';

interface IButtonStyles extends WithStyles<Styles<any, any, any>>, Omit<ButtonProps, 'classes' | 'variant'> {
  partnerCode: EPartnerCode;
  variant?: 'contained' | 'outlined';
}

// 1. Выносим ВСЮ конфигурацию в изолированный плоский объект данных.
// Это не стили JSS, это просто конфиг, который не зависит от пропсов React!
const partnersConfig = {
  [EPartnerCode.Red]: {
    letterSpacing: 'inherit',
    fontWeight: 'normal',
    lineHeight: '38px',
    minWidth: 'unset',
    borderRadius: '0px',
    contained: {
      backgroundColor: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
      border: '2px solid red',
      color: '#FFF',
      boxShadow: '0 3px 5px 2px rgba(230, 57, 70, .3)',
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '2px solid red',
      color: '#e63946',
      boxShadow: 'none',
    },
    hover: {
      color: '#FFF',
      backgroundColor: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
      border: '2px solid red',
      boxShadow: '0 0px 8px 2px rgba(230, 57, 70, .5)',
    },
    disabled: { borderColor: 'inherit', opacity: 1 }
  },

  [EPartnerCode.SvyaznoyYellow]: {
    letterSpacing: '0.6px',
    fontWeight: 500,
    lineHeight: '38px',
    minWidth: '200px',
    borderRadius: '8px',
    contained: { backgroundColor: '#FFC800', border: '2px solid #FFC800', color: '#4C1E87', boxShadow: 'none' },
    outlined: { backgroundColor: 'transparent', border: '2px solid #FFC800', color: '#4C1E87', boxShadow: 'none' },
    hover: { color: '#FFC800', backgroundColor: '#4C1E87', border: '2px solid #4C1E87', boxShadow: 'none' },
    disabled: { borderColor: '#FFC800', opacity: 0.5 }
  },

  [EPartnerCode.Yellow]: {
    letterSpacing: '0.6px',
    fontWeight: 'bold',
    lineHeight: '30px',
    minWidth: '120px',
    borderRadius: '8px',
    contained: { backgroundColor: '#FFC800', border: '2px solid #FFC800', color: '#000', boxShadow: 'none' },
    outlined: { backgroundColor: 'transparent', border: '2px solid #FFC800', color: '#FFC800', boxShadow: 'none' },
    hover: { color: '#FFC800', backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '2px solid #fff', boxShadow: 'none' },
    disabled: { borderColor: 'transparent', opacity: 0.5 }
  },

  [EPartnerCode.SvyaznoySecondary]: {
    letterSpacing: '0.6px',
    fontWeight: 500,
    lineHeight: '38px',
    minWidth: '200px',
    borderRadius: '8px',
    contained: { backgroundColor: 'transparent', border: '2px solid #4C1E87', color: '#4C1E87', boxShadow: 'none' },
    outlined: { backgroundColor: 'transparent', border: '2px solid #4C1E87', color: '#4C1E87', boxShadow: 'none' },
    hover: { color: '#FFF', backgroundColor: '#4C1E87', border: '2px solid #4C1E87', boxShadow: 'none' },
    disabled: { borderColor: 'lightgray', opacity: 1 }
  },

  default: {
    letterSpacing: 'inherit',
    fontWeight: 'normal',
    lineHeight: '40px',
    minWidth: 'unset',
    borderRadius: '0px',
    contained: {
      backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 'none',
      color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '2px solid #FE6B8B',
      color: '#FE6B8B',
      boxShadow: 'none',
    },
    hover: {
      color: 'inherit',
      backgroundColor: 'linear-gradient(0deg, #FE6B8B 10%, #FF8E53 110%)',
      border: 'none',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .5)',
    },
    disabled: { borderColor: 'inherit', opacity: 1 }
  }
};

// 2. Делаем функцию-селектор для JSS стилей.
// ВАЖНО: Она принимает props и возвращает значение динамически. 
// Так как имена базовых классов станут статичными (root, rootOutlined), несоответствие className исчезнет.
const getStyleByProps = (path: string) => (props: any) => {
  const partner = props.partnerCode;
  const variant = props.variant || 'contained';
  const config = (partnersConfig as Record<string, any>)[partner] || partnersConfig.default;

  if (path === 'variantStyles') {
    return config[variant] || config['contained'];
  }
  return config[path];
};

// 3. Статичные JSS-классы для MUI. 
// Имена "root" и "hover" теперь монолитны, генератор классов на сервере и клиенте выдаст одинаковый хэш.
const styles = {
  root: {
    padding: '0px',
    transition: 'all 0.1s ease-in',
    
    // Подмешиваем общие параметры партнера
    letterSpacing: getStyleByProps('letterSpacing'),
    fontWeight: getStyleByProps('fontWeight'),
    lineHeight: getStyleByProps('lineHeight'),
    minWidth: getStyleByProps('minWidth'),
    borderRadius: getStyleByProps('borderRadius'),

    // Разворачиваем специфичные стили для contained или outlined
    ...getStyleByProps('variantStyles') as any,

    '&:hover': {
      // Подмешиваем ховеры из нашего конфига
      ...getStyleByProps('hover') as any
    },
    '&:disabled': {
      ...getStyleByProps('disabled') as any
    },
  },
} as Record<string, any> as any;

export const ThemedButton = withStyles(styles)(
  ({ classes, partnerCode, variant = 'contained', ...other }: IButtonStyles) => {
    // Вся магия выбора теперь лежит внутри динамического getStyleByProps,
    // а класс на ноде всегда один — стабильный classes.root
    return (
      <Button 
        className={classes.root} 
        {...other} 
      />
    );
  }
);
