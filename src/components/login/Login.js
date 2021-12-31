import { inject } from "vue";

export default {
  name: "Login",
  setup() {
    const store = inject("store");

    return {
      store,
    };
  },
};
