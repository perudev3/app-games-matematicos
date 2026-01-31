<template>
  <q-page class="chat-page">

    <!-- CONTENT -->
    <div class="chat-content">

      <!-- BIENVENIDA (solo si no hay mensajes) -->
      <template v-if="messages.length === 0">
        <div class="robot-container">
          <img src="/logo-sin-fondo.png" class="robot-img" />          
        </div>

        <h3 class="chat-title">Hola 👋</h3>
        <p class="chat-subtitle">
          Soy tu asistente de matemáticas.<br />
          Pregúntame lo que quieras.
        </p>
      </template>

      <!-- CHAT -->
      <div v-else class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.from === 'user' ? 'msg-user' : 'msg-ai'"
        >
          {{ msg.text }}
        </div>
      </div>

    </div>

    <!-- INPUT -->
    <div class="chat-input">
      <q-input
        v-model="message"
        outlined
        placeholder="Escribe tu pregunta…"
        dense
        class="input"
        @keyup.enter="sendMessage"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            icon="send"
            class="send-btn"
            :loading="loading"
            @click="sendMessage"
          />
        </template>
      </q-input>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

const $q = useQuasar()

const message = ref('')
const loading = ref(false)
const messages = ref([])
const conversationId = ref(null)

const sendMessage = async () => {
  if (!message.value.trim() || !conversationId.value) return

  const userText = message.value
  message.value = ''
  loading.value = true

  // Mostrar y guardar mensaje del usuario
  messages.value.push({ from: 'user', text: userText })
  await saveMessage('user', userText)

  try {
    const res = await fetch('http://localhost:3333/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })

    const data = await res.json() // 👈 data DEFINIDA AQUÍ

    // Mostrar y guardar respuesta IA
    messages.value.push({ from: 'ai', text: data.reply })
    await saveMessage('ai', data.reply)

  } catch (err) {
    console.error(err)

    messages.value.push({
      from: 'ai',
      text: '❌ Error al procesar tu mensaje'
    })
  } finally {
    loading.value = false
  }
}

const createConversation = async () => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({ user_id: (await supabase.auth.getUser()).data.user.id })
    .select()
    .single()

  console.log('Conversation ID:', conversationId.value)

  if (!error) conversationId.value = data.id  
}

const saveMessage = async (sender, text) => {
  await supabase.from('ai_messages').insert({
    conversation_id: conversationId.value,
    sender,
    message: text
  })
}

onMounted(() => {
  createConversation()
})
</script>