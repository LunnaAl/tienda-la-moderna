import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

export default {
  listar() {
    return axios.get(API_URL);
  },
  listarStockBajo() {
    return axios.get(`${API_URL}/stock-bajo`);
  },
  listarPorCaducar() {
    return axios.get(`${API_URL}/por-caducar`);
  },
  crear(producto) {
    return axios.post(API_URL, producto);
  },
  actualizar(id, producto) {
    return axios.put(`${API_URL}/${id}`, producto);
  },
  desactivar(id) {
    return axios.put(`${API_URL}/${id}/desactivar`);
  },
  activar(id) {
    return axios.put(`${API_URL}/${id}/activar`);
  }
};
