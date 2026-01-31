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
