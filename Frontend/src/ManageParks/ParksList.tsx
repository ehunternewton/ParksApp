import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useParkContext } from './ParkContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditParkDialog from './EditParkDialog'; 

const ParkList: React.FC = () => {
  const { parks, loading, error, deletePark } = useParkContext();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPark, setCurrentPark] = useState<any>(null);
  const [deleteParkId, setDeleteParkId] = useState<number | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleEditOpen = (park: any) => {
    setCurrentPark(park);
    setOpenEditDialog(true);
  };

  const handleDeleteOpen = (id: number) => {
    setDeleteParkId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteParkId !== null) {
      deletePark(deleteParkId);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant='subtitle1'>Park</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Description</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parks.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOpen(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteOpen(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {currentPark && (
        <EditParkDialog
          open={openEditDialog}
          handleClose={() => {
            setOpenEditDialog(false)
            setCurrentPark(null)
          }}
          park={currentPark}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this park?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ParkList;
