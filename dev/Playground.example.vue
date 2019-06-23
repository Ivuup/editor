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
          },
          {
            marker: "/",
            items: [
              {
                name: "Teste de comando",
                raw: "/command(2)",
                render: (core, createElement) => {
                  createElement(null, document.createTextNode("@"));
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
      test: 10,
      value: `<p placeholder="Digite aqui...">Oi,&nbsp;<span class="hotkey " contenteditable="false" data-item="@user(2)"><span>Daniel Soares</span></span>.</p><p placeholder="Digite aqui..."><br></p><p placeholder="Digite aqui...">Olha esse componente!</p><p placeholder="Digite aqui..."><div class="hotkey " contenteditable="false" data-item="@component(1)"><div class="v-card v-sheet theme--light"><div class="v-card__title title">10asdasd</div><div class="v-card__text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo fugiat
    saepe consectetur tempora optio, iusto neque natus impedit quasi aperiam
    expedita dolores non? Maxime, quaerat exercitationem provident a modi
    perferendis.</div></div></div><p placeholder="Digite aqui...">&nbsp;<br></p><p placeholder="Digite aqui...">asd</p><p placeholder="Digite aqui...">asd</p><p placeholder="Digite aqui...">as</p><p placeholder="Digite aqui...">d</p><p placeholder="Digite aqui...">asd</p><p placeholder="Digite aqui...">as</p><p placeholder="Digite aqui...">d</p></p>`
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
            },
            on: {
              input: this.inputTest
            }
          })
      });
    },
    inputTest(v) {
      this.test = v;
    }
  }
};
</script>
