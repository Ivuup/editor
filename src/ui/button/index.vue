<template>
  <v-btn icon small @click="$emit('command', item.command)">
    <v-icon>{{ item.icon }}</v-icon>
  </v-btn>
</template>

<script>
import Button from '@/contracts/Button'

export default {
  props: {
    item: {
      type: Button,
      required: true
    }
  }
}
</script>