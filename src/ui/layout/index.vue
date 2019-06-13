<template>
  <div class="i-editor">
    <toolbar class="i-toolbar"
      @command="command"
    ></toolbar>
    <div class="i-button-toolbar">
      <buttonToolbar :core="core"
        @command="command"
      ></buttonToolbar>
    </div>
    <div
      class="i-content"
      ref="editor"
    ></div>
  </div>
</template>

<script>
import Toolbar from './toolbar.vue'
import ButtonToolbar from './buttonToolbar.vue'
import Core from '@/core'
import {Bold} from '@/plugins/Font/Style/Bold'

export default {
  components: {
    ButtonToolbar,
    Toolbar
  },
  data() {
    return {
      core: this.$refs.editor
    }
  },
  mounted() {
    this.$nextTick().then((context) => {
      context.core = new Core({
        element: context.$refs.editor,
        plugins: [
          new Bold
        ],
        innerHTML: null
      })
    })
  },
  methods: {
    command(command) {
      this.core.exec(command)
    },
    // input(e) {
    //   this.core.selection = window.getSelection()
    // },
    // dblClick(e) {
    //   this.core.selection = window.getSelection()
    // }
  }
}
</script>