<template>
  <v-menu attach bottom offset-y :class="{ add: true, active: show}">
    <v-btn
      slot="activator"
      small
      class="mx-0 mb-0"
      icon
      :style="`margin-top: ${offsetTop}px;`"
    >
      <v-icon>add_circle_outline</v-icon>
    </v-btn>
    <v-card class="pa-1">
      <btn
        v-for="button in buttons" 
        :key="button.name"
        :item="button"
        @command="$emit('command', $event)"
      ></btn>
    </v-card>
  </v-menu>
</template>

<script>
import Btn from '@/ui/button'

export default {
  components: {
    Btn
  },
  computed: {
    buttons() {
      return this.core.config.buttonToolbar.slice().map(i => this.core.enabledButtons[i])
    }
  },
  data() {
    return {
      show: null,
      target: null,
      offsetTop: 0,
      errorHeight: 5
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
      if (this.offsetTop < 40)
        this.offsetTop = 40
    }
  }
}
</script>