<template>
  <div class="container">
    <h1>Editor's Ivuup</h1>
    <editor :config="config" ref="editor" v-model="value"></editor>
    <v-text-field v-model="value"></v-text-field>
    <v-btn @click="changeContent">change content</v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import Editor from "@/index.vue";
import FakeData from "./components/FakeData.vue";
import Button from "@/contracts/Button";
import CustomViewHotkey from "./components/CustomViewHotkey.vue";

export default {
  components: {
    Editor
  },
  computed: {
    value: {
      set(v) {
        localStorage.setItem("value", v);
        this.data = v;
      },
      get() {
        // this.data = localStorage.getItem("value");
        return localStorage.getItem("value");
      }
    },
    config() {
      return {
        innerHTML: this.value,
        toolbar: [
          "align-left",
          "bold",
          "italic",
          "underline",
          "removeFormat",
          "horizontalRule"
        ],
        buttonToolbar: [
          "link",
          "uploadImage",
          new Button(
            "mention",
            () => [
              "hotkey.selectedItem",
              {
                name: "Teste de comando",
                render: core => {
                  document.execCommand("insertText", false, "@");
                  core.exec("hotkey.onKeyup");
                }
              }
            ],
            "alternate_email"
          )
        ],
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
                  target.innerText = "Daniel";
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
          },
          {
            marker: "/",
            view: CustomViewHotkey,
            items: [
              {
                name: "Teste de comando",
                render: (core, createElement) => {
                  createElement(null, document.createTextNode(""));
                  core.exec("upload.new");
                }
              },
              {
                name: "Fake Data",
                raw: "/component(1)",
                render: (core, createElement) => {
                  let target = createElement();
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
      test: "abc",
      data: null
    };
  },
  methods: {
    mountComponent(target) {
      return new Vue({
        parent: this,
        el: target,
        render: h =>
          h(FakeData, {
            props: {
              test: this.test
            },
            on: {
              input: this.inputTest
            }
          })
      });
    },
    inputTest(v) {
      this.test = v;
    },
    changeContent() {
      setTimeout(() => {
        this.$refs.editor.getCore().setContent(`<h1>Título</h1>
          <p>an text here</p>
          <p>an another <a href="#">text</a> <span>here</span></p>
          <p>an another <b>text</b> <span>here</span></p>`);

        this.changeContent();
      }, 3000);
    }
  }
};
</script>
