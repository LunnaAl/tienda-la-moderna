<template>
  <section class="crud-productos mb-4">
    <!-- La card ocupa todo el ancho -->
    <div class="card shadow-sm w-100">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 class="m-0">Gestor</h5>
        <button class="btn btn-sm btn-primary" @click="openModal()">Nuevo Producto</button>
      </div>
      <div class="card-body p-0">
        <!-- La tabla también ocupa todo el ancho -->
        <table class="table table-hover table-striped mb-0 w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Proveedor ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Caducidad</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.proveedorId }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.precioUnitario }}</td>
              <td>{{ p.stock }}</td>
              <td>{{ p.fechaCaducidad }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-warning me-1" @click="openModal(p)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="borrar(p.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear / Editar -->
    <div class="modal fade" tabindex="-1" ref="productoModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id === null ? 'Nuevo Producto' : 'Editar Producto' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">ID Proveedor</label>
              <input
                v-model.number="form.proveedorId"
                type="number"
                class="form-control"
                placeholder="Escribe el ID del proveedor"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                placeholder="Nombre del producto"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Precio Unitario</label>
              <input
                v-model.number="form.precioUnitario"
                type="number"
                step="0.01"
                class="form-control"
                placeholder="Precio unitario"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                class="form-control"
                placeholder="Stock disponible"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha Caducidad</label>
              <input
                v-model="form.fechaCaducidad"
                type="date"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal()">Cancelar</button>
            <button class="btn btn-guardar" @click="guardar()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ProductosService from '@/service/ProductosCadService';
import Modal from 'bootstrap/js/dist/modal';

export default {
  name: 'CrudProductos',
  data() {
    return {
      productos: [],
      form: {
        id: null,
        proveedorId: null,
        nombre: '',
        precioUnitario: 0,
        stock: 0,
        fechaCaducidad: ''
      },
      productModal: null
    };
  },
  mounted() {
    this.productModal = new Modal(this.$refs.productoModal);
    this.traerTodos();
  },
  methods: {
    traerTodos() {
      ProductosService.listar()
        .then(r => (this.productos = r.data))
        .catch(console.error);
    },

    
    openModal(producto) {
      if (producto) {
        this.form = {
          id: producto.id,
          proveedorId: producto.proveedorId,
          nombre: producto.nombre,
          precioUnitario: producto.precioUnitario,
          stock: producto.stock,
          fechaCaducidad: producto.fechaCaducidad
        };
      } else {
        this.resetForm();
      }
      this.productModal.show();
    },
    closeModal() {
      this.productModal.hide();
      this.resetForm();
    },
    guardar() {
      const payload = {
        nombre: this.form.nombre,
        precioUnitario: this.form.precioUnitario,
        stock: this.form.stock,
        fechaCaducidad: this.form.fechaCaducidad,
        proveedorId: this.form.proveedorId
      };
      const call = this.form.id == null
        ? ProductosService.crear(payload)
        : ProductosService.actualizar(this.form.id, payload);

      call
        .then(() => {
          this.closeModal();
          this.traerTodos();
        })
        .catch(err => console.error(err.response?.data || err));
    },
    borrar(id) {
      if (!confirm('¿Eliminar este producto?')) return;
      ProductosService.eliminar(id)
        .then(() => this.traerTodos())
        .catch(console.error);
    },
    resetForm() {
      this.form = {
        id: null,
        proveedorId: null,
        nombre: '',
        precioUnitario: 0,
        stock: 0,
        fechaCaducidad: ''
      };
    }
  }
};
</script>

<style scoped>
.crud-productos {
  /* Si antes tenías margen horizontal, elimínalo para que la sección ocupe todo */
  margin: 0;
}

/* Opcional: si quieres ajustar la altura máxima de la tabla */
.table {
  max-width: 100%;
  overflow-x: auto;
}

/* Asegura que la card no tenga margen lateral */
.card {
  margin: 1rem 0;
}
</style>
