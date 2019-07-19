<template>
  <v-menu
    ref="floatAction"
    attach
    absolute
    max-width="100%"
    :style="`width: 100%; position: absolute; top: ${y}px; left: ${x}px`"
    :value="core._floatAction.value"
  >
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
  },
  watch: {
    "core.selection"(v) {
      if (v.focusNode.nodeName == "P") return;
      let maxX =
        v.focusNode.parentElement.clientWidth -
        this.$refs.floatAction.$refs.content.clientWidth;
      maxX = maxX < 0 ? 0 : maxX;
      this.y =
        v.focusNode.parentElement.offsetTop +
        v.focusNode.parentElement.clientHeight -
        v.focusNode.parentElement.parentNode.scrollTop;
      let x =
        v.getRangeAt(0).getBoundingClientRect().x -
        this.core.editor.getBoundingClientRect().x;
      x = x > maxX ? maxX : x;

      if (x < 0) return;

      this.x = x;
    }
  }
};
</script>
