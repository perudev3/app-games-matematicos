<template>
  <q-page class="login-page flex flex-center">

    <!-- AMBIENT BACKGROUND -->
    <div class="ambient">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="login-card">

      <!-- SHINE TOP -->
      <div class="card-shine"></div>

      <!-- LOGOS -->
      <div class="logos-row">
        <div class="logo-wrap">
          <img src="logo-facultad.jpeg" class="logo-img" />
        </div>
        <div class="logo-divider"></div>
        <div class="logo-wrap logo-main">
          <div class="logo-ring">
            <img src="logo-mathplay.png" class="logo-img-main" />
          </div>
        </div>
      </div>

      <h1 class="title">MathPlay</h1>
      <p class="subtitle">{{ showRegister ? 'Crea tu cuenta y empieza a jugar' : 'Inicia sesión y sigue tu aventura' }}</p>

      <!-- TABS -->
      <div class="tabs-row">
        <button
          class="tab-btn"
          :class="{ 'tab-active': !showRegister }"
          @click="showRegister = false"
        >Iniciar Sesión</button>
        <button
          class="tab-btn"
          :class="{ 'tab-active': showRegister }"
          @click="showRegister = true"
        >Registrarse</button>
        <div class="tab-indicator" :class="{ 'tab-right': showRegister }"></div>
      </div>

      <!-- ─── LOGIN FORM ─── -->
      <transition name="form-fade" mode="out-in">
        <div v-if="!showRegister" key="login" class="form-body">
          <div class="field-wrap">
            <label class="field-label">CORREO ELECTRÓNICO</label>
            <div class="field-row">
              <span class="field-icon">✉️</span>
              <input
                v-model="email"
                class="field-input"
                type="email"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div class="field-wrap">
            <label class="field-label">CONTRASEÑA</label>
            <div class="field-row">
              <span class="field-icon">🔒</span>
              <input
                v-model="password"
                class="field-input"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button class="btn-primary" :class="{ loading }" :disabled="loading" @click="login">
            <span v-if="!loading">🚀 Iniciar Sesión</span>
            <span v-else class="spinner"></span>
          </button>

          <!-- <p class="switch-text">
            ¿No tienes cuenta?
            <button class="link-btn" @click="showRegister = true">Registrarse</button>
          </p> -->
        </div>

        <!-- ─── REGISTER FORM ─── -->
        <div v-else key="register" class="form-body">
          <div class="field-wrap">
            <label class="field-label">NOMBRE COMPLETO</label>
            <div class="field-row">
              <span class="field-icon">👤</span>
              <input
                v-model="registerName"
                class="field-input"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div class="field-wrap">
            <label class="field-label">CORREO ELECTRÓNICO</label>
            <div class="field-row">
              <span class="field-icon">✉️</span>
              <input
                v-model="registerEmail"
                class="field-input"
                type="email"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div class="field-wrap">
            <label class="field-label">CONTRASEÑA</label>
            <div class="field-row">
              <span class="field-icon">🔒</span>
              <input
                v-model="registerPassword"
                class="field-input"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button class="btn-primary" :class="{ loading }" :disabled="loading" @click="register">
            <span v-if="!loading">⚡ Crear Cuenta</span>
            <span v-else class="spinner"></span>
          </button>

          <!-- <p class="switch-text">
            ¿Ya tienes cuenta?
            <button class="link-btn" @click="showRegister = false">Iniciar sesión</button>
          </p> -->
        </div>
      </transition>

      <!-- CARD BOTTOM SHADOW -->
      <div class="card-bottom-shadow"></div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const showRegister = ref(false)

const email = ref('')
const password = ref('')
const loading = ref(false)

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const auth = useAuthStore()
const router = useRouter()

watch(
  () => auth.user,
  (user) => {
    if (user) {
      router.replace('/app/dashboard')
    }
  }
)

async function login() {
  try {
    loading.value = true
    await auth.login(email.value, password.value)
    router.replace('/app/dashboard')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function register() {
  try {
    loading.value = true
    await auth.register({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value
    })
    router.replace('/app/dashboard')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ─────────────────────────────────────────
   TOKENS
───────────────────────────────────────── */
.login-page {
  --bg:        #0b0c1a;
  --surface:   #13152a;
  --surface-2: #1c1f3a;
  --border:    rgba(255,255,255,0.08);
  --white:     #ffffff;
  --dim:       rgba(255,255,255,0.4);
  --purple:    #a855f7;
  --blue:      #3b82f6;
  --teal:      #06b6d4;
  --gold:      #fbbf24;
  --red:       #ef4444;

  min-height: 100vh;
  background: var(--bg);
  font-family: 'Nunito', 'Poppins', 'Segoe UI', sans-serif;
  color: var(--white);
  position: relative;
  overflow: hidden;
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
  filter: blur(90px);
  opacity: 0.2;
}
.orb-1 { width: 480px; height: 480px; background: var(--purple); top: -180px; left: -160px; animation: orbFloat 12s ease-in-out infinite; }
.orb-2 { width: 320px; height: 320px; background: var(--blue);   bottom: -80px; right: -100px; animation: orbFloat 9s ease-in-out infinite reverse; }
.orb-3 { width: 240px; height: 240px; background: var(--teal);   top: 40%; left: 40%; animation: orbFloat 14s ease-in-out infinite; animation-delay: -5s; }
@keyframes orbFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(24px,-32px) scale(1.06); }
  66%      { transform: translate(-16px,22px) scale(0.95); }
}
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 100%);
}

