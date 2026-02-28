<template>
  <q-page class="dashboard-page">

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
      <div class="hero-content">
        <div class="player-row">
          <div class="avatar-stack">
            <div class="avatar-ring">
              <img src="/logo-sin-fondo.png" class="avatar-img" />
            </div>
            <div class="level-pin">{{ globalLevel }}</div>
          </div>
          <div class="player-info">
            <span class="player-label">JUGADOR</span>
            <h1 class="player-name">{{ firstName }}</h1>
          </div>
          <div class="coin-pill">
            <span class="coin-star">⭐</span>
            <span class="coin-val">{{ totalXP }}</span>
          </div>
        </div>

        <!-- XP PROGRESS -->
        <div class="xp-bar-wrap">
          <div class="xp-bar-track">
            <div class="xp-bar-fill" :style="{ width: xpPercent + '%' }">
              <div class="xp-bar-shine"></div>
            </div>
            <div class="xp-bar-label">XP {{ totalXP % 100 }} / 100</div>
          </div>
          <div class="xp-streak">
            <span class="streak-fire">🔥</span>
            <span class="streak-count">{{ streak }}</span>
          </div>
        </div>
      </div>

      <!-- MASCOT -->
      <!-- <div class="hero-mascot">
        <div class="mascot-halo"></div>
        <img src="/logo-sin-fondo.png" class="mascot-img" />
        <div class="mascot-shadow"></div>
      </div> -->
    </header>

    <!-- ══════════════════════════════
         DAILY QUEST BANNER
    ══════════════════════════════ -->
    <div class="quest-banner" @click="startDaily">
      <div class="quest-left">
        <div class="quest-icon-wrap">
          <span class="quest-icon">🎁</span>
          <div class="quest-ring"></div>
        </div>
        <div class="quest-text">
          <span class="quest-tag">MISIÓN DEL DÍA</span>
          <span class="quest-title">¡Nuevo desafío disponible!</span>
        </div>
      </div>
      <div class="quest-reward">
        <span class="reward-val">+50</span>
        <span class="reward-unit">XP</span>
      </div>
      <div class="quest-arrow">›</div>
    </div>

    <!-- ══════════════════════════════
         PRACTICE SECTION
    ══════════════════════════════ -->
    <section class="section">
      <div class="section-head">
        <span class="section-icon">⚡</span>
        <h2 class="section-title">Práctica</h2>
      </div>

      <div class="practice-grid">
        <div
          v-for="p in practices"
          :key="p.key"
          class="pcard"
          :class="p.theme"
          @click="startPractice(p.key)"
        >
          <!-- Top shine -->
          <div class="pcard-shine"></div>

          <!-- Header row -->
          <div class="pcard-top">
            <div class="pcard-icon">{{ p.icon }}</div>
            <div v-if="progress[p.key]" class="pcard-badge">
              Nv.{{ progress[p.key].level }}
            </div>
            <div v-else class="pcard-badge pcard-badge-new">NEW</div>
          </div>

          <div class="pcard-label">{{ p.label }}</div>

          <!-- Progress bar -->
          <div class="pcard-bar-track">
            <div
              class="pcard-bar-fill"
              :style="{ width: progress[p.key] ? progress[p.key].percent + '%' : '0%' }"
            ></div>
          </div>

          <!-- Steps -->
          <div class="pcard-steps">
            <div
              v-for="n in 5"
              :key="n"
              class="pstep"
              :class="{
                'pstep-done':   progress[p.key] && n < progress[p.key].exercise,
                'pstep-active': progress[p.key] && n === progress[p.key].exercise
              }"
            ></div>
          </div>

          <!-- Bottom shadow -->
          <div class="pcard-bottom-shadow"></div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         BOOKS SECTION
    ══════════════════════════════ -->
    <section class="section">
      <div class="section-head">
        <span class="section-icon">📚</span>
        <h2 class="section-title">Libros</h2>
      </div>

      <div class="books-row">
        <div
          v-for="b in books"
          :key="b.key"
          class="bcard"
          :class="b.theme"
          @click="openBook(b.key)"
        >
          <div class="bcard-shine"></div>
          <div class="bcard-icon">{{ b.icon }}</div>
          <div class="bcard-title">{{ b.title }}</div>

          <div class="bcard-bar-track">
            <div
              class="bcard-bar-fill"
              :style="{ width: progress[b.key] ? progress[b.key].percent + '%' : '0%' }"
            ></div>
          </div>

          <div v-if="!progress[b.key]" class="bcard-lock">🔓 Iniciar</div>
          <div v-else class="bcard-prog">
            Nv.{{ progress[b.key].level }} · {{ progress[b.key].exercise }}/5
          </div>
          <div class="bcard-bottom-shadow"></div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════
         STATS ROW
    ══════════════════════════════ -->
    <section class="stats-row">
      <div v-for="s in stats" :key="s.label" class="scard">
        <span class="scard-icon">{{ s.icon }}</span>
        <span class="scard-val">{{ s.val }}</span>
        <span class="scard-label">{{ s.label }}</span>
      </div>
    </section>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const router = useRouter()

