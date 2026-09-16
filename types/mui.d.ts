import { Theme } from '@mui/material/styles';

// Расширяем модуль стилей, привязывая к нему типы реальной темы MUI 5
declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}