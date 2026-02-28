<template>
  <q-page class="chat-page">

    <!-- Floating background bubbles -->
    <div class="bg-bubbles">
      <span v-for="n in 10" :key="n" :class="`bubble bubble-${n}`"></span>
    </div>

    <!-- HEADER -->
    <div class="chat-header">
      <div class="header-avatar">
        <div class="avatar-ring">
          <img src="/logo-sin-fondo.png" class="avatar-img" />
          <span class="avatar-status"></span>
        </div>
      </div>
      <div class="header-info">
        <span class="header-name">MathBot 🤖</span>
        <span class="header-status">
          <span class="status-dot" :class="{ typing: loading }"></span>
          {{ loading ? 'Escribiendo...' : 'En línea' }}
        </span>
      </div>
      <div class="header-xp">
        <span class="xp-gem">💎</span>
        <span class="xp-num">{{ xpCount }}</span>
      </div>
    </div>

    <!-- MESSAGES AREA -->
    <div class="chat-scroll" ref="scrollRef">

      <!-- BIENVENIDA -->
      <transition name="pop">
        <div v-if="messages.length === 0" class="welcome-screen">
          <div class="welcome-mascot-wrap">
            <div class="mascot-glow"></div>
            <img src="/logo-sin-fondo.png" class="welcome-mascot" />
          </div>
          <h3 class="welcome-title">¡Hola! 👋</h3>
          <p class="welcome-subtitle">
            Soy tu asistente de matemáticas.<br />
            Pregúntame lo que quieras.
          </p>
          <div class="quick-chips">
            <button
              v-for="chip in quickSuggestions"
              :key="chip"
              class="chip"
              @click="sendQuick(chip)"
            >{{ chip }}</button>
          </div>
        </div>
      </transition>

      <!-- MENSAJES -->
      <div class="messages-list">
        <transition-group name="msg-pop">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="msg-row"
            :class="msg.from === 'user' ? 'msg-row-user' : 'msg-row-ai'"
          >
            <!-- Avatar IA -->
            <div v-if="msg.from === 'ai'" class="msg-avatar">
              <img src="/logo-sin-fondo.png" />
            </div>

            <div class="msg-bubble" :class="msg.from === 'user' ? 'bubble-user' : 'bubble-ai'">
              {{ msg.text }}
            </div>

            <!-- Avatar usuario -->
            <div v-if="msg.from === 'user'" class="msg-avatar user-avatar">
              🧑‍🎓
            </div>
          </div>
        </transition-group>

        <!-- Typing indicator -->
        <transition name="msg-pop">
          <div v-if="loading" class="msg-row msg-row-ai">
            <div class="msg-avatar">
              <img src="/logo-sin-fondo.png" />
            </div>
            <div class="msg-bubble bubble-ai bubble-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </transition>
      </div>

    </div>

    <!-- INPUT AREA -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <input
          v-model="message"
          class="chat-input-field"
          placeholder="Escribe tu pregunta…"
          :disabled="loading"
          @keyup.enter="sendMessage"
        />
        <button
          class="send-btn"
          :class="{ active: message.trim().length > 0 }"
          :disabled="loading || !message.trim()"
          @click="sendMessage"
        >
          <span v-if="!loading" class="send-icon">🚀</span>
          <span v-else class="send-loading"></span>
        </button>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from 'src/boot/supabase'

const message = ref('')
const loading = ref(false)
const messages = ref([])
const conversationId = ref(null)
const scrollRef = ref(null)
const xpCount = ref(0)

const quickSuggestions = [
  '¿Qué es una fracción?',
  'Explícame la multiplicación',
  '¿Cómo resuelvo restas?',
  'Pon un ejercicio difícil'
]

const scrollToBottom = async () => {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
  }
}

const sendQuick = (text) => {
  message.value = text
  sendMessage()
}

const sendMessage = async () => {
  if (!message.value.trim() || !conversationId.value) return

  const userText = message.value
  message.value = ''
  loading.value = true

  messages.value.push({ from: 'user', text: userText })
  await saveMessage('user', userText)
  scrollToBottom()

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
    const data = await res.json()
    messages.value.push({ from: 'ai', text: data.reply })
    await saveMessage('ai', data.reply)
    xpCount.value += 10
  } catch (err) {
    console.error(err)
    messages.value.push({ from: 'ai', text: '❌ Error al procesar tu mensaje' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const createConversation = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error obteniendo usuario:', userError)
    return
  }

  const userId = userData.user?.id

  if (!userId) {
    console.error('No hay usuario autenticado')
    return
  }

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({ user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('Error creando conversación:', error)
    return
  }

  console.log('Conversación creada correctamente:', data)
  conversationId.value = data.id
}

const saveMessage = async (sender, text) => {
  if (!conversationId.value) {
    console.error('❌ conversationId es null o undefined')
    return
  }

  console.log('💾 Guardando mensaje con conversationId:', conversationId.value)

  const { data, error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId.value,
      sender,
      message: text
    })
    .select()

  if (error) {
    console.error('❌ Error guardando mensaje:', error)
    return
  }

  console.log('✅ Mensaje guardado correctamente:', data)
}

onMounted(async () => {
  await createConversation()
})
</script>