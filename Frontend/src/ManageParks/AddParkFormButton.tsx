import React, { useState } from 'react';
import { useParkContext } from './ParkContext';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';

const AddParkFormButton: React.FC = () => {
  const { addPark } = useParkContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const newPark = { name, description };

    try {
      await addPark(newPark);
      handleClose();
    } catch (err) {
      setError('Failed to add park. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Park
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Park</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Park Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="description"
              label="Park Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Park'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddParkFormButton;
