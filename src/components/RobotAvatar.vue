<template>
  <div class="robot-container">
    <div class="robot-head">
      <div class="robot-eyes">
        <span></span>
        <span></span>
      </div>
      <div class="robot-mouth"></div>
    </div>
  </div>
</template>

<style scoped>
.robot-container {
  width: 96px;
  height: 96px;
  background: #F3F4F6;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Cabeza */
.robot-head {
  width: 64px;
  height: 64px;
  background: #ffffff;
  border: 2.5px solid #2F80ED;
  border-radius: 18px;
  position: relative;
}

/* Ojos */
.robot-eyes {
  display: flex;
  justify-content: space-between;
  padding: 18px 14px 0;
}

.robot-eyes span {
  width: 8px;
  height: 8px;
  background: #2F80ED;
  border-radius: 50%;
}

/* Boca */
.robot-mouth {
  width: 20px;
  height: 3px;
  background: #9CA3AF;
  border-radius: 2px;
  margin: 8px auto 0;
}
</style>
