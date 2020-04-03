<template>
    <modal class="alert" :class="classes">
        <h1 v-if="!this.isBare" slot="header">{{ title }}</h1>

        <div v-if="isHtml" v-html="message" class="user-message"></div>
        <div v-else v-user-text="message"></div>
        
        <template v-if="!this.isBare" slot="footer">
            <template v-if="shouldConfirm">
                <button class="primary" @click="ok" v-autofocus>Confirm</button>
                <button class="default" @click="$dismiss()">Cancel</button>
            </template>
            <button v-else class="default" @click="ok" v-autofocus>OK</button>
        </template>
    </modal>
</template>

<script>
import Vue from 'vue';

let classDef = {
    data() {
        return {
            isBare: false,
            isHtml: false,
            classes: [],
            title: null,
            message: null,
            shouldConfirm: false
        }
    },

    created() {
        if (typeof(this.message) == 'object') {
            if (this.message.html) {
                this.isHtml = true;
                this.message = this.message.html;
            }
            
            else if (this.message instanceof Error) {
                let err = this.message;
                err.handle();

                this.message = err.userMessage;
            }
        }
    },

    methods: {
        ok() {
            this.$dismiss(true);
        }
    }
};

export default classDef;

Vue.prototype.$alert = async function(title, message) {
    return await this.$modal(classDef, { title, message });
}

Vue.prototype.$confirm = async function(title, message) {
    const result = await this.$modal(classDef, { title, message, shouldConfirm: true });
    return !!result;
}

Vue.prototype.$wait = function(title, message) {
    if (title && !message) {
        message = title;
        title = undefined;
    }
    else if (!title && !message) {
        message = 'Please wait...';
    }
    
    let resolved = null;
    let promise = new Promise((resolve, reject) => {
        this.$modal(classDef, { title, message, isBare: true, classes: ['wait'] }, resolve);
    })
    .then(inResolved => resolved = inResolved);
    
    this.$endWait = () => {
        delete this.$endWait;
        if (resolved)
            resolved.$dismiss();
        else
            promise.then(() => resolved.$dismiss());
    }

    return this.$endWait;
}

</script>

<style lang="scss">
.modal.alert {
    .modal-inner {
        max-width: 800px;
        
        > .content {
            padding: 12px;
        }
    }

    &.wait {
        > .modal-inner > .content {
            text-align: center;
        }
    }
}
</style>