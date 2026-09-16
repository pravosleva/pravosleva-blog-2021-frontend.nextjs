import { createTheme } from '@mui/material/styles';
import { red, green } from '@mui/material/colors';

export const breakpoints = {
  xs: 320,
  sm: 600,
  md: 800,
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
          padding: '6px 16px',
          '&::disabled': {
            cursor: 'not-allowed'
          },
        },
        sizeSmall: {
          lineHeight: 1.7,
          borderRadius: '16px',
          fontSize: '0.7rem',
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
          borderRadius: '16px',
        },
      },
    },
    
    // 🎯 Для инпутов с рамкой (Outlined) — самый популярный дефолтный вариант TextField
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },

    // 🎯 Для инпутов с нижней линией и фоновой заливкой (Filled)
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },

    // 🎯 Опционально: если вы используете стандартные выпадающие списки MuiSelect
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Установленный нами ранее радиус самого инпута
        },
      },
      // 🎯 ФИКС ОТСТУПА ДЛЯ SELECT: Пробрасываем смещение во внутреннее меню Popover
      defaultProps: {
        MenuProps: {
          PaperProps: {
            style: {
              // Мягко сдвигаем всплывающее окно вниз на 8px
              marginTop: '8px', 
            },
          },
          // Переопределяем опорные точки позиционирования, 
          // чтобы меню открывалось СТРОГО под инпутом, а не перекрывало его собой
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        },
      },
    },

    // 🎯 Скругление выпадающего окна (меню) Autocomplete на 8px
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: '8px', // Переопределяет 16px от MuiPaper конкретно для этого меню
        },
        // Опционально: скругление чипсов (тегов) внутри множественного выбора Autocomplete (multiple)
        tag: {
          borderRadius: '6px',
        },
        // 🎯 ФИКС ОТСТУПА: Задаем зазор между инпутом и выпадающим окном
        popper: {
          // Использовать !important здесь безопасно и необходимо, 
          // чтобы перебить динамические инлайн-координаты Popper.js
          marginTop: '8px !important', 
          
          // Дополнительно: можно добавить красивую мягкую тень для глубины
          filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.1))',
        }
      },
    },

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
