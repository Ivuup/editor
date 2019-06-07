<template>
    <vue-tribute :options="tributeOptions">
        <slot name="content"></slot>
    </vue-tribute>
</template>

<script>
import VueTribute from 'vue-tribute'

export default {
    components: {
        VueTribute
    },
    data() {
        return {
            tributeOptions: {
                values: async (text, cb) => {
                    const persons = (await this.$store.dispatch('Person/search', {})).data
                    cb(persons)
                },
                selectTemplate: function (item) {
                    if (typeof item === 'undefined') return null;
                    if (this.range.isContentEditable(this.current.element)) {
                        return `<span contenteditable="false" class="ivuup-editor-mentioned-person" data-id="${item.original.id}">
                                    <a title="${item.original.email}">${item.original.name || item.original.email}</a>
                                </span>`;
                    }
                    return '@' + item.original.name || item.original.email;
                },
                lookup: function (person, mentionText) {
                    return `<div>
                                <div>${person.name || person.email}</div>
                                <div>${person.email}</div>
                            </div>`;
                },
                menuItemTemplate: function (item) {
                    return `<div style="display: flex; align-items: center;">
                                <img width="30" src="${item.original.image_url}">
                                ${item.string}
                            </div>`;
                }
            }
        }
    }
}
</script>