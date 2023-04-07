<template>
    <div class="vf-smart-select" :class="{ disabled: effectiveDisabled, open: shouldDisplayOptions }">
        <input
            v-model="searchText"
            ref="searchField"
            type="text"
            :class="{ nullable: !!props.nullTitle }"
            @keydown="handleKeyDown"
            :placeholder="effectivePlaceholder"
            v-disabled="effectiveDisabled"
            @focus="handleInputFocused"
            @blur="handleInputBlurred"
        />
        <div v-if="shouldDisplayOptions" ref="optionsContainer" class="vf-smart-select-options">
            <div v-if="!isLoaded" class="no-results">Loading...</div>
            <template v-else>
                <div
                    v-for="option in effectiveOptions"
                    :key="String(option.key)"
                    class="option"
                    :class="{
                        highlighted: highlightedOptionKey === option.key
                    }"
                    @mousemove="handleOptionHover(option)"
                    @mousedown="selectOption(option)"
                >
                    <div class="title" v-html="option.title" />
                    <div v-if="option.subtitle" class="subtitle" v-html="option.subtitle" />
                </div>
                <div v-if="!effectiveOptions.length && searchText" class="no-results">
                    {{ effectiveNoResultsText }}
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
// eslint-disable-next-line vue/prefer-import-from-vue
import { escapeHtml } from '@vue/shared';
import { debounce } from 'lodash';
import { defineComponent, defineEmits, defineProps } from 'vue';

const NullSymbol = Symbol('null');
const CreateSymbol = Symbol('create');

const VALID_KEYS = `\`1234567890-=[]\\;',./~!@#$%^&*()_+{}|:"<>?qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM`;

// todo: make type safe when Vue alpha is released

type GenericObject = { [key: string]: any };
interface OptionDescriptor {
    key: string | Symbol;
    title: string;
    subtitle?: string | null;
    searchContent?: string;
    ref?: GenericObject;
}

