
import { inject, onMounted, ref } from "vue";

export default {
  name: "ChatList",
  setup() {
    const store = inject("store");

    const chats = ref([]);

    const lastMessages = ref({});

    onMounted(() => {
      chats.value = store.state.currentUser.chats;
      chats.value.forEach(chat => {
        lastMessages.value[`chat/${chat.id}`] = {
          message: getLastMessage(chat.data.at(-1)),
          dateSent: getLastMessageTime(chat.data.at(-1))
        }
        store.getters.getEventSubscription(
          `chat/${chat.id}`,
          (response) => {
            lastMessages.value[`chat/${chat.id}`] = {
              message: getLastMessage(response),
              dateSent: getLastMessageTime(response)
            }
            chat.data.push(response);
          }
        );
      })
    });

    const getChatName = (chat) => {
      const otherUserId = chat.users.find(u => u.id !== store.state.currentUser.id).id;
      return store.state.initialUsers.find(u => u.id === otherUserId).name;
    };

    const getChatIcon = (chat) => {
      const otherUserId = chat.users.find(u => u.id !== store.state.currentUser.id).id;
      return store.state.initialUsers.find(u => u.id === otherUserId).avatar;
    };

    const getLastMessage = (message) => {
      if (!message.message) {
        return "No messages jet";
      }
      return `${message.from === store.state.currentUser.id ? "You: " : `${getUserName(message.from)}: `} ${message.message}`;
    };

    const getUserName = (userId) => store.state.initialUsers.find(u => u.id === userId).name;

    const getLastMessageTime = (message) => {
      if (!message.dateSent) {
        return "";
      }
      const date = new Date(message.dateSent);
      return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    };

    return {
      store,
      chats,
      lastMessages,
      getChatName,
      getChatIcon,
    };
  },
};