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

<style scoped>
/* ─────────────────────────────────────────
   TOKENS
───────────────────────────────────────── */
.profile-page {
  --bg:        #0b0c1a;
  --surface:   #13152a;
  --surface-2: #1c1f3a;
  --border:    rgba(255,255,255,0.08);
  --white:     #ffffff;
  --dim:       rgba(255,255,255,0.45);

  --blue:   #3b82f6;
  --red:    #ef4444;
  --teal:   #06b6d4;
  --purple: #a855f7;
  --green:  #22c55e;
  --orange: #f97316;
  --gold:   #fbbf24;

  min-height: 100vh;
  background: var(--bg);
  padding: 0 0 48px;
  font-family: 'Nunito', 'Poppins', 'Segoe UI', sans-serif;
  color: var(--white);
  position: relative;
  overflow-x: hidden;
}

/* ─────────────────────────────────────────
   AMBIENT
───────────────────────────────────────── */
.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
}
.orb-1 { width:380px;height:380px;background:var(--purple);top:-120px;left:-100px;animation:orbFloat 12s ease-in-out infinite; }
.orb-2 { width:280px;height:280px;background:var(--teal);top:220px;right:-90px;animation:orbFloat 9s ease-in-out infinite reverse; }
.orb-3 { width:220px;height:220px;background:var(--blue);bottom:120px;left:25%;animation:orbFloat 14s ease-in-out infinite;animation-delay:-4s; }
@keyframes orbFloat {
  0%,100%{transform:translate(0,0) scale(1);}
  33%{transform:translate(20px,-30px) scale(1.05);}
  66%{transform:translate(-15px,20px) scale(0.96);}
}
.grid-overlay {
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);
  background-size:40px 40px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black 30%,transparent 100%);
}

