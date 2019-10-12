<template>
  <v-menu attach bottom offset-y v-if="typeof item.command == 'object'">
    <template #activator="{ on }">
      <v-btn icon small class="mx-0" :title="item.title" v-on="on">
        <v-icon v-bind="iconProps">{{ item.icon }}</v-icon>
      </v-btn>
    </template>
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
    class="mx-0"
    :title="item.title"
    :color="item.active ? 'grey lighten-2' : null"
  >
    <v-icon v-bind="iconProps">{{ item.icon }}</v-icon>
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
    },
    iconProps: {
      type: Object,
      default: () => ({
        small: true
      })
    }
  }
};
</script>
