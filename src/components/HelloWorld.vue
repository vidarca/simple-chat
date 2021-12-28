<template>
  <q-header elevated>
    <q-toolbar class="q-py-md">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>

      <q-toolbar-title>Quasar Framework</q-toolbar-title>

      <div class="flex flex-center" v-if="!user.status">
        <div class="flex flex-center">
          <q-input
            ref="username"
            bg-color="blue-2"
            class="q-pr-md"
            filled
            color="black"
            dense
            v-model="user.username"
            lazy-rules
            :rules="userFormValidations.usernameValidations"
            hide-bottom-space
            no-error-icon
            placeholder="Username"
          />
          <q-input
            ref="password"
            bg-color="blue-2"
            class="q-pr-md"
            filled
            color="black"
            dense
            v-model="user.password"
            placeholder="Password"
            lazy-rules
            no-error-icon
            hide-bottom-space
            :rules="userFormValidations.passwordValidations"
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
        <div class="q-pr-md">Welcome {{ user.username }}</div>

        <q-btn outline icon-right="logout" @click="logout()"> Logout </q-btn>
      </div>
    </q-toolbar>
  </q-header>
  <q-page class="flex flex-center">
    <q-chip>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </q-avatar>
      John
    </q-chip>
  </q-page>
</template>

<style>
</style>

<script>
import { useQuasar } from "quasar";
import { DeepstreamClient } from "@deepstream/client";
import { reactive, ref } from "@vue/reactivity";

export default {
  name: "HelloWorld",
  methods: {
    async login() {
      this.$refs.username.validate();
      this.$refs.password.validate();
      if (!this.$refs.username.hasError && !this.$refs.password.hasError) {
        this.client = new DeepstreamClient("localhost:6020");
        await this.client.login({
          user: this.user.username,
          password: this.user.password,
        });
        this.user.status = true;
        this.$refs.menu.hide();
      }
    },
    async logout() {
      this.client.close();
      this.user.status = false;
      this.$refs.menu.hide();
    },
  },
  setup() {
    const q$ = useQuasar();

    const user = reactive({
      username: "",
      password: "",
      status: false,
    });

    const userFormValidations = reactive({
      usernameValidations: [(val) => val && val.length > 0],
      passwordValidations: [(val) => val && val.length > 0],
    });
    const hidePassword = ref(true);
    const client = ref(null);
    return {
      user,
      userFormValidations,
      hidePassword,
      client,
      q$,
    };
  },
};
</script>
