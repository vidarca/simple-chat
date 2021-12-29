<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="min-height: 100vh">
      <q-header elevated>
        <q-toolbar class="q-py-md">
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="q-mr-sm"
            @click="user.status ? (drawer = !drawer) : ''"
          />
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          <q-toolbar-title>Simple Chat</q-toolbar-title>

          <div class="flex flex-center" v-if="!user.status">
            <div class="flex flex-center">
              <q-input
                bg-color="blue-2"
                class="q-pr-md"
                filled
                color="black"
                dense
                square
                v-model="v$.username.$model"
                :error="v$.username.$error"
                hide-bottom-space
                no-error-icon
                placeholder="Username"
              />
              <q-input
                bg-color="blue-2"
                class="q-pr-md"
                filled
                color="black"
                dense
                square
                v-model="v$.password.$model"
                :error="v$.password.$error"
                hide-bottom-space
                placeholder="Password"
                no-error-icon
                :type="hidePassword ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="!hidePassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="hidePassword = !hidePassword"
                  />
                </template>
              </q-input>
            </div>
            <q-btn outline icon-right="login" @click="login()"> Login </q-btn>
          </div>
          <div class="flex flex-center" v-else>
            <div class="q-pr-md">Welcome {{ currentUser }}</div>

            <q-btn outline icon-right="logout" @click="logout()">
              Logout
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        :width="200"
        :breakpoint="500"
        class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <div class="row items-center">
            <q-input
              class="col-9"
              filled
              color="black"
              dense
              square
              placeholder="Filter by username"
              v-model="chatFilter"
            />
            <div class="col-3 text-center">
              <q-icon name="add" @click="openAddUserModal()" />
            </div>
          </div>
          <q-list padding>
            <q-item
              clickable
              v-ripple
              v-for="chat in currentChats"
              :key="chat.id"
            >
              <q-item-section avatar @click="selectedChat = 'Change'">
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section> Inbox </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container>
        <SimpleChat
          :selectedChat="selectedChat"
          :client="client"
          :chatData="chatData"
        />
      </q-page-container>
    </q-layout>
  </div>
  <q-dialog v-model="initChat">
    <q-card>
      <q-card-section>
        <q-input
          class="full-width"
          filled
          color="black"
          dense
          square
          placeholder="Filter by username"
          v-model="usernameFilter"
          @keyup="filterUsers()"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-for="user in clientsLoggedFiltered" :key="user">
          <q-icon name="user"></q-icon>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { DeepstreamClient } from "@deepstream/client";
import SimpleChat from "./components/SimpleChat.vue";
import useVulidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { reactive, ref } from "@vue/reactivity";
import { watch } from "vue-demi";

export default {
  name: "LayoutDefault",
  components: {
    SimpleChat,
  },
  setup() {
    const user = reactive({
      username: "",
      password: "",
      status: false,
    });
    const currentUser = ref("");

    const userFormValidations = {
      username: { required },
      password: { required },
    };
    const v$ = useVulidate(userFormValidations, user);

    const clientsLogged = ref([]);
    const clientsLoggedFiltered = ref([]);
    const currentChats = ref([]);
    const usernameFilter = ref("");
    const chatFilter = ref("");
    const initChat = ref(false);

    const hidePassword = ref(true);
    const client = ref(null);

    const drawer = ref(false);
    const selectedChat = ref("");

    const chatData = ref([]);

    async function login() {
      v$.value.username.$validate();
      v$.value.password.$validate();
      if (!v$.value.username.$invalid && !v$.value.password.$invalid) {
        await loginAndReset();
        waitForUsers();
        getUserChats();
      }
    }

    async function loginAndReset() {
      client.value = new DeepstreamClient("localhost:6020");
      client.value.on("error", () => {});
      client.value.login({
        username: user.username,
        password: user.password,
      });
      user.status = true;
      currentUser.value = user.username;
      v$.value.username.$model = "";
      v$.value.username.$reset();
      v$.value.password.$model = "";
      v$.value.password.$reset();
    }

    function waitForUsers() {
      client.value.presence.subscribe((username, isLoggedIn) => {
        if (isLoggedIn) {
          clientsLogged.value.push(username);
          filterUsers();
          return;
        }
        const index = clientsLogged.value.findIndex((c) => c === username);
        clientsLogged.value.splice(index, 1);
        filterUsers();
      });
    }

    async function getUserChats() {
      const record = client.value.record.getRecord(
        `user/${client.value.getUid()}`
      );
      await record.whenReady();
      console.log(record.get());
      if (!record.get().chats){
        record.set({
          chats: [],
        });
      }
    }

    async function logout() {
      client.value.close();
      user.status = false;
    }

    function changeSelectedChat(chatId) {
      selectedChat.value = chatId;
    }

    function filterUsers() {
      clientsLoggedFiltered.value = clientsLogged.value.filter((c) =>
        c
          .toLowerCase()
          .trim()
          .includes(usernameFilter.value.trim().toLowerCase())
      );
    }

    function openAddUserModal() {
      clientsLoggedFiltered.value = [...clientsLogged.value];
      initChat.value = true;
    }

    watch(client, () => {
      if (client.value) {
        return;
      }
    });

    return {
      user,
      currentUser,
      userFormValidations,
      hidePassword,
      client,
      v$,
      drawer,
      selectedChat,
      chatData,
      clientsLogged,
      currentChats,
      initChat,
      usernameFilter,
      chatFilter,
      login,
      logout,
      changeSelectedChat,
      filterUsers,
      openAddUserModal,
    };
  },
};
</script>
