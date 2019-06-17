<template>
  <v-menu :value="value">
    <v-list v-if="items.length > 0">
      <v-list-tile>
        <v-list-tile-content>{{ item.name }}</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: []
    }
  }
}
</script>
