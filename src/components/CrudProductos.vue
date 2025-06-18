<template>
  <section class="crud-productos mb-4">
    <div class="card shadow-sm w-100">
      <div
        class="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center"
      >
        <h5 class="m-0">Gestor</h5>
        <div class="btn-group">
          <button
            class="btn btn-sm btn-outline-light"
            :class="{ active: viewMode==='all' }"
            @click="setView('all')"
          >
            Todos
          </button>
          <button
            class="btn btn-sm btn-warning"
            :class="{ active: viewMode==='stock' }"
            @click="setView('stock')"
          >
            Stock Bajo
          </button>
          <button
            class="btn btn-sm btn-danger"
            :class="{ active: viewMode==='caducar' }"
            @click="setView('caducar')"
          >
            Por Caducar
          </button>
          <button
            class="btn btn-sm btn-secondary"
            :class="{ active: viewMode==='historial' }"
            @click="setView('historial')"
          >
            Historial
          </button>
          <button class="btn btn-sm btn-primary ms-2" @click="openModal()">
            Nuevo Producto
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th v-if="viewMode==='all'">Precio</th>
              <th v-if="viewMode!=='caducar'">Stock</th>
              <th v-if="viewMode!=='stock'">Caducidad</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in displayed" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td v-if="viewMode==='all'">{{ p.precioUnitario }}</td>
              <td v-if="viewMode!=='caducar'">{{ p.stock }}</td>
              <td v-if="viewMode!=='stock'">{{ p.fechaCaducidad }}</td>
              <td class="text-end">
                <!-- Sólo en “all”, “stock” y “caducar” mostramos editar/eliminar -->
                <template v-if="viewMode!=='historial'">
                  <button
                    class="btn btn-sm btn-warning me-1"
                    @click="openModal(p)"
                  >Editar</button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="desactivar(p.id)"
                  >Eliminar</button>
                </template>
              </td>
            </tr>
            <tr v-if="displayed.length === 0">
              <td :colspan="columnsCount" class="text-center">
                No hay productos
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div class="modal fade" tabindex="-1" ref="productoModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id == null ? 'Nuevo Producto' : 'Editar Producto' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal()" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">ID Proveedor</label>
              <input
                v-model.number="form.proveedorId"
                type="number"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3" v-if="viewMode==='all'">
              <label class="form-label">Precio Unitario</label>
              <input
                v-model.number="form.precioUnitario"
                type="number"
                step="0.01"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3" v-if="viewMode!=='caducar'">
              <label class="form-label">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3" v-if="viewMode!=='stock'">
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
import Modal from 'bootstrap/js/dist/modal';
import ProductosService from '@/service/ProductosService';

export default {
  name: 'CrudProductos',
  data() {
    return {
      productos: [],
      viewMode: 'all', // 'all' | 'stock' | 'caducar' | 'historial'
      form: {
        id: null,
        proveedorId: null,
        nombre: '',
        precioUnitario: 0,
        stock: 0,
        fechaCaducidad: ''
      },
      modal: null
    };
  },
  computed: {
    normalized() {
      return this.productos.map(p => ({
        activo: p.activo == null ? 1 : p.activo,
        ...p
      }));
    },
    activos() {
      return this.normalized.filter(p => p.activo === 1);
    },
    inactivos() {
      return this.normalized.filter(p => p.activo === 0);
    },
    displayed() {
      const hoy = new Date();
      const limite = new Date();
      limite.setDate(hoy.getDate() + 7);

      switch (this.viewMode) {
        case 'stock':
          return this.activos.filter(p => p.stock <= 5);
        case 'caducar':
          return this.activos.filter(p => new Date(p.fechaCaducidad) <= limite);
        case 'historial':
          return this.inactivos;
        default:
          return this.activos;
      }
    },
    columnsCount() {
      let cnt = 2; // ID + Nombre
      if (this.viewMode === 'all') cnt += 3;           // Precio, Stock, Caducidad
      else if (this.viewMode === 'stock') cnt += 1;    // Stock
      else if (this.viewMode === 'caducar') cnt += 1;  // Caducidad
      else if (this.viewMode === 'historial') cnt += 3; // Precio, Stock, Caducidad
      cnt += 1; // Acciones
      return cnt;
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.productoModal);
    this.traerTodos();
  },
  methods: {
    traerTodos() {
      ProductosService.listar()
        .then(r => this.productos = r.data)
        .catch(console.error);
    },
    setView(mode) {
      this.viewMode = mode;
      if (mode === 'stock') {
        ProductosService.listarStockBajo().then(r => this.productos = r.data);
      } else if (mode === 'caducar') {
        ProductosService.listarPorCaducar().then(r => this.productos = r.data);
      } else {
        this.traerTodos();
      }
    },
    openModal(p = null) {
      if (p) this.form = { ...p };
      else this.form = { id: null, proveedorId: null, nombre: '', precioUnitario: 0, stock: 0, fechaCaducidad: '' };
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    guardar() {
      const payload = {
        proveedorId: this.form.proveedorId,
        nombre: this.form.nombre,
        precioUnitario: this.form.precioUnitario,
        stock: this.form.stock,
        fechaCaducidad: this.form.fechaCaducidad
      };
      const call = this.form.id == null
        ? ProductosService.crear(payload)
        : ProductosService.actualizar(this.form.id, payload);
      call.then(() => {
        this.closeModal();
        this.traerTodos();
      });
    },
    desactivar(id) {
      if (!confirm('¿Desactivar este producto?')) return;
      ProductosService.desactivar(id).then(() => this.traerTodos());
    }
  }
};
</script>

<style scoped>
.crud-productos { margin: 0 }
.table { max-width: 100%; overflow-x: auto }
.card { margin: 1rem 0 }
.card-header .btn-group .btn { margin-right: .25rem }
.btn-group .active { text-decoration: underline; }
</style>
