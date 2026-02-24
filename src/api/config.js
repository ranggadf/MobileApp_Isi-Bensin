const API_BASE_URL = 'http://192.168.1.6:8000/api';

const API = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  UPDATE_USER: (id) => `${API_BASE_URL}/updateuserbyid/${id}`,

  // ✅ TAMBAHAN UNTUK WARUNG
  WARUNG: `${API_BASE_URL}/warung`,              // GET & POST & PUT
  UPDATE_STOK: `${API_BASE_URL}/warung/stok`,   // PUT stok saja
};

export default API;