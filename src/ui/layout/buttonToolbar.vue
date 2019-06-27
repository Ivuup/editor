<template>
  <v-menu attach bottom offset-y :class="{ add: true, active: show }">
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
import Btn from "../button";
import Button from "../../contracts/Button";

export default {
  components: {
    Btn
  },
  computed: {
    buttons() {
      return this.core.config.buttonToolbar
        .slice()
        .map(i => (i instanceof Button ? i : this.core.enabledButtons[i]));
    }
  },
  data() {
    return {
      show: null,
      target: null,
      offsetTop: 0
    };
  },
  props: {
    core: {
      required: true
    }
  },
  watch: {
    "core.selection"(v) {
      this.show = v.focusNode.innerText == "" || v.focusNode.textContent == "";
      this.target = v.focusNode;
      if (v.focusNode.nodeType == 1)
        this.offsetTop =
          v.focusNode.offsetTop -
          v.focusNode.clientHeight / 3 -
          v.focusNode.parentNode.scrollTop;
      if (this.offsetTop < 40) this.offsetTop = 40;
    }
  }
};
</script>
