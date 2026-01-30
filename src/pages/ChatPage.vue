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

      <!-- ROBOT -->
      <div class="robot-container">
        <img src="/logo-sin-fondo.png" class="robot-img" />
      </div>

      <h3 class="chat-title">Hola 👋</h3>
      <p class="chat-subtitle">
        Soy tu asistente de matemáticas.<br />
        Pregúntame lo que quieras.
      </p>

    </div>

    <!-- INPUT -->
    <div class="chat-input">
      <q-input
        outlined
        placeholder="Escribe tu pregunta…"
        dense
        class="input"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            icon="send"
            class="send-btn"
          />
        </template>
      </q-input>
    </div>

  </q-page>
</template>

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
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  text-align: center;
}

/* ROBOT */
.robot-container {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.robot-img {
  width: 44px;
  height: auto;
}

/* TEXT */
.chat-title {
  font-size: 17px;
  font-weight: 600;
  color: #2e2e2e;
  margin-bottom: 6px;
}

.chat-subtitle {
  font-size: 13px;
  color: #8a8a8a;
  line-height: 1.45;
  max-width: 260px;
}

/* INPUT */
.chat-input {
  padding: 12px 16px 18px;
}

.input :deep(.q-field__control) {
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.08);
}

.send-btn {
  color: #2f80ed;
}
</style>
