<template>
  <div class="container fill-height">
    <v-layout column>
      <h1>Editor's Ivuup</h1>
      <v-btn icon @click="config.readOnly.active = !config.readOnly.active"
        ><v-icon>edit</v-icon></v-btn
      >
      <v-flex>
        <editor :config="config" ref="editor" v-model="value"></editor>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Vue from "vue";
import Editor from "@/index.vue";
import FakeData from "./components/FakeData.vue";
import Button from "@/contracts/Button";

export default {
  components: {
    Editor
  },
  computed: {
    value: {
      set(v) {
        localStorage.setItem("value", v);
      },
      get() {
        return localStorage.getItem("value");
      }
    }
  },
  data() {
    return {
      test: "abc",
      config: {
        innerHTML: this.value,
        toolbar: [
          "alignment",
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
                render: () => {
                  document.execCommand("insertText", false, "@");
                }
              }
            ],
            "alternate_email"
          )
        ],
        placeholder: "Digite aqui...",
        preview: {
          onPaste: [
            // links de pdf
            (event, text) => {
              if (/.pdf$/.test(text)) {
                event.preventDefault();
                let obj = document.createElement("object");
                obj.data = text;
                obj.width = "90%";
                obj.height = "400px";
                obj.type = "application/pdf";
                document.execCommand("insertHTML", false, obj.outerHTML);
                return true;
              }
            },
            (event, text) => {
              if (/sei.dnit.gov.br/.test(text)) {
                event.preventDefault();

                let iframe = document.createElement("iframe");
                iframe.src = text;
                iframe.width = "80%";
                iframe.height = "400px";
                document.execCommand("insertHTML", false, iframe.outerHTML);
                return true;
              }
            },
            (event, text) => {
              if (/^<[\w|\W]*[-a-zA-Z0-9@:%._+~#=]*<\/[\w|\W]*>$/.test(text)) {
                event.preventDefault();
                document.execCommand("insertHTML", false, text);
                return true;
              }
            }
          ]
        },
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
            items: [
              {
                name: "Teste de comando",
                render: core => {
                  document.execCommand("insertText", false, "@");
                  core.exec("hotkey.onKeyup");
                }
              },
              {
                name: "Fake Data",
                raw: "/component(1)",
                render: (core, createElement) => {
                  let target = createElement("div");

                  this.mountComponent(target);
                }
              }
            ]
          }
        ],
        readOnly: {
          active: true
        }
      }
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

<style>
#app {
  height: 100vh;
}
</style>
