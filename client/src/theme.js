import { createTheme } from '@mui/material/styles'
import { blue, amber, red } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: blue['A400'],
    },
    secondary: {
      main: amber[50],
    },
  },
  typography: {
    fontFamily: "Ubuntu"
  }
})

export const adminTheme = createTheme({
  palette: {
    primary: {
      main: red['A200'],
    },
    secondary: {
      main: amber[50],
    },
  },
  typography: {
    fontFamily: "Ubuntu"
  }
})