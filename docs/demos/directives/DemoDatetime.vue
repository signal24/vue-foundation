<template>
    <div>
        <p style="margin-bottom: 8px">
            <label><strong>Pick a date/time:</strong> <input type="datetime-local" v-model="pickerValue" style="margin-left: 4px" /></label>
        </p>

        <p style="margin-bottom: 8px">
            <label
                ><strong>defaultDateFormat:</strong>
                <input
                    v-model="dateFormat"
                    @input="applyConfig"
                    style="margin-left: 4px; width: 100px; padding: 2px 6px; font-family: monospace; font-size: 0.9em"
            /></label>
            <label style="margin-left: 16px"
                ><strong>defaultTimeFormat:</strong>
                <input
                    v-model="timeFormat"
                    @input="applyConfig"
                    style="margin-left: 4px; width: 80px; padding: 2px 6px; font-family: monospace; font-size: 0.9em"
            /></label>
        </p>

        <p v-if="formatError" style="margin-bottom: 8px; color: var(--vp-c-danger-1)">{{ formatError }}</p>

        <p style="margin-bottom: 8px">
            <strong>ISO input:</strong> <code>{{ isoDate }}</code>
        </p>

        <table :key="configKey" style="border-collapse: collapse; width: 100%">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Modifier</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Output</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)">Default</td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-datetime="isoDate"></span></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>date-only</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-datetime="isoDate" date-only></span></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>format="MMM d, yyyy"</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)">
                        <span v-datetime="isoDate" format="MMM d, yyyy"></span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>relative-date</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-datetime="isoDate" relative-date></span></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>simplified-date</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-datetime="isoDate" simplified-date></span></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>placeholder="N/A"</code> (null value)</td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-datetime="null" placeholder="N/A"></span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { computed, onBeforeUnmount, ref } from 'vue';
import { configureVf } from '@zyno-io/vue-foundation';

const defaultDate = new Date(Date.now() - (3 * 60 + 25) * 60 * 1000);
const toLocalISOString = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const pickerValue = ref(toLocalISOString(defaultDate));
const isoDate = computed(() => (pickerValue.value ? new Date(pickerValue.value).toISOString() : null));

const DEFAULT_DATE_FORMAT = 'M/d/yy';
const DEFAULT_TIME_FORMAT = 'H:mm';
const dateFormat = ref(DEFAULT_DATE_FORMAT);
const timeFormat = ref(DEFAULT_TIME_FORMAT);
const configKey = ref(0);
const formatError = ref('');

function applyConfig() {
    try {
        format(new Date(), dateFormat.value);
        format(new Date(), timeFormat.value);
        formatError.value = '';
        configureVf({ defaultDateFormat: dateFormat.value, defaultTimeFormat: timeFormat.value });
        configKey.value++;
    } catch {
        formatError.value = 'Invalid format string';
    }
}

onBeforeUnmount(() => {
    configureVf({ defaultDateFormat: DEFAULT_DATE_FORMAT, defaultTimeFormat: DEFAULT_TIME_FORMAT });
});
</script>