const userName      = ref('Alumno')
const streak        = ref(5)
const totalXP       = ref(240)
const globalLevel   = ref(3)
const completedCount= ref(12)

const firstName = computed(() => userName.value.split(' ')[0])
const xpPercent = computed(() => totalXP.value % 100)

const practices = [
  { key: 'sumas',  label: 'Sumas',  icon: '➕', theme: 'pt-blue'   },
  { key: 'restas', label: 'Restas', icon: '➖', theme: 'pt-red'    },
  { key: 'series', label: 'Series', icon: '🔢', theme: 'pt-teal'   },
  { key: 'mixto',  label: 'Mixto',  icon: '🎲', theme: 'pt-purple' },
]

const books = [
  { key: 'libro-1', title: 'Libro 1', icon: '📗', theme: 'bt-green'  },
  { key: 'libro-2', title: 'Libro 2', icon: '📙', theme: 'bt-orange' },
  { key: 'libro-3', title: 'Libro 3', icon: '📘', theme: 'bt-blue'   },
]

const progress = ref({})

const stats = computed(() => [
  { icon: '🏆', val: totalXP.value,       label: 'XP Total'  },
  { icon: '🔥', val: streak.value,         label: 'Racha'     },
  { icon: '✅', val: completedCount.value, label: 'Ejercicios'},
])

const loadUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  userName.value = user.user_metadata?.full_name || user.name || 'Alumno'

  const { data } = await supabase
    .from('practice_progress')
    .select('*')
    .eq('user_id', user.id)

  if (data) {
    let xp = 0, done = 0
    data.forEach(p => {
      progress.value[p.practice] = {
        level:   p.level,
        exercise:p.exercise,
        percent: Math.floor(((p.exercise - 1) / 5) * 100)
      }
      xp   += (p.level - 1) * 100 + (p.exercise - 1) * 20
      done += (p.level - 1) * 5   + (p.exercise - 1)
    })
    totalXP.value       = xp
    globalLevel.value   = Math.floor(xp / 100) + 1
    completedCount.value= done
  }
}

const startPractice = (key) => router.push({ path: '/practice', query: { practice: key, grade: 6 } })
const openBook      = (key) => router.push({ path: '/practice', query: { book: key,     grade: 6 } })
const startDaily    = ()    => router.push({ path: '/practice', query: { practice: 'mixto', grade: 6 } })

onMounted(loadUserData)
</script>

<style scoped>
/* ─────────────────────────────────────────
   TOKENS & RESET
───────────────────────────────────────── */
.dashboard-page {
  --bg:          #0b0c1a;
  --surface:     #13152a;
  --surface-2:   #1c1f3a;
  --border:      rgba(255,255,255,0.08);
  --white:       #ffffff;
  --dim:         rgba(255,255,255,0.45);

  --blue:   #3b82f6;
  --red:    #ef4444;
  --teal:   #06b6d4;
  --purple: #a855f7;
  --green:  #22c55e;
  --orange: #f97316;
  --gold:   #fbbf24;

  min-height: 100vh;
  background: var(--bg);
  padding: 0 0 40px;
  font-family: 'Nunito', 'Poppins', 'Segoe UI', sans-serif;
  color: var(--white);
  position: relative;
  overflow-x: hidden;
}

