import axios from 'axios';

const fetchUserData = async () => {

  try {
     const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/auth/get-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data; // Return the user data from the API response.
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Propagate the error for the caller to handle.
  }
};

export default fetchUserData;