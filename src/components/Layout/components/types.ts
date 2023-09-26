import { WithStyles } from '@mui/styles'
import { Styles } from '@mui/styles/withStyles'
// import { EPartner } from '~/components/ot/constants/interfaces';

export enum EThemeCode {
  LIGHT = 'light',
  GRAY = 'gray',
  DARK_GRAY = 'dark-gray',
  DARK = 'dark',
}

export interface IStyles {
  themeCode: EThemeCode;
  children: React.ReactNode;
  [key: string]: any;
}
export interface IColorsMapping {
  [key: string]: any;
}
export interface IButtonStyles extends WithStyles<Styles<any, any, any>> {
  partnerCode: EThemeCode;
}
