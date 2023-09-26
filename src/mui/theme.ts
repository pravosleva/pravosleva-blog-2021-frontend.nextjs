import { createTheme } from '@mui/material/styles';
import { red, green } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      // main: '#556cd6',
      // main: '#2196f3',
      main: '#0162c8',
      dark: '#2196f3',
    },
    secondary: {
      // main: '#19857b',
      // main: '#97f48a',
      main: '#27c196',
    },
    error: {
      // main: red.A400,
      main: red.A200,
    },
    success: {
      main: green[600],
    }
  },
  breakpoints: {
    values: {
      xs: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    },
  },
  // NOTE: See also https://mui.com/material-ui/customization/theme-components/#theme-default-props
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
