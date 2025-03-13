import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface Park {
  id: number; 
  name: string;
  description: string;
}

interface ParkContextType {
  parks: Park[];
  loading: boolean;
  error: string | null;
  addPark: (newPark: Omit<Park, 'id'>) => void;
  editPark: (updatedPark: Park) => void;
  deletePark: (id: number) => void;
}

const ParkContext = createContext<ParkContextType | undefined>(undefined);

interface ParkProviderProps {
  children: ReactNode;
}

export const ParkProvider: React.FC<ParkProviderProps> = ({ children }) => {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch('http://localhost:5001/parks');
        if (!response.ok) {
          throw new Error('Failed to fetch parks');
        }
        const data = await response.json();
        setParks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  const addPark = async (newPark: Omit<Park, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5001/parks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPark),
      });

      if (!response.ok) {
        throw new Error('Failed to add park');
      }

      const addedPark = await response.json();
      setParks((prevParks) => [...prevParks, addedPark]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while adding park');
    }
  };

  const editPark = async (updatedPark: Park) => {
    try {
      const response = await fetch(`http://localhost:5001/park/${updatedPark.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPark),
      });

      if (!response.ok) {
        throw new Error('Failed to update park');
      }

      setParks((prevParks) =>
        prevParks.map((park) => (park.id === updatedPark.id ? updatedPark : park))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating park');
    }
  };

  const deletePark = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/park/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete park');
      }

      setParks((prevParks) => prevParks.filter((park) => park.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while deleting park');
    }
  };

  return (
    <ParkContext.Provider value={{ parks, loading, error, addPark, editPark, deletePark }}>
      {children}
    </ParkContext.Provider>
  );
};

export const useParkContext = (): ParkContextType => {
  const context = React.useContext(ParkContext);
  if (!context) {
    throw new Error('useParkContext must be used within a ParkProvider');
  }
  return context;
};
