<template>
  <editor
    ref="editor"
    :core="core"
    @blur="$emit('blur', $event)"
    @input="$emit('input', $event)"
    @editing="$emit('editing', $event)"
  />
</template>

<script>
import Core from "./core";
import Layout from "./ui/layout";
import Link from "./plugins/Link";
import Format from "./plugins/Format";
import Hotkey from "./plugins/Hotkey";
import Preview from "./plugins/Link/Preview";
import ImageUpload from "./plugins/Image/Upload";
import History from "./plugins/History";

export default {
  components: {
    editor: Layout
  },
  data() {
    return {
      core: null
    };
  },
  props: {
    plugins: {
      type: Array,
      default: () => [Link, Hotkey, Preview, ...Format, ImageUpload, History]
    },
    config: {
      type: Object,
      default: () => ({
        toolbar: [
          "alignment",
          "bold",
          "italic",
          "underline",
          "removeFormat",
          "horizontalRule"
        ],
        buttonToolbar: ["link", "uploadImage"],
        placeholder: "Digite aqui..."
      })
    },
    value: {
      type: String
    }
  },
  created() {
    if (!this.core)
      this.$nextTick().then(context => {
        context.core = new Core({
          editor: context.$refs.editor.$refs.content,
          plugins: context.plugins,
          config: context.config,
          innerHTML: context.value || null
        });
      });
  },
  methods: {
    getCore() {
      return this.core;
    }
  },
  watch: {
    value(v) {
      if (v !== this.core.editor.innerHTML) this.core.setContent(v);
    }
  }
};
</script>

<style>
@import "./assets/index.css";
</style>
