import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';
import { useParkContext } from './ParkContext';

interface EditParkDialogProps {
  open: boolean;
  handleClose: () => void;
  park: any;
}

const EditParkDialog: React.FC<EditParkDialogProps> = ({ open, handleClose, park }) => {
  const { editPark } = useParkContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (park) {
      setName(park.name);
      setDescription(park.description);
    }
  }, [park]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const updatedPark = { id: park.id, name, description };

    try {
      await editPark(updatedPark);
      handleClose();
    } catch (err) {
      setError('Failed to edit park. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Park</DialogTitle>
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
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditParkDialog;
