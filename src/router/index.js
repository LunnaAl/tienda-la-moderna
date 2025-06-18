import { createRouter, createWebHistory } from 'vue-router'
import CrudProductos   from '@/components/CrudProductos.vue'
import CrudClientes    from '@/components/CrudClientes.vue'
import CrudProveedores from '@/components/CrudProveedores.vue'
import CrudVentas      from '@/components/CrudVentas.vue'
import CrudCaja      from '@/components/CrudCaja.vue'


const routes = [
  { path: '/productos',   component: CrudProductos },
  { path: '/clientes',    component: CrudClientes },
  { path: '/proveedores', component: CrudProveedores },
  { path: '/ventas',      component: CrudVentas },
  { path: '/:pathMatch(.*)*', redirect: '/productos' },
  { path: '/caja', name: 'Caja', component: CrudCaja},
]

export default createRouter({
  history: createWebHistory(),
  routes
})
