<template>
  <div class="i-editor">
    <div class="i-button-toolbar" v-if="core && core.config.buttonToolbar">
      <buttonToolbar :core="core" @command="command"></buttonToolbar>
    </div>
    <div class="wrap">
      <toolbar
        v-if="core && core.config.toolbar"
        class="i-toolbar"
        :core="core"
        @command="command"
      ></toolbar>
      <div class="i-content" ref="content"></div>
      <float-action
        class="i-float-action"
        v-if="core"
        :core="core"
      ></float-action>
    </div>
  </div>
</template>

<script>
import Toolbar from "./toolbar.vue";
import ButtonToolbar from "./buttonToolbar.vue";
import FloatAction from "./floatAction.vue";

export default {
  components: {
    ButtonToolbar,
    FloatAction,
    Toolbar
  },
  props: {
    core: {
      type: Object
    }
  },
  methods: {
    command(command) {
      this.core.editor.focus();
      if (typeof command == "function") return this.core.exec(...command());

      return this.core.exec(command);
    }
  },
  watch: {
    core() {
      // ativar eventos
      this.core.blurCallback = (event => this.$emit("blur", event)).bind(this);
      this.core.editingCallback = (boolean =>
        this.$emit("editing", boolean)).bind(this);
      this.core.inputCallback = (payload => this.$emit("input", payload)).bind(
        this
      );
    }
  }
};
</script>
