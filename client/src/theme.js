import { createTheme } from '@mui/material/styles'
import { blue, amber } from '@mui/material/colors';

const theme = createTheme({
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

export default theme