<template>
    <div class="vf-smart-select" :class="{ disabled: effectiveDisabled, open: shouldDisplayOptions }">
        <input
            v-model="searchText"
            ref="searchField"
            type="text"
            :class="{ nullable: !!nullTitle }"
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
                    :key="option.key"
                    class="option"
                    :class="{
                        highlighted: highlightedOptionKey === option.key
                    }"
                    @mousemove="handleOptionHover(option)"
                    @mousedown="selectOption(option)"
                >
                    <div class="title" v-html="option.titleHtml" />
                    <div v-if="option.subtitleHtml" class="subtitle" v-html="option.subtitleHtml" />
                </div>
                <div v-if="!effectiveOptions.length && searchText" class="no-results">
                    {{ effectiveNoResultsText }}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';

const nullSymbol = Symbol(null);
const createSymbol = Symbol('create');

const VALID_KEYS = `\`1234567890-=[]\\;',./~!@#$%^&*()_+{}|:"<>?qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM`;

export default {
    emits: ['optionsLoaded', 'createItem', 'update:modelValue'],

    props: [
        'modelValue',
        'options',
        'prependOptions',
        'appendOptions',
        'preload',
        'url',
        'urlParams',
        'remoteSearch',
        'searchFields',
        'placeholder',
        'valueKey',
        'idKey',
        'titleKey',
        'titleFormatter',
        'subtitleKey',
        'subtitleFormatter',
        'nullTitle',
        'noResultsText',
        'disabled',
        'optionsListId',
        'debug'
    ],

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
        };
    },

    computed: {
        /**
         * EFFECTIVE PROPS
         */
        effectiveDisabled() {
            return this.disabled || !this.loadedOptions;
        },

        effectivePlaceholder() {
            if (!this.isLoaded && this.$isPropTruthy(this.preload)) return 'Loading...';
            if (this.nullTitle) return this.nullTitle;
            return this.placeholder || '';
        },

        effectiveIdKey() {
            return this.idKey || 'id';
        },

        effectiveTitleKey() {
            return this.titleKey || 'name';
        },

        effectiveValueKey() {
            if (this.valueKey) return this.valueKey;
            if (this.options && !Array.isArray(this.options)) return this.effectiveIdKey;
            return undefined;
        },

        effectiveNoResultsText() {
            return this.noResultsText || 'No options match your search.';
        },

        /**
         * OPTIONS GENERATION
         */

        loadedOptionsArray() {
            return this.arrayifyOptions(this.loadedOptions);
        },

        prependOptionsArray() {
            return this.prependOptions ? this.arrayifyOptions(this.prependOptions) : [];
        },

        appendOptionsArray() {
            return this.appendOptions ? this.arrayifyOptions(this.appendOptions) : [];
        },

        fullOptionsArray() {
            return [...this.prependOptionsArray, ...this.loadedOptionsArray, ...this.appendOptionsArray];
        },

        optionsDescriptors() {
            return this.fullOptionsArray.map((option, index) => {
                const title = this.getOptionTitle(option);
                const subtitle = this.getOptionSubtitle(option);
                const strippedTitle = title ? title.text.trim().toLowerCase() : '';
                const strippedSubtitle = subtitle ? subtitle.text.trim().toLowerCase() : '';

                let searchContent = [];
                if (this.searchFields) {
                    this.searchFields.forEach(field => {
                        option[field] && searchContent.push(String(option[field]).toLowerCase());
                    });
                } else {
                    searchContent.push(strippedTitle);
                    strippedSubtitle && searchContent.push(strippedSubtitle);
                }

                return {
                    key: typeof option == 'object' ? option[this.effectiveIdKey] || index : option,
                    titleHtml: title.html,
                    subtitleHtml: subtitle?.html,
                    searchContent: searchContent.join(''),
                    ref: option
                };
            });
        },

        effectiveOptions() {
            let options = [...this.optionsDescriptors];

            if (this.isSearching) {
                const strippedSearchText = this.searchText.trim().toLowerCase();

                if (strippedSearchText.length) {
                    options = options.filter(option => option.searchContent.includes(strippedSearchText));

                    const escapedSearchText = this.searchText.escapeHtml().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const searchRe = new RegExp(`(${escapedSearchText})`, 'ig');

                    options = options.map(option => {
                        option = { ...option };
                        option.titleHtml = option.titleHtml.replace(searchRe, '<mark>$1</mark>');
                        if (option.subtitleHtml)
                            option.subtitleHtml = option.subtitleHtml.replace(searchRe, '<mark>$1</mark>');
                        return option;
                    });

                    if (this.shouldShowCreateOption) {
                        const hasExactMatch =
                            options.find(option => option.searchContent === strippedSearchText) !== undefined;
                        if (!hasExactMatch) {
                            options.push({
                                key: createSymbol,
                                titleHtml: 'Create <strong>' + this.searchText.trim() + '</strong>...'
                            });
                        }
                    }
                }
            } else if (this.nullTitle) {
                options.unshift({
                    key: nullSymbol,
                    titleHtml: this.nullTitle
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
            this.loadedOptions = this.options;
        },

        url() {
            this.handleSourceUpdate();
        },

        urlParams() {
            this.handleSourceUpdate();
        },

        // data

        optionsDescriptors() {
            this.shouldDisplayOptions && setTimeout(this.highlightInitialOption, 0);
        },

        searchText() {
            if (this.isSearching && !this.searchText.trim().length) this.isSearching = false;
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
            if (
                !this.highlightedOptionKey ||
                !this.effectiveOptions.find(option => option.key == this.highlightedOptionKey)
            ) {
                this.highlightedOptionKey = this.effectiveOptions.length ? this.effectiveOptions[0].key : null;
            }
        }
    },

    async mounted() {
        this.shouldShowCreateOption = this.$attrs['onCreateItem'] !== undefined;

        if (this.options) {
            this.loadedOptions = this.options;
            this.isLoaded = true;
        } else if (this.$isPropTruthy(this.preload)) {
            await this.performInitialLoad();
        }

        this.handleValueChanged();

        this.$watch('selectedOption', () => {
            const newValue =
                this.selectedOption && this.effectiveValueKey
                    ? this.selectedOption[this.effectiveValueKey]
                    : this.selectedOption;
            newValue === this.modelValue || this.$emit('update:modelValue', newValue);
        });
    },

    methods: {
        async performInitialLoad() {
            await this.reloadOptions();
            this.$emit('optionsLoaded', this.loadedOptions);

            if (this.$isPropTruthy(this.remoteSearch)) {
                this.$watch('searchText', debounce(this.reloadOptionsIfSearching, 250));
            }
        },

        handleSourceUpdate() {
            if (this.preload) return this.reloadOptions();
            if (!this.isLoaded) return;
            this.isLoaded = false;
            this.loadedOptions = [];
        },

        async reloadOptions() {
            let params = {};
            this.urlParams && Object.assign(params, this.urlParams);
            this.$isPropTruthy(this.remoteSearch) && this.searchText && (params.q = this.searchText);

            const result = await this.$http.get(this.url, { params: params });
            this.loadedOptions = result.data;
            this.isLoaded = true;
        },

        reloadOptionsIfSearching() {
            this.isSearching && this.reloadOptions();
        },

        handleKeyDown(e) {
            if (e.key == 'Escape') {
                e.stopPropagation();
                e.target.blur();
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
                return this.incrementHighlightedOption(
                    e.key == 'Home' ? -Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
                );
            }

            if (e.key == 'Enter') {
                e.preventDefault();
                const highlightedOption = this.effectiveOptions.find(option => option.key == this.highlightedOptionKey);
                if (highlightedOption) return this.selectOption(highlightedOption);
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.searchText.length > 1) this.isSearching = true;
                return;
            }

            if (!e.metaKey && VALID_KEYS.includes(e.key)) {
                this.isSearching = true;
            }
        },

        handleInputFocused() {
            if (this.selectedOption)
                this.highlightedOptionKey =
                    typeof this.selectedOption == 'object' && this.selectedOption !== null
                        ? this.selectedOption[this.effectiveIdKey]
                        : this.selectedOption;
            else if (this.nullTitle) this.highlightedOptionKey = nullSymbol;

            this.shouldDisplayOptions = true;
        },

        handleInputBlurred() {
            if (this.$isPropTruthy(this.debug)) return;

            if (!this.searchText.length && this.nullTitle) {
                this.selectedOption = null;
                this.selectedOptionTitle = null;
            }

            this.shouldDisplayOptions = false;
        },

        handleOptionsDisplayed() {
            this.isLoaded || this.$isPropTruthy(this.preload) || this.performInitialLoad();
            this.teleportOptionsContainer();
            this.optionsListId && this.$refs.optionsContainer.setAttribute('id', this.optionsListId);
        },

        teleportOptionsContainer() {
            const elRect = this.$el.getBoundingClientRect();
            const targetTop = elRect.y + elRect.height + 2;
            const targetLeft = elRect.x;

            const optionsEl = this.$refs.optionsContainer;
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
            const highlightedOptionIdx = this.effectiveOptions.findIndex(
                option => option.key == this.highlightedOptionKey
            );
            const containerEl = this.$refs.optionsContainer;
            const highlightedOptionEl = containerEl.querySelectorAll('.option')[highlightedOptionIdx];
            containerEl.scrollTop = highlightedOptionEl.offsetTop;
        },

        handleOptionHover(option) {
            this.highlightedOptionKey = option ? option.key : null;
        },

        incrementHighlightedOption(increment) {
            const highlightedOptionIdx = this.effectiveOptions.findIndex(
                option => option.key == this.highlightedOptionKey
            );
            let targetOptionIdx = highlightedOptionIdx + increment;

            if (targetOptionIdx < 0) targetOptionIdx = 0;
            else if (targetOptionIdx >= this.effectiveOptions.length)
                targetOptionIdx = this.effectiveOptions.length - 1;

            if (highlightedOptionIdx == targetOptionIdx) return;

            this.highlightedOptionKey = this.effectiveOptions[targetOptionIdx].key;

            const containerEl = this.$refs.optionsContainer;
            const targetOptionEl = containerEl.querySelectorAll('.option')[targetOptionIdx];

            if (targetOptionEl.offsetTop < containerEl.scrollTop) {
                containerEl.scrollTop = targetOptionEl.offsetTop;
            } else if (
                targetOptionEl.offsetTop + targetOptionEl.offsetHeight >
                containerEl.scrollTop + containerEl.clientHeight
            ) {
                containerEl.scrollTop =
                    targetOptionEl.offsetTop + targetOptionEl.offsetHeight - containerEl.clientHeight;
            }
        },

        selectOption(option) {
            if (option.key == nullSymbol) {
                this.searchText = '';
                this.selectedOption = null;
                this.selectedOptionTitle = null;
            } else if (option.key === createSymbol) {
                const createText = this.searchText.trim();
                this.searchText = '';
                this.selectedOption = null;
                this.selectedOptionTitle = null;
                this.$emit('createItem', createText);
            } else {
                const selectedDecoratedOption = this.optionsDescriptors.find(
                    decoratedOption => decoratedOption.key == option.key
                );
                const realOption = selectedDecoratedOption.ref;
                this.selectedOption = realOption;
                this.selectedOptionTitle = this.getOptionTitle(this.selectedOption).text;
                this.searchText = this.selectedOptionTitle || '';
            }

            this.$refs.searchField.blur();
        },

        handleValueChanged() {
            if (this.modelValue) {
                if (this.effectiveValueKey) {
                    this.selectedOption = this.fullOptionsArray.find(
                        option => option[this.effectiveValueKey] === this.modelValue
                    );
                } else {
                    this.selectedOption = this.modelValue;
                }

                this.selectedOptionTitle = this.getOptionTitle(this.selectedOption).text;
                this.searchText = this.selectedOptionTitle || '';
            } else {
                this.selectedOption = null;
                this.selectedOptionTitle = null;
                this.searchText = '';
            }
        },

        getOptionTitle(option) {
            if (option === null) return null;

            if (this.titleFormatter) {
                const result = this.titleFormatter(option);
                if (typeof result == 'object') {
                    return {
                        text: result.text || result.html.replace(/<[^>]+>/g, ''),
                        html: result.html
                    };
                } else {
                    return {
                        text: result,
                        html: result.escapeHtml()
                    };
                }
            }

            const text = String(typeof option != 'object' ? option : option[this.effectiveTitleKey]);
            return { text, html: text.escapeHtml() };
        },

        getOptionSubtitle(option) {
            if (option === null) return null;

            if (this.subtitleFormatter) {
                const result = this.subtitleFormatter(option);
                if (!result) return null;
                if (typeof result == 'object') {
                    return {
                        text: result.text || result.html.replace(/<[^>]+>/g, ''),
                        html: result.html
                    };
                } else {
                    return {
                        text: result,
                        html: result.escapeHtml()
                    };
                }
            }

            let text = typeof option != 'object' ? null : option[this.subtitleKey];
            if (!text) return null;

            text = String(text);
            return { text, html: text.escapeHtml() };
        },

        addRemoteOption(option) {
            this.loadedOptions.push(option);
        },

        arrayifyOptions(options) {
            return Array.isArray(options)
                ? options
                : Object.entries(options).map(entry => ({
                      [this.effectiveIdKey]: entry[0],
                      [this.effectiveTitleKey]: entry[1]
                  }));
        }
    }
};
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
