<template>
  <div class="vr-container">
    <div v-if="!aframeReady" class="loading-screen">
      <div class="loader-ring"></div>
      <p>Cargando experiencia VR...</p>
    </div>

    <a-scene
      v-if="aframeReady"
      background="color: #0a0f1e"
      vr-mode-ui="enabled: true"
      renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true"
      loading-screen="dotsColor: #C9A24D; backgroundColor: #0a0f1e"
    >
      <!-- Iluminación -->
      <a-light type="ambient" color="#1a1f3a" intensity="0.8"></a-light>
      <a-light type="point" color="#C9A24D" intensity="1.5" position="0 3 -3"></a-light>
      <a-light type="point" color="#4488ff" intensity="0.8" position="-4 2 -4"></a-light>
      <a-light type="point" color="#ff4488" intensity="0.8" position="4 2 -4"></a-light>
      <!-- Flash al tocar medalla -->
      <a-light type="point" id="reward-flash" color="#ffffff" intensity="0" position="0 2 -1"></a-light>

      <!-- Cámara -->
      <a-entity camera look-controls="pointerLockEnabled: false"
        position="0 1.6 0" wasd-controls="enabled: false">
        <a-entity
          cursor="fuse: true; fuseTimeout: 1200"
          position="0 0 -1"
          geometry="primitive: ring; radiusInner: 0.014; radiusOuter: 0.022"
          material="color: #C9A24D; shader: flat; opacity: 0.9"
          animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
          raycaster="far: 20; objects: .clickable"
        ></a-entity>
      </a-entity>

      <!-- ═══ TÍTULO ═══ -->
      <a-entity position="0 3.2 -5">
        <a-text value="★  Sala de Logros  ★" align="center" color="#FFD700" width="7" font="exo2bold"
          animation="property: position; from: 0 0.15 0; to: 0 -0.15 0; dir: alternate; loop: true; dur: 2500; easing: easeInOutSine">
        </a-text>
      </a-entity>
      <a-plane position="0 2.85 -4.98" width="3.5" height="0.015"
        color="#C9A24D" material="shader: flat; opacity: 0.8"></a-plane>

      <!-- ═══ PEDESTALES ═══ -->
      <a-cylinder position="-2.5 0.3 -5" radius="0.55" height="0.6" color="#1a1230" material="roughness: 0.2; metalness: 0.9"></a-cylinder>
      <a-cylinder position="-2.5 0.65 -5" radius="0.48" height="0.1" color="#C9A24D" material="roughness: 0.1; metalness: 1"></a-cylinder>
      <a-cylinder position="0 0.3 -5" radius="0.55" height="0.6" color="#1a1230" material="roughness: 0.2; metalness: 0.9"></a-cylinder>
      <a-cylinder position="0 0.65 -5" radius="0.48" height="0.1" color="#aaaaaa" material="roughness: 0.1; metalness: 1"></a-cylinder>
      <a-cylinder position="2.5 0.3 -5" radius="0.55" height="0.6" color="#1a1230" material="roughness: 0.2; metalness: 0.9"></a-cylinder>
      <a-cylinder position="2.5 0.65 -5" radius="0.48" height="0.1" color="#cd7f32" material="roughness: 0.1; metalness: 1"></a-cylinder>

      <!-- ═══ MEDALLA ORO ═══ -->
      <a-entity id="medal-gold" position="-2.5 1.35 -5" class="clickable"
        medal-reward="medalColor: #FFD700; title: Nivel 1 Completado; desc: Maestro del conocimiento basico.; stars: 3; particleColor: #FFD700">
        <a-torus radius="0.52" radius-tubular="0.02" color="#FFD700"
          material="shader: flat; opacity: 0.5"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
          animation__pulse="property: material.opacity; from: 0.3; to: 0.9; loop: true; dir: alternate; dur: 900">
        </a-torus>
        <a-cylinder radius="0.42" height="0.12" color="#FFD700"
          material="roughness: 0.05; metalness: 1"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear"
          animation__bob="property: position; from: 0 0 0; to: 0 0.12 0; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine">
        </a-cylinder>
        <a-entity position="0 0.08 0">
          <a-text value="★" align="center" color="#fff8dc" width="2.5"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear"></a-text>
        </a-entity>
      </a-entity>
      <a-entity position="-2.5 0.38 -4.45">
        <a-plane width="1.5" height="0.55" color="#0d0920" material="opacity: 0.85; transparent: true"></a-plane>
        <a-text value="Nivel 1\nMaestro" align="center" color="#FFD700" width="3.5" position="0 0 0.01"></a-text>
      </a-entity>

      <!-- ═══ MEDALLA PLATA ═══ -->
      <a-entity id="medal-silver" position="0 1.35 -5" class="clickable"
        medal-reward="medalColor: #C0C0C0; title: Reto Logico Superado; desc: Experto en pensamiento critico.; stars: 2; particleColor: #aaddff">
        <a-torus radius="0.52" radius-tubular="0.02" color="#C0C0C0"
          material="shader: flat; opacity: 0.5"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
          animation__pulse="property: material.opacity; from: 0.2; to: 0.8; loop: true; dir: alternate; dur: 1100">
        </a-torus>
        <a-cylinder radius="0.42" height="0.12" color="#d0d0d0"
          material="roughness: 0.05; metalness: 1"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 4500; easing: linear"
          animation__bob="property: position; from: 0 0 0; to: 0 0.12 0; dir: alternate; loop: true; dur: 2100; easing: easeInOutSine">
        </a-cylinder>
        <a-entity position="0 0.08 0">
          <a-text value="⬡" align="center" color="#e0e0e0" width="2.5"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4500; easing: linear"></a-text>
        </a-entity>
      </a-entity>
      <a-entity position="0 0.38 -4.45">
        <a-plane width="1.5" height="0.55" color="#0d0920" material="opacity: 0.85; transparent: true"></a-plane>
        <a-text value="Reto Logico\nExperto" align="center" color="#C0C0C0" width="3.5" position="0 0 0.01"></a-text>
      </a-entity>

      <!-- ═══ MEDALLA BRONCE ═══ -->
      <a-entity id="medal-bronze" position="2.5 1.35 -5" class="clickable"
        medal-reward="medalColor: #cd7f32; title: Geometria Dominada; desc: Aprendiz de formas y espacios.; stars: 1; particleColor: #ffaa44">
        <a-torus radius="0.52" radius-tubular="0.02" color="#cd7f32"
          material="shader: flat; opacity: 0.5"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
          animation__pulse="property: material.opacity; from: 0.2; to: 0.8; loop: true; dir: alternate; dur: 1300">
        </a-torus>
        <a-cylinder radius="0.42" height="0.12" color="#cd7f32"
          material="roughness: 0.1; metalness: 0.9"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear"
          animation__bob="property: position; from: 0 0 0; to: 0 0.12 0; dir: alternate; loop: true; dur: 2400; easing: easeInOutSine">
        </a-cylinder>
        <a-entity position="0 0.08 0">
          <a-text value="▲" align="center" color="#f0a050" width="2.5"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear"></a-text>
        </a-entity>
      </a-entity>
      <a-entity position="2.5 0.38 -4.45">
        <a-plane width="1.5" height="0.55" color="#0d0920" material="opacity: 0.85; transparent: true"></a-plane>
        <a-text value="Geometria\nAprendiz" align="center" color="#cd7f32" width="3.5" position="0 0 0.01"></a-text>
      </a-entity>

      <!-- ═══════════════════════════════════════
           PANEL DE RECOMPENSA (oculto por defecto)
      ════════════════════════════════════════ -->
      <a-entity id="reward-panel" position="0 1.7 -2.2" visible="false">
        <!-- Fondo -->
        <a-plane id="panel-bg" width="2.8" height="2.1" color="#050d20"
          material="opacity: 0.97; transparent: true; side: double"></a-plane>
        <!-- Bordes -->
        <a-plane id="panel-border-top" position="0 1.0 0.01" width="2.8" height="0.06"
          color="#FFD700" material="shader: flat"></a-plane>
        <a-plane id="panel-border-bot" position="0 -1.0 0.01" width="2.8" height="0.06"
          color="#FFD700" material="shader: flat"></a-plane>
        <!-- Icono -->
        <a-text id="panel-icon" value="🏆" align="center"
          position="0 0.65 0.02" width="3"
          animation__rock="property: rotation; from: 0 -15 0; to: 0 15 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine">
        </a-text>
        <!-- Textos -->
        <a-text id="panel-title" value="¡LOGRO DESBLOQUEADO!" align="center"
          position="0 0.22 0.02" color="#FFD700" width="5"></a-text>
        <a-text id="panel-name" value="" align="center"
          position="0 -0.1 0.02" color="#ffffff" width="4.5"></a-text>
        <a-text id="panel-desc" value="" align="center"
          position="0 -0.38 0.02" color="#aabbcc" width="4" wrap-count="28"></a-text>
        <a-text id="panel-stars" value="" align="center"
          position="0 -0.65 0.02" color="#FFD700" width="5"></a-text>
        <!-- Botón cerrar -->
        <a-entity id="panel-close" position="0 -0.87 0.02" class="clickable" close-panel>
          <a-plane width="1.4" height="0.28" color="#22c55e"
            material="opacity: 0.92; transparent: true"
            animation__hov="property: scale; from: 1 1 1; to: 1.06 1.06 1.06; startEvents: mouseenter; dur: 150"
            animation__unho="property: scale; from: 1.06 1.06 1.06; to: 1 1 1; startEvents: mouseleave; dur: 150">
          </a-plane>
          <a-text value="✓  ACEPTAR" align="center" color="white" width="3.5" position="0 0 0.01"></a-text>
        </a-entity>
      </a-entity>

      <!-- ═══ PARTÍCULAS AMBIENTE ═══ -->
      <a-sphere position="-3.5 2.5 -5.5" radius="0.04" color="#FFD700" material="shader: flat"
        animation="property: position; from: -3.5 2.5 -5.5; to: -3.5 3.5 -5.5; dir: alternate; loop: true; dur: 3200; easing: easeInOutSine"
        animation__fade="property: material.opacity; from: 1; to: 0.1; dir: alternate; loop: true; dur: 3200"></a-sphere>
      <a-sphere position="3.5 1.8 -4.5" radius="0.04" color="#4488ff" material="shader: flat"
        animation="property: position; from: 3.5 1.8 -4.5; to: 3.5 2.8 -4.5; dir: alternate; loop: true; dur: 2700; easing: easeInOutSine"
        animation__fade="property: material.opacity; from: 1; to: 0.1; dir: alternate; loop: true; dur: 2700"></a-sphere>
      <a-sphere position="1 3 -5.5" radius="0.03" color="#ff4488" material="shader: flat"
        animation="property: position; from: 1 3 -5.5; to: 1 4 -5.5; dir: alternate; loop: true; dur: 4000; easing: easeInOutSine"
        animation__fade="property: material.opacity; from: 0.9; to: 0.1; dir: alternate; loop: true; dur: 4000"></a-sphere>
      <a-sphere position="-1 2.2 -4" radius="0.035" color="#C9A24D" material="shader: flat"
        animation="property: position; from: -1 2.2 -4; to: -1 3.2 -4; dir: alternate; loop: true; dur: 3500; easing: easeInOutSine"
        animation__fade="property: material.opacity; from: 0.9; to: 0.1; dir: alternate; loop: true; dur: 3500"></a-sphere>

      <!-- ═══ BOTÓN SALIR ═══ -->
      <a-entity position="0 0.85 -2.5" class="clickable" exit-vr>
        <a-plane width="1.6" height="0.45" color="#ef4444"
          material="roughness: 0.3; metalness: 0.5; opacity: 0.95"
          class="clickable"
          animation__hov="property: scale; from: 1 1 1; to: 1.07 1.07 1.07; startEvents: mouseenter; dur: 200"
          animation__unho="property: scale; from: 1.07 1.07 1.07; to: 1 1 1; startEvents: mouseleave; dur: 200">
        </a-plane>
        <a-text value="✕  Salir VR" align="center" color="white" width="4" position="0 0 0.01"></a-text>
      </a-entity>

      <!-- Piso + paredes -->
      <a-plane rotation="-90 0 0" width="20" height="20" color="#070d1a"
        material="roughness: 0.2; metalness: 0.5"></a-plane>
      <a-entity position="0 0.001 0" rotation="-90 0 0">
        <a-plane width="20" height="20"
          material="color: #1a2a4a; wireframe: true; opacity: 0.2; transparent: true"></a-plane>
      </a-entity>
      <a-plane position="-6 2.5 -5" rotation="0 90 0" width="12" height="8"
        color="#0d1528" material="opacity: 0.6; transparent: true"></a-plane>
      <a-plane position="6 2.5 -5" rotation="0 -90 0" width="12" height="8"
        color="#0d1528" material="opacity: 0.6; transparent: true"></a-plane>
      <a-plane position="0 2.5 -8" width="14" height="8"
        color="#0a0f1e" material="opacity: 0.8; transparent: true"></a-plane>

    </a-scene>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const aframeReady = ref(false)
