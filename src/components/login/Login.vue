<template>
  <div
    class="flex flex-center"
    v-if="typeof store.state.currentUser.id !== 'number'"
  >
    <div
      class="q-pl-md"
      v-for="user in store.state.initialUsers"
      :key="user.id"
    >
      <q-tooltip class="bg-indigo-3 text-body2" anchor="center left" self="center right" :offset="[-10, -10]">
        Loggin as {{ user.name }}
      </q-tooltip>
      <q-avatar @click="store.mutations.login(user)">
        <img :src="user.avatar" />
      </q-avatar>
    </div>
  </div>
  <div class="flex flex-center" v-else>
    <div class="q-pr-md">Welcome {{ store.state.currentUser.name }}</div>

    <q-btn outline icon-right="logout" @click="store.mutations.logout()">
      Logout
    </q-btn>
  </div>
</template>

<script src="./Login.js">
</script>

<style lang="sass" scoped>
@import "./Login"
</style>