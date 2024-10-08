import { createTheme } from '@mui/material/styles';
import { red, green } from '@mui/material/colors';

export const breakpoints = {
  xs: 320,
  sm: 600,
  md: 900,
  lg: 1280,
  xl: 1920
}

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
      // main: '#27c196',
      main: '#cbd5e1', // tw slate-300
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
    values: breakpoints,
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
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    // MuiInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: '8px',
    //     },
    //   },
    // },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: '8px',
    //     },
    //   },
    // },
    // MuiButtonBase: {
    //   styleOverrides: {
    //     root: {
    //       color: '#cbd5e1',
    //     },
    //   },
    // },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       color: '#cbd5e1',
    //     },
    //   },
    // },
    MuiChip: {
      styleOverrides: {
        label: {
          fontFamily: 'system-ui',
        },
      },
    },
  },
});

export default theme;
