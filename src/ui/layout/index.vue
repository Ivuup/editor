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
import Hotkey from '@/plugins/Hotkey'
import ImageUpload from '@/plugins/Image/Upload'
import Preview from '@/plugins/Link/Preview'
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
        editor: context.$refs.editor,
        plugins: [
          Link,
          Hotkey,
          Preview,
          ...Format,
          ImageUpload
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
          ],
          placeholder: 'Digite aqui...',
          hotkey: [
            {
              marker: '@',
              items: [
                {
                  name: 'Amy',
                  original: '@user(2)',
                  render: ''
                }
              ]
            }
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