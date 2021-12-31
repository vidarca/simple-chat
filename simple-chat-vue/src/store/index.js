import { reactive, readonly } from "vue";
import { DeepstreamClient } from "@deepstream/client";

const state = reactive({
  client: new DeepstreamClient("localhost:6020"),
  fakeClient: new DeepstreamClient("localhost:6020"),
  currentUser: {},
  userChecked: false,
  selectedChat: {},
  chatRecord: {},
  userRecord: null,
  drawerWidth: 0,
  onlineUsersChecked: false,
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
    for (const chat of user.chats) {
      await mutations.initChatsRecord(chat);
    }
    state.currentUser = user;
    state.initialUsers.find(u => u.id === user.id).logged = true;
    await mutations.initUserRecord(user);
  },
  logout: () => {
    mutations.unsubscribeToAll();
    state.client.close();
    state.initialUsers.find(u => u.id === state.currentUser.id).logged = false;
    state.currentUser = {};
    state.selectedChat = {};
    state.userChecked = false;
  },
  changeSelectedChat: (chat) => {
    state.selectedChat = chat;
  },
  initUserRecord: async (user) => {
    state.userRecord = state.client.record.getRecord(`user/${user.id}`);
    await state.userRecord.whenReady();
    if (typeof state.userRecord.get("id") === 'number') {
      mutations.validateUserChats();
      setTimeout(() => {
        state.currentUser = {
          ...state.currentUser,
          chats: state.userRecord.get("chats")
        };
        state.userChecked = true;
      }, 100);
      return;
    }
    state.userRecord.set(user);
    state.userChecked = true;
  },
  validateUserChats: () => {
    state.currentUser.chats.forEach((chat, index) => {
      if (JSON.stringify(state.chatRecord[chat.id].get("chat.data")) !== JSON.stringify(state.userRecord.get(`chats[${index}].data`))){
        mutations.updateUserRecord(`chats[${index}].data`, state.chatRecord[chat.id].get("chat.data"))
      }
    });
  },
  initChatsRecord: async (chat) => {
    state.chatRecord[chat.id] = state.client.record.getRecord(`chat/${chat.id}`);
    await state.chatRecord[chat.id].whenReady();
    if (state.chatRecord[chat.id].get("chat")) {
      mutations.updateChatRecord(chat.id, chat.data);
      return;
    }
    state.chatRecord[chat.id].set({ chat });
  },
  unsubscribeToAll: () => {
    state.client.event.unsubscribe(`chat/${state.selectedChat.id}`);
  },
  emitEvent: (eventName, eventValue) => {
    mutations.updateChatRecord(eventName.split("/")[1], eventValue)
    state.client.event.emit(eventName, eventValue);
  },
  updateChatRecord: (chatId, data) => {
    const chat = state.chatRecord[chatId].get("chat.data");
    if (data instanceof Array) {
      if (data.length && data.at(-1).dateSent > chat.at(-1).dateSent) {
        state.chatRecord[chatId].set(`chat.data`, [
          ...new Set([
            ...chat.map(d => JSON.stringify(d)),
            ...data.map(d => JSON.stringify(d))
          ])
        ].map(d => JSON.parse(d)));
      }
      mutations.updateUserChats(chatId);
      return;
    }
    state.chatRecord[chatId].set(`chat.data`, [
      ...new Set([
        ...chat.map(d => JSON.stringify(d)),
        JSON.stringify(data)
      ])
    ].map(d => JSON.parse(d)));
    mutations.updateUserChats(chatId);
  },
  updateUserChats: (chatId) => {
    if (typeof state.currentUser.id === 'number') {
      const index = state.currentUser.chats.findIndex(c => c.id === chatId);
      mutations.updateUserRecord(`chats[${index}].data`, state.chatRecord[chatId].get("chat.data"));
    }
  },
  updateUserRecord: (pathRecord, data) => {
    const userData = state.userRecord.get(pathRecord);
    if (data instanceof Array) {
      if (data.length) {
        state.userRecord.set(pathRecord, [
          ...new Set([
            ...userData.map(d => JSON.stringify(d)),
            ...data.map(d => JSON.stringify(d))
          ])
        ].map(d => JSON.parse(d)));
      }
      return;
    }
    state.userRecord.set(pathRecord, [
      ...new Set([
        ...userData.map(d => JSON.stringify(d)),
        JSON.stringify(data)
      ])
    ].map(d => JSON.parse(d)));
  },
  getDrawerWith: () => {
    if (window.innerWidth >= 500) {
      state.drawerWidth = Math.min(window.innerWidth * 0.3, 350) > 200 ? Math.min(window.innerWidth * 0.3, 350) : 200;
      return;
    }
    state.drawerWidth = window.innerWidth;
  },
  getOnlineUsers: () => {
    state.fakeClient.on();
    state.fakeClient.login();
    state.fakeClient.presence.getAll((_, clients) => {
      clients.forEach(c => {
        state.initialUsers.find(u => u.username === c).logged = true;
      });
      state.onlineUsersChecked = true;
    });
    state.fakeClient.presence.subscribe((username, isLoggedIn) => {
      state.initialUsers.find(u => u.username === username).logged = isLoggedIn;
    });
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