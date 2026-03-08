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

    <!-- ══════════════════════════════
        VR REWARDS
    ══════════════════════════════ -->
    <section class="section">
      <div class="section-head">
        <span class="section-icon">🥽</span>
        <h2 class="section-title">Realidad Virtual</h2>
      </div>

      <div class="vr-card" @click="openVR">
        <div class="vr-icon">🏆</div>
        <div class="vr-text">
          <span class="vr-title">Ver mis recompensas</span>
          <span class="vr-sub">Explora tus medallas en 3D</span>
        </div>
        <div class="vr-arrow">›</div>
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

const openVR = () => {
  router.push('/vr-rewards')
}

const startPractice = (key) => router.push({ path: '/practice', query: { practice: key, grade: 6 } })
const openBook      = (key) => router.push({ path: '/practice', query: { book: key,     grade: 6 } })
const startDaily    = ()    => router.push({ path: '/practice', query: { practice: 'mixto', grade: 6 } })

onMounted(loadUserData)
</script>