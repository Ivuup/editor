<template>
  <v-menu attach bottom offset-y v-if="typeof item.command == 'object'">
    <v-btn icon small slot="activator">
      <v-icon>format_align_justify</v-icon>
    </v-btn>
    <v-card>
      <recursive-button
        v-for="button in item.command"
        :key="button.name"
        :item="button"
        @command="$emit('command', $event)"
      ></recursive-button>
    </v-card>
  </v-menu>
  <v-btn
    v-else
    icon
    small
    @click="$emit('command', item.command)"
    class="mx-1"
    :color="item.active ? 'grey lighten-2' : null"
  >
    <v-icon>{{ item.icon }}</v-icon>
  </v-btn>
</template>

<script>
import Button from "../../contracts/Button";

export default {
  name: "recursive-button",
  props: {
    item: {
      type: Button,
      required: true
    }
  }
};
</script>
