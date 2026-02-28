<template>
  <q-page class="practice-page">
    <div class="bg-bubbles">
      <span v-for="n in 12" :key="n" :class="`bubble bubble-${n}`"></span>
    </div>

    <div class="practice-header">
      <div class="header-top">
        <div class="practice-badge">
          <span class="badge-icon">{{ practiceIcon }}</span>
          <span class="badge-label">{{ practiceLabel }}</span>
        </div>
        <div class="lives">
          <span v-for="n in 3" :key="n" class="heart" :class="{ lost: n > hearts }">❤️</span>
        </div>
      </div>
      <div class="level-bar">
        <div class="level-info">
          <span class="level-badge">⭐ Nivel {{ level }}</span>
          <span class="xp-label">{{ (exercise - 1) * 20 }}/100 XP</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }">
            <span class="progress-glow"></span>
          </div>
        </div>
        <div class="step-indicators">
          <div v-for="n in 5" :key="n" class="step-dot"
            :class="{ done: n < exercise, active: n === exercise, pending: n > exercise }">
            <span v-if="n < exercise">✓</span>
            <span v-else>{{ n }}</span>
          </div>
        </div>
      </div>
    </div>

    <transition name="pop">
      <div v-if="loading" class="loading-card">
        <div class="loading-mascot">🤖</div>
        <div class="loading-dots"><span></span><span></span><span></span></div>
        <p class="loading-text">¡Preparando tu ejercicio!</p>
      </div>
    </transition>

    <transition name="zoom">
      <div v-if="showFeedback" class="feedback-overlay" :class="feedbackType">
        <div class="feedback-content">
          <div class="feedback-emoji">{{ feedbackType === 'correct' ? '🎉' : '😅' }}</div>
          <div class="feedback-title">{{ feedbackType === 'correct' ? '¡Correcto!' : '¡Casi!' }}</div>
          <div class="feedback-sub">{{ feedbackType === 'correct' ? `+${current.points} puntos` : `La respuesta era ${current.answer}` }}</div>
        </div>
      </div>
    </transition>

    <transition name="slide-up">
      <div v-if="!loading" class="exercise-card">
        <div class="card-header-deco">
          <span class="deco-star">⭐</span>
          <span class="deco-label">Ejercicio {{ exercise }} de 5</span>
          <span class="deco-star">⭐</span>
        </div>
        <div class="question-bubble">
          <div class="question-mascot">🧮</div>
          <h3 class="question">{{ current.question }}</h3>
        </div>
        <div class="options-grid">
          <button v-for="(opt, i) in current.options" :key="i"
            class="option-btn" :class="[`option-color-${i}`, { selected: selectedAnswer === opt, answered: showFeedback }]"
            :disabled="showFeedback" @click="selectAnswer(opt)">
            <span class="option-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
            <span class="option-text">{{ opt }}</span>
          </button>
        </div>
        <div class="coin-display">
          <span class="coin-icon">🪙</span>
          <span class="coin-count">{{ totalPoints }}</span>
          <span class="coin-label">puntos totales</span>
        </div>
      </div>
    </transition>

    <transition name="zoom">
      <div v-if="showLevelUp" class="levelup-banner">
        <div class="levelup-content">
          <div class="levelup-burst">🌟</div>
          <h2>¡Nivel {{ level - 1 }} Completado!</h2>
          <p>Subiste al Nivel {{ level }} 🚀</p>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const route = useRoute()
const practice = route.query.practice
const level = ref(1)
const exercise = ref(1)
const loading = ref(false)
const hearts = ref(3)
const totalPoints = ref(0)
const selectedAnswer = ref(null)
const showFeedback = ref(false)
const feedbackType = ref('correct')
const showLevelUp = ref(false)
const current = ref({ question: '', options: [], answer: null, points: 0 })
const book = route.query.book || null

const progressPercent = computed(() => ((exercise.value - 1) / 5) * 100)
const practiceLabel = computed(() => {
  if (practice === 'sumas') return 'Sumas'
  if (practice === 'restas') return 'Restas'
  return 'Práctica'
})
const practiceIcon = computed(() => {
  if (practice === 'sumas') return '➕'
  if (practice === 'restas') return '➖'
  return '📚'
})

const generateExercise = async () => {
  loading.value = true
  selectedAnswer.value = null
  const res = await fetch('http://localhost:3000/api/generate-exercise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: practice, difficulty: level.value, book })
  })
  current.value = await res.json()
  loading.value = false
}

const selectAnswer = async (value) => {
  selectedAnswer.value = value
  const correct = value === current.value.answer
  feedbackType.value = correct ? 'correct' : 'wrong'
  showFeedback.value = true
  if (correct) {
    totalPoints.value += current.value.points
    await completeExercise(current.value.points)
  } else {
    hearts.value = Math.max(0, hearts.value - 1)
  }
  setTimeout(async () => {
    showFeedback.value = false
    if (exercise.value < 5) {
      exercise.value++
      generateExercise()
    } else {
      showLevelUp.value = true
      setTimeout(() => {
        showLevelUp.value = false
        level.value++
        exercise.value = 1
        generateExercise()
      }, 2200)
    }
  }, 1400)
}

const completeExercise = async (points) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.rpc('complete_exercise', {
    exercise_points: points,    // exacto como en la función
    practice_name: practice,    // exacto como en la función
    uid: user.id                // exacto como en la función
  })
  if (error) console.error('Error:', error.message)
}

onMounted(() => generateExercise())
</script>