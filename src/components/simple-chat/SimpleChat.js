import { ref, inject, watch, computed } from "vue";

export default {
  name: "SimpleChat",
  setup() {
    const store = inject("store");
    const chat = ref([]);
    const messageText = ref("");

    const selectedChat = ref(computed(() => store.state.selectedChat));

    watch(selectedChat, () => {
      if (typeof store.state.selectedChat.id === "string") {
        chat.value = store.state.chatRecord[store.state.selectedChat.id]
          .get("chat").data;
        store.getters.getEventSubscription(
          `chat/${store.state.selectedChat.id}`,
          (response) => {
            chat.value.push(response);
            setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight)
            }, 200);
          }
        );
      } else {
        chat.value = [];
      }
    });

    const sendMessage = () => {
      if (messageText.value.trim() !== ""){
        store.mutations.emitEvent(`chat/${store.state.selectedChat.id}`, {
          message: messageText.value.trim(),
          from: store.state.currentUser.id,
          dateSent: Date.now(),
        });
        messageText.value = "";
      }
    }

    const getTime = (message) => {
      const date = new Date(message.dateSent);
      return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    };

    const getAvatar = (userId) => store.state.initialUsers.find(u => u.id === userId).avatar;

    return {
      chat,
      store,
      messageText,
      sendMessage,
      getTime,
      getAvatar,
    };
  },
};