/* ─────────────────────────────────────────
   CARD
───────────────────────────────────────── */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  margin: 0 16px;
  background: var(--surface);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 28px;
  padding: 32px 24px 36px;
  text-align: center;
  box-shadow:
    0 12px 0 rgba(0,0,0,0.5),
    0 20px 60px rgba(0,0,0,0.6),
    0 0 80px rgba(168,85,247,0.08);
  overflow: hidden;
}

.card-shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 42%;
  background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%);
  border-radius: 28px 28px 70% 70%;
  pointer-events: none;
}
.card-bottom-shadow {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 8px;
  background: rgba(0,0,0,0.4);
  border-radius: 0 0 28px 28px;
}

/* ─────────────────────────────────────────
   LOGOS
───────────────────────────────────────── */
.logos-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}
.logo-wrap { display: flex; align-items: center; justify-content: center; }
.logo-img {
  width: 52px; height: 52px;
  object-fit: contain;
  border-radius: 12px;
  opacity: 0.85;
}
.logo-divider {
  width: 1.5px; height: 40px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent);
}
.logo-ring {
  width: 64px; height: 64px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(var(--purple), var(--blue), var(--teal), var(--purple));
  animation: spinRing 6s linear infinite;
  box-shadow: 0 0 24px rgba(168,85,247,0.35);
}
@keyframes spinRing { to { filter: hue-rotate(360deg); } }
.logo-img-main {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface-2);
  display: block;
}

/* ─────────────────────────────────────────
   TITLES
───────────────────────────────────────── */
.title {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 4px;
  background: linear-gradient(135deg, var(--white), rgba(168,85,247,0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  letter-spacing: -0.5px;
}
.subtitle {
  font-size: 12px;
  color: var(--dim);
  font-weight: 700;
  letter-spacing: 0.3px;
  margin: 0 0 22px;
}

/* ─────────────────────────────────────────
   TABS
───────────────────────────────────────── */
.tabs-row {
  position: relative;
  display: flex;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 22px;
  gap: 0;
}
.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  background: none;
  border: none;
  padding: 9px 0;
  font-size: 12px;
  font-weight: 900;
  color: var(--dim);
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.3px;
  transition: color 0.25s ease;
  border-radius: 10px;
}
.tab-active { color: var(--white); }
.tab-indicator {
  position: absolute;
  top: 4px; bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  background: linear-gradient(135deg, var(--purple), var(--blue));
  border-radius: 10px;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 12px rgba(168,85,247,0.4);
}
.tab-right { transform: translateX(100%); }

/* ─────────────────────────────────────────
   FORM
───────────────────────────────────────── */
.form-body { display: flex; flex-direction: column; gap: 0; }

.field-wrap { margin-bottom: 13px; text-align: left; }
.field-label {
  display: block;
  font-size: 9px; font-weight: 900;
  letter-spacing: 2px; color: var(--dim);
  margin-bottom: 6px;
}
.field-row {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.field-row:focus-within {
  border-color: rgba(168,85,247,0.6);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
}
.field-icon { font-size: 15px; margin-right: 8px; flex-shrink: 0; opacity: 0.7; }
.field-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  font-family: inherit;
}
.field-input::placeholder { color: rgba(255,255,255,0.22); }

/* ─────────────────────────────────────────
   BUTTONS
───────────────────────────────────────── */
.btn-primary {
  width: 100%;
  margin-top: 8px;
  background: linear-gradient(135deg, var(--purple), var(--blue));
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 14px; font-weight: 900;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 0 rgba(100,30,180,0.5), 0 8px 24px rgba(168,85,247,0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s;
  position: relative;
  overflow: hidden;
}
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%);
  border-radius: 14px 14px 50% 50%;
}
.btn-primary:hover  { transform: translateY(-3px); box-shadow: 0 9px 0 rgba(100,30,180,0.5), 0 12px 32px rgba(168,85,247,0.5); }
.btn-primary:active { transform: translateY(2px); box-shadow: 0 3px 0 rgba(100,30,180,0.5), 0 4px 12px rgba(168,85,247,0.3); }
.btn-primary.loading { opacity: 0.7; cursor: not-allowed; transform: none; }
.btn-primary:disabled { cursor: not-allowed; }

.spinner {
  display: inline-block;
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.switch-text {
  font-size: 12px;
  color: var(--dim);
  margin: 14px 0 0;
  font-weight: 700;
}
.link-btn {
  background: none;
  border: none;
  color: var(--purple);
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  padding: 0 0 0 4px;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.link-btn:hover { color: var(--blue); }

/* ─────────────────────────────────────────
   TRANSITIONS
───────────────────────────────────────── */
.form-fade-enter-active { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.form-fade-leave-active { transition: all 0.15s ease; }
.form-fade-enter-from  { opacity: 0; transform: translateX(14px) scale(0.98); }
.form-fade-leave-to    { opacity: 0; transform: translateX(-10px) scale(0.98); }
</style>