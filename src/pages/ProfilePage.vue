<template>
  <q-page class="profile-page">

    <!-- HEADER -->
    <div class="profile-header">
      <div class="avatar"></div>
      <h3>{{ userName }}</h3>
      <p>{{ userEmail }}</p>

      <q-btn
        v-if="!editing"
        label="Editar Perfil"
        color="primary"
        class="edit-btn"
        @click="editing = true"
      />
    </div>

    <!-- FORMULARIO DE EDICIÓN -->
    <div v-if="editing" class="form-card">
      <q-input
        filled
        v-model="form.name"
        label="Nombre"
        class="q-mb-sm"
      />
      <q-input
        filled
        v-model="form.email"
        label="Email"
        class="q-mb-sm"
        type="email"
      />
      <div class="form-buttons">
        <q-btn label="Guardar" color="primary" @click="updateProfile" />
        <q-btn label="Cancelar" flat color="red" @click="cancelEdit" />
      </div>
    </div>

    <!-- PROGRESO -->
    <div class="info-card" v-if="!editing">
      <strong>Progreso General</strong>
      <p>Puntuación Total: {{ progress.total_score }}</p>
      <p>Racha Actual: {{ progress.streak }} días</p>

      <div v-for="(p, key) in practiceProgress" :key="key" class="practice-progress">
        <p>{{ key.toUpperCase() }} · Nivel {{ p.level }} · Ejercicio {{ p.exercise }}/5</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(p.exercise-1)/5*100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- CERRAR SESIÓN -->
    <q-btn label="Cerrar Sesión" class="logout" @click="logout" />

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

      // traer progreso de cada práctica
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
.profile-page {
  padding: 24px;
  background: linear-gradient(180deg, #f0f9ff, #e6f2ff);
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

.edit-btn {
  margin-top: 12px;
}

/* FORMULARIO */
.form-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 18px;
  margin-top: 16px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 30px 60px rgba(0, 0, 0, 0.04);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
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

/* PROGRESO DE PRÁCTICAS */
.practice-progress {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #dbeeff;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4facfe, #2f80ed);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #457b9d;
  text-align: center;
  margin: 0;
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
