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
    uid: user.id, practice_name: practice, exercise_points: points
  })
  if (error) console.error('Error:', error.message)
}

onMounted(() => generateExercise())
</script>

<style scoped>
.practice-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #11314f 100%);
  display: flex; flex-direction: column; align-items: center;
  padding: 16px; position: relative; overflow: hidden;
  font-family: 'Nunito', 'Poppins', sans-serif;
}
.bg-bubbles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.bubble { position: absolute; border-radius: 50%; opacity: 0.15; animation: floatUp 8s infinite ease-in-out; }
.bubble-1  { width:60px;  height:60px;  background:#ff6b9d; left:5%;  bottom:-60px;  animation-delay:0s;    animation-duration:9s; }
.bubble-2  { width:40px;  height:40px;  background:#ffcc00; left:15%; bottom:-40px;  animation-delay:1.5s;  animation-duration:7s; }
.bubble-3  { width:80px;  height:80px;  background:#00e5ff; left:25%; bottom:-80px;  animation-delay:3s;    animation-duration:11s; }
.bubble-4  { width:30px;  height:30px;  background:#a855f7; left:40%; bottom:-30px;  animation-delay:0.5s;  animation-duration:8s; }
.bubble-5  { width:55px;  height:55px;  background:#00ff88; left:55%; bottom:-55px;  animation-delay:2s;    animation-duration:10s; }
.bubble-6  { width:45px;  height:45px;  background:#ff9500; left:70%; bottom:-45px;  animation-delay:4s;    animation-duration:6s; }
.bubble-7  { width:70px;  height:70px;  background:#ff6b9d; left:80%; bottom:-70px;  animation-delay:1s;    animation-duration:12s; }
.bubble-8  { width:35px;  height:35px;  background:#ffcc00; left:90%; bottom:-35px;  animation-delay:3.5s;  animation-duration:8s; }
.bubble-9  { width:50px;  height:50px;  background:#00e5ff; left:10%; bottom:-50px;  animation-delay:5s;    animation-duration:9s; }
.bubble-10 { width:25px;  height:25px;  background:#ff6b9d; left:35%; bottom:-25px;  animation-delay:2.5s;  animation-duration:7s; }
.bubble-11 { width:65px;  height:65px;  background:#a855f7; left:60%; bottom:-65px;  animation-delay:0.8s;  animation-duration:13s; }
.bubble-12 { width:40px;  height:40px;  background:#00ff88; left:48%; bottom:-40px;  animation-delay:6s;    animation-duration:8s; }
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity:0.15; }
  50%  { transform: translateY(-50vh) scale(1.1); opacity:0.2; }
  100% { transform: translateY(-110vh) scale(0.8); opacity:0; }
}
.practice-header { width:100%; max-width:500px; margin-bottom:16px; z-index:1; }
.header-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.practice-badge { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.12); border:2px solid rgba(255,255,255,0.25); border-radius:50px; padding:6px 16px; backdrop-filter:blur(8px); }
.badge-icon { font-size:22px; }
.badge-label { font-size:16px; font-weight:800; color:#fff; }
.lives { display:flex; gap:4px; }
.heart { font-size:22px; transition:all 0.3s; }
.heart.lost { filter:grayscale(1); opacity:0.4; transform:scale(0.8); }
.level-bar { background:rgba(255,255,255,0.1); border:2px solid rgba(255,255,255,0.2); border-radius:20px; padding:12px 16px; backdrop-filter:blur(10px); }
.level-info { display:flex; justify-content:space-between; margin-bottom:8px; }
.level-badge { font-size:14px; font-weight:800; color:#ffcc00; text-shadow:0 0 8px rgba(255,204,0,0.6); }
.xp-label { font-size:13px; font-weight:700; color:rgba(255,255,255,0.7); }
.progress-track { height:14px; background:rgba(0,0,0,0.3); border-radius:20px; overflow:hidden; margin-bottom:10px; }
.progress-fill { height:100%; background:linear-gradient(90deg,#a855f7,#ec4899,#ff9500); border-radius:20px; transition:width 0.6s cubic-bezier(0.34,1.56,0.64,1); position:relative; overflow:hidden; }
.progress-glow { position:absolute; top:0; right:0; bottom:0; width:40px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.6)); animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0%{transform:translateX(-40px)} 100%{transform:translateX(40px)} }
.step-indicators { display:flex; justify-content:space-between; gap:6px; }
.step-dot { flex:1; height:30px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.step-dot.done   { background:linear-gradient(135deg,#00e676,#00bcd4); color:#fff; box-shadow:0 2px 10px rgba(0,230,118,0.5); transform:scale(1.05); }
.step-dot.active { background:linear-gradient(135deg,#ffcc00,#ff9500); color:#fff; box-shadow:0 2px 12px rgba(255,204,0,0.6); transform:scale(1.1); animation:pulse-step 1s infinite alternate; }
.step-dot.pending { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.4); }
@keyframes pulse-step { from{box-shadow:0 2px 8px rgba(255,204,0,0.4)} to{box-shadow:0 4px 20px rgba(255,204,0,0.8)} }
.loading-card { z-index:1; background:rgba(255,255,255,0.1); backdrop-filter:blur(20px); border:2px solid rgba(255,255,255,0.2); border-radius:28px; padding:48px 40px; text-align:center; width:100%; max-width:500px; }
.loading-mascot { font-size:64px; animation:bounce 0.7s infinite alternate; }
@keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-16px)} }
.loading-dots { display:flex; justify-content:center; gap:8px; margin:20px 0; }
.loading-dots span { width:12px; height:12px; background:#a855f7; border-radius:50%; animation:dotPulse 1.2s infinite ease-in-out; }
.loading-dots span:nth-child(2) { background:#ec4899; animation-delay:0.2s; }
.loading-dots span:nth-child(3) { background:#ff9500; animation-delay:0.4s; }
@keyframes dotPulse { 0%,100%{transform:scale(0.6);opacity:0.5} 50%{transform:scale(1.2);opacity:1} }
.loading-text { color:#fff; font-size:16px; font-weight:700; margin:0; }
.exercise-card { z-index:1; width:100%; max-width:500px; background:rgba(255,255,255,0.07); backdrop-filter:blur(20px); border:2px solid rgba(255,255,255,0.15); border-radius:28px; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,0.4); }
.card-header-deco { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:16px; }
.deco-star { font-size:18px; animation:spinStar 3s linear infinite; }
.deco-star:last-child { animation-direction:reverse; }
@keyframes spinStar { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.2)} 100%{transform:rotate(360deg) scale(1)} }
.deco-label { font-size:13px; font-weight:800; color:rgba(255,255,255,0.6); letter-spacing:1px; text-transform:uppercase; }
.question-bubble { background:rgba(255,255,255,0.12); border:2px solid rgba(255,255,255,0.2); border-radius:20px; padding:20px; margin-bottom:20px; text-align:center; }
.question-mascot { font-size:36px; margin-bottom:10px; display:block; animation:wobble 2s infinite ease-in-out; }
@keyframes wobble { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
.question { color:#fff; font-size:22px; font-weight:800; margin:0; line-height:1.4; }
.options-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.option-btn { position:relative; border:none; border-radius:18px; padding:18px 12px; cursor:pointer; font-family:inherit; font-size:18px; font-weight:800; color:#fff; display:flex; flex-direction:column; align-items:center; gap:6px; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 6px 0 rgba(0,0,0,0.3); transform:translateY(0); overflow:hidden; }
.option-btn::before { content:''; position:absolute; top:0; left:0; right:0; height:50%; background:rgba(255,255,255,0.15); border-radius:18px 18px 50% 50%; }
.option-btn:hover:not(:disabled) { transform:translateY(-4px) scale(1.02); box-shadow:0 10px 0 rgba(0,0,0,0.3); }
.option-btn:active:not(:disabled) { transform:translateY(2px); box-shadow:0 2px 0 rgba(0,0,0,0.3); }
.option-btn:disabled { cursor:not-allowed; opacity:0.8; }
.option-color-0 { background:linear-gradient(135deg,#e91e8c,#ff4081); }
.option-color-1 { background:linear-gradient(135deg,#1976d2,#42a5f5); }
.option-color-2 { background:linear-gradient(135deg,#f9a825,#ffcc02); color:#1a0533; }
.option-color-3 { background:linear-gradient(135deg,#2e7d32,#43a047); }
.option-letter { font-size:11px; font-weight:900; background:rgba(0,0,0,0.25); border-radius:8px; padding:2px 8px; letter-spacing:1px; }
.option-text { font-size:20px; font-weight:800; }
.coin-display { display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,204,0,0.1); border:2px solid rgba(255,204,0,0.3); border-radius:50px; padding:8px 20px; }
.coin-icon { font-size:22px; animation:coinSpin 2s infinite linear; }
@keyframes coinSpin { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(360deg)} }
.coin-count { font-size:22px; font-weight:900; color:#ffcc00; text-shadow:0 0 10px rgba(255,204,0,0.6); }
.coin-label { font-size:13px; font-weight:700; color:rgba(255,255,255,0.6); }
.feedback-overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:100; pointer-events:none; }
.feedback-content { background:rgba(0,0,0,0.85); backdrop-filter:blur(20px); border-radius:28px; padding:32px 48px; text-align:center; border:3px solid; }
.feedback-overlay.correct .feedback-content { border-color:#00e676; box-shadow:0 0 60px rgba(0,230,118,0.4); }
.feedback-overlay.wrong   .feedback-content { border-color:#ff5252; box-shadow:0 0 60px rgba(255,82,82,0.4); }
.feedback-emoji { font-size:56px; }
.feedback-title { font-size:28px; font-weight:900; color:#fff; margin:8px 0 4px; }
.feedback-overlay.correct .feedback-title { color:#00e676; }
.feedback-overlay.wrong   .feedback-title { color:#ff5252; }
.feedback-sub { font-size:16px; color:rgba(255,255,255,0.7); font-weight:700; }
.levelup-banner { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:200; background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); }
.levelup-content { text-align:center; animation:levelUpPop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.levelup-burst { font-size:80px; animation:burst 0.6s ease; }
.levelup-content h2 { font-size:36px; font-weight:900; color:#ffcc00; margin:8px 0; text-shadow:0 0 30px rgba(255,204,0,0.8); }
.levelup-content p { font-size:20px; font-weight:700; color:#fff; margin:0; }
@keyframes levelUpPop { from{transform:scale(0.3) rotate(-10deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
@keyframes burst { 0%{transform:scale(1) rotate(0deg)} 30%{transform:scale(1.4) rotate(15deg)} 60%{transform:scale(0.9) rotate(-5deg)} 100%{transform:scale(1) rotate(0deg)} }
.pop-enter-active    { animation:bounceIn 0.4s; }
.pop-leave-active    { animation:bounceIn 0.3s reverse; }
.slide-up-enter-active { animation:slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.slide-up-leave-active { animation:slideUp 0.3s reverse; }
.zoom-enter-active   { animation:bounceIn 0.4s; }
.zoom-leave-active   { animation:bounceIn 0.3s reverse; }
@keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.08);opacity:1} 100%{transform:scale(1)} }
@keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
</style>