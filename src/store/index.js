import { reactive, readonly } from "vue";
import { DeepstreamClient } from "@deepstream/client";

const state = reactive({
  client: new DeepstreamClient("localhost:6020"),
  currentUser: null,
  selectedChat: null,
  record: null,
  initialUsers: [
    {
      id: 0,
      username: "firstClient",
      name: "John",
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
  login: (user) => {
    state.client = new DeepstreamClient("localhost:6020");
    state.client.on("error", () => {});
    state.client.login({
      username: state.currentUser.username,
    });
    state.currentUser = user;
    state.initialUsers.find(u => u.id === user.id).logged = true;
    initRecord();
  },
  logout: () => {
    state.client.close();
    state.initialUsers.find(u => u.id === state.currentUser.id).logged = false;
    state.currentUser = null;
  },
  changeSelectedChat: (chat) => {
    state.selectedChat = chat;
  },
  initRecord: async () => {
    state.record = state.client.record.getRecord(`user/${state.client.getUid()}`);
    await state.record.whenReady();
    state.record.set(state.currentUser.chats);
  },
});

export default {
  state: readonly(state),
  mutations,
}