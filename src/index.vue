<template>
  <editor
    ref="editor"
    :core="core || defaultCore"
    @blur="$emit('blur', $event)"
    @input="$emit('input', $event)"
    @editing="$emit('editing', $event)"
  />
</template>

<script>
import Core from '@/core'
import Layout from '@/ui/layout'
import Link from '@/plugins/Link'
import Format from '@/plugins/Format'
import Hotkey from '@/plugins/Hotkey'
import Preview from '@/plugins/Link/Preview'
import ImageUpload from '@/plugins/Image/Upload'

export default {
  components: {
    editor: Layout
  },
  data() {
    return {
      defaultCore: null,
      test: null
    }
  },
  props: {
    core: {
      type: Object
    }
  },
  created() {
    if (!this.core)
      this.$nextTick().then((context) => {
        context.defaultCore = new Core({
          editor: context.$refs.editor.$refs.content,
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
              'link',
              'uploadImage'
            ],
            placeholder: 'Digite aqui...',
            hotkey: [
              {
                marker: '@',
                items: [
                  {
                    name: 'Amy Example',
                    raw: '@user(2)',
                    render: ''
                  }
                ]
              }
            ]
          },
          innerHTML: null
        })
      })
  }
}
</script>

<style>
@import './assets/index.css';
</style>
