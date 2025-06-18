<template>
  <section class="crud-caja mb-4">
    <div class="card shadow-sm w-100">
      <div
        class="card-header bg-dark text-white d-flex justify-content-between align-items-center"
      >
        <h5 class="m-0">Caja</h5>
        <div class="btn-group">
          <button
            class="btn btn-sm btn-outline-light"
            :class="{ active: viewMode==='diario' }"
            @click="traerTodos"
          >
            Diario
          </button>
          <button
            class="btn btn-sm btn-warning"
            :class="{ active: viewMode==='semanal' }"
            @click="traerSemanal"
          >
            Semanal
          </button>
          <button
            class="btn btn-sm btn-primary ms-2"

            @click="openIntervalModal"
          >
            Intervalo
          </button>
          <button
            class="btn btn-sm btn-primary ms-2"

            @click="openFechaModal"
          >
            Hoy
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 w-100">
          <thead class="table-dark">
            <tr>
              <th>Fecha</th>
              <th v-if="viewMode==='semanal'">Cliente</th>
              <th class="text-end">Total Efectivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reportes" :key="r.fecha + (r.cliente || '')">
              <td>{{ r.fecha }}</td>
              <td v-if="viewMode==='semanal'">{{ r.cliente }}</td>
              <td class="text-end">{{ formatoMoneda(r.totalEfectivo) }}</td>
            </tr>
            <tr v-if="reportes.length === 0">
              <td :colspan="viewMode==='semanal' ? 3 : 2" class="text-center">
                No hay datos
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Intervalo -->
    <div class="modal fade" tabindex="-1" ref="intervaloModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reporte por Intervalo</h5>
            <button type="button" class="btn-close" @click="closeIntervalModal" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Fecha inicio</label>
              <input v-model="intervaloDesde" type="date" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha fin</label>
              <input v-model="intervaloHasta" type="date" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeIntervalModal">
              Cancelar
            </button>
            <button class="btn btn-primary" @click="traerIntervalo">
              Consultar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Día específico -->
    <div class="modal fade" tabindex="-1" ref="fechaModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reporte por Día Específico</h5>
            <button type="button" class="btn-close" @click="closeFechaModal" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Selecciona la fecha</label>
              <input
                v-model="fechaSeleccionada"
                type="date"
                class="form-control"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeFechaModal">
              Cancelar
            </button>
            <button class="btn btn-primary" @click="traerPorFecha">
              Consultar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';
import CajaService from '@/service/CajaService';

export default {
  name: 'CrudCaja',
  data() {
    return {
      reportes: [],
      viewMode: 'diario',      // 'diario' | 'semanal' | 'intervalo' | 'hoy'
      intervaloDesde: '',
      intervaloHasta: '',
      fechaSeleccionada: '',
      intervaloModalInstance: null,
      fechaModalInstance: null
    };
  },
  mounted() {
    this.intervaloModalInstance = new Modal(this.$refs.intervaloModal);
    this.fechaModalInstance     = new Modal(this.$refs.fechaModal);
    this.traerTodos();
  },
  methods: {
    traerTodos() {
      this.viewMode = 'diario';
      CajaService.listar()
        .then(res => {
          this.reportes = res.data.map(item => ({
            fecha: item.fecha,
            totalEfectivo: item.totalEfectivo
          }));
        })
        .catch(console.error);
    },
    traerSemanal() {
      this.viewMode = 'semanal';
      CajaService.reporteSemanal()
        .then(res => {
          this.reportes = res.data.map(item => ({
            fecha: item.FECHA.substring(0, 10),
            cliente: item.CLIENTE,
            totalEfectivo: item.TOTAL
          }));
        })
        .catch(console.error);
    },
    openIntervalModal() {
      this.viewMode = 'intervalo';
      this.intervaloDesde = '';
      this.intervaloHasta = '';
      this.intervaloModalInstance.show();
    },
    closeIntervalModal() {
      this.intervaloModalInstance.hide();
    },
    traerIntervalo() {
      if (!this.intervaloDesde || !this.intervaloHasta) {
        return alert('Debes seleccionar ambas fechas');
      }
      const inicio = this.intervaloDesde;
      const fin    = this.intervaloHasta;
      CajaService.reporteIntervalo({ inicio, fin })
        .then(res => {
          this.reportes = res.data.map(item => ({
            fecha: item.FECHA.substring(0, 10),
            totalEfectivo: item.TOTAL_EFECTIVO
          }));
          this.closeIntervalModal();
        })
        .catch(err => {
          console.error(err);
          alert('Error al consultar intervalo');
        });
    },
    openFechaModal() {
      this.viewMode = 'hoy';
      this.fechaSeleccionada = '';
      this.fechaModalInstance.show();
    },
    closeFechaModal() {
      this.fechaModalInstance.hide();
    },
    traerPorFecha() {
      if (!this.fechaSeleccionada) {
        return alert('Selecciona la fecha');
      }
      const fecha = this.fechaSeleccionada;
      CajaService.reporteDia({ fecha })
        .then(res => {
          this.reportes = res.data.map(item => ({
            fecha: item.FECHA.substring(0, 10),
            totalEfectivo: item.TOTAL_EFECTIVO
          }));
          this.closeFechaModal();
        })
        .catch(err => {
          console.error(err);
          alert('Error al consultar día específico');
        });
    },
    formatoMoneda(value) {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(value);
    }
  }
};
</script>

<style scoped>
.crud-caja {
  margin: 0;
}
.table {
  max-width: 100%;
  overflow-x: auto;
}
.card {
  margin: 1rem 0;
}
.btn-group .active {
  text-decoration: underline;
}
</style>
