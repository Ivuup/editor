<template>
  <v-list v-if="core.plugins.hotkey.currentList.length > 0">
    <v-list-tile
      v-for="item in core.plugins.hotkey.currentList"
      :key="item.raw"
      @click="core.exec('hotkey.selectedItem', item)"
    >
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
};
</script>