/* ─────────────────────────────────────────
   AMBIENT BACKGROUND
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
.orb-1 {
  width: 420px; height: 420px;
  background: var(--purple);
  top: -140px; left: -120px;
  animation: orbFloat 12s ease-in-out infinite;
}
.orb-2 {
  width: 300px; height: 300px;
  background: var(--blue);
  top: 200px; right: -100px;
  animation: orbFloat 9s ease-in-out infinite reverse;
}
.orb-3 {
  width: 250px; height: 250px;
  background: var(--teal);
  bottom: 100px; left: 30%;
  animation: orbFloat 14s ease-in-out infinite;
  animation-delay: -4s;
}
@keyframes orbFloat {
  0%,100% { transform: translate(0, 0)   scale(1);   }
  33%      { transform: translate(20px, -30px) scale(1.05); }
  66%      { transform: translate(-15px, 20px) scale(0.96); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
}

/* ─────────────────────────────────────────
   HERO HEADER
───────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 52px 20px 0;
  margin-bottom: 0;
  min-height: 200px;
}

.hero-content { flex: 1; padding-bottom: 24px; }

.player-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-stack { position: relative; flex-shrink: 0; }
.avatar-ring {
  width: 52px; height: 52px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(var(--purple), var(--blue), var(--teal), var(--purple));
  animation: spinRing 6s linear infinite;
}
@keyframes spinRing { to { filter: hue-rotate(360deg); } }
.avatar-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: var(--surface);
  display: block;
}
.level-pin {
  position: absolute;
  bottom: -4px; right: -4px;
  width: 20px; height: 20px;
  background: var(--gold);
  border-radius: 50%;
  border: 2px solid var(--bg);
  font-size: 10px;
  font-weight: 900;
  color: #000;
  display: flex; align-items: center; justify-content: center;
}

.player-info { flex: 1; }
.player-label {
  display: block;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--dim);
  margin-bottom: 2px;
}
.player-name {
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  color: var(--white);
  line-height: 1;
  text-shadow: 0 0 30px rgba(168,85,247,0.5);
}

.coin-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(251,191,36,0.12);
  border: 1.5px solid rgba(251,191,36,0.35);
  border-radius: 50px;
  padding: 6px 14px;
}
.coin-star { font-size: 16px; }
.coin-val  { font-size: 15px; font-weight: 900; color: var(--gold); }

/* XP bar */
.xp-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.xp-bar-track {
  flex: 1;
  height: 10px;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--purple), var(--blue));
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  overflow: hidden;
}
.xp-bar-shine {
  position: absolute;
  top: 0; bottom: 0; right: 0;
  width: 30px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
  animation: shine 2s infinite;
}
@keyframes shine { 0%{transform:translateX(-30px)} 100%{transform:translateX(30px)} }
.xp-bar-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 900;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.5px;
}
.xp-streak {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}
.streak-fire   { font-size: 18px; animation: flamePulse 1s infinite alternate; }
@keyframes flamePulse {
  from { transform: scale(1)    rotate(-3deg); filter: brightness(1);   }
  to   { transform: scale(1.15) rotate(3deg);  filter: brightness(1.3); }
}
.streak-count  { font-size: 15px; font-weight: 900; color: var(--orange); }

