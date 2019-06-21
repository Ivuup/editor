<template>
  <div class="toolbar">
    <btn
      v-for="button in buttons"
      :key="button.name"
      :item="button"
      @command="$emit('command', $event)"
    ></btn>
  </div>
</template>

<script>
import Btn from "../button";

export default {
  components: {
    Btn
  },
  computed: {
    buttons() {
      if (!this.core.config.toolbar) return [];

      return this.core.config.toolbar
        .slice()
        .map(i => this.core.enabledButtons[i]);
    }
  },
  props: {
    core: {
      required: true
    }
  }
};
</script>
