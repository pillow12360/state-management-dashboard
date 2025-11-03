import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
      }}
    >
      <Stack spacing={4} maxWidth={520} width="100%">
        <Stack spacing={1} textAlign="center">
          <Typography variant="h3" fontWeight={700}>
            State Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            React 19, Vite, and Material UI are ready to help you compare state
            management strategies. Start by wiring up your data layer and
            visualization widgets.
          </Typography>
        </Stack>

        <Card elevation={6}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Interactive demo</Typography>
              <Typography variant="body2" color="text.secondary">
                Use the counter below to verify that Material UI components are
                functioning. Replace this card with your dashboard widgets.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setCount((value) => value + 1)}
                >
                  Increment ({count})
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setCount(0)}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}

export default App
