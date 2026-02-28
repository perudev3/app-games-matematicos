<template>
  <q-page class="profile-page">

    <!-- AMBIENT BACKGROUND -->
    <div class="ambient">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- ══════════════════════════════
         HERO HEADER
    ══════════════════════════════ -->
    <header class="hero">
      <div class="avatar-ring">
        <div class="avatar-inner">
          <span class="avatar-initial">{{ userName.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
      <h3 class="hero-name">{{ userName }}</h3>
      <p class="hero-email">{{ userEmail }}</p>

      <q-btn
        v-if="!editing"
        unelevated
        class="edit-btn"
        @click="editing = true"
      >
        <span class="edit-btn-inner">✏️ Editar Perfil</span>
      </q-btn>
    </header>

    <!-- ══════════════════════════════
         FORMULARIO DE EDICIÓN
    ══════════════════════════════ -->
    <transition name="slide-fade">
      <div v-if="editing" class="glass-card form-card">
        <div class="card-title-row">
          <span class="card-icon">⚙️</span>
          <span class="card-title">Editar Perfil</span>
        </div>

        <div class="field-wrap">
          <label class="field-label">NOMBRE</label>
          <input
            v-model="form.name"
            class="field-input"
            placeholder="Tu nombre"
          />
        </div>

        <div class="field-wrap">
          <label class="field-label">EMAIL</label>
          <input
            v-model="form.email"
            class="field-input"
            type="email"
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-buttons">
          <button class="btn-save" @click="updateProfile">
            <span>💾 Guardar</span>
          </button>
          <button class="btn-cancel" @click="cancelEdit">
            <span>✕ Cancelar</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ══════════════════════════════
         STATS RÁPIDAS
    ══════════════════════════════ -->
    <div v-if="!editing" class="stats-strip">
      <div class="stat-pill">
        <span class="stat-pill-icon">⭐</span>
        <div class="stat-pill-info">
          <span class="stat-pill-val">{{ progress.total_score }}</span>
          <span class="stat-pill-label">XP Total</span>
        </div>
      </div>
      <div class="stat-pill">
        <span class="stat-pill-icon">🔥</span>
        <div class="stat-pill-info">
          <span class="stat-pill-val">{{ progress.streak }}</span>
          <span class="stat-pill-label">Racha</span>
        </div>
      </div>
      <div class="stat-pill">
        <span class="stat-pill-icon">🏅</span>
        <div class="stat-pill-info">
          <span class="stat-pill-val">{{ Object.keys(practiceProgress).length }}</span>
          <span class="stat-pill-label">Prácticas</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════
         PROGRESO
    ══════════════════════════════ -->
    <section v-if="!editing" class="section">
      <div class="section-head">
        <span class="section-icon">📊</span>
        <h2 class="section-title">Progreso General</h2>
      </div>

      <div class="progress-list">
        <div
          v-for="(p, key) in practiceProgress"
          :key="key"
          class="prow"
          :class="themeFor(key)"
        >
          <div class="prow-shine"></div>
          <div class="prow-left">
            <span class="prow-icon">{{ iconFor(key) }}</span>
            <div class="prow-info">
              <span class="prow-name">{{ labelFor(key) }}</span>
              <span class="prow-sub">Nivel {{ p.level }} · Ejercicio {{ p.exercise }}/5</span>
            </div>
          </div>
          <div class="prow-right">
            <div class="prow-bar-track">
              <div
                class="prow-bar-fill"
                :style="{ width: `${(p.exercise - 1) / 5 * 100}%` }"
              ></div>
            </div>
            <span class="prow-percent">{{ Math.round((p.exercise - 1) / 5 * 100) }}%</span>
          </div>
          <div class="prow-bottom-shadow"></div>
        </div>

        <div v-if="Object.keys(practiceProgress).length === 0" class="empty-state">
          <span class="empty-icon">🎯</span>
          <span class="empty-text">Aún no has iniciado ninguna práctica</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         CERRAR SESIÓN
    ══════════════════════════════ -->
    <div class="logout-wrap">
      <button class="btn-logout" @click="logout">
        <span class="logout-icon">🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = ref('Alumno')
const userEmail = ref('')
const editing = ref(false)
const form = ref({ name: '', email: '' })
const progress = ref({ total_score: 0, streak: 0 })
const practiceProgress = ref({})

/* ======================
   HELPERS DE UI
====================== */
const icons  = { sumas: '➕', restas: '➖', series: '🔢', mixto: '🎲' }
const labels = { sumas: 'Sumas', restas: 'Restas', series: 'Series', mixto: 'Mixto' }
const themes = { sumas: 'pr-blue', restas: 'pr-red', series: 'pr-teal', mixto: 'pr-purple' }

const iconFor  = (k) => icons[k]  || '📘'
const labelFor = (k) => labels[k] || k.toUpperCase()
const themeFor = (k) => themes[k] || 'pr-blue'

/* ======================
   CARGAR DATOS DEL USUARIO
====================== */
const loadProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      userName.value = profile.name || 'Alumno'
      userEmail.value = profile.email || user.email
      form.value.name = profile.name || ''
      form.value.email = profile.email || ''

      progress.value.total_score = profile.total_score || 0
      progress.value.streak = profile.streak || 0

      const { data: practices } = await supabase
        .from('practice_progress')
        .select('*')
        .eq('user_id', user.id)

      if (practices) {
        practices.forEach(p => {
          practiceProgress.value[p.practice] = {
            level: p.level,
            exercise: p.exercise
          }
        })
      }
    }
  }
}

/* ======================
   ACTUALIZAR PERFIL
====================== */
const updateProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('profiles')
    .update({ name: form.value.name, email: form.value.email })
    .eq('id', user.id)

  if (error) {
    alert('Error al actualizar perfil: ' + error.message)
  } else {
    userName.value = form.value.name
    userEmail.value = form.value.email
    editing.value = false
  }
}

const cancelEdit = () => {
  form.value.name = userName.value
  form.value.email = userEmail.value
  editing.value = false
}

/* ======================
   LOGOUT
====================== */
const logout = async () => {
  await supabase.auth.signOut()
  router.replace('/')
}

onMounted(() => {
  loadProfile()
})
</script>