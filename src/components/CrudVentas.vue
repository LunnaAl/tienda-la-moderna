<template>
  <section class="crud-ventas mb-4 container-fluid p-0">
    <!-- Tabla de Ventas -->
    <div class="card shadow-sm w-100">
      <div
        class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
      >
        <h5 class="m-0">Gestión de Ventas</h5>
        <div class="btn-group">
          <button class="btn btn-sm btn-primary me-2" @click="openModal()">
            Nueva Venta
          </button>
          <button class="btn btn-sm btn-primary ms-2" @click="openConsultModal()">
            Consultar Ticket
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente ID</th>
              <th>Fecha</th>
              <th>Total</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ventas" :key="v.id">
              <td>{{ v.id }}</td>
              <td>{{ v.idCliente }}</td>
              <td>{{ v.fecha }}</td>
              <td>{{ v.total }}</td>
              <td class="text-end">
                <!-- Botón Editar eliminado -->
  
                <button
                  class="btn btn-sm btn-secondary"
                  @click="showTicket(v.id)"
                >Ver Ticket</button>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="totales">
            <tr>
              <th colspan="3">Totales</th>
              <th>{{ totales.totalVentas }}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal Crear / Editar Venta -->
    <div class="modal fade" tabindex="-1" ref="ventaModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id == null ? 'Nueva Venta' : 'Editar Venta' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal()"></button>
          </div>
          <div class="modal-body">
            <!-- Selección de Cliente -->
            <div class="mb-3">
              <label class="form-label">Cliente</label>
              <select v-model.number="form.idCliente" class="form-select" required>
                <option disabled value="">— Selecciona cliente —</option>
                <option v-for="c in clientes" :key="c.id" :value="c.id">
                  {{ c.nombre }}
                </option>
              </select>
            </div>

            <!-- Líneas de productos -->
            <div
              v-for="(line, idx) in form.productos"
              :key="idx"
              class="row align-items-end mb-2"
            >
              <div class="col-6">
                <label class="form-label">Producto</label>
                <select
                  v-model.number="line.idProducto"
                  class="form-select"
                  required
                >
                  <option disabled value="">— Selecciona producto —</option>
                  <option v-for="p in productos" :key="p.id" :value="p.id">
                    {{ p.nombre }}
                  </option>
                </select>
              </div>
              <div class="col-4">
                <label class="form-label">Cantidad</label>
                <input
                  v-model.number="line.cantidad"
                  type="number"
                  class="form-control"
                  min="1"
                  required
                />
              </div>
              <div class="col-2 text-end">
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="removeLine(idx)"
                  v-if="form.productos.length > 1"
                >×</button>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-primary" @click="addLine()">
              + Agregar producto
            </button>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal()">Cancelar</button>
            <button class="btn btn-primary" @click="guardar()">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Consultar Ticket por ID -->
    <div class="modal fade" tabindex="-1" ref="consultModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Consultar Ticket</h5>
            <button type="button" class="btn-close" @click="closeConsultModal()"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">ID de Venta</label>
            <input
              v-model.number="consultTicketId"
              type="number"
              class="form-control"
              placeholder="Ingresa el ID"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeConsultModal()">Cancelar</button>
            <button class="btn btn-info" @click="showTicket(consultTicketId)">
              Ver Ticket
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Mostrar Ticket Formateado -->
    <div class="modal fade" tabindex="-1" ref="ticketModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Ticket Venta {{ ticketData?.idVenta || currentTicketId }}
            </h5>
            <button type="button" class="btn-close" @click="closeTicketModal()"></button>
          </div>
          <div class="modal-body p-4">
            <div v-if="ticketData">
              <!-- Empresa -->
              <div class="receipt-company text-center mb-3">
                <img src="@/assets/logos.png" alt="Terra Moderna" class="logo mb-2" />
                <h3 class="company-name mb-1">Tienda La Moderna</h3>
                <div class="company-info small">
                  www.tiendamoderna.com.mx<br/>
                  Av. Santa Ana, Culhuacan, CDMX.
                </div>
              </div>

              <hr/>

              <!-- Meta datos -->
              <div class="receipt-meta mb-3">
                <div><strong>N. Recibo:</strong> {{ ticketData.idVenta }}</div>
                <div><strong>Fecha:</strong>      {{ ticketData.fecha }}</div>
                <div><strong>Cliente:</strong>    {{ ticketData.cliente }}</div>
              </div>

              <!-- Detalle -->
              <table class="table receipt-table mb-3">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="text-center">Cant.</th>
                    <th class="text-end">P.Unit</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,i) in ticketData.productos" :key="i">
                    <td>{{ item.nombreProducto }}</td>
                    <td class="text-center">{{ item.cantidad }}</td>
                    <td class="text-end">{{ item.precioUnitario }}$</td>
                    <td class="text-end">{{ item.subtotal }}$</td>
                  </tr>
                </tbody>
              </table>

              <!-- Total -->
              <div class="receipt-total text-end mb-0">
                <strong>Total: {{ ticketData.total }}$</strong>
              </div>

              <!-- Pie con degradado -->
              <div class="receipt-footer mt-3"></div>
            </div>
            <div v-else class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VentasService    from '@/service/VentasService'
