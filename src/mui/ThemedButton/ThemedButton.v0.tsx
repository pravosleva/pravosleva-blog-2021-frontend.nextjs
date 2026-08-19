import React from 'react'
import { withStyles, WithStyles } from '@mui/styles';
import { Styles } from '@mui/styles/withStyles';
import Button, { ButtonProps } from '@mui/material/Button';
import { EPartnerCode } from './types';

// Расширяем интерфейс пропсов для styledBy, добавляя опциональный вариант
interface IStyles {
  partnerCode: EPartnerCode;
  variant?: 'contained' | 'outlined';
  children: React.ReactNode;
  [key: string]: any;
}

// Теперь значением маппинга может быть либо строка/число, либо вложенный объект под конкретный variant
interface IColorsMapping {
  default: string | number | { contained?: string | number; outlined?: string | number };
  red: string | number | { contained?: string | number; outlined?: string | number };
  [key: string]: any;
}

// Пропсы для результирующего компонента (наследуем нативные пропсы Button из MUI)
interface IButtonStyles extends WithStyles<Styles<any, any, any>>, Omit<ButtonProps, 'classes'> {
  partnerCode: EPartnerCode;
  variant?: 'contained' | 'outlined';
}

/**
 * Умный хелпер styledBy, поддерживающий двумерный маппинг:
 * 1. Ищет конфигурацию по свойству (например, по partnerCode)
 * 2. Если конфигурация — это объект с ключами contained/outlined, достает значение на основе props.variant
 * 3. Если это обычная строка/число, возвращает её как дефолт
 */
const styledBy = (property: string, mapping: IColorsMapping) => (props: IStyles) => {
  const targetConfig = mapping[props[property]];
  
  if (targetConfig && typeof targetConfig === 'object') {
    const currentVariant = props.variant || 'contained'; // По умолчанию contained
    return targetConfig[currentVariant] ?? targetConfig['contained'];
  }
  
  return targetConfig;
};

