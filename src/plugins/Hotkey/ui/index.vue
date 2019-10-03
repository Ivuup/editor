<template>
  <v-list v-if="core.plugins.hotkey.currentList.length > 0">
    <v-list-item
      v-for="item in core.plugins.hotkey.currentList"
      :key="item.raw"
      @click="core.exec('hotkey.selectedItem', item)"
    >
      <v-list-item-content>{{ item.name }}</v-list-item-content>
    </v-list-item>
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
