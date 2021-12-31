<template>
  <div>
    <q-layout view="hHh Lpr lFf" style="height: 100vh; max-height: 100vh">
      <q-header class="bg-indigo-10">
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          <q-toolbar-title>Simple Chat</q-toolbar-title>

          <Login />
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        :width="350"
        :breakpoint="500"
        class="bg-grey-3"
      >
        <ChatList v-if="drawer"/>
      </q-drawer>
      <q-page-container class="chat">
        <SimpleChat />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import SimpleChat from "./components/simple-chat/SimpleChat.vue";
import Login from "./components/login/Login.vue";
import ChatList from "./components/chat-list/ChatList.vue";

import { ref, provide, watch, computed } from "vue";
import store from "./store";

export default {
  name: "LayoutDefault",
  components: {
    SimpleChat,
    Login,
    ChatList,
  },
  setup() {
    const drawer = ref(false);

    provide("store", store);

    const selectedChat = ref(computed(() => store.state.selectedChat));
    const currentUser = ref(computed(() => store.state.currentUser));

    watch(currentUser, () => {
      if (typeof currentUser.value.id === "number") {
        drawer.value = true;
      } else {
        drawer.value = false;
      }
    });

    watch(selectedChat, () => {
      if (typeof store.state.selectedChat === "string") {
        store.state.client.presence.subscribe((username, isLoggedIn) => {
          store.state.initialUsers.find((u) => u.username === username).logged =
            isLoggedIn;
        });
      }
    });

    return {
      store,
      drawer,
    };
  },
};
</script>

<style lang="sass">
html
  scroll-behavior: smooth
.chat
  background-image: url("./assets/chat-background.jpg")
  background-size: cover
  background-repeat: no-repeat
  background-position: top center
  &::before
    content: ""
    background-color: rgba(255, 255, 255, 0.7)
    height: 100%
    width: 100%
    position: absolute
    top: 0
    left: 0

.q-avatar
  cursor: pointer
</style>
