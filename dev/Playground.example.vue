<template>
  <div class="container">
    <h1>Editor's Ivuup</h1>
    <editor ref="editor"></editor>
    <v-btn @click="mountComponent">render</v-btn>
    <fake-data class="mt-5" :test="test"></fake-data>
    <v-text-field v-model="test"></v-text-field>
  </div>
</template>

<script>
import Vue from "vue";
import Editor from "@/index.vue";
import FakeData from "./components/FakeData.vue";

export default {
  components: {
    Editor,
    FakeData
  },
  data() {
    return {
      test: 20
    };
  },
  methods: {
    mountComponent() {
      new Vue({
        el: this.$refs.editor.$refs.editor.core.editor.firstChild,
        render: h =>
          h(FakeData, {
            domProps: {
              contentEditable: false
            },
            props: {
              test: this.test
            }
          })
      });
    }
  }
};
</script>
