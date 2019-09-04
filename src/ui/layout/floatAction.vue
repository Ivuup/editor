<template>
  <v-menu ref="floatAction" attach="body" :value="core._floatAction.value">
    <div
      v-if="core._floatAction.component"
      :is="core._floatAction.component"
      :core="core"
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
  },
  watch: {
    "core.selection"(v) {
      if (v.focusNode.nodeName !== "#text") return;
      this.calcDimensions();
    },
    "core._floatAction.value"(v) {
      this.$refs.floatAction.active = v;
      if (!v) return;
      this.calcDimensions();
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

      if (x < 0) return;

      this.x = x;

      this.$refs.floatAction.$refs.content.style.top = `${this.y}px`;
      this.$refs.floatAction.$refs.content.style.left = `${this.x}px`;
    }
  }
};
</script>
