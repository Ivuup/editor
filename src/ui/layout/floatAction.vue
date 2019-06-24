<template>
  <v-menu
    ref="floatAction"
    attach
    absolute
    min-width="100%"
    :style="`width: 100%; position: absolute; top: ${y}px`"
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
      y: 0
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
      let node =
        v.focusNode.nodeName != "P" ? v.focusNode.parentNode : v.focusNode;
      this.y = node.offsetTop + node.clientHeight - node.parentNode.scrollTop;
    }
  }
};
</script>
