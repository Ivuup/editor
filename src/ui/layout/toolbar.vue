<template>
  <div class="toolbar">
    <v-menu :attach="$refs.toolbar_default" top nudge-left="27px" nudge-top="30px" :disabled="!enableTypography">
      <v-btn :disabled="!enableTypography" icon small slot="activator">
        <v-icon size="16">format_align_justify</v-icon>
      </v-btn>
      <v-btn-toggle>
        <v-btn icon small @click="typography('justifyLeft')">
            <v-icon color="black" size="17">format_align_left</v-icon>
        </v-btn>
        <v-btn icon small @click="typography('justifyCenter')">
            <v-icon color="black" size="17">format_align_center</v-icon>
        </v-btn>
        <v-btn icon small @click="typography('justifyRight')">
            <v-icon color="black" size="17">format_align_right</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-menu>
    <v-btn :disabled="!enableTypography" icon small @click="typography('bold')">
      <v-icon color="black" size="17">format_bold</v-icon>
    </v-btn>
    <v-btn :disabled="!enableTypography" icon small @click="typography('italic')">
      <v-icon color="black" size="17">format_italic</v-icon>
    </v-btn>
    <v-btn :disabled="!enableTypography" icon small @click="typography('underline')">
      <v-icon color="black" size="17">format_underlined</v-icon>
    </v-btn>
    <v-btn icon small @click="link">
      <v-icon color="black" size="17">link</v-icon>
    </v-btn>
    <ivuup-color-picker @input="setColor"></ivuup-color-picker>
    <v-btn :disabled="!enableTypography" icon small @click="clearTypography">
      <v-icon color="black" size="17">format_clear</v-icon>
    </v-btn>
    <v-btn icon small @click="typography('insertHorizontalRule')">
      <v-icon color="black" size="17">remove</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
}
</script>