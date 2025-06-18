import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos/stock-bajo';

export default {
  listar() {
    return axios.get(API_URL);
  },
  obtener(id) {
    return axios.get(`${API_URL}/${id}`);
  },
  crear(producto) {
    return axios.post(API_URL, producto);
  },
  actualizar(id, producto) {
    return axios.put(`${API_URL}/${id}`, producto);
  },
  eliminar(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
};
