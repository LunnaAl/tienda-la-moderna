<template>
  <div id="app">
    <!-- Sidebar fijo -->
    <aside
      :class="['sidebar bg-dark text-white', { collapsed: !sidebarOpen }]"
    >
      <div class="sidebar-toggle">
        <button class="btn btn-sm btn-light" @click="toggleSidebar">
          <i :class="sidebarOpen ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
        </button>
      </div>
      <nav class="nav flex-column px-2 mt-5">
        <router-link
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav-link d-flex align-items-center mb-2"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span v-if="sidebarOpen" class="ms-2">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Contenedor completo que se mueve -->
    <div :class="['main-container', { collapsed: !sidebarOpen }]">
      <!-- Header simplificado -->
      <header class="app-header d-flex align-items-center justify-content-between px-4">
        <!-- Título dinámico -->
        <h1 class="h5 mb-0 text-white">{{ pageTitle }}</h1>

        <!-- Avatar + Nombre -->
        <div class="d-flex align-items-center">
          <img
            src="@/assets/logos.png"
            alt="avatar"
            class="rounded-circle"
            width="32" height="32"
          />
          <span class="ms-2 text-white">Tienda La Moderna</span>
        </div>
      </header>

      <main class="content overflow-auto px-4 py-4">
        <div class="container-fluid main-content">
        <!-- Transición global para TODO router-view -->
       <transition name="fade-slide" mode="out-in">
          <router-view/>
        </transition>
        </div>
      </main>

      <footer class="app-footer text-center py-3 bg-light">
        &copy; 2025 Tienda La Moderna
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      sidebarOpen: true,
      userName: 'Admin User',
      menu: [
        { path: '/productos',   label: 'Productos',   icon: 'bi bi-box-seam'      },
        { path: '/clientes',    label: 'Clientes',    icon: 'bi bi-people'        },
        { path: '/proveedores', label: 'Proveedores', icon: 'bi bi-truck'         },
        { path: '/ventas',      label: 'Ventas',      icon: 'bi bi-currency-dollar'},
        { path: '/caja',        label: 'Caja',        icon: 'bi bi-wallet2' }
      ]
    };
  },
  computed: {
    // Obtiene el título según la ruta
    pageTitle() {
      const match = this.menu.find(i => i.path === this.$route.path);
      return match ? match.label : 'Dashboard';
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }
};
</script>

<style>
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Variables globales */
:root {
  --sidebar-width:       240px;
  --sidebar-mini-width:   64px;
  --transition-time:      0.3s;
  --color-bg:            #f6f7fb;
  --color-sidebar:       #27293d;
  --color-header:        #373952;
}

/* Sidebar fijo */
.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--sidebar-width);
  transition: width var(--transition-time) ease;
  overflow: hidden;
  z-index: 1000;
}
.sidebar.collapsed {
  width: var(--sidebar-mini-width);
}
.sidebar-toggle {
  position: absolute;
  top: 8px; left: 8px;
}
.sidebar-toggle .btn {
  border: none;
  background: transparent;
  color: #fafafa;
}
/* Links del sidebar */
.sidebar .nav-link {
  color: #fafafa !important;
  border-radius: 8px;
  transition: background 0.2s;
}
.sidebar .nav-link:hover {
  background: rgba(255,255,255,0.1);
}
.sidebar .nav-link.active {
  background: rgba(255,255,255,0.2) !important;
}
.sidebar .nav-link .bi {
  font-size: 1.2rem;
  transition: color 0.2s;
}
.sidebar .nav-link.active .bi,
.sidebar .nav-link:hover .bi {
  color: #a478c9 !important;
}

/* Main container (header + content + footer) */
.main-container {
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-time) ease;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main-container.collapsed {
  margin-left: var(--sidebar-mini-width);
}

/* Header */
.app-header {
  flex-shrink: 0;
  background: var(--color-header);
  height: 56px;
  padding: 0 1rem;
}
.app-header h1 {
  font-size: 1.25rem;
}

/* Main content */
.content {
  flex: 1;
  background: var(--color-bg);
  overflow-y: auto;
}
.main-content {
  padding-left: 0;
  padding-right: 0;
}

/* Footer */
.app-footer {
  flex-shrink: 0;
}

.text-white{
  font-weight: 600;
}


/* Transición fade-slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);


}
</style>
