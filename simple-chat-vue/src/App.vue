<template>
  <div>
    <q-layout view="hHh Lpr lFf" style="height: 100vh; max-height: 100vh">
      <q-header class="bg-indigo-10">
        <q-toolbar>
          <q-icon
            name="menu"
            color="white"
            size="26px"
            @click="store.state.userChecked ? drawer = !drawer : ''"
          />

          <q-toolbar-title>Simple Chat</q-toolbar-title>

          <Login v-if="store.state.onlineUsersChecked" />
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        :width="store.state.drawerWidth"
        :breakpoint="500"
        class="bg-grey-3"
      >
        <ChatList v-if="drawer" />
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

import {
  ref,
  provide,
  watch,
  computed,
  onBeforeUnmount,
  onMounted,
  onBeforeMount,
} from "vue";
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
    const userChecked = ref(computed(() => store.state.userChecked));

    onBeforeMount(() => {
      store.mutations.getDrawerWith();
      store.mutations.getOnlineUsers();
    });

    onMounted(() => {
      window.addEventListener("resize", store.mutations.getDrawerWith);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", store.mutations.getDrawerWith());
    });

    watch(userChecked, () => {
      if (userChecked.value) {
        drawer.value = true;
        return;
      }
      drawer.value = false;
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
.chat
  background-image: url("./assets/chat-background.jpg")
  background-size: contain
  background-repeat: repeat
  background-position: top center
.q-avatar
  cursor: pointer
.cursor-default
  cursor: default !important
</style>
