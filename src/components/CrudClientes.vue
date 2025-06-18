<template>
  <section class="crud-clientes mb-4">
    <div class="card shadow-sm w-100">
      <div
        class="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center"
      >
        <h5 class="m-0">Clientes</h5>
        <div class="btn-group">
          <button 
          class="btn btn-sm btn-outline-light"
          :class="{ active: viewMode==='all' }" 
          @click="setView('all')"
          >
            Todos
          </button>
          <button class="btn btn-sm btn-warning"
          :class="{ active: viewMode==='historial' }" 
          @click="setView('historial')">
            Historial
          </button>
          <button class="btn btn-sm btn-primary ms-2" 
          :class="{ active: viewMode==='' }" 
          @click="openModal()">
            Nuevo Cliente
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
            <tr v-for="c in displayed" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.nombre }}</td>
              <td>{{ c.telefono }}</td>
              <td class="text-end">
                <template v-if="viewMode === 'all'">
                  <button class="btn btn-sm btn-warning me-1" @click="openModal(c)">
                    Editar
                  </button>
                  <button class="btn btn-sm btn-danger" @click="desactivar(c.id)">
                    Eliminar
                  </button>
                </template>
              </td>
            </tr>
            <tr v-if="displayed.length === 0">
              <td colspan="4" class="text-center">
                No hay {{ viewMode === 'historial' ? 'clientes desactivados' : 'clientes' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear/Editar Cliente -->
    <div class="modal fade" tabindex="-1" ref="clienteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id == null ? 'Nuevo Cliente' : 'Editar Cliente' }}
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
import ClientesService from '@/service/ClientesService';

export default {
  name: 'CrudClientes',
  data() {
    return {
      clientes: [],
      viewMode: 'all', // all | historial
      form: { id: null, nombre: '', telefono: '' },
      modalInstance: null
    };
  },
  computed: {
    activos() {
      return this.clientes.filter(c => c.activo === 1);
    },
    inactivos() {
      return this.clientes.filter(c => c.activo === 0);
    },
    displayed() {
      return this.viewMode === 'historial' ? this.inactivos : this.activos;
    }
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.clienteModal);
    this.traerTodos();
  },
  methods: {
    traerTodos() {
      ClientesService.listar()
        .then(r => {
          this.clientes = r.data.map(c => ({
            activo: c.activo == null ? 1 : c.activo,
            ...c
          }));
        })
        .catch(console.error);
    },
    setView(mode) {
      this.viewMode = mode;
      if (mode === 'all') this.traerTodos();
    },
    openModal(c = null) {
      if (c) {
        this.form = { id: c.id, nombre: c.nombre, telefono: c.telefono };
      } else {
        this.form = { id: null, nombre: '', telefono: '' };
      }
      this.modalInstance.show();
    },
    closeModal() {
      this.modalInstance.hide();
    },
    guardar() {
          // Marcamos explícitamente al crear como activo = 1
    const payload = {
      nombre: this.form.nombre,
     telefono: this.form.telefono,
     activo: 1
    };
      const call = this.form.id == null
        ? ClientesService.crear(payload)
        : ClientesService.actualizar(this.form.id, payload);
      call.then(() => {
        this.closeModal();
        this.traerTodos();
      });
    },
    desactivar(id) {
      if (!confirm('¿Desactivar este cliente?')) return;
      ClientesService.desactivar(id)
        .then(() => this.traerTodos());
    }
  }
};
</script>

<style scoped>
.crud-clientes { margin: 0 }
.table { max-width: 100%; overflow-x: auto }
.card { margin: 1rem 0 }
.card-header .btn-group .btn { margin-right: .25rem }
</style>
