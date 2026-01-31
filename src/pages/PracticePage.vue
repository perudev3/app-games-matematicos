<template>
  <q-page class="practice-page">

    <div class="practice-header">
      <h2>{{ practiceLabel }}</h2>
      <p>Nivel {{ level }} · Ejercicio {{ exercise }}/5</p>
    </div>

    <div v-if="loading" class="loading">
      <q-spinner size="40px" color="primary" />
      <p>Generando ejercicio…</p>
    </div>

    <div v-else class="exercise-card">
      <h3 class="question">{{ current.question }}</h3>

      <div class="options">
        <q-btn
          v-for="(opt, i) in current.options"
          :key="i"
          outline
          class="option-btn"
          @click="selectAnswer(opt)"
        >
          {{ opt }}
        </q-btn>
      </div>
    </div>

  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const route = useRoute()

const practice = route.query.practice
const grade = route.query.grade

const level = ref(1)
const exercise = ref(1)
const loading = ref(false)

const current = ref({
  question: '',
  options: [],
  answer: null,
  points: 0
})

const practiceLabel = computed(() => {
  if (practice === 'sumas') return 'Práctica de Sumas'
  if (practice === 'restas') return 'Práctica de Restas'
  return 'Práctica'
})

/* ======================
   GENERAR EJERCICIO IA
====================== */
const generateExercise = async (retries = 3) => {
  loading.value = true

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://localhost:3333/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practice,
          level: level.value,
          exercise: exercise.value,
          grade
        })
      })

      if (!res.ok) throw new Error(`Status ${res.status}`)

      const data = await res.json()
      current.value = data
      break
    } catch (e) {
      console.error('Error generando ejercicio', e)
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, 1000)) // espera 1 seg antes de reintentar
      } else {
        alert('No se pudo generar el ejercicio. Intenta nuevamente más tarde.')
      }
    } finally {
      loading.value = false
    }
  }
}

/* ======================
   RESPUESTA DEL ALUMNO
====================== */
const selectAnswer = async (value) => {
  const correct = value === current.value.answer;

  if (correct) {
    await completeExercise(current.value.points); // Suma puntos y actualiza progreso
  }

  if (exercise.value < 5) {
    exercise.value++;
    generateExercise();
  } else {
    level.value++;
    exercise.value = 1;
    generateExercise();
  }
};

/* ======================
   PUNTAJE Y PROGRESO
====================== */
const addPoints = async (points) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.rpc('add_points', {
    uid: user.id,
    pts: points
  });

  if (error) {
    console.error('Error sumando puntos:', error.message);
  } else {
    console.log('Puntos sumados correctamente');
  }
};

/* ======================
   ACTUALIZAR EJERCICIO / NIVEL
====================== */
const completeExercise = async (points) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.rpc('complete_exercise', {
    uid: user.id,
    practice_name: practice,
    exercise_points: points
  });

  if (error) {
    console.error('Error actualizando progreso:', error.message);
  } else {
    console.log('Progreso actualizado correctamente');
  }
};




/* ======================
   NIVEL COMPLETADO
====================== */
const completeLevel = async () => {
  level.value++
  exercise.value = 1
  generateExercise()
}

onMounted(() => {
  generateExercise()
})
</script>


<style scoped>
.practice-page {
  padding: 20px;
  background: linear-gradient(180deg, #f0f9ff, #e6f2ff);
  min-height: 100vh;
}

/* HEADER */
.practice-header {
  margin-bottom: 24px;
  text-align: center;
}

.practice-header h2 {
  font-size: 26px;
  font-weight: 700;
  color: #1d3557;
}

.practice-header p {
  font-size: 14px;
  color: #457b9d;
  margin-top: 6px;
}

/* EJERCICIO CARD */
.exercise-card {
  background: #fff;
  padding: 28px 20px;
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
}

.question {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 18px;
  color: #1d3557;
  text-align: center;
}

/* OPCIONES */
.options {
  display: grid;
  gap: 14px;
  margin-top: 12px;
}

.option-btn {
  border-radius: 16px;
  font-size: 16px;
  padding: 14px;
  font-weight: 600;
  transition: all 0.2s;
  background: #f1faff;
  color: #1d3557;
}

.option-btn:hover {
  background: #4facfe;
  color: #fff;
}

/* LOADING */
.loading {
  text-align: center;
  margin-top: 60px;
  color: #1d3557;
}

/* PROGRESS BAR */
.progress-wrapper {
  margin-top: 18px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #dbeeff;
  border-radius: 8px;
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
</style>
