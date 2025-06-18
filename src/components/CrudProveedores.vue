<template>
  <section class="crud-proveedores mb-4">
    <div class="card shadow-sm w-100">
      <div
        class="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center"
      >
        <h5 class="m-0">Proveedores</h5>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-light" 
          :class="{ active: viewMode==='all' }"
          @click="setView('all')">
            Todos
          </button>
          <button class="btn btn-sm btn-secondary" 
          :class="{ active: viewMode==='historial' }"
          @click="setView('historial')">
            Historial
          </button>
          <button class="btn btn-sm btn-primary ms-2" @click="openModal()">
            Nuevo Proveedor
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in displayed" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.telefono }}</td>
              <td class="text-end">
                <template v-if="viewMode === 'all'">
                  <button class="btn btn-sm btn-warning me-1" @click="openModal(p)">
                    Editar
                  </button>
                  <button class="btn btn-sm btn-danger" @click="desactivar(p.id)">
                    Eliminar
                  </button>
                </template>
              </td>
            </tr>
            <tr v-if="displayed.length === 0">
              <td colspan="4" class="text-center">
                No hay {{ viewMode==='historial'? 'proveedores desactivados':'proveedores' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear/Editar Proveedor -->
    <div class="modal fade" tabindex="-1" ref="proveedorModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id == null ? 'Nuevo Proveedor' : 'Editar Proveedor' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal()" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Teléfono</label>
              <input
                v-model="form.telefono"
                type="text"
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
import ProveedoresService from '@/service/ProveedoresService';

export default {
  name: 'CrudProveedores',
  data() {
    return {
      proveedores: [],
      viewMode: 'all', // all | historial
      form: { id: null, nombre: '', telefono: '' },
      modalInstance: null
    };
  },
  computed: {
    activos() {
      return this.proveedores.filter(p => p.activo === 1);
    },
    inactivos() {
      return this.proveedores.filter(p => p.activo === 0);
    },
    displayed() {
      return this.viewMode === 'historial' ? this.inactivos : this.activos;
    }
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.proveedorModal);
    this.traerTodos();
  },
  methods: {
    traerTodos() {
      ProveedoresService.listar()
        .then(r => {
          this.proveedores = r.data.map(p => ({
            activo: p.activo == null ? 1 : p.activo,
            ...p
          }));
        })
        .catch(console.error);
    },
    setView(mode) {
      this.viewMode = mode;
      if (mode === 'all') this.traerTodos();
    },
    openModal(p = null) {
      if (p) {
        this.form = { id: p.id, nombre: p.nombre, telefono: p.telefono };
      } else {
        this.form = { id: null, nombre: '', telefono: '' };
      }
      this.modalInstance.show();
    },
    closeModal() {
      this.modalInstance.hide();
    },
    guardar() {
    // Al crear, marcamos explícitamente activo = 1
    const payload = {
      nombre: this.form.nombre,
      telefono: this.form.telefono,
      activo: 1
   };
      const call = this.form.id == null
        ? ProveedoresService.crear(payload)
        : ProveedoresService.actualizar(this.form.id, payload);
      call.then(() => {
        this.closeModal();
        this.traerTodos();
      });
    },
    desactivar(id) {
      if (!confirm('¿Desactivar este proveedor?')) return;
      ProveedoresService.desactivar(id)
        .then(() => this.traerTodos());
    }
  }
};
</script>

<style scoped>
.crud-proveedores { margin: 0 }
.table { max-width: 100%; overflow-x: auto }
.card { margin: 1rem 0 }
.card-header .btn-group .btn { margin-right: .25rem }
</style>
