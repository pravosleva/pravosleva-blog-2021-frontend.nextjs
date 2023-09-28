import React from 'react'
import { withStyles, WithStyles } from '@mui/styles';
import { Styles } from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import { EPartnerCode } from './types';

interface IStyles {
  partnerCode: EPartnerCode;
  children: React.ReactNode;
  [key: string]: any;
}
interface IColorsMapping {
  default: string | number;
  red: string | number;
  [key: string]: any;
}
interface IButtonStyles extends WithStyles<Styles<any, any, any>> {
  partnerCode: EPartnerCode;
}

// Like https://github.com/brunobertolini/styled-by
const styledBy = (property: string, mapping: IColorsMapping) => (
  props: IStyles
) => mapping[props[property]];

const styles = {
  root: {
    padding: '0px',
    letterSpacing: styledBy('partnerCode', {
      default: 'inherit',
      red: 'inherit',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: '0.6px',
      [EPartnerCode.SvyaznoySecondaryBig]: '0.6px',
      [EPartnerCode.SvyaznoyYellow]: '0.6px',
      [EPartnerCode.SvyaznoyYellowBig]: '0.6px',
      [EPartnerCode.Yellow]: '0.6px',
    }),
    fontWeight: styledBy('partnerCode', {
      default: 'normal',
      red: 'normal',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: 500,
      [EPartnerCode.SvyaznoySecondaryBig]: 500,
      [EPartnerCode.SvyaznoyYellow]: 500,
      [EPartnerCode.SvyaznoyYellowBig]: 500,
      [EPartnerCode.Yellow]: 'bold',
    }),
    lineHeight: styledBy('partnerCode', {
      default: '40px',
      red: '38px',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: '38px',
      [EPartnerCode.SvyaznoySecondaryBig]: '48px',
      [EPartnerCode.SvyaznoyYellow]: '38px',
      [EPartnerCode.SvyaznoyYellowBig]: '48px',
      [EPartnerCode.Yellow]: '30px',
    }),
    minWidth: styledBy('partnerCode', {
      default: 'unset',
      red: 'unset',

      // SVYAZNOY: 280px
      [EPartnerCode.SvyaznoySecondary]: '200px',
      [EPartnerCode.SvyaznoySecondaryBig]: '200px',
      [EPartnerCode.SvyaznoyYellow]: '200px',
      [EPartnerCode.SvyaznoyYellowBig]: '200px',
      [EPartnerCode.Yellow]: '120px',
    }),
    backgroundColor: styledBy('partnerCode', {
      default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      red: 'linear-gradient(45deg, #e63946 30%, #fe7f2d 90%)',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: 'transparent',
      [EPartnerCode.SvyaznoySecondaryBig]: 'transparent',
      [EPartnerCode.SvyaznoyYellow]: '#FFC800',
      [EPartnerCode.SvyaznoyYellowBig]: '#FFC800',
      [EPartnerCode.Yellow]: '#FFC800',
    }),
    border: styledBy('partnerCode', {
      default: 'none',
      red: '2px solid red',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: '2px solid #4C1E87',
      [EPartnerCode.SvyaznoySecondaryBig]: '2px solid #4C1E87',
      [EPartnerCode.SvyaznoyYellow]: '2px solid #FFC800',
      [EPartnerCode.SvyaznoyYellowBig]: '2px solid #FFC800',
      [EPartnerCode.Yellow]: '2px solid #FFC800',
    }),
    borderRadius: styledBy('partnerCode', {
      default: '0px',
      red: '0px',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: '8px',
      [EPartnerCode.SvyaznoySecondaryBig]: '8px',
      [EPartnerCode.SvyaznoyYellow]: '8px',
      [EPartnerCode.SvyaznoyYellowBig]: '8px',
      [EPartnerCode.Yellow]: '8px',
    }),
    transition: 'all 0.1s ease-in',
    color: styledBy('partnerCode', {
      default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      red: '#FFF',

      // SVYAZNOY:
      [EPartnerCode.SvyaznoySecondary]: '#4C1E87',
      [EPartnerCode.SvyaznoySecondaryBig]: '#4C1E87',
      [EPartnerCode.SvyaznoyYellow]: '#4C1E87',
      [EPartnerCode.SvyaznoyYellowBig]: '#4C1E87',
      [EPartnerCode.Yellow]: '#000',
    }),
    boxShadow: styledBy('partnerCode', {
      default: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      red: '0 3px 5px 2px rgba(230, 57, 70, .3)',

      // SVYAZNOY:
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

        // SVYAZNOY:
        [EPartnerCode.SvyaznoySecondary]: '#FFF',
        [EPartnerCode.SvyaznoySecondaryBig]: '#FFF',
        [EPartnerCode.SvyaznoyYellow]: '#FFC800',
        [EPartnerCode.SvyaznoyYellowBig]: '#FFC800',
        [EPartnerCode.Yellow]: '#FFC800',
      }),
      backgroundColor: styledBy('partnerCode', {
        default: 'linear-gradient(0deg, #FE6B8B 10%, #FF8E53 110%)',
        red: 'linear-gradient(0deg, #e63946 10%, #fe7f2d 110%)',

        // SVYAZNOY:
        [EPartnerCode.SvyaznoySecondary]: '#4C1E87',
        [EPartnerCode.SvyaznoySecondaryBig]: '#4C1E87',
        [EPartnerCode.SvyaznoyYellow]: '#4C1E87',
        [EPartnerCode.SvyaznoyYellowBig]: '#4C1E87',
        [EPartnerCode.Yellow]: 'rgba(0, 0, 0, 0.5)',
      }),
      border: styledBy('partnerCode', {
        default: 'none',
        red: '2px solid red',

        // SVYAZNOY:
        [EPartnerCode.SvyaznoySecondary]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoySecondaryBig]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoyYellow]: '2px solid #4C1E87',
        [EPartnerCode.SvyaznoyYellowBig]: '2px solid #4C1E87',
        [EPartnerCode.Yellow]: '2px solid #fff',
      }),
      boxShadow: styledBy('partnerCode', {
        default: '0 3px 5px 2px rgba(255, 105, 135, .5)',
        red: '0 0px 8px 2px rgba(230, 57, 70, .5)',

        // SVYAZNOY:
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

        // SVYAZNOY:
        [EPartnerCode.SvyaznoySecondary]: 'lightgray',
        [EPartnerCode.SvyaznoySecondaryBig]: 'lightgray',
        [EPartnerCode.SvyaznoyYellow]: '#FFC800',
        [EPartnerCode.SvyaznoyYellowBig]: '#FFC800',
        [EPartnerCode.Yellow]: 'transparent',
      }),
      opacity: styledBy('partnerCode', {
        default: 1,
        red: 1,

        // SVYAZNOY:
        [EPartnerCode.SvyaznoySecondary]: 1,
        [EPartnerCode.SvyaznoySecondaryBig]: 1,
        [EPartnerCode.SvyaznoyYellow]: 0.5,
        [EPartnerCode.SvyaznoyYellowBig]: 0.5,
        [EPartnerCode.Yellow]: 0.5,
      }),
    },
  },
};


export const ThemedButton = withStyles(
  styles
)(({ classes, partnerCode, ...other }: IButtonStyles) => (
  <Button className={classes.root} {...other} />
));
