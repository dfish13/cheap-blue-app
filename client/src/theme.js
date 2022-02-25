import { createTheme } from '@mui/material/styles'
import { blue, amber, purple} from '@mui/material/colors';

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
      main: purple[300],
    },
    secondary: {
      main: amber[50],
    },
  },
  typography: {
    fontFamily: "Ubuntu"
  }
})