/* ─────────────────────────────────────────
   HERO HEADER
───────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 20px 28px;
}

.avatar-ring {
  width: 88px; height: 88px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(var(--purple), var(--blue), var(--teal), var(--purple));
  animation: spinRing 6s linear infinite;
  margin-bottom: 14px;
  box-shadow: 0 0 40px rgba(168,85,247,0.4);
}
@keyframes spinRing { to { filter: hue-rotate(360deg); } }
.avatar-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
}
.avatar-initial {
  font-size: 34px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--purple), var(--blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-name {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 4px;
  text-shadow: 0 0 30px rgba(168,85,247,0.5);
}
.hero-email {
  font-size: 13px;
  color: var(--dim);
  margin: 0 0 18px;
}

.edit-btn {
  background: linear-gradient(135deg, var(--purple), var(--blue)) !important;
  border-radius: 50px !important;
  padding: 0 !important;
  box-shadow: 0 4px 20px rgba(168,85,247,0.4) !important;
  border: none !important;
}
.edit-btn-inner {
  display: block;
  padding: 9px 22px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}

/* ─────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────── */
.stats-strip {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  margin: 0 16px 4px;
}
.stat-pill {
  flex: 1;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 18px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s ease;
}
.stat-pill:hover { transform: translateY(-2px); }
.stat-pill-icon  { font-size: 22px; }
.stat-pill-info  { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-pill-val   { font-size: 20px; font-weight: 900; color: var(--white); line-height: 1; }
.stat-pill-label { font-size: 9px; font-weight: 700; color: var(--dim); letter-spacing: 1px; text-transform: uppercase; }

/* ─────────────────────────────────────────
   SECTIONS
───────────────────────────────────────── */
.section {
  position: relative;
  z-index: 1;
  padding: 24px 16px 0;
}
.section-head {
  display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
}
.section-icon  { font-size: 18px; }
.section-title {
  font-size: 15px; font-weight: 900;
  letter-spacing: 0.5px; color: rgba(255,255,255,0.85);
  margin: 0; text-transform: uppercase;
}

/* ─────────────────────────────────────────
   PROGRESS ROWS
───────────────────────────────────────── */
.progress-list { display: flex; flex-direction: column; gap: 10px; }

.prow {
  position: relative;
  border-radius: 18px;
  padding: 14px 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.1);
  cursor: default;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.prow:hover { transform: translateY(-3px); }

.prow-shine {
  position: absolute; top: 0; left: 0; right: 0; height: 45%;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  border-radius: 18px 18px 60% 60%;
  pointer-events: none;
}
.prow-bottom-shadow {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 5px; background: rgba(0,0,0,0.35);
  border-radius: 0 0 18px 18px;
}

.pr-blue   { background: linear-gradient(145deg,#1e3a6e,#2563eb); box-shadow:0 6px 0 #1a3060,0 8px 24px rgba(37,99,235,.35); }
.pr-red    { background: linear-gradient(145deg,#6b1010,#dc2626); box-shadow:0 6px 0 #5a0e0e,0 8px 24px rgba(220,38,38,.35);  }
.pr-teal   { background: linear-gradient(145deg,#0d4f5c,#0891b2); box-shadow:0 6px 0 #0b3f4a,0 8px 24px rgba(8,145,178,.35); }
.pr-purple { background: linear-gradient(145deg,#3b1466,#9333ea); box-shadow:0 6px 0 #2e1053,0 8px 24px rgba(147,51,234,.35); }

.prow-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.prow-icon { font-size: 28px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.4)); flex-shrink: 0; }
.prow-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.prow-name { font-size: 14px; font-weight: 900; color: #fff; }
.prow-sub  { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.65); }

.prow-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; min-width: 80px; }
.prow-bar-track {
  width: 80px; height: 6px;
  background: rgba(0,0,0,0.3); border-radius: 6px; overflow: hidden;
}
.prow-bar-fill {
  height: 100%;
  background: rgba(255,255,255,0.85);
  border-radius: 6px;
  transition: width 0.7s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 0 8px rgba(255,255,255,0.5);
}
.prow-percent {
  font-size: 11px; font-weight: 900; color: rgba(255,255,255,0.75);
}

/* Empty state */
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 32px 20px;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: 18px;
  color: var(--dim);
}
.empty-icon { font-size: 36px; }
.empty-text { font-size: 13px; font-weight: 700; text-align: center; }

/* ─────────────────────────────────────────
   GLASS CARD / FORM
───────────────────────────────────────── */
.glass-card {
  position: relative;
  z-index: 1;
  margin: 12px 16px 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 24px;
  padding: 22px 18px 24px;
  backdrop-filter: blur(12px);
}

.card-title-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
}
.card-icon { font-size: 18px; }
.card-title {
  font-size: 14px; font-weight: 900; text-transform: uppercase;
  letter-spacing: 0.5px; color: rgba(255,255,255,0.85);
}

.field-wrap { margin-bottom: 14px; }
.field-label {
  display: block;
  font-size: 9px; font-weight: 900; letter-spacing: 2px;
  color: var(--dim); margin-bottom: 6px;
}
.field-input {
  width: 100%; box-sizing: border-box;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 14px; font-weight: 700;
  color: var(--white);
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.field-input::placeholder { color: rgba(255,255,255,0.25); }
.field-input:focus {
  border-color: rgba(168,85,247,0.6);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
}

.form-buttons {
  display: flex; gap: 10px; margin-top: 6px;
}
.btn-save {
  flex: 1;
  background: linear-gradient(135deg, var(--purple), var(--blue));
  border: none; border-radius: 12px;
  padding: 12px;
  font-size: 13px; font-weight: 800; color: #fff;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 16px rgba(168,85,247,0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-save:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(168,85,247,0.5); }
.btn-save:active { transform: translateY(1px); }

.btn-cancel {
  background: rgba(239,68,68,0.12);
  border: 1.5px solid rgba(239,68,68,0.3);
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 13px; font-weight: 800; color: var(--red);
  cursor: pointer; font-family: inherit;
  transition: background 0.2s ease, transform 0.15s ease;
}
.btn-cancel:hover  { background: rgba(239,68,68,0.22); transform: translateY(-1px); }
.btn-cancel:active { transform: translateY(1px); }

/* ─────────────────────────────────────────
   LOGOUT
───────────────────────────────────────── */
.logout-wrap {
  position: relative; z-index: 1;
  padding: 28px 16px 0;
}
.btn-logout {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 14px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 14px; font-weight: 800; color: rgba(255,255,255,0.55);
  cursor: pointer; font-family: inherit;
  letter-spacing: 0.3px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.btn-logout:hover {
  background: rgba(239,68,68,0.1);
  border-color: rgba(239,68,68,0.3);
  color: var(--red);
}
.logout-icon { font-size: 16px; }

/* ─────────────────────────────────────────
   TRANSITIONS
───────────────────────────────────────── */
.slide-fade-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from  { opacity: 0; transform: translateY(-12px) scale(0.97); }
.slide-fade-leave-to    { opacity: 0; transform: translateY(-8px) scale(0.98); }
</style>