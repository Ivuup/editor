<template>
  <v-list v-if="core.config.hotkey[0].items.length > 0">
    <v-list-tile v-for="item in core.config.hotkey[0].items" :key="item.raw">
      <v-list-tile-content>{{ item.name }}</v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    core: {
      type: Object,
      required: true
    }
  }
}
</script>
