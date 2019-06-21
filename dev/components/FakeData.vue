<template>
  <v-card>
    <v-card-title class="title">{{ test }}</v-card-title>
    <v-card-text
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo fugiat
      saepe consectetur tempora optio, iusto neque natus impedit quasi aperiam
      expedita dolores non? Maxime, quaerat exercitationem provident a modi
      perferendis.</v-card-text
    >
  </v-card>
</template>

<script>
export default {
  props: {
    test: {
      default: "Original"
    }
  }
};
</script>