const router = useRouter()

function onVrNavigate (e) {
  router.push(e.detail)
}

function registerComponents () {

  /* ── exit-vr ── */
  if (!AFRAME.components['exit-vr']) {
    AFRAME.registerComponent('exit-vr', {
      init () {
        this.el.addEventListener('click', () => {
          const scene = document.querySelector('a-scene')
          const navigate = () => {
            // Emitir evento global que Vue Router escucha
            window.dispatchEvent(new CustomEvent('vr-navigate', { detail: '/app/dashboard' }))
          }
          if (scene && scene.is('vr-mode')) {
            scene.exitVR()
            // Esperar a que salga del modo VR antes de navegar
            scene.addEventListener('exit-vr', navigate, { once: true })
          } else {
            navigate()
          }
        })
      }
    })
  }

  /* ── close-panel ── */
  if (!AFRAME.components['close-panel']) {
    AFRAME.registerComponent('close-panel', {
      init () {
        this.el.addEventListener('click', () => {
          const panel = document.getElementById('reward-panel')
          if (!panel) return
          panel.setAttribute('animation__close',
            'property: scale; from: 1 1 1; to: 0.01 0.01 0.01; dur: 350; easing: easeInBack')
          setTimeout(() => {
            panel.setAttribute('visible', 'false')
            panel.setAttribute('scale', '1 1 1')
            // Eliminar confeti sobrante
            document.querySelectorAll('.confetti-particle').forEach(p => {
              if (p.parentNode) p.parentNode.removeChild(p)
            })
          }, 360)
        })
      }
    })
  }

  /* ══════════════════════════════════════════
     medal-reward  —  componente principal
  ══════════════════════════════════════════ */
  if (!AFRAME.components['medal-reward']) {
    AFRAME.registerComponent('medal-reward', {
      schema: {
        medalColor:    { type: 'string', default: '#FFD700' },
        title:         { type: 'string', default: 'Logro desbloqueado' },
        desc:          { type: 'string', default: 'Has completado el desafio.' },
        stars:         { type: 'number', default: 3 },
        particleColor: { type: 'string', default: '#FFD700' }
      },

      init () {
        this.el.addEventListener('click', () => this.triggerReward())
      },

      triggerReward () {
        const { data, el } = this
        const scene = el.sceneEl

        /* 1 — Flash de luz */
        const flash = document.getElementById('reward-flash')
        if (flash) {
          flash.setAttribute('light', `color: ${data.medalColor}; intensity: 7`)
          flash.setAttribute('animation__flash',
            'property: light.intensity; from: 7; to: 0; dur: 800; easing: easeOutQuad')
        }

        /* 2 — Explosión de escala (burst) en la medalla */
        el.removeAttribute('animation__burst')
        el.removeAttribute('animation__rebound')
        el.setAttribute('animation__burst',
          'property: scale; from: 1 1 1; to: 1.7 1.7 1.7; dur: 200; easing: easeOutBack')
        setTimeout(() => {
          el.setAttribute('animation__rebound',
            'property: scale; from: 1.7 1.7 1.7; to: 1 1 1; dur: 500; easing: easeInOutElastic')
        }, 210)

        /* Spin rápido del disco de la medalla */
        const disc = el.querySelector('a-cylinder')
        if (disc) {
          disc.removeAttribute('animation')
          disc.removeAttribute('animation__spin_fast')
          disc.setAttribute('animation__spin_fast',
            'property: rotation; from: 0 0 0; to: 0 1080 0; dur: 700; easing: easeOutCubic')
          setTimeout(() => {
            disc.removeAttribute('animation__spin_fast')
            disc.setAttribute('animation',
              'property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear')
          }, 750)
        }

        /* 3 — Onda de choque */
        this.spawnShockwave(el.object3D.position, data.medalColor)

        /* 4 — Confeti */
        this.spawnConfetti(el.object3D.position, data.particleColor, data.medalColor)

        /* 5 — Panel de recompensa (con pequeño delay para que el burst se vea) */
        setTimeout(() => this.showPanel(data), 480)
      },

      /* Anillo de onda expansiva */
      spawnShockwave (origin, color) {
        const scene = this.el.sceneEl
        const wave  = document.createElement('a-torus')
        wave.setAttribute('position', `${origin.x} ${origin.y} ${origin.z}`)
        wave.setAttribute('rotation', '90 0 0')
        wave.setAttribute('radius', '0.15')
        wave.setAttribute('radius-tubular', '0.018')
        wave.setAttribute('color', color)
        wave.setAttribute('material', 'shader: flat; opacity: 0.95; transparent: true')
        wave.setAttribute('animation__expand',
          'property: scale; from: 0.3 0.3 0.3; to: 7 7 7; dur: 750; easing: easeOutQuad')
        wave.setAttribute('animation__fade',
          'property: material.opacity; from: 0.95; to: 0; dur: 750; easing: easeOutQuad')
        scene.appendChild(wave)
        setTimeout(() => { if (wave.parentNode) wave.parentNode.removeChild(wave) }, 800)
      },

      /* Lluvia de confeti radial */
      spawnConfetti (origin, color1, color2) {
        const scene  = this.el.sceneEl
        const colors = [color1, color2, '#ffffff', '#ff4488', '#44aaff', '#aaffaa']
        const count  = 26

        for (let i = 0; i < count; i++) {
          const p      = document.createElement('a-sphere')
          p.classList.add('confetti-particle')

          const r     = 0.03 + Math.random() * 0.05
          const color = colors[Math.floor(Math.random() * colors.length)]
          const angle = Math.random() * Math.PI * 2
          const up    = 0.6 + Math.random() * 2.0
          const lat   = 0.8 + Math.random() * 2.2

          const ox = origin.x + (Math.random() - 0.5) * 0.3
          const oy = origin.y
          const oz = origin.z + (Math.random() - 0.5) * 0.3

          const tx = ox + Math.cos(angle) * lat
          const ty = oy + up
          const tz = oz + Math.sin(angle) * lat

          const flyDur  = 400 + Math.random() * 500
          const fallDur = 500 + Math.random() * 500
          const delay   = flyDur + Math.random() * 200

          p.setAttribute('position', `${ox} ${oy} ${oz}`)
          p.setAttribute('radius', r)
          p.setAttribute('color', color)
          p.setAttribute('material', 'shader: flat; opacity: 1; transparent: true')

          p.setAttribute('animation__fly',
            `property: position; from: ${ox} ${oy} ${oz}; to: ${tx} ${ty} ${tz}; dur: ${flyDur}; easing: easeOutCubic`)
          p.setAttribute('animation__fall',
            `property: position; from: ${tx} ${ty} ${tz}; to: ${tx} ${ty - up - 0.8} ${tz}; dur: ${fallDur}; delay: ${delay}; easing: easeInQuad`)
          p.setAttribute('animation__fade',
            `property: material.opacity; from: 1; to: 0; dur: 500; delay: ${delay + 100}; easing: easeInQuad`)

          scene.appendChild(p)
          setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p) }, delay + fallDur + 200)
        }
      },

      /* Panel flotante con la info del logro */
      showPanel (data) {
        const panel = document.getElementById('reward-panel')
        if (!panel) return

        // Detener pulso previo si lo hay
        panel.removeAttribute('animation__pulse')

        // Actualizar contenido
        const starsStr = '★'.repeat(data.stars) + '☆'.repeat(Math.max(0, 3 - data.stars))
        const icons    = { 1: '🥉', 2: '🥈', 3: '🏆' }

        document.getElementById('panel-icon').setAttribute('value', icons[data.stars] || '🏆')
        document.getElementById('panel-title').setAttribute('color', data.medalColor)
        document.getElementById('panel-name').setAttribute('value', data.title)
        document.getElementById('panel-desc').setAttribute('value', data.desc)
        document.getElementById('panel-stars').setAttribute('value', starsStr)
        document.getElementById('panel-border-top').setAttribute('color', data.medalColor)
        document.getElementById('panel-border-bot').setAttribute('color', data.medalColor)

        // Entrada con scale desde 0
        panel.setAttribute('scale', '0.01 0.01 0.01')
        panel.setAttribute('visible', 'true')
        panel.removeAttribute('animation__close')
        panel.setAttribute('animation__appear',
          'property: scale; from: 0.01 0.01 0.01; to: 1 1 1; dur: 520; easing: easeOutBack')

        // Pulso suave continuo
        setTimeout(() => {
          panel.setAttribute('animation__pulse',
            'property: scale; from: 1 1 1; to: 1.012 1.012 1.012; dir: alternate; loop: true; dur: 1300; easing: easeInOutSine')
        }, 530)
      }
    })
  }
}

function loadAFrame () {
  return new Promise((resolve) => {
    if (window.AFRAME) { resolve(); return }
    const s    = document.createElement('script')
    s.src      = 'https://aframe.io/releases/1.4.0/aframe.min.js'
    s.onload   = resolve
    s.onerror  = resolve
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  window.addEventListener('vr-navigate', onVrNavigate)
  await loadAFrame()
  if (window.AFRAME) registerComponents()
  aframeReady.value = true
})

onUnmounted(() => {
  window.removeEventListener('vr-navigate', onVrNavigate)
})
</script>

<style scoped>
.vr-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0f1e;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0a0f1e;
  color: #C9A24D;
  font-family: 'Segoe UI', sans-serif;
  gap: 20px;
}

.loader-ring {
  width: 60px;
  height: 60px;
  border: 4px solid #1a2a4a;
  border-top-color: #C9A24D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loading-screen p {
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

:global(a-scene) { width: 100% !important; height: 100% !important; }
:global(.a-cursor) { opacity: 1 !important; }
</style>