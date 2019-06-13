<template>
  <v-menu attach right offset-x>
    <v-btn :class="{ add: true, active: show}" slot="activator" small icon
      :style="`margin-top: ${offsetTop}px;`"
    >
      <v-icon>add_circle_outline</v-icon>
    </v-btn>
    <v-card>
      <v-btn icon @click="$emit('command', 'bold.toggle')">B</v-btn>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      show: null,
      target: null,
      offsetTop: 0,
      errorHeight: 45
    }
  },
  props: {
    core: {
      required: true
    }
  },
  watch: {
    'core.selection'(v) {
      this.show =  v.focusNode.innerText == "" || v.focusNode.textContent == ""
      this.target = v.focusNode
      if (v.focusNode.nodeType == 1)
        this.offsetTop = v.focusNode.offsetTop - this.errorHeight
    }
  }
}
</script>

<style>
.add:not(.active) {
  opacity: 0;
}
</style>