/* Mascot */
.hero-mascot {
  position: relative;
  width: 130px;
  flex-shrink: 0;
  margin-right: -4px;
  align-self: flex-end;
}
.mascot-halo {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%);
  animation: haloPulse 3s ease-in-out infinite alternate;
  border-radius: 50%;
}
@keyframes haloPulse {
  from { transform: scale(0.85); opacity: 0.5; }
  to   { transform: scale(1.1);  opacity: 1;   }
}
.mascot-img {
  width: 100%; height: auto;
  display: block;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 12px 30px rgba(168,85,247,0.45));
  animation: mascotFloat 3.5s ease-in-out infinite;
}
@keyframes mascotFloat {
  0%,100% { transform: translateY(0)    rotate(0deg); }
  50%      { transform: translateY(-10px) rotate(1deg); }
}
.mascot-shadow {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 70%; height: 14px;
  background: rgba(168,85,247,0.3);
  border-radius: 50%;
  filter: blur(8px);
  animation: shadowPulse 3.5s ease-in-out infinite;
}
@keyframes shadowPulse {
  0%,100% { transform: translateX(-50%) scaleX(1)   ; opacity: 0.4; }
  50%      { transform: translateX(-50%) scaleX(0.7); opacity: 0.2; }
}

/* ─────────────────────────────────────────
   QUEST BANNER
───────────────────────────────────────── */
.quest-banner {
  position: relative;
  z-index: 1;
  margin: 16px 16px 0;
  background: linear-gradient(135deg, rgba(251,191,36,0.14), rgba(249,115,22,0.12));
  border: 1.5px solid rgba(251,191,36,0.3);
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.quest-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%);
  pointer-events: none;
}
.quest-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(251,191,36,0.2);
}

.quest-left { display: flex; align-items: center; gap: 12px; flex: 1; }
.quest-icon-wrap { position: relative; }
.quest-icon { font-size: 34px; display: block; animation: chestWiggle 1.8s ease-in-out infinite; }
@keyframes chestWiggle {
  0%,100% { transform: rotate(-5deg) scale(1);    }
  50%      { transform: rotate(5deg)  scale(1.08); }
}
.quest-ring {
  position: absolute;
  inset: -5px;
  border: 2px solid rgba(251,191,36,0.5);
  border-radius: 50%;
  animation: questRing 1.8s infinite;
}
@keyframes questRing {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

.quest-text { display: flex; flex-direction: column; gap: 2px; }
.quest-tag {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--gold);
}
.quest-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--white);
}

.quest-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  background: rgba(251,191,36,0.18);
  border-radius: 12px;
  padding: 6px 12px;
}
.reward-val  { font-size: 18px; font-weight: 900; color: var(--gold); line-height: 1; }
.reward-unit { font-size: 10px; font-weight: 700; color: var(--gold); opacity: 0.7; }
.quest-arrow { font-size: 24px; color: rgba(255,255,255,0.3); font-weight: 300; }

/* ─────────────────────────────────────────
   SECTIONS
───────────────────────────────────────── */
.section {
  position: relative;
  z-index: 1;
  padding: 24px 16px 0;
}
.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.section-icon { font-size: 18px; }
.section-title {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.85);
  margin: 0;
  text-transform: uppercase;
}

/* ─────────────────────────────────────────
   PRACTICE CARDS
───────────────────────────────────────── */
.practice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pcard {
  position: relative;
  border-radius: 22px;
  padding: 18px 14px 20px;
  cursor: pointer;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.1);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
}
.pcard:hover  {
  transform: translateY(-5px) scale(1.02);
}
.pcard:active { transform: translateY(1px) scale(0.99); }

/* Top-left shine */
.pcard-shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  border-radius: 22px 22px 60% 60%;
  pointer-events: none;
}

/* Bottom push shadow */
.pcard-bottom-shadow {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 6px;
  background: rgba(0,0,0,0.35);
  border-radius: 0 0 22px 22px;
}

