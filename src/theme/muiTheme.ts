import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    background: { default: '#f6f8fb', paper: '#ffffff' },
  },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
})

export default muiTheme
