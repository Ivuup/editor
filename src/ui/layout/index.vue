<template>
  <div class="i-editor">
    <div
      class="i-button-toolbar"
      v-if="core && !core.readOnly.status && core.config.buttonToolbar"
    >
      <buttonToolbar :core="core" @command="command"></buttonToolbar>
    </div>
    <div class="wrap">
      <toolbar
        v-if="core && !core.readOnly.status && core.config.toolbar"
        class="i-toolbar"
        :core="core"
        @command="command"
      ></toolbar>
      <div class="i-content" ref="content"></div>
      <float-action
        v-if="core && !core.readOnly.status"
        class="i-float-action"
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
      this.core.blurCallback = (payload => this.$emit("blur", payload)).bind(
        this
      );
      this.core.editingCallback = (boolean =>
        this.$emit("editing", boolean)).bind(this);
      this.core.inputCallback = (payload => this.$emit("input", payload)).bind(
        this
      );
    },
    "core.config.readOnly.active"(v) {
      this.core.setReadOnly(v);
    }
  }
};
</script>
