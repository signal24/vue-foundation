<template>
    <Modal class="vf-alert" :class="classes">
        <template v-if="!this.isBare" v-slot:header>
            <h1>{{ title }}</h1>
        </template>

        <div v-if="isHtml" v-html="message" class="user-message"></div>
        <div v-else v-user-text="message"></div>

        <template v-if="!this.isBare" v-slot:footer>
            <template v-if="shouldConfirm">
                <button class="primary" @click="ok" v-autofocus>Confirm</button>
                <button class="default" @click="$dismiss()">Cancel</button>
            </template>
            <button v-else class="default" @click="ok" v-autofocus>OK</button>
        </template>
    </Modal>
</template>

<script>
import app from '../app';
import Modal from './modal';

const classDef = {
    components: {
        Modal
    },

    data() {
        return {
            isBare: false,
            isHtml: false,
            classes: [],
            title: null,
            message: null,
            shouldConfirm: false
        };
    },

    created() {
        if (typeof this.message == 'object') {
            if (this.message.html) {
                this.isHtml = true;
                this.message = this.message.html;
            } else if (this.message instanceof Error) {
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

async function launchModal(context, classDef, ...args) {
    classDef = { ...classDef, __modalId: Math.random().toString(36).substring(2, 10) };
    return await context.$modal.apply(context, [classDef, ...args]);
}

app.config.globalProperties.$alert = async function (title, message) {
    return await launchModal(this, classDef, { title, message });
};

app.config.globalProperties.$confirm = async function (title, message, options) {
    options = options || {};
    const result = await launchModal(this, classDef, { title, message, shouldConfirm: true, ...options });
    return !!result;
};

app.config.globalProperties.$confirmDestroy = function (title, message, options) {
    options = options || {};
    options.classes = options.classes || [];
    options.classes.push('destructive');
    return this.$confirm(title, message, options);
};

app.config.globalProperties.$wait = function (title, message) {
    if (title && !message) {
        message = title;
        title = undefined;
    } else if (!title && !message) {
        message = 'Please wait...';
    }

    let resolved = null;
    let promise = new Promise((resolve, reject) => {
        launchModal(this, classDef, { title, message, isBare: true, classes: ['wait'] }, resolve);
    }).then(inResolved => (resolved = inResolved));

    this.$endWait = async () => {
        delete this.$endWait;
        if (resolved) await resolved.$dismiss();
        else await promise.then(() => resolved.$dismiss());
    };

    return this.$endWait;
};
</script>

<style lang="scss">
.vf-modal-wrap.vf-alert {
    .vf-modal {
        max-width: 800px;

        > .vf-modal-content {
            padding: 12px;
        }
    }

    &.wait {
        .vf-modal-content {
            text-align: center;
        }
    }

    &.destructive {
        button.primary {
            color: red;
        }
    }
}
</style>
