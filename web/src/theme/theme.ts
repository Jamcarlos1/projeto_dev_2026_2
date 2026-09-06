import { createTheme } from '@mui/material/styles'


export const tokens = {
  paper: '#F6F1E7',
  paperDark: '#EDE5D4',
  ink: '#2B2A28',
  inkSoft: '#5B5850',
  moss: '#4B6350',
  mossDark: '#374A3B',
  mustard: '#C98A2C',
  mustardDark: '#A66F1F',
  rust: '#B0512E',
  border: '#D8CFBB',
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: tokens.paper,
      paper: '#FFFFFF',
    },
    primary: {
      main: tokens.moss,
      dark: tokens.mossDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.mustard,
      dark: tokens.mustardDark,
      contrastText: tokens.ink,
    },
    error: {
      main: tokens.rust,
    },
    text: {
      primary: tokens.ink,
      secondary: tokens.inkSoft,
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.paper,
          backgroundImage: `linear-gradient(rgba(75, 99, 80, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(75, 99, 80, 0.035) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        },
        '::selection': {
          color: '#FFFFFF',
          backgroundColor: tokens.moss,
        },
        ':focus-visible': {
          outline: `3px solid ${tokens.mustard}`,
          outlineOffset: 3,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          paddingInline: '1.25rem',
          paddingBlock: '0.6rem',
          transition: 'background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
          '&:active': { transform: 'translateY(1px)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: tokens.mossDark,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        },
        root: {
          borderColor: tokens.border,
        },
      },
    },
  },
})
