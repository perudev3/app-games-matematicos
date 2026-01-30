<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white">
      <q-tabs align="justify" dense>
        <q-route-tab icon="home" label="Inicio" to="/app/dashboard" />
        <q-route-tab icon="chat" label="IA" to="/app/chat" />
        <q-route-tab icon="person" label="Perfil" to="/app/profile" />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>



<style >

.q-tab {
    color: #636363;
}
</style>