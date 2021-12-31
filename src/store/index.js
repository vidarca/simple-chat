import { reactive, readonly } from "vue";
import { DeepstreamClient } from "@deepstream/client";

const state = reactive({
  client: new DeepstreamClient("localhost:6020"),
  currentUser: {},
  selectedChat: {},
  chatRecord: {},
  initialUsers: [
    {
      id: 0,
      username: "firstClient",
      name: "John",
      avatar: "https://cdn.quasar.dev/img/avatar1.jpg",
      chats: [
        {
          id: "f456e0a8-357e-4eec-9baa-4a99d447d850",
          data: [],
          users: [
            {
              id: 0,
              username: "firstClient"
            },
            {
              id: 1,
              username: "secondClient"
            }
          ]
        }
      ],
      logged: false,
    },
    {
      id: 1,
      username: "secondClient",
      name: "Peter",
      avatar: "https://cdn.quasar.dev/img/avatar4.jpg",
      chats: [
        {
          id: "f456e0a8-357e-4eec-9baa-4a99d447d850",
          data: [],
          users: [
            {
              id: 0,
              username: "firstClient"
            },
            {
              id: 1,
              username: "secondClient"
            }
          ]
        }
      ],
      logged: false,
    }
  ],
});

const mutations = reactive({
  login: async (user) => {
    state.client.on("error", () => { });
    state.client.login({
      username: user.username,
    });
    for (const chat of user.chats){
      await mutations.initRecord(chat);
    }
    state.currentUser = user;
    state.initialUsers.find(u => u.id === user.id).logged = true;
  },
  logout: () => {
    mutations.unsubscribeToAll();
    state.client.close();
    state.initialUsers.find(u => u.id === state.currentUser.id).logged = false;
    state.currentUser = {};
    state.selectedChat = {};
  },
  changeSelectedChat: (chat) => {
    state.selectedChat = chat;
  },
  initRecord: async (chat) => {
    state.chatRecord[chat.id] = state.client.record.getRecord(`chat/${chat.id}`);
    await state.chatRecord[chat.id].whenReady();
    if (state.chatRecord[chat.id].get("chat")){
      mutations.updateRecord(chat.id, chat.data);
      return;
    }
    state.chatRecord[chat.id].set({ chat });
  },
  unsubscribeToAll: () => {
    state.client.event.unsubscribe(`chat/${state.selectedChat.id}`);
    state.client.presence.unsubscribe();
  },
  emitEvent: (eventName, eventValue) => {
    mutations.updateRecord(eventName.split("/")[1], eventValue)
    state.client.event.emit(eventName, eventValue);
  },
  updateRecord: (chatId, data) => {
    const chat = state.chatRecord[chatId].get("chat");
    if (data instanceof Array){
      if (data.length  && data.at(-1).dateSent > chat.data.at(-1).dateSent){
        state.chatRecord[chatId].set(`chat.data`, [
          ...chat.data,
          ...data
        ]);
      }
      return;
    }
    state.chatRecord[chatId].set(`chat.data`, [
      ...chat.data,
      data
    ]);
  },
});

const getters = {
  getEventSubscription: (eventName, callback) => state.client.event.subscribe(eventName, callback),
  getChatData: (chatId) => state.chatRecord[chatId].get("chat") ? state.chatRecord[chatId].get("chat").data : [],
}

export default {
  state: readonly(state),
  mutations,
  getters,
}