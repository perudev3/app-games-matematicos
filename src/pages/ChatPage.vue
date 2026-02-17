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
    const res = await fetch('http://localhost:3000/api', {
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
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({ user_id: (await supabase.auth.getUser()).data.user.id })
    .select()
    .single()
  if (!error) conversationId.value = data.id
}

const saveMessage = async (sender, text) => {
  await supabase.from('ai_messages').insert({
    conversation_id: conversationId.value,
    sender,
    message: text
  })
}

onMounted(() => createConversation())
</script>

<style scoped>
/* =====================
   BASE
===================== */
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #11314f 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: 'Nunito', 'Poppins', sans-serif;
}

/* =====================
   BUBBLES
===================== */
.bg-bubbles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
.bubble { position: absolute; border-radius: 50%; opacity: 0.12; animation: floatUp 8s infinite ease-in-out; }
.bubble-1  { width:50px;  height:50px;  background:#ff6b9d; left:5%;  bottom:-50px;  animation-delay:0s;   animation-duration:9s; }
.bubble-2  { width:35px;  height:35px;  background:#ffcc00; left:18%; bottom:-35px;  animation-delay:2s;   animation-duration:7s; }
.bubble-3  { width:65px;  height:65px;  background:#00e5ff; left:30%; bottom:-65px;  animation-delay:4s;   animation-duration:11s; }
.bubble-4  { width:28px;  height:28px;  background:#a855f7; left:50%; bottom:-28px;  animation-delay:1s;   animation-duration:8s; }
.bubble-5  { width:45px;  height:45px;  background:#00ff88; left:65%; bottom:-45px;  animation-delay:3s;   animation-duration:10s; }
.bubble-6  { width:55px;  height:55px;  background:#ff9500; left:78%; bottom:-55px;  animation-delay:5s;   animation-duration:6s; }
.bubble-7  { width:40px;  height:40px;  background:#ff6b9d; left:88%; bottom:-40px;  animation-delay:1.5s; animation-duration:12s; }
.bubble-8  { width:30px;  height:30px;  background:#ffcc00; left:42%; bottom:-30px;  animation-delay:6s;   animation-duration:8s; }
.bubble-9  { width:60px;  height:60px;  background:#a855f7; left:12%; bottom:-60px;  animation-delay:2.5s; animation-duration:13s; }
.bubble-10 { width:38px;  height:38px;  background:#00e5ff; left:58%; bottom:-38px;  animation-delay:0.8s; animation-duration:9s; }
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1);       opacity: 0.12; }
  50%  { transform: translateY(-50vh) scale(1.1); opacity: 0.18; }
  100% { transform: translateY(-110vh) scale(0.8);opacity: 0; }
}

/* =====================
   HEADER
===================== */
.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.12);
  z-index: 10;
  position: relative;
}

.avatar-ring {
  position: relative;
  width: 46px; height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899, #ff9500);
  padding: 3px;
  animation: rotateRing 4s linear infinite;
}
@keyframes rotateRing {
  from { filter: hue-rotate(0deg); }
  to   { filter: hue-rotate(360deg); }
}
.avatar-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #1a0533;
  display: block;
}
.avatar-status {
  position: absolute;
  bottom: 1px; right: 1px;
  width: 11px; height: 11px;
  background: #00e676;
  border-radius: 50%;
  border: 2px solid #1a0533;
  animation: statusPulse 2s infinite;
}
@keyframes statusPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,230,118,0.6); }
  50%      { box-shadow: 0 0 0 5px rgba(0,230,118,0); }
}

.header-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.header-name { font-size: 16px; font-weight: 900; color: #fff; }
.header-status { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 5px; }
.status-dot {
  width: 7px; height: 7px;
  background: #00e676;
  border-radius: 50%;
  transition: background 0.3s;
}
.status-dot.typing { background: #ffcc00; animation: blink 0.7s infinite alternate; }
@keyframes blink { from { opacity: 1; } to { opacity: 0.3; } }

.header-xp {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(168,85,247,0.2);
  border: 1px solid rgba(168,85,247,0.4);
  border-radius: 50px;
  padding: 4px 12px;
}
.xp-gem { font-size: 16px; }
.xp-num { font-size: 14px; font-weight: 900; color: #c084fc; }

/* =====================
   SCROLL AREA
===================== */
.chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  position: relative;
  z-index: 1;
  scroll-behavior: smooth;
}
.chat-scroll::-webkit-scrollbar { width: 4px; }
.chat-scroll::-webkit-scrollbar-track { background: transparent; }
.chat-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.4); border-radius: 4px; }

/* =====================
   WELCOME SCREEN
===================== */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.welcome-mascot-wrap {
  position: relative;
  margin-bottom: 20px;
}
.mascot-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s infinite alternate;
}
@keyframes glowPulse {
  from { transform: scale(0.9); opacity: 0.6; }
  to   { transform: scale(1.1); opacity: 1; }
}
.welcome-mascot {
  width: 110px; height: 110px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255,255,255,0.05);
  border: 3px solid rgba(168,85,247,0.5);
  position: relative;
  z-index: 1;
  animation: floatMascot 3s ease-in-out infinite;
}
@keyframes floatMascot {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}

