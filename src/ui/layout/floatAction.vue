<template>
  <v-menu
    ref="floatAction"
    :value="core._floatAction.value"
    attach
    @input="$refs.floatAction.isActive = core._floatAction.value"
  >
    <div
      v-if="core._floatAction.component"
      :is="core._floatAction.component"
      :core="core"
      @DOMSubtreeModified.native="calcDimensions()"
      style="max-height:100vh;"
    ></div>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      y: 0,
      x: 0
    };
  },
  props: {
    core: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.core._floatAction.menu = this.$refs.floatAction;
    this.$refs.floatAction.$refs.content.style.position = "fixed";

    // teclas de navegação em listagem
    this._actionsEvent = this.core.editor.addEventListener("keydown", event => {
      // verificando se menu esta ativo
      if (!this.$refs.floatAction.isActive) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          this.$refs.floatAction.isActive = false;
          break;
        default:
          this.$refs.floatAction.changeListIndex(event);
          break;
      }

      let tmp = {
        node: window.getSelection().focusNode,
        offset: window.getSelection().focusOffset
      };
      if (this.$refs.floatAction.activeTile)
        this.$refs.floatAction.activeTile.focus();
      window.getSelection().removeAllRanges();
      window.getSelection().setPosition(tmp.node, tmp.offset);
    });
  },
  beforeDestroy() {
    this.core.editor.removeEventListener("keydown", this._actionsEvent);
  },
  watch: {
    "core.selection"(v) {
      if (v.focusNode.nodeName !== "#text") return;
      this.calcDimensions();
    },
    "core._floatAction.value"(v) {
      this.$refs.floatAction.isActive = v;
      if (!v) return;
      setTimeout(() => {
        this.calcDimensions();
      }, 100);
    }
  },
  methods: {
    calcDimensions() {
      if (!this.core._floatAction.value) return;

      this.y =
        this.core.selection.getRangeAt(0).getBoundingClientRect().y +
        this.core.selection.getRangeAt(0).getBoundingClientRect().height;
      let maxX =
        this.core.editor.getBoundingClientRect().width +
        this.core.editor.getBoundingClientRect().x -
        this.$refs.floatAction.$refs.content.clientWidth;
      maxX = maxX < 0 ? 0 : maxX;
      if (
        this.y + this.$refs.floatAction.$refs.content.clientHeight >
        window.innerHeight
      )
        this.y =
          this.core.selection.getRangeAt(0).getBoundingClientRect().y -
          this.$refs.floatAction.$refs.content.clientHeight;

      let x = this.core.selection.getRangeAt(0).getBoundingClientRect().x;
      x = x > maxX ? maxX : x;
      this.y = this.y < 0 ? 0 : this.y;

      if (x < 0) return;

      this.x = x;
      this.$refs.floatAction.$refs.content.style.transform = `translate(${
        this.x
      }px, ${this.y}px)`;
      this.$refs.floatAction.$refs.content.style.maxWidth =
        this.core.editor.getBoundingClientRect().width + "px";
    }
  }
};
</script>
