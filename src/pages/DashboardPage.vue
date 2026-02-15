<template>
  <q-page class="dashboard-page">

    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1 class="hello">Hola, {{ userName }}</h1>
        <p class="welcome">¿Listo para practicar hoy?</p>
      </div>
      <img src="/logo-sin-fondo.png" class="robot-header" />
    </div>

    <!-- CARDS DE PRÁCTICAS -->
    <div class="cards">
      <div
        v-for="p in practices"
        :key="p.key"
        class="card action"
        @click="startPractice(p.key)"
      >
        <div :class="['icon', p.iconClass]">{{ p.icon }}</div>
        <p>{{ p.label }}</p>

        <!-- Progress bar -->
        <div class="progress-wrapper" v-if="progress[p.key]">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${progress[p.key].percent}%` }"
            ></div>
          </div>
          <p class="progress-text">
            Nivel {{ progress[p.key].level }} · Ejercicio {{ progress[p.key].exercise }}/5
          </p>
        </div>
      </div>
    </div>

    <!-- DAILY CHALLENGE -->
    <div class="daily-card">
      <div class="chest">🎁</div>
      <div>
        <h3>Desafío Diario</h3>
        <p>¡Nuevo reto disponible!</p>
      </div>
    </div>

    <!-- LIBROS -->
    <div class="books-section">

      <h3 class="section-title">Practicar por Libro</h3>

      <div class="books-grid">
        <div
          v-for="b in books"
          :key="b.key"
          class="book-card"
          :style="{ background: b.color }"
          @click="openBook(b.key)"
        >
          <div class="book-icon">📘</div>
          <p>{{ b.title }}</p>

          <!-- PROGRESO LIBRO -->
          <div
            class="progress-wrapper"
            v-if="progress[b.key]"
          >
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${progress[b.key].percent}%` }"
              ></div>
            </div>

            <p class="progress-text">
              Nivel {{ progress[b.key].level }}
              · Ejercicio {{ progress[b.key].exercise }}/5
            </p>
          </div>

        </div>
      </div>

    </div>


  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const router = useRouter()

const userName = ref('Alumno')
const practices = [
  { key: 'sumas', label: 'Práctica de Sumas', icon: '+', iconClass: 'plus' },
  { key: 'restas', label: 'Práctica de Restas', icon: '−', iconClass: 'minus' },
  { key: 'series', label: 'Práctica de Series', icon: 'S', iconClass: 'series' },
  { key: 'mixto', label: 'Práctica Mixta', icon: 'M', iconClass: 'mixto' },
]

const books = [
  {
    key: 'libro-1',
    title: 'Libro 1',
    color: 'linear-gradient(180deg,#ff9a9e,#fad0c4)'
  },
  {
    key: 'libro-2',
    title: 'Libro 2',
    color: 'linear-gradient(180deg,#a18cd1,#fbc2eb)'
  },
  {
    key: 'libro-3',
    title: 'Libro 3',
    color: 'linear-gradient(180deg,#84fab0,#8fd3f4)'
  }
]

const openBook = (bookKey) => {
  router.push({
    path: '/practice',
    query: {
      book: bookKey,    // 👈 pasa el libro
      grade: 6
    }
  })
}



// Progreso por práctica
const progress = ref({})

/* ======================
   CARGAR USUARIO Y PROGRESO
====================== */
const loadUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userName.value = user.user_metadata?.full_name || user.email || 'Alumno'

    // Traer progreso de la base
    const { data } = await supabase
      .from('practice_progress')
      .select('*')
      .eq('user_id', user.id)

    if (data) {
      data.forEach(p => {
        progress.value[p.practice] = {
          level: p.level,
          exercise: p.exercise,
          percent: Math.floor(((p.exercise - 1) / 5) * 100)
        }
      })
    }
  }
}

/* ======================
   INICIAR PRÁCTICA
====================== */
const startPractice = (practiceKey) => {
  router.push({
    path: '/practice',
    query: {
      practice: practiceKey,
      grade: 6
    }
  })
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
  background: linear-gradient(180deg, #f6f7f9 0%, #eef1f6 100%);
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}

.hello {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #2e2e2e;
}

.welcome {
  font-size: 14px;
  color: #8a8a8a;
  margin-top: 4px;
}

.robot-header {
  width: 50%;
  height: auto;
}

/* ACTION CARDS */
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 26px;
}

.card {
  background: #ffffff;
  border-radius: 22px;
  padding: 26px 16px;
  text-align: center;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 30px 60px rgba(0, 0, 0, 0.04);
  position: relative;
}

.card p {
  font-weight: 600;
  font-size: 15px;
  margin-top: 12px;
  color: #2e2e2e;
}

/* ICONS */
.icon {
  width: 54px;
  height: 54px;
  margin: 0 auto;
  border-radius: 50%;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.plus {
  background: linear-gradient(180deg, #4facfe, #2f80ed);
}

.minus {
  background: linear-gradient(180deg, #f2994a, #eb5757);
}

.series {
  background: linear-gradient(180deg, #56ccf2, #2f80ed);
}

.mixto {
  background: linear-gradient(180deg, #bb6bd9, #8e44ad);
}

/* PROGRESS BAR */
.progress-wrapper {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
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
  color: #8a8a8a;
  text-align: center;
  margin: 0;
}

/* DAILY CHALLENGE */
.daily-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.06);
}

.daily-card h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
}

.daily-card p {
  font-size: 13px;
  color: #8a8a8a;
  margin-top: 4px;
}

.chest {
  font-size: 36px;
}

.books-section {
  margin-top: 26px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #2e2e2e;
}

.books-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}

.book-card {
  border-radius: 18px;
  padding: 20px 10px;
  text-align: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
  transition: transform .2s;
}

.book-card:hover {
  transform: translateY(-4px);
}

.book-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.book-card .progress-bar {
  background: rgba(255,255,255,.3);
}

.book-card .progress-fill {
  background: white;
}

.book-card .progress-text {
  color: white;
}


</style>
