<template>
  <div class="i-editor">
    <div class="i-button-toolbar" v-if="core && core.config.buttonToolbar">
        <buttonToolbar
          :core="core"
          @command="command"
        ></buttonToolbar>
      </div>
    <div class="wrap">
      <toolbar
        v-if="core && core.config.toolbar"
        class="i-toolbar"
        :core="core"
        @command="command"
      ></toolbar>
      <div
        class="i-content"
        ref="editor"
      ></div>
    </div>
  </div>
</template>

<script>
import Core from '@/core'
import Toolbar from './toolbar.vue'
import Format from '@/plugins/Format'
import Link from '@/plugins/Link'
import ButtonToolbar from './buttonToolbar.vue'

export default {
  components: {
    ButtonToolbar,
    Toolbar
  },
  data() {
    return {
      core: null
    }
  },
  created() {
    this.$nextTick().then((context) => {
      context.core = new Core({
        element: context.$refs.editor,
        plugins: [
          Link,
          ...Format
        ],
        config: {
          toolbar: [
            'alignment',
            'bold',
            'italic',
            'underline',
            'removeFormat',
            'horizontalRule'
          ],
          buttonToolbar: [
            'link'
          ]
        },
        innerHTML: null
      })
    })
  },
  methods: {
    command(command) {
      this.core.exec(command)
    }
  }
}
</script>