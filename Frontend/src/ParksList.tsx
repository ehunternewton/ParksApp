import React, { useState, useEffect } from 'react';

// Define TypeScript interface for the park data
interface Park {
  name: string;
  description: string;
}

const ParkList: React.FC = () => {
  // Define state to hold the list of parks
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch park data when the component mounts
  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch('http://localhost:5001/parks'); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch parks');
        }
        const data = await response.json();
        setParks(data);
      } catch (error) {
        console.error(error);
        setError("Something went wrong")
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  // Loading, error, and data display
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Parks</h1>
      <ul>
        {parks.map((park, index) => (
          <li key={index}>
            <h2>{park.name}</h2>
            <p>{park.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkList;
