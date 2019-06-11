<template lang="html">
    <div class="ivuup-editor" v-click-outside="clickOutside" :class="{editor: true, white: true, actived, mobile}" ref="editor">
        <div class="toolbar">
            <slot name="before"></slot>
            <div class="toolbar_default" ref="toolbar_default">
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
            <slot name="after"></slot>
        </div>
        <mention>
            <div slot="content" class="content"
                ref="content"
                contenteditable
                @dblclick="toggleTypography"
                @keyup="keypress"
                @input="input"
                @blur="blur"
                @change="change"
                @focus="actived = true"
                v-html="innerHTML"
                @tribute-replaced="replaceInnerHTML"
                >
            </div>
        </mention>
        <span
            v-show="!text"
            class="editor-placeholder"
            @click="$refs.content.focus()"
            v-text="placeholder"
            >
        </span>
    </div>
</template>

<script>
import IvuupColorPicker from './Components/IvuupColorPicker.vue'
import Mention from './Components/Mention.vue'

export default {
    components:{
        IvuupColorPicker,
        Mention
    },
    props:{
        value:{
            type: String
        },
        placeholder:{
            type: String,
            default: 'Sem descrição'
        }
    },
    data(){
        return {
            body: this.value,
            enableTypography: false,
            editing: false,
            color: null,
            actived: false
        }
    },
    computed:{
        text(){
            let parser = new DOMParser()
            let doc = parser.parseFromString(this.value, 'text/html')
            return doc.body.textContent == 'null' ? null : doc.body.textContent;
        },
        mobile(){
            return this.$vuetify.breakpoint.smAndDown
        },
        innerHTML: {
            get() {
                return this.value || this.body
            },
            set(v) {
                this.body = v
                this.$refs.content.innerHTML = v
            }
        }
    },
    watch:{
        actived(actived){
            this.$emit('actived', actived);
        },
        enableTypography(enable){
            if(enable){
                this.last_selection = window.getSelection().getRangeAt(0)
            }
        }
    },
    mounted(){
        this.$root.$el.addEventListener('mouseup', this.listenerMouseup);
    },
    beforeDestroy(){
        this.$root.$el.removeEventListener('mouseup', this.listenerMouseup);
    },
    methods:{
        clickOutside(event){
            // Caso o click foi no IvuupColorPicker
            if(event.target.closest('.ivuup-color-picker')){
                return
            }

            this.actived = false
        },
        setColor(color) {
            let selection = window.getSelection();
            if(!selection){
                return false
            }
            selection.removeAllRanges();

            selection.addRange(this.last_selection);
            this._execComand("foreColor", false, color)
            selection.removeAllRanges();

            this.last_selection = null
        },
        clear(){
            this.$refs.content.innerHTML = null
        },
        focus(){
            this.$nextTick(() => this.$refs.content.focus() )
        },
        _html(){
            return this.$refs.content.innerHTML
        },
        _execComand(...params){
            document.execCommand(...params)
            this.change()
        },
        link(){
            var url = prompt("Digite a URL");
            this._execComand("createLink", false, url)
        },
        typography(type){
            this._execComand(type, false, '')
        },
        clearTypography(){
            this._execComand('removeFormat')
        },
        listenerMouseup(event){
            this.toggleTypography()
        },
        disableTypography(){
            this.enableTypography = false
        },
        keypress(){
            this.toggleTypography()
            this.change()
        },
        toggleTypography(){
            setTimeout(() => {
                let selection = window.getSelection();
                this.enableTypography = selection.type == 'Range' && this.$refs.editor.contains(selection.focusNode)
            }, 200)
        },
        change(){
            // Disparando o save
            if(this.editing){
                clearTimeout(this.editing);
            }

            this.editing = setTimeout(() => {
                this.$emit('change', this._html())
                this.$emit('editing', false)
            }, 1000)

            this.$emit('editing', true)
        },
        input(){
            this.$emit('input', this._html())
        },
        blur(){
            this.$emit('blur', this._html())
        },
        replaceInnerHTML(event) {
            this.$emit('input', event.target.innerHTML)
        }
    }
}
</script>

<style scoped>
    @import url('~tributejs/dist/tribute.css');

    .ivuup-editor{
        position: relative;
        margin: 15px;
    }
    .actived.ivuup-editor{
        border: solid .5px #ddd !important;
        border-radius: 2px !important;
    }
    .content{
        padding: 10px 22px;
        min-height: 80px;
        max-height: 200px;
        overflow-y: auto;
    }

    .content >>> img{
        max-width: 100%
    }
    .toolbar{
        padding: 0 29px;
        text-align: left;
        height: 0px;
        -webkit-transition: height 0.5s;
        transition: height 0.5s;
        overflow: hidden;
    }
    .actived > .toolbar{
        overflow: unset;
        height: 42px;
        border-bottom: solid .5px #ddd;
    }
    .mobile.actived > .toolbar{
        height: 80px;
    }
    .toolbar > div{
        display: inline-block;
    }

    [contenteditable="true"]:active,
    [contenteditable="true"]:focus{
        border:none;
        outline:none;
    }

    .ivuup-editor > .editor-placeholder{
        position: absolute;
        top: 10px;
        left: 29px;
        font-style: italic;
        color: #ddd
    }
    .actived.ivuup-editor > .editor-placeholder{
        visibility: hidden;
    }
</style>
