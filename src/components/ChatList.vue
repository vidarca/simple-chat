<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item
        clickable
        v-ripple
        v-for="chat in state.currentUser.chats"
        :key="chat.id"
        @click="state.mutations.changeSelectedChat(chat)"
      >
        <q-item-section avatar>
          <q-icon name="inbox" />
        </q-item-section>

        <q-item-section> Inbox </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script>
import { inject } from "vue";

export default {
  name: "ChatList",
  setup() {
    const store = inject("store");

    return {
      store
    }
  }
}
</script>