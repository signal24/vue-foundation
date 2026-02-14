<template>
    <div>
        <table style="border-collapse: collapse; width: 100%">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Variant</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--vp-c-divider)">Output</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)">Default (with seconds)</td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-duration="startTime"></span></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><code>no-seconds</code></td>
                    <td style="padding: 8px; border-bottom: 1px solid var(--vp-c-divider)"><span v-duration="startTime" no-seconds></span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
const startTime = new Date(Date.now() - 3723000).toISOString();
</script>
