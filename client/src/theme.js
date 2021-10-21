import { createTheme } from '@mui/material/styles'
import { lightGreen } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4169e1", // royalblue
    },
    secondary: {
      main: lightGreen[500],
    },
  },
  typography: {
    fontFamily: "Ubuntu"
  }
})

export default theme