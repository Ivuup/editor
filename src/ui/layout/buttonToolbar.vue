<template>
  <v-menu
    attach
    bottom
    offset-y
    :class="{ add: true, active: show }"
    v-if="buttonOrButtons.length > 0"
  >
    <template #activator="{ on }">
      <v-btn
        slot="activator"
        small
        class="mx-0 mb-0"
        icon
        :style="`margin-top: ${offsetTop}px;`"
        v-show="show"
        v-on="on"
      >
        <v-icon>add_circle_outline</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-1">
      <btn
        v-for="button in buttonOrButtons"
        :key="button.name"
        :item="button"
        @command="$emit('command', $event)"
      ></btn>
    </v-card>
  </v-menu>
  <btn
    v-else
    @command="$emit('command', $event)"
    :style="`margin-top: ${offsetTop}px; opacity: ${show ? 1 : 0}`"
    :item="buttonOrButtons"
    :iconProps="{}"
  />
</template>

<script>
import Btn from "../button";
import Button from "../../contracts/Button";

export default {
  components: {
    Btn
  },
  computed: {
    buttonOrButtons() {
      if (this.core.config.buttonToolbar instanceof Button)
        return this.core.config.buttonToolbar;

      return this.core.config.buttonToolbar.map(i =>
        i instanceof Button ? i : this.core.enabledButtons[i]
      );
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
      if (this.offsetTop < 22) this.offsetTop = 22;
    }
  }
};
</script>