export default defineComponent({
    setup() {
        const props = defineProps<{
            modelValue?: GenericObject;
            loadOptions?: (searchText: string | null) => Promise<GenericObject[]>;
            options?: GenericObject[];
            prependOptions?: GenericObject[];
            appendOptions?: GenericObject[];
            onCreateItem?: (searchText: string) => void;
            preload?: boolean;
            keyProp?: string; // K
            remoteSearch?: boolean;
            searchFields?: string[];
            placeholder?: string;
            formatter: (option: GenericObject) => string;
            subtitleFormatter?: (option: GenericObject) => string;
            nullTitle?: string;
            noResultsText?: string;
            disabled?: boolean;
            optionsListId?: string;
            debug?: boolean;
        }>();

        defineEmits<{
            optionsLoaded: (options: any[]) => void;
            createItem: (searchText: string) => void;
            'update:modelValue': (value: any) => void;
        }>();

        return { props };
    },

    data() {
        return {
            isLoaded: false,
            loadedOptions: [],
            isSearching: false,
            searchText: '',
            selectedOption: null,
            selectedOptionTitle: null,
            shouldDisplayOptions: false,
            highlightedOptionKey: null,
            shouldShowCreateOption: false
        } as {
            isLoaded: boolean;
            loadedOptions: GenericObject[];
            isSearching: boolean;
            searchText: string;
            selectedOption: GenericObject | null;
            selectedOptionTitle: string | null;
            shouldDisplayOptions: boolean;
            highlightedOptionKey: string | Symbol | null;
            shouldShowCreateOption: boolean;
        };
    },

    computed: {
        /**
         * EFFECTIVE PROPS
         */
        effectiveDisabled() {
            return this.props.disabled || !this.loadedOptions;
        },

        effectivePlaceholder() {
            if (!this.isLoaded && this.props.preload) return 'Loading...';
            if (this.props.nullTitle) return this.props.nullTitle;
            return this.props.placeholder || '';
        },

        effectiveNoResultsText() {
            return this.props.noResultsText || 'No options match your search.';
        },

        /**
         * OPTIONS GENERATION
         */

        fullOptionsArray() {
            return [...(this.props.prependOptions ?? []), ...this.loadedOptions, ...(this.props.appendOptions ?? [])];
        },

        optionsDescriptors() {
            return this.fullOptionsArray.map((option, index) => {
                const title = this.props.formatter(option);
                const subtitle = this.props.subtitleFormatter?.(option);
                const strippedTitle = title ? title.trim().toLowerCase() : '';
                const strippedSubtitle = subtitle ? subtitle.trim().toLowerCase() : '';

                const searchContent = [];
                if (this.props.searchFields) {
                    this.props.searchFields.forEach(field => {
                        option[field] && searchContent.push(String(option[field]).toLowerCase());
                    });
                } else {
                    searchContent.push(strippedTitle);
                    strippedSubtitle && searchContent.push(strippedSubtitle);
                }

                return {
                    key: String(this.props.keyProp ? option[this.props.keyProp] : index),
                    title,
                    subtitle,
                    searchContent: searchContent.join(''),
                    ref: option
                } as OptionDescriptor;
            });
        },

        effectiveOptions() {
            let options = [...this.optionsDescriptors];

            if (this.isSearching) {
                const strippedSearchText = this.searchText.trim().toLowerCase();

                if (strippedSearchText.length) {
                    options = options.filter(option => option.searchContent!.includes(strippedSearchText));

                    const escapedSearchText = escapeHtml(this.searchText).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const searchRe = new RegExp(`(${escapedSearchText})`, 'ig');

                    options = options.map(option => ({
                        ...option,
                        title: option.title.replace(searchRe, '<mark>$1</mark>'),
                        subtitle: option.subtitle?.replace(searchRe, '<mark>$1</mark>')
                    }));

                    if (this.shouldShowCreateOption) {
                        const hasExactMatch = options.find(option => option.searchContent === strippedSearchText) !== undefined;
                        if (!hasExactMatch) {
                            options.push({
                                key: CreateSymbol,
                                title: 'Create <strong>' + this.searchText.trim() + '</strong>...'
                            });
                        }
                    }
                }
            } else if (this.props.nullTitle) {
                options.unshift({
                    key: NullSymbol,
                    title: this.props.nullTitle
                });
            }

            return options;
        }
    },

    watch: {
        // props

        modelValue() {
            this.handleValueChanged();
        },

        options() {
            this.loadedOptions = this.props.options ?? [];
        },

        // data

        optionsDescriptors() {
            if (this.shouldDisplayOptions) {
                setTimeout(this.highlightInitialOption, 0);
            }
        },

        searchText() {
            // don't disable searching here if it's remote search, as that will need to be done after the fetch
            if (this.isSearching && !this.props.remoteSearch && !this.searchText.trim().length) {
                this.isSearching = false;
            }
        },

        shouldDisplayOptions() {
            if (this.shouldDisplayOptions) {
                setTimeout(this.handleOptionsDisplayed, 0);
            } else {
                this.isSearching = false;
                this.searchText = this.selectedOptionTitle || '';
            }
        },

        effectiveOptions() {
            if (!this.highlightedOptionKey || !this.effectiveOptions.find(option => option.key == this.highlightedOptionKey)) {
                this.highlightedOptionKey = this.effectiveOptions.length ? this.effectiveOptions[0].key : null;
            }
        }
    },

    async mounted() {
        this.shouldShowCreateOption = this.$attrs['onCreateItem'] !== undefined;

        if (this.props.options) {
            this.loadedOptions = this.props.options;
            this.isLoaded = true;
        } else if (this.props.preload) {
            await this.loadRemoteOptions();
        }

        this.handleValueChanged();

        this.$watch('selectedOption', () => {
            if (this.selectedOption !== this.props.modelValue) {
                this.$emit('update:modelValue', this.selectedOption);
            }
        });

        if (this.props.remoteSearch) {
            this.$watch('searchText', debounce(this.reloadOptionsIfSearching, 250));
        }
    },

    methods: {
        async loadRemoteOptions() {
            await this.reloadOptions();
            this.$emit('optionsLoaded', this.loadedOptions);
        },

        handleSourceUpdate() {
            console.log('source updated');
            if (this.props.preload) return this.reloadOptions();
            if (!this.isLoaded) return;
            this.isLoaded = false;
            this.loadedOptions = [];
        },

        async reloadOptions() {
            const searchText = this.props.remoteSearch && this.isSearching && this.searchText ? this.searchText : null;
            this.loadedOptions = (await this.props.loadOptions?.(searchText)) ?? [];
            this.isLoaded = true;
        },

        reloadOptionsIfSearching() {
            if (this.isSearching) {
                this.reloadOptions();
                this.isSearching = this.searchText.trim().length > 0;
            }
        },

        handleKeyDown(e: KeyboardEvent) {
            if (e.key == 'Escape') {
                e.stopPropagation();
                (e.target as any).blur();
                return;
            }

            if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') return;
            if (e.key == 'Tab') return;

            if (!this.isLoaded) {
                this.isSearching || e.preventDefault();
                return;
            }

            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                e.preventDefault();
                return this.incrementHighlightedOption(e.key == 'ArrowUp' ? -1 : 1);
            }

            if (e.key == 'PageUp' || e.key == 'PageDown') {
                e.preventDefault();
                return this.incrementHighlightedOption(e.key == 'PageUp' ? -10 : 10);
            }

            if (e.key == 'Home' || e.key == 'End') {
                e.preventDefault();
                return this.incrementHighlightedOption(e.key == 'Home' ? -Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);
            }

            if (e.key == 'Enter') {
                e.preventDefault();
                const highlightedOption = this.effectiveOptions.find(option => option.key == this.highlightedOptionKey);
                if (highlightedOption) return this.selectOption(highlightedOption);
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.searchText.length > 1) {
                    this.isSearching = true;
                }
                return;
            }

            if (!e.metaKey && VALID_KEYS.includes(e.key)) {
                this.isSearching = true;
            }
        },

        handleInputFocused() {
            if (this.selectedOption)
                this.highlightedOptionKey = String(
                    this.props.keyProp ? this.selectedOption[this.props.keyProp] : this.loadedOptions.indexOf(this.selectedOption)
                );
            else if (this.props.nullTitle) this.highlightedOptionKey = NullSymbol;

            this.shouldDisplayOptions = true;
        },

        handleInputBlurred() {
            if (this.props.debug) return;

            if (!this.searchText.length && this.props.nullTitle) {
                this.selectedOption = null;
                this.selectedOptionTitle = null;
            }

            this.shouldDisplayOptions = false;
        },

        handleOptionsDisplayed() {
            this.isLoaded || this.loadRemoteOptions();
            this.teleportOptionsContainer();
            this.props.optionsListId && (this.$refs.optionsContainer as HTMLElement).setAttribute('id', this.props.optionsListId);
        },

        teleportOptionsContainer() {
            const elRect = this.$el.getBoundingClientRect();
            const targetTop = elRect.y + elRect.height + 2;
            const targetLeft = elRect.x;

            const optionsEl = this.$refs.optionsContainer as HTMLElement;
            const styles = window.getComputedStyle(this.$el);

            for (let key in styles) {
                if (!/^(font|text)/.test(key)) continue;
                optionsEl.style[key] = styles[key];
            }

            optionsEl.style.top = targetTop + 'px';
            optionsEl.style.left = targetLeft + 'px';
            optionsEl.style.minWidth = elRect.width + 'px';

            if (!styles.maxHeight || styles.maxHeight == 'none') {
                const maxHeight = window.innerHeight - targetTop - 12;
                optionsEl.style.maxHeight = maxHeight + 'px';
            }

            document.body.appendChild(optionsEl);

            setTimeout(this.highlightInitialOption, 0);
        },

        highlightInitialOption() {
            if (!this.isLoaded) return;
            if (!this.highlightedOptionKey) return;
            const highlightedOptionIdx = this.effectiveOptions.findIndex(option => option.key == this.highlightedOptionKey);
            const containerEl = this.$refs.optionsContainer as HTMLElement;
            const highlightedOptionEl = containerEl.querySelectorAll('.option')[highlightedOptionIdx] as HTMLElement;
            containerEl.scrollTop = highlightedOptionEl.offsetTop;
        },

        handleOptionHover(option: OptionDescriptor) {
            this.highlightedOptionKey = option ? option.key : null;
        },

        incrementHighlightedOption(increment: number) {
            const highlightedOptionIdx = this.effectiveOptions.findIndex(option => option.key == this.highlightedOptionKey);
            let targetOptionIdx = highlightedOptionIdx + increment;

            if (targetOptionIdx < 0) targetOptionIdx = 0;
            else if (targetOptionIdx >= this.effectiveOptions.length) targetOptionIdx = this.effectiveOptions.length - 1;

            if (highlightedOptionIdx == targetOptionIdx) return;

            this.highlightedOptionKey = this.effectiveOptions[targetOptionIdx].key;

            const containerEl = this.$refs.optionsContainer as HTMLElement;
            const targetOptionEl = containerEl.querySelectorAll('.option')[targetOptionIdx] as HTMLElement;

            if (targetOptionEl.offsetTop < containerEl.scrollTop) {
                containerEl.scrollTop = targetOptionEl.offsetTop;
            } else if (targetOptionEl.offsetTop + targetOptionEl.offsetHeight > containerEl.scrollTop + containerEl.clientHeight) {
                containerEl.scrollTop = targetOptionEl.offsetTop + targetOptionEl.offsetHeight - containerEl.clientHeight;
            }
        },

        selectOption(option: OptionDescriptor) {
            this.isSearching = false;

            if (option.key == NullSymbol) {
                this.searchText = '';
                this.selectedOption = null;
                this.selectedOptionTitle = null;
            } else if (option.key === CreateSymbol) {
                const createText = this.searchText.trim();
                this.searchText = '';
                this.selectedOption = null;
                this.selectedOptionTitle = null;
                this.$emit('createItem', createText);
            } else {
                const selectedDecoratedOption = this.optionsDescriptors.find(decoratedOption => decoratedOption.key == option.key);
                const realOption = selectedDecoratedOption!.ref;
                this.selectedOption = realOption!;
                this.selectedOptionTitle = this.props.formatter(realOption!);
                this.searchText = this.selectedOptionTitle || '';
            }

            (this.$refs.searchField as HTMLElement).blur();
        },

        handleValueChanged() {
            if (this.props.modelValue) {
                this.selectedOption = this.props.modelValue;
                this.selectedOptionTitle = this.props.formatter(this.selectedOption);
                this.searchText = this.selectedOptionTitle || '';
            } else {
                this.selectedOption = null;
                this.selectedOptionTitle = null;
                this.searchText = '';
            }
        },

        addRemoteOption(option: GenericObject) {
            this.loadedOptions.push(option);
        }
    }
});
</script>

<style lang="scss">
.vf-smart-select {
    position: relative;

    input {
        width: 100%;
        padding-right: 24px !important;

        &.nullable::placeholder {
            color: #000;
        }
    }

    &:after {
        content: ' ';
        display: block;
        position: absolute;
        top: 50%;
        right: 8px;
        margin-top: -3px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 0 5px;
        border-color: #333333 transparent transparent transparent;
        pointer-events: none;
    }

    &.open:after {
        margin-top: -4px;
        border-width: 0 5px 5px 5px;
        border-color: transparent transparent #333333 transparent;
    }

    &:not(.disabled) {
        input {
            cursor: pointer;
        }
    }

    &.disabled:after {
        opacity: 0.4;
    }
}

.vf-smart-select-options {
    position: absolute;
    min-height: 20px;
    border: 1px solid #e8e8e8;
    background: white;
    overflow: auto;
    z-index: 101;

    .option,
    .no-results {
        padding: 5px 8px;
    }

    .option {
        cursor: pointer;

        &.highlighted {
            background-color: #f5f5f5;
        }
    }
}
</style>
