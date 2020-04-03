<template>
    <select v-if="!options" disabled><option>{{ loadingText || 'Loading...' }}</option></select>
    <select v-else v-model="selectedItem">
        <option v-if="nullText" :value="null">{{ nullText }}</option>
        <option v-for="option in options" :key="option.id" :value="option">{{ textKey ? option[textKey] : option }}</option>
    </select>
</template>

<script>
export default {
    props: ['value', 'url', 'params', 'itemsKey', 'preprocessor', 'textKey', 'nullText', 'loadingText'],

    data() {
        return {
            options: null,
            selectedItem: null
        }
    },

    watch: {
        params() {
            this.load();
        },

        selectedItem() {
            this.$emit('input', this.selectedItem);
        },

        value() {
            this.selectedItem = this.value;
        }
    },

    mounted() {
        this.load();
    },

    methods: {
        async load() {
            this.options = null;
            let params = this.params ? { params: this.params } : undefined
            let result = await this.$http.get(this.url, params);
            let options = this.itemsKey ? result.data[this.itemsKey] : result.data;
            this.preprocessor && this.preprocessor(options);
            this.options = options;
            this.selectedItem = this.value;
        }
    }
}
</script>