const API_BASE_URL = 'http://192.168.110.155:8000/api';

const API = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  UPDATE_USER: (id) => `${API_BASE_URL}/updateuserbyid/${id}`,

  // ✅ TAMBAHAN UNTUK WARUNG
  WARUNG: `${API_BASE_URL}/warung`,              
  UPDATE_STOK: `${API_BASE_URL}/warung/stok`,   
};

export default API;