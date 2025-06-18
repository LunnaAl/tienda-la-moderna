import axios from 'axios';

const API_URL = 'http://localhost:8080/api/caja';

export default {
  // Reporte diario general (sin parámetros)
  listar() {
    return axios.get(API_URL);
  },
  // Reporte semanal
  reporteSemanal() {
    return axios.get(`${API_URL}/reporte-semanal`);
  },
  // Reporte por intervalo
  reporteIntervalo(params = {}) {
    return axios.get(`${API_URL}/reporte-intervalo`, { params });
  },
  // Reporte del día específico, pasando ?fecha=YYYY-MM-DD
  reporteDia(params = {}) {
    return axios.get(`${API_URL}/reporte-dia`, { params });
  }
};