/* Themes */
.pt-blue   { background: linear-gradient(145deg, #1e3a6e, #2563eb); box-shadow: 0 8px 0 #1a3060, 0 10px 30px rgba(37,99,235,0.35); }
.pt-red    { background: linear-gradient(145deg, #6b1010, #dc2626); box-shadow: 0 8px 0 #5a0e0e, 0 10px 30px rgba(220,38,38,0.35); }
.pt-teal   { background: linear-gradient(145deg, #0d4f5c, #0891b2); box-shadow: 0 8px 0 #0b3f4a, 0 10px 30px rgba(8,145,178,0.35); }
.pt-purple { background: linear-gradient(145deg, #3b1466, #9333ea); box-shadow: 0 8px 0 #2e1053, 0 10px 30px rgba(147,51,234,0.35); }

.pcard-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.pcard-icon { font-size: 36px; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4)); }
.pcard-badge {
  background: rgba(255,255,255,0.18);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 900;
  color: rgba(255,255,255,0.9);
  padding: 2px 8px;
  letter-spacing: 0.5px;
}
.pcard-badge-new { background: rgba(251,191,36,0.25); color: var(--gold); }

.pcard-label {
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 12px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.pcard-bar-track {
  height: 6px;
  background: rgba(0,0,0,0.3);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.pcard-bar-fill {
  height: 100%;
  background: rgba(255,255,255,0.85);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 0 8px rgba(255,255,255,0.5);
}

.pcard-steps { display: flex; gap: 4px; }
.pstep {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: rgba(255,255,255,0.18);
  transition: all 0.3s ease;
}
.pstep-done   { background: rgba(255,255,255,0.8); }
.pstep-active {
  background: rgba(255,255,255,1);
  box-shadow: 0 0 6px rgba(255,255,255,0.8);
  animation: stepGlow 1s infinite alternate;
}
@keyframes stepGlow {
  from { box-shadow: 0 0 4px rgba(255,255,255,0.6); }
  to   { box-shadow: 0 0 10px rgba(255,255,255,1);  }
}

/* ─────────────────────────────────────────
   BOOK CARDS
───────────────────────────────────────── */
.books-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.bcard {
  position: relative;
  border-radius: 18px;
  padding: 16px 10px 18px;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.1);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}
.bcard:hover  { transform: translateY(-4px) scale(1.03); }
.bcard:active { transform: translateY(1px); }

.bcard-shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 45%;
  background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%);
  border-radius: 18px 18px 60% 60%;
  pointer-events: none;
}
.bcard-bottom-shadow {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 5px;
  background: rgba(0,0,0,0.35);
  border-radius: 0 0 18px 18px;
}

.bt-green  { background: linear-gradient(145deg, #14532d, #16a34a); box-shadow: 0 6px 0 #10421f, 0 8px 24px rgba(22,163,74,0.35); }
.bt-orange { background: linear-gradient(145deg, #7c2d12, #ea580c); box-shadow: 0 6px 0 #63240e, 0 8px 24px rgba(234,88,12,0.35); }
.bt-blue   { background: linear-gradient(145deg, #1e3a8a, #2563eb); box-shadow: 0 6px 0 #1a3070, 0 8px 24px rgba(37,99,235,0.35); }

.bcard-icon  { font-size: 28px; margin-bottom: 6px; display: block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3)); }
.bcard-title { font-size: 13px; font-weight: 900; color: #fff; margin: 0 0 10px; }

.bcard-bar-track {
  height: 5px;
  background: rgba(0,0,0,0.3);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 6px;
}
.bcard-bar-fill {
  height: 100%;
  background: rgba(255,255,255,0.85);
  border-radius: 5px;
  transition: width 0.6s ease;
  box-shadow: 0 0 6px rgba(255,255,255,0.4);
}

.bcard-lock {
  font-size: 10px;
  font-weight: 800;
  color: rgba(255,255,255,0.65);
}
.bcard-prog {
  font-size: 10px;
  font-weight: 800;
  color: rgba(255,255,255,0.75);
}

/* ─────────────────────────────────────────
   STATS ROW
───────────────────────────────────────── */
.stats-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 24px 16px 0;
}

.scard {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 18px;
  padding: 16px 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s ease;
}
.scard:hover { transform: translateY(-2px); }
.scard-icon  { font-size: 22px; }
.scard-val   { font-size: 22px; font-weight: 900; color: var(--white); line-height: 1; }
.scard-label { font-size: 10px; font-weight: 700; color: var(--dim); letter-spacing: 0.5px; text-transform: uppercase; }
</style>