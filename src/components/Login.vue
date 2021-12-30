<template>
  <div class="flex flex-center" v-if="!store.currentUser">
    <q-avatar
      icon="user"
      v-for="user in state.initialUsers"
      :key="user.id"
      @click="store.login(user)"
    />
  </div>
  <div class="flex flex-center" v-else>
    <div class="q-pr-md">Welcome {{ store.currentUser.name }}</div>

    <q-btn outline icon-right="logout" @click="store.logout()">
      Logout
    </q-btn>
  </div>
</template>

<script>
import { inject, ref } from "vue";

export default {
  name: "Login",
  setup() {
    const store = inject("store");

    return {
      store,
    }
  }
}
</script>