<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- BOTTOM NAV -->
    <q-footer class="game-footer">
      <nav class="nav-bar">

        <!-- Glow line top -->
        <div class="nav-glow-line"></div>

        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="nav-item"
          :class="{ active: isActive(tab.to) }"
        >
          <div class="nav-icon-wrap">
            <div class="nav-icon-bg"></div>
            <span class="nav-icon">{{ tab.icon }}</span>
            <div class="nav-active-ring"></div>
          </div>
          <span class="nav-label">{{ tab.label }}</span>
        </router-link>

      </nav>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/app/dashboard', icon: '🏠', label: 'Inicio'  },
  { to: '/app/chat',      icon: '🤖', label: 'IA'      },
  { to: '/app/profile',   icon: '👤', label: 'Perfil'  },
]

const isActive = (path) => route.path === path || route.path.startsWith(path)
</script>

<style>
/* ─────────────────────────────────────
   GLOBAL: quitar padding/background
   que Quasar aplica al footer
───────────────────────────────────── */
.game-footer {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.q-footer {
  background: transparent !important;
}
</style>

<style scoped>
/* ─────────────────────────────────────
   NAV BAR CONTAINER
───────────────────────────────────── */
.nav-bar {
  position: relative;
  display: flex;
  align-items: stretch;
  background: rgba(13, 14, 28, 0.92);
  backdrop-filter: blur(24px) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 8px 0 max(12px, env(safe-area-inset-bottom));
  font-family: 'Nunito', 'Poppins', 'Segoe UI', sans-serif;
}

/* Subtle purple glow line at top */
.nav-glow-line {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(168, 85, 247, 0.6),
    rgba(59, 130, 246, 0.6),
    rgba(168, 85, 247, 0.6),
    transparent
  );
  filter: blur(1px);
}

/* ─────────────────────────────────────
   NAV ITEMS
───────────────────────────────────── */
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item:active {
  transform: scale(0.88);
}

/* ─────────────────────────────────────
   ICON WRAPPER
───────────────────────────────────── */
.nav-icon-wrap {
  position: relative;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pill background — hidden by default */
.nav-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.25));
  border: 1.5px solid rgba(168,85,247,0.35);
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity  0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Active ring glow */
.nav-active-ring {
  position: absolute;
  inset: -3px;
  border-radius: 17px;
  border: 1.5px solid rgba(168,85,247,0.5);
  opacity: 0;
  transform: scale(0.7);
  transition:
    opacity  0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: none;
}

.nav-icon {
  font-size: 22px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
  filter: grayscale(0.4) brightness(0.65);
}

/* ─────────────────────────────────────
   LABEL
───────────────────────────────────── */
.nav-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.25s ease;
  text-transform: uppercase;
}

/* ─────────────────────────────────────
   ACTIVE STATE
───────────────────────────────────── */
.nav-item.active {
  transform: translateY(-2px);
}

.nav-item.active .nav-icon-bg {
  opacity: 1;
  transform: scale(1);
}

.nav-item.active .nav-active-ring {
  opacity: 1;
  transform: scale(1);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.nav-item.active .nav-icon {
  transform: scale(1.15);
  filter: grayscale(0) brightness(1.1);
}

.nav-item.active .nav-label {
  color: rgba(168, 85, 247, 0.95);
}

/* ─────────────────────────────────────
   ANIMATIONS
───────────────────────────────────── */
@keyframes ringPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
    border-color: rgba(168, 85, 247, 0.5);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
    border-color: rgba(168, 85, 247, 0.8);
  }
}
</style>