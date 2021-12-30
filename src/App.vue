<template>
  <div>
    <q-layout view="lHh lpR lFf" container style="min-height: 100vh">
      <q-header elevated>
        <q-toolbar class="q-py-md">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          <q-toolbar-title>Simple Chat</q-toolbar-title>

          <Loggin />
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer && store.currentUser"
        :width="200"
        :breakpoint="500"
        class="bg-grey-3"
      >
        <ChatList />
      </q-drawer>
      <q-page-container>
        <SimpleChat />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import SimpleChat from "./components/SimpleChat.vue";
import Login from "./components/Loggin.vue";
import ChatList from "./components/ChatList.vue";

import { ref, provide, inject, onMounted } from "vue";
import store from "./store";

export default {
  name: "LayoutDefault",
  components: {
    SimpleChat,
    Login,
    ChatList
  },
  setup() {

    const drawer = ref(true);

    provide("store", store);

    const store = inject("store");

    onMounted(() => {
      state.client.presence.subscribe((username, isLoggedIn) => {
        state.initialUsers.find(u => u.username === username).logged = isLoggedIn;
      });
    });

    return {
      drawer,
      store,
    };
  },
};
</script>
