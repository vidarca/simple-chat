<template>
  <q-page class="flex flex-center">
    <q-chip>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </q-avatar>
      John
    </q-chip>
  </q-page>
</template>

<script>
import { ref, inject, watch } from "vue";

export default {
  name: "SimpleChat",
  setup() {
    const store = inject("store");
    const chat = ref([]);

    watch(store.selectedChat, () => {
      chat.value = state.record.get("chats").find(c => c.id === store.selectedChat.id).data;
      state.client.event.subscribe(`chat/${store.selectedChat.id}`, (response) => {
        chat.value.push(response);
      });
    });

    const function sendMessage(message) {
      state.client.event.emit(`chat/${store.selectedChat.id}`, {
        message,
        from: store.currentUser.username
      })
    }

    return {
      chat,
      store,
    };
  },
};
</script>
