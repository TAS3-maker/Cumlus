import axios from 'axios';
import { API_URL } from '../utils/Apiconfig';
import Cookies from 'js-cookie';
const fetchUserData = async () => {

  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_URL}/api/auth/get-user`, {
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