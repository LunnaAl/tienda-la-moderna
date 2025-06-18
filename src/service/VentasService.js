import axios from 'axios';

const API = 'http://localhost:8080/api/ventas';

export default {
  // Listar todas las ventas
  listar: () => axios.get(API),

  // Obtener una venta por ID
  obtener: id => axios.get(`${API}/${id}`),

  // Crear venta “completa” (usa tu nuevo endpoint)
 crear: payload => axios.post(`${API}/completa`, payload),

  // Actualizar cabecera de venta
  actualizar: (id, payload) => axios.put(`${API}/${id}`, payload),

  // Borrar una venta
  eliminar: id => axios.delete(`${API}/${id}`),

  // <-- Este método obtiene el JSON de tu ticket
 obtenerTicketJson: id => axios.get(`${API}/${id}/ticket`),

  // Totales agregados
  totales: () => axios.get(`${API}/totales`),
};
