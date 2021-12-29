<template>
  <q-page class="flex flex-center">
    <q-chip>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </q-avatar>
      John
    </q-chip>
  </q-page>
</template>

<script>
import { DeepstreamClient } from "@deepstream/client";
import { computed, ref, watch } from "vue-demi";

export default {
  name: "SimpleChat",
  props: {
    selectedChat: String,
    client: DeepstreamClient,
    chatData: Array,
  },
  setup(props) {
    const selectedChat = ref(computed(() => props.selectedChat));
    const chat = ref([]);

    watch(selectedChat, () => {
      if (selectedChat?.value) {
        chat.value = props.chatData;
        props.client.event.subscribe(`${selectedChat.value}`, (response) => {
          chat.value.push(response);
        });
      }
    });

    return {
      chat,
    };
  },
};
</script>
