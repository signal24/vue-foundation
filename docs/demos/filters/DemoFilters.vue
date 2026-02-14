<template>
    <div style="overflow-x: auto">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Filter</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Input</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Output</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.filter" style="border-bottom: 1px solid var(--vp-c-divider)">
                    <td style="padding: 8px; font-family: monospace; white-space: nowrap">{{ row.filter }}</td>
                    <td style="padding: 8px; font-family: monospace; white-space: nowrap; color: var(--vp-c-text-2)">{{ row.input }}</td>
                    <td style="padding: 8px; font-weight: 500">{{ row.output }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { createFilters } from '@signal24/vue-foundation';

const $f = createFilters(() => ({}));

const rows = [
    { filter: '$f.date()', input: "'2024-01-15T10:30:00'", output: $f.date('2024-01-15T10:30:00') },
    { filter: '$f.time()', input: "'2024-01-15T10:30:00'", output: $f.time('2024-01-15T10:30:00') },
    { filter: '$f.dateTime()', input: "'2024-01-15T10:30:00'", output: $f.dateTime('2024-01-15T10:30:00') },
    { filter: '$f.phone()', input: "'1234567890'", output: $f.phone('1234567890') },
    { filter: '$f.usCurrency()', input: '1234', output: $f.usCurrency(1234) },
    { filter: '$f.usCurrency(, 100)', input: '1234', output: $f.usCurrency(1234, 100) },
    { filter: '$f.number()', input: '12345', output: $f.number(12345) },
    { filter: '$f.bytes()', input: '1048576', output: $f.bytes(1048576) },
    { filter: '$f.dash()', input: 'null', output: $f.dash(null) },
    { filter: '$f.dash()', input: "'hello'", output: $f.dash('hello') },
    { filter: '$f.dashZeros()', input: '0', output: $f.dashZeros(0) },
    { filter: '$f.upperFirst()', input: "'hello'", output: $f.upperFirst('hello') },
    { filter: '$f.startCase()', input: "'hello_world'", output: $f.startCase('hello_world') },
    { filter: '$f.upperCase()', input: "'hello'", output: $f.upperCase('hello') },
    { filter: '$f.upperWords()', input: "'hello world'", output: $f.upperWords('hello world') },
    { filter: '$f.desnake()', input: "'snake_case'", output: $f.desnake('snake_case') },
    { filter: '$f.divide()', input: '1000, 100', output: $f.divide(1000, 100) },
    { filter: '$f.oneDayForward()', input: "'2024-01-15'", output: $f.oneDayForward('2024-01-15') }
];
</script>