const styles = {
  root: {
    padding: '0px',
    letterSpacing: styledBy('partnerCode', {
      default: 'inherit',
      red: 'inherit',
      [EPartnerCode.SvyaznoySecondary]: '0.6px',
      [EPartnerCode.SvyaznoySecondaryBig]: '0.6px',
      [EPartnerCode.SvyaznoyYellow]: '0.6px',
      [EPartnerCode.SvyaznoyYellowBig]: '0.6px',
      [EPartnerCode.Yellow]: '0.6px',
    }),
    fontWeight: styledBy('partnerCode', {
      default: 'normal',
      red: 'normal',
      [EPartnerCode.SvyaznoySecondary]: 500,
      [EPartnerCode.SvyaznoySecondaryBig]: 500,
      [EPartnerCode.SvyaznoyYellow]: 500,
      [EPartnerCode.SvyaznoyYellowBig]: 500,
      [EPartnerCode.Yellow]: 'bold',
    }),
    lineHeight: styledBy('partnerCode', {
      default: '40px',
      red: '38px',
      [EPartnerCode.SvyaznoySecondary]: '38px',
      [EPartnerCode.SvyaznoySecondaryBig]: '48px',
      [EPartnerCode.SvyaznoyYellow]: '38px',
      [EPartnerCode.SvyaznoyYellowBig]: '48px',
      [EPartnerCode.Yellow]: '30px',
    }),
    minWidth: styledBy('partnerCode', {
      default: 'unset',
      red: 'unset',
      [EPartnerCode.SvyaznoySecondary]: '200px',
      [EPartnerCode.SvyaznoySecondaryBig]: '200px',
      [EPartnerCode.SvyaznoyYellow]: '200px',
      [EPartnerCode.SvyaznoyYellowBig]: '200px',
      [EPartnerCode.Yellow]: '120px',
    }),
    
    // ПРИМЕР: Динамическое разделение фонов contained / outlined
    backgroundColor: styledBy('partnerCode', {
      default: {
        contained: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        outlined: 'transparent'
      },
      red: {
        contained: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',
        outlined: 'transparent'
      },
      [EPartnerCode.SvyaznoySecondary]: 'transparent',
      [EPartnerCode.SvyaznoySecondaryBig]: 'transparent',
      [EPartnerCode.SvyaznoyYellow]: {
        contained: '#FFC800',
        outlined: 'transparent'
      },
      [EPartnerCode.SvyaznoyYellowBig]: {
        contained: '#FFC800',
        outlined: 'transparent'
      },
      [EPartnerCode.Yellow]: {
        contained: '#FFC800',
        outlined: 'transparent'
      },
    }),

    // ПРИМЕР: Динамическое разделение границ
    border: styledBy('partnerCode', {
      default: 'none',
      red: '2px solid red',
      [EPartnerCode.SvyaznoySecondary]: '2px solid #4C1E87',
      [EPartnerCode.SvyaznoySecondaryBig]: '2px solid #4C1E87',
      [EPartnerCode.SvyaznoyYellow]: '2px solid #FFC800',
      [EPartnerCode.SvyaznoyYellowBig]: '2px solid #FFC800',
      [EPartnerCode.Yellow]: '2px solid #FFC800',
    }),
    borderRadius: styledBy('partnerCode', {
      default: '0px',
      red: '0px',
      [EPartnerCode.SvyaznoySecondary]: '8px',
      [EPartnerCode.SvyaznoySecondaryBig]: '8px',
      [EPartnerCode.SvyaznoyYellow]: '8px',
      [EPartnerCode.SvyaznoyYellowBig]: '8px',
      [EPartnerCode.Yellow]: '8px',
    }),
    transition: 'all 0.1s ease-in',

    // ПРИМЕР: Инвертируем цвета шрифтов для outlined версии, чтобы текст не сливался с фоном страницы
    color: styledBy('partnerCode', {
      default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      red: {
        contained: '#FFF',
        outlined: '#e63946'
      },
      [EPartnerCode.SvyaznoySecondary]: '#4C1E87',
      [EPartnerCode.SvyaznoySecondaryBig]: '#4C1E87',
      [EPartnerCode.SvyaznoyYellow]: '#4C1E87',
      [EPartnerCode.SvyaznoyYellowBig]: '#4C1E87',
      [EPartnerCode.Yellow]: '#000',
    }),
    boxShadow: styledBy('partnerCode', {
      default: {
        contained: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        outlined: 'none'
      },
      red: {
        contained: '0 3px 5px 2px rgba(230, 57, 70, .3)',
        outlined: 'none'
      },
      [EPartnerCode.SvyaznoySecondary]: 'none',
      [EPartnerCode.SvyaznoySecondaryBig]: 'none',
      [EPartnerCode.SvyaznoyYellow]: 'none',
      [EPartnerCode.SvyaznoyYellowBig]: 'none',
      [EPartnerCode.Yellow]: 'none',
    }),
    
    '&:hover': {
      color: styledBy('partnerCode', {
        default: 'inherit',
        red: '#FFF',
        [EPartnerCode.SvyaznoySecondary]: '#FFF',
        [EPartnerCode.SvyaznoySecondaryBig]: '#FFF',
        [EPartnerCode.SvyaznoyYellow]: '#FFC800',
        [EPartnerCode.SvyaznoyYellowBig]: '#FFC800',
        [EPartnerCode.Yellow]: '#FFC800',
      }),
      backgroundColor: styledBy('partnerCode', {
        default: 'linear-gradient(0deg, #FE6B8B 10%, #FF8E53 110%)',
        red: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',
        [EPartnerCode.SvyaznoySecondary]: '#4C1E87',
        [EPartnerCode.SvyaznoySecondaryBig]: '#4C1E87',
        [EPartnerCode.SvyaznoyYellow]: '#4C1E87',
        [EPartnerCode.SvyaznoyYellowBig]: '#4C1E87',
        [EPartnerCode.Yellow]: 'rgba(0, 0, 0, 0.5)',
      }),
      border: styledBy('partnerCode', {
        default: 'none',
        red: '2px solid red',
        [EPartnerCode.SvyaznoySecondary]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoySecondaryBig]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoyYellow]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoyYellowBig]: '2px solid #4C1E87',
        [EPartnerCode.Yellow]: '2px solid #fff',
      }),
      boxShadow: styledBy('partnerCode', {
        default: '0 3px 5px 2px rgba(255, 105, 135, .5)',
        red: '0 0px 8px 2px rgba(230, 57, 70, .5)',
        [EPartnerCode.SvyaznoySecondary]: 'none',
        [EPartnerCode.SvyaznoySecondaryBig]: 'none',
        [EPartnerCode.SvyaznoyYellow]: 'none',
        [EPartnerCode.SvyaznoyYellowBig]: 'none',
        [EPartnerCode.Yellow]: 'none',
      }),
    },
    '&:disabled': {
      borderColor: styledBy('partnerCode', {
        default: 'inherit',
        red: 'inherit',
        [EPartnerCode.SvyaznoySecondary]: 'lightgray',
        [EPartnerCode.SvyaznoySecondaryBig]: 'lightgray',
        [EPartnerCode.SvyaznoyYellow]: '#FFC800',
        [EPartnerCode.SvyaznoyYellowBig]: '#FFC800',
        [EPartnerCode.Yellow]: 'transparent',
      }),
      opacity: styledBy('partnerCode', {
        default: 1,
        red: 1,
        [EPartnerCode.SvyaznoySecondary]: 1,
        [EPartnerCode.SvyaznoySecondaryBig]: 1,
        [EPartnerCode.SvyaznoyYellow]: 0.5,
        [EPartnerCode.SvyaznoyYellowBig]: 0.5,
        [EPartnerCode.Yellow]: 0.5,
      }),
    },
  },
};

// Чтобы MUI не выкидывал предупреждения в консоль о неизвестных DOM-пропсах,
// мы забираем partnerCode и собственный variant, передавая в базовый Button только стандартные пропсы
export const ThemedButton = withStyles(styles)(
  ({ classes, partnerCode, variant = 'contained', ...other }: IButtonStyles) => (
    <Button className={classes.root} {...other} />
  )
);
