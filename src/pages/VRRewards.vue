<template>
  <div class="vr-container">

    <a-scene background="color: #0f172a" vr-mode-ui="enabled: true">

        <!-- cámara -->
        <a-entity camera look-controls position="0 1.6 0">

            <a-entity
                cursor="fuse: true; fuseTimeout: 1500"
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
                material="color: white; shader: flat">
            </a-entity>

        </a-entity>

      <!-- título -->
      <a-text
        value="Sala de Recompensas"
        position="0 2 -4"
        align="center"
        color="#FFD700"
        width="6"
      ></a-text>

      <!-- medalla 1 -->
      <a-cylinder
        position="-2 1 -4"
        radius="0.4"
        height="0.1"
        color="gold"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
      ></a-cylinder>

      <a-text
        value="Nivel 1"
        position="-2 0.6 -4"
        align="center"
        width="4"
      ></a-text>

      <!-- medalla 2 -->
      <a-cylinder
        position="0 1 -4"
        radius="0.4"
        height="0.1"
        color="silver"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
      ></a-cylinder>

      <a-text
        value="Reto Logico"
        position="0 0.6 -4"
        align="center"
        width="4"
      ></a-text>

      <!-- medalla 3 -->
      <a-cylinder
        position="2 1 -4"
        radius="0.4"
        height="0.1"
        color="#cd7f32"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
      ></a-cylinder>

      <a-text
        value="Geometria"
        position="2 0.6 -4"
        align="center"
        width="4"
      ></a-text>

        <a-box
        position="0 1 -2"
        depth="0.2"
        height="0.5"
        width="1.5"
        color="#ef4444"
        class="clickable"
        exit-vr>
        </a-box>

        <a-text
        value="Salir"
        position="0 1 -1.8"
        align="center"
        color="white"
        width="4">
        </a-text>

      <!-- piso -->
      <a-plane
        rotation="-90 0 0"
        width="20"
        height="20"
        color="#111827"
      ></a-plane>

    </a-scene>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (!window.AFRAME) {
    const script = document.createElement('script')
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js'
    script.async = true
    document.head.appendChild(script)
  }

  setTimeout(() => {
    if (window.AFRAME) {
      AFRAME.registerComponent('exit-vr', {
        init: function () {
          this.el.addEventListener('click', () => {
            const scene = document.querySelector('a-scene')
            if (scene.is('vr-mode')) {
              scene.exitVR()
            }
          })
        }
      })
    }
  }, 500)
})
</script>