import ClientesService  from '@/service/ClientesService'
import ProductosService from '@/service/ProductosService'
import Modal            from 'bootstrap/js/dist/modal'

export default {
  name: 'CrudVentas',
  data() {
    return {
      ventas: [],
      totales: null,
      clientes: [],
      productos: [],
      form: {
        id: null,
        idCliente: null,
        productos: [{ idProducto: null, cantidad: 1 }]
      },
      venteModal: null,
      consultModal: null,
      ticketModal: null,
      consultTicketId: null,
      currentTicketId: null,
      ticketData: null
    }
  },
  mounted() {
    // Creamos instancias de Bootstrap Modal para cada ref
    this.venteModal   = new Modal(this.$refs.ventaModal)
    this.consultModal = new Modal(this.$refs.consultModal)
    this.ticketModal  = new Modal(this.$refs.ticketModal)
    // Cargamos datos iniciales
    this.fetchAll()
  },
  methods: {
    fetchAll() {
      this.traerTodos()
      this.traerTotales()
      this.traerClientes()
      this.traerProductos()
    },
    traerTodos() {
      VentasService.listar()
        .then(r => (this.ventas = r.data))
        .catch(console.error)
    },
    traerTotales() {
      VentasService.totales()
        .then(r => (this.totales = r.data))
        .catch(console.error)
    },
    traerClientes() {
      ClientesService.listar()
        .then(r => (this.clientes = r.data))
        .catch(console.error)
    },
    traerProductos() {
      ProductosService.listar()
        .then(r => (this.productos = r.data))
        .catch(console.error)
    },
    openModal(v) {
      if (v) {
        this.form = {
          id: v.id,
          idCliente: v.idCliente,
          productos: v.productos.map(x => ({
            idProducto: x.idProducto,
            cantidad: x.cantidad
          }))
        }
      } else {
        this.resetForm()
      }
      this.venteModal.show()
    },
    closeModal() {
      this.venteModal.hide()
      this.resetForm()
    },
    addLine() {
      this.form.productos.push({ idProducto: null, cantidad: 1 })
    },
    removeLine(i) {
      this.form.productos.splice(i, 1)
    },
    guardar() {
      const payload = {
        idCliente: this.form.idCliente,
        productos: this.form.productos.map(x => ({
          idProducto: x.idProducto,
          cantidad: x.cantidad
        }))
      }
      const call = this.form.id == null
        ? VentasService.crear(payload)
        : VentasService.actualizar(this.form.id, payload)
      call
        .then(() => {
          this.closeModal()
          this.fetchAll()
        })
        .catch(err => console.error(err.response?.data || err))
    },
    borrar(id) {
      if (!confirm('¿Eliminar esta venta?')) return
      VentasService.eliminar(id)
        .then(() => this.fetchAll())
        .catch(console.error)
    },
    openConsultModal() {
      this.consultTicketId = null
      this.consultModal.show()
    },
    closeConsultModal() {
      this.consultModal.hide()
    },
    showTicket(id) {
      if (!id) return alert('Debes indicar un ID válido')
      this.currentTicketId = id
      this.ticketData = null
      this.consultModal.hide()
      this.ticketModal.show()
      VentasService.obtenerTicketJson(id)
        .then(res => { this.ticketData = res.data })
        .catch(err => {
          console.error(err)
          alert('Error al cargar ticket')
          this.ticketModal.hide()
        })
    },
    closeTicketModal() {
      this.ticketModal.hide()
    },
    resetForm() {
      this.form = {
        id: null,
        idCliente: null,
        productos: [{ idProducto: null, cantidad: 1 }]
      }
    }
  }
}
</script>

<style scoped>
/* Espacios */
.crud-ventas .row {
  gap: 0.5rem;
}

/* Receipt styling */
.receipt-company {
  font-family: 'Segoe UI', sans-serif;
}
.receipt-company .logo {
  max-width: 80px;
}
.receipt-company .company-name {
  font-size: 1.1rem;
  letter-spacing: 1px;
  margin: 0;
}
.receipt-company .company-info {
  font-size: 0.75rem;
  color: #555;
  line-height: 1.2;
}

.receipt-meta {
  font-size: 0.85rem;
  line-height: 1.4;
}
.receipt-meta div + div {
  margin-top: 0.25rem;
}

.receipt-table th,
.receipt-table td {
  padding: 4px 6px;
}
.receipt-table tbody tr {
  border-bottom: 1px dashed #ccc;
}

.receipt-total {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.receipt-footer {
  height: 6px;
  margin-top: 1rem;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(135deg, #3ac5c9 0%, #5a4fbe 100%);
}
</style>
