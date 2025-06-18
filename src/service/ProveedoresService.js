import axios from 'axios';

const API_URL = 'http://localhost:8080/api/proveedores';

export default {
  listar() {
    return axios.get(API_URL);
  },
  crear(proveedor) {
    return axios.post(API_URL, proveedor);
  },
  actualizar(id, proveedor) {
    return axios.put(`${API_URL}/${id}`, proveedor);
  },
  desactivar(id) {
    return axios.put(`${API_URL}/${id}/desactivar`);
  }
};
