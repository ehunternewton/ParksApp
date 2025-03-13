import { Box, Typography } from '@mui/material'

import Grid from '@mui/material/Grid2';

import './App.css'
import ParkList from './ManageParks/ParksList'
import { ParkProvider } from './ManageParks/ParkContext';
import AddParkFormButton from './ManageParks/AddParkFormButton';

function App() {
  return (
    <ParkProvider>

      <Typography variant="h3" gutterBottom>
        Parks I've Been To
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <ParkList />
        </Grid>
        <Grid size={12}>
          <Box display="flex" justifyContent="flex-end">
            <AddParkFormButton />
          </Box>
        </Grid>
      </Grid>
    </ParkProvider>
  )
}

export default App