.welcome-title {
  font-size: 28px; font-weight: 900;
  color: #fff; margin: 0 0 8px;
  text-shadow: 0 0 20px rgba(168,85,247,0.6);
}
.welcome-subtitle {
  font-size: 15px; color: rgba(255,255,255,0.7);
  line-height: 1.6; margin: 0 0 24px;
  font-weight: 600;
}

.quick-chips {
  display: flex; flex-wrap: wrap;
  gap: 8px; justify-content: center;
}
.chip {
  border: none;
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  backdrop-filter: blur(8px);
}
.chip:hover {
  background: rgba(168,85,247,0.3);
  border-color: rgba(168,85,247,0.6);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 15px rgba(168,85,247,0.3);
}

/* =====================
   MESSAGES
===================== */
.messages-list { display: flex; flex-direction: column; gap: 12px; }

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.msg-row-user { flex-direction: row-reverse; }

.msg-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(168,85,247,0.4);
  display: flex; align-items: center; justify-content: center;
}
.msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-avatar { font-size: 18px; border-color: rgba(236,72,153,0.4); background: rgba(236,72,153,0.1); }

.msg-bubble {
  max-width: 72%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  word-break: break-word;
}

.bubble-ai {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255,255,255,0.15);
  color: #fff;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.bubble-user {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 20px rgba(168,85,247,0.4);
}

/* Typing indicator */
.bubble-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}
.bubble-typing span {
  width: 8px; height: 8px;
  background: rgba(255,255,255,0.6);
  border-radius: 50%;
  animation: typingDot 1.2s infinite ease-in-out;
}
.bubble-typing span:nth-child(2) { animation-delay: 0.2s; }
.bubble-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingDot {
  0%,100% { transform: scale(0.6); opacity: 0.4; }
  50%      { transform: scale(1.2); opacity: 1; }
}

/* =====================
   INPUT AREA
===================== */
.chat-input-area {
  padding: 12px 16px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.1);
  position: relative;
  z-index: 10;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 50px;
  padding: 6px 6px 6px 18px;
  transition: border-color 0.3s;
}
.input-wrapper:focus-within {
  border-color: rgba(168,85,247,0.6);
  box-shadow: 0 0 20px rgba(168,85,247,0.2);
}

.chat-input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
}
.chat-input-field::placeholder { color: rgba(255,255,255,0.4); }
.chat-input-field:disabled { opacity: 0.5; }

.send-btn {
  width: 42px; height: 42px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.15);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  flex-shrink: 0;
}
.send-btn.active {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  box-shadow: 0 4px 15px rgba(168,85,247,0.5);
  transform: scale(1.05);
}
.send-btn.active:hover {
  transform: scale(1.12) rotate(-10deg);
  box-shadow: 0 6px 20px rgba(168,85,247,0.7);
}
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.send-loading {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* =====================
   TRANSITIONS
===================== */
.pop-enter-active { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.pop-leave-active { animation: popIn 0.3s reverse; }
@keyframes popIn {
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
.msg-pop-enter-active { animation: msgIn 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.msg-pop-enter-from  { transform: translateY(16px) scale(0.9); opacity: 0; }
</style>