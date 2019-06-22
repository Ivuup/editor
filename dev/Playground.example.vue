<template>
  <div class="container">
    <h1>Editor's Ivuup</h1>
    <editor :config="config" ref="editor"></editor>
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
  data() {
    return {
      test: 10,
      config: {
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
                clickHandle: () => {
                  return "Amy Example";
                }
              },
              {
                name: "Fake Data",
                raw: "@user(1)",
                clickHandle: (editor, element) => {
                  let target = document.createElement("div");
                  element.appendChild(target);
                  return this.mountComponent(target);
                }
              }
            ]
          }
        ]
      }
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
