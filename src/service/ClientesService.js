import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clientes';

export default {
  listar() {
    return axios.get(API_URL);
  },
  crear(cliente) {
    return axios.post(API_URL, cliente);
  },
  actualizar(id, cliente) {
    return axios.put(`${API_URL}/${id}`, cliente);
  },
  desactivar(id) {
    return axios.put(`${API_URL}/${id}/desactivar`);
  }
};
