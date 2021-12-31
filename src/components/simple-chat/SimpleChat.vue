<template>
  <q-page class="column justify-end">
    <div class="inchat_box">
      <div v-for="message in chat" :key="message.dateSent">
        <q-chat-message
          :avatar="store.state.currentUser.avatar"
          :text="[message.message]"
          :stamp="getTime(message)"
          sent
          size="6"
          bg-color="indigo-2"
          v-if="message.from === store.state.currentUser.id"
        />
        <q-chat-message
          :avatar="getAvatar(message.from)"
          :text="[message.message]"
          :stamp="getTime(message)"
          size="6"
          bg-color="white"
          v-else
        />
      </div>
    </div>
    <div class="inchat_write flex flex-center no-wrap"  v-if="typeof store.state.selectedChat.id === 'string'">
      <q-input
        class="inchat_write-input"
        rounded
        outlined
        autogrow
        bg-color="indigo-1"
        color="indigo-3"
        v-model="messageText"
        placeholder="Write your message..."
        input-style="max-height: calc( 80vh - 50px )"
      >
        <template v-slot:append>
          <q-avatar
            class="inchat_write-icon"
            icon="send"
            color="indigo-3"
            font-size="30px"
            text-color="white"
            @click="sendMessage()"
          />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script src="./SimpleChat.js">
</script>

<style lang="sass" scoped>
@import "./SimpleChat"
</style>
