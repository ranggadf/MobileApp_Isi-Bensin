const API_BASE_URL = 'http://192.168.1.8:8000/api';

const API = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  UPDATE_USER: (id) => `${API_BASE_URL}/updateuserbyid/${id}`,
  

  
};

export default API;