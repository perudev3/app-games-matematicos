<template>
  <q-page class="chat-page">

    <!-- TOP BAR -->
    <div class="top-bar">
      <q-btn
        flat
        round
        icon="arrow_back"
        class="icon-btn"
        @click="$router.back()"
      />

      <span class="top-title">Asistente IA</span>

      <div style="width: 40px"></div>
    </div>

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

<style scoped>
.chat-page {
  background: linear-gradient(180deg, #f6f7f9 0%, #eef1f6 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* TOP BAR */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.top-title {
  font-size: 15px;
  font-weight: 600;
  color: #2e2e2e;
}

.icon-btn {
  color: #2e2e2e;
}

/* CONTENT */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;
}

/* ROBOT */
.robot-container {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.robot-img {
  width: 44px;
}

/* TEXT */
.chat-title {
  font-size: 17px;
  font-weight: 600;
  color: #2e2e2e;
  margin-bottom: 6px;
  text-align: center;
}

.chat-subtitle {
  font-size: 13px;
  color: #8a8a8a;
  line-height: 1.45;
  max-width: 260px;
  text-align: center;
  margin: 0 auto;
}

/* MESSAGES */
.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.msg-user {
  align-self: flex-end;
  background: #2f80ed;
  color: white;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
  max-width: 80%;
  font-size: 13px;
}

.msg-ai {
  align-self: flex-start;
  background: #ffffff;
  color: #2e2e2e;
  padding: 10px 14px;
  border-radius: 16px 16px 16px 4px;
  max-width: 80%;
  font-size: 13px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

/* INPUT */
.chat-input {
  padding: 12px 16px 18px;
}

.input :deep(.q-field__control) {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.send-btn {
  color: #2f80ed;
}
</style>
