<template>
  <q-scroll-area
    class="fit bg-white custom-chat"
    v-if="chats.length"
  >
    <q-list class="custom-chat_list" :style="'width:' + store.state.drawerWidth + 'px'">
      <q-item
        :class="{'rounded-borders custom-chat_item': true, 'selected': store.state.selectedChat.id === chat.id}"
        clickable
        v-ripple
        v-for="chat in store.state.currentUser.chats"
        :key="chat.id"
        @click="store.mutations.changeSelectedChat(chat)"
      >
        <q-item-section class="custom-chat_item-section-icon" avatar>
          <q-avatar>
            <img :src="getChatIcon(chat)">
          </q-avatar>
        </q-item-section>

        <q-item-section class="custom-chat_item-section-main">
          <div class="flex column full-width">
            <span class="custom-chat_chat-title">{{ getChatName(chat) }}</span>
            <span class="custom-chat_chat-message">{{ lastMessages[`chat/${chat.id}`].message }}</span>
          </div>
        </q-item-section>

        <q-item-section class="custom-chat_item-section-date">
          {{ lastMessages[`chat/${chat.id}`].dateSent }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script src="./ChatList.js">

</script>

<style lang="sass" scoped>
@import "./ChatList"
</style>