<template>
  <q-page class="login-page flex flex-center">
    <div class="login-card">

      <!-- ROBOT -->
      <div class="robot-wrapper">
        <img src="logo-sin-fondo.png" class="robot-img" />
      </div>

      <h1 class="title">Juegos Matemáticos</h1>
      <p class="subtitle">Bienvenido de vuelta</p>

      <q-input
        v-model="email"
        outlined
        placeholder="Correo Electrónico"
        class="input"
        type="email"
      />

      <q-input
        v-model="password"
        outlined
        placeholder="Contraseña"
        class="input"
        type="password"
      />

      <q-btn
        label="Iniciar Sesión"
        class="btn-login full-width"
        unelevated
        :loading="loading"
        @click="login"
      />

      <p class="forgot">¿Olvidaste tu contraseña?</p>

    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

// 🔑 REDIRECCIÓN AUTOMÁTICA CUANDO SE AUTENTICA
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

    // 🔑 Redirecciona directamente después de iniciar sesión
    router.replace('/app/dashboard')

  } catch (err) {
    console.error(err)
    // opcional: mostrar error con $q.notify
    // $q.notify({ type: 'negative', message: 'Credenciales incorrectas' })
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-page {
  background: linear-gradient(180deg, #f6f7f9 0%, #eef1f6 100%);
}

.login-card {
  width: 100%;
  max-width: 360px;
  padding: 36px 26px;
  text-align: center;

  background: #ffffff;
  border-radius: 22px;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 30px 60px rgba(0, 0, 0, 0.05);
}

/* TITULOS */
.title {
  font-size: 22px;
  font-weight: 700;
  color: #2e2e2e;
  margin-top: 8px;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #8a8a8a;
  margin-bottom: 26px;
}

/* INPUTS */
.input {
  margin-bottom: 14px;
}

.input :deep(.q-field__control) {
  border-radius: 14px;
  background: #fafafa;
}

/* BOTÓN */
.btn-login {
  background: linear-gradient(180deg, #2f80ed, #256dd6);
  color: white;
  border-radius: 14px;
  height: 48px;
  font-weight: 600;
  font-size: 15px;
  margin-top: 14px;
}

/* TEXTO SECUNDARIO */
.forgot {
  font-size: 13px;
  color: #8a8a8a;
  margin-top: 18px;
}

/* ROBOT */
.robot-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.robot-img {
  width: 72%;
  max-width: 200px;
  height: auto;
}
</style>
