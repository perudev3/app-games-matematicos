<template>
  <q-page class="profile-page">

    <div class="profile-header">
      <div class="avatar"></div>
      <h3>Daniel</h3>
      <p>daniel12@email.com</p>
    </div>

    <div class="info-card">
      <strong>Progreso</strong>
      <p>Puntuación Total: 1820</p>
      <p>Racha Actual: 12 días</p>
    </div>

    <div class="info-card">Ajustes</div>
    <div class="info-card">Insignias</div>

    <q-btn label="Cerrar Sesión" class="logout" @click="logout" />

  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function logout () {
  await auth.logout()
  router.replace('/')
}
</script>


<style scoped>
.profile-page {
  padding: 24px;
  background: linear-gradient(180deg, #f6f7f9 0%, #eef1f6 100%);
  min-height: 100vh;
}

/* HEADER */
.profile-header {
  text-align: center;
  margin-bottom: 28px;
}

.avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(180deg, #4facfe, #2f80ed);
  box-shadow:
    0 10px 25px rgba(47, 128, 237, 0.35),
    0 20px 40px rgba(0, 0, 0, 0.08);
}

.profile-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 6px 0 2px;
  color: #2e2e2e;
}

.profile-header p {
  font-size: 13px;
  color: #8a8a8a;
  margin: 0;
}

/* INFO CARDS */
.info-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  margin-top: 16px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 30px 60px rgba(0, 0, 0, 0.04);
}

.info-card strong {
  font-size: 15px;
  font-weight: 700;
  color: #2e2e2e;
  display: block;
  margin-bottom: 8px;
}

.info-card p {
  font-size: 14px;
  color: #6f6f6f;
  margin: 4px 0;
}

/* LOGOUT */
.logout {
  margin-top: 28px;
  width: 100%;
  height: 48px;
  border-radius: 16px;
  font-weight: 600;
  background: linear-gradient(180deg, #bdbdbd, #9e9e9e);
  color: white;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
