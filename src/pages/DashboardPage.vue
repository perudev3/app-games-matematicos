<template>
  <q-page class="dashboard-page">

    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1 class="hello">Hola, Daniel</h1>
        <p class="welcome">¿Listo para practicar hoy?</p>
      </div>

      <img src="/logo-sin-fondo.png" class="robot-header" />
    </div>

    <!-- CARDS -->
    <div class="cards">

      <div class="card action">
        <div class="icon plus">+</div>
        <p>Práctica de<br />Sumas</p>
      </div>

      <div class="card action">
        <div class="icon minus">−</div>
        <p>Práctica de<br />Restas</p>
      </div>

    </div>

    <!-- DAILY CHALLENGE -->
    <div class="daily-card">
      <div class="chest">🎁</div>
      <div>
        <h3>Desafío Diario</h3>
        <p>¡Nuevo reto disponible!</p>
      </div>
    </div>

  </q-page>
</template>

<style scoped>
.dashboard-page {
  padding: 20px;
  background: linear-gradient(180deg, #f6f7f9 0%, #eef1f6 100%);
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}

.hello {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  color: #2e2e2e;
}

.welcome {
  font-size: 14px;
  color: #8a8a8a;
  margin-top: 4px;
}

.robot-header {
  width: 50%;
  height: auto;
}

/* ACTION CARDS */
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 26px;
}

.card {
  background: #ffffff;
  border-radius: 22px;
  padding: 26px 16px;
  text-align: center;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 30px 60px rgba(0, 0, 0, 0.04);
}

.card p {
  font-weight: 600;
  font-size: 15px;
  margin-top: 12px;
  color: #2e2e2e;
}

/* ICONS */
.icon {
  width: 54px;
  height: 54px;
  margin: 0 auto;
  border-radius: 50%;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.plus {
  background: linear-gradient(180deg, #4facfe, #2f80ed);
}

.minus {
  background: linear-gradient(180deg, #f2994a, #eb5757);
}

/* DAILY CHALLENGE */
.daily-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.06);
}

.daily-card h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
}

.daily-card p {
  font-size: 13px;
  color: #8a8a8a;
  margin-top: 4px;
}

.chest {
  font-size: 36px;
}
</style>

