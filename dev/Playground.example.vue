<template>
  <div class="container">
    <h1>Editor's Ivuup</h1>
    <editor :config="config" ref="editor" :value="value"></editor>
    <v-text-field v-model="test"></v-text-field>
  </div>
</template>

<script>
import Vue from "vue";
import Editor from "@/index.vue";
import FakeData from "./components/FakeData.vue";

export default {
  components: {
    Editor
  },
  computed: {
    config() {
      return {
        toolbar: [
          "alignment",
          "bold",
          "italic",
          "underline",
          "removeFormat",
          "horizontalRule"
        ],
        buttonToolbar: ["link", "uploadImage"],
        placeholder: "Digite aqui...",
        hotkey: [
          {
            marker: "@",
            items: [
              {
                name: "Amy Example",
                raw: "@user(2)",
                render: (core, createElement) => {
                  let target = createElement();
                  target.innerText = "Alexa";
                }
              },
              {
                name: "Fake Data",
                raw: "@component(1)",
                render: (core, createElement) => {
                  let target = createElement("div");
                  this.mountComponent(target);
                }
              }
            ]
          }
        ]
      };
    }
  },
  data() {
    return {
      test: 10,
      value: null
    };
  },
  methods: {
    mountComponent(target) {
      return new Vue({
        el: target,
        render: h =>
          h(FakeData, {
            props: {
              test: this.test
            }
          })
      });
    }
  }
};
</script>
