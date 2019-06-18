<template>
  <v-menu absolute :position-x="x" :position-y="y" :value="core._floatAction.value">
    <div v-if="core._floatAction.component" :is="core._floatAction.component" :core="core"></div>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      y: 0, 
      x: 0
    }
  },
  props: {
    core: {
      type: Object,
      required: true
    }
  },
  watch: {
    'core.selection'(v) {
      let node = v.focusNode.nodeName != 'P' ? v.focusNode.parentNode : v.focusNode
      this.y = node.offsetTop + 16
      this.x = node.offsetLeft
    }
  }
}
</script>