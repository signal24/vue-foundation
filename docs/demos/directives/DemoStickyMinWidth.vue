<template>
    <div>
        <p style="margin-bottom: 12px">
            The table headers below use <code>v-sticky-min-width</code> to prevent them from shrinking below their current width when scrolling. Try
            resizing the browser window to see the effect.
        </p>

        <div style="overflow: auto; max-height: 200px; border: 1px solid var(--vp-c-divider); border-radius: 4px">
            <table style="border-collapse: collapse; width: 100%">
                <thead>
                    <tr>
                        <th
                            v-sticky-min-width
                            style="
                                position: sticky;
                                top: 0;
                                padding: 8px 12px;
                                background: var(--vp-c-bg-soft);
                                border-bottom: 2px solid var(--vp-c-divider);
                                text-align: left;
                            "
                        >
                            Name
                        </th>
                        <th
                            v-sticky-min-width
                            style="
                                position: sticky;
                                top: 0;
                                padding: 8px 12px;
                                background: var(--vp-c-bg-soft);
                                border-bottom: 2px solid var(--vp-c-divider);
                                text-align: left;
                            "
                        >
                            Email
                        </th>
                        <th
                            v-sticky-min-width
                            style="
                                position: sticky;
                                top: 0;
                                padding: 8px 12px;
                                background: var(--vp-c-bg-soft);
                                border-bottom: 2px solid var(--vp-c-divider);
                                text-align: left;
                            "
                        >
                            Role
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.name">
                        <td style="padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider)">{{ row.name }}</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider)">{{ row.email }}</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider)">{{ row.role }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
const rows = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer' },
    { name: 'Dave Brown', email: 'dave@example.com', role: 'Editor' },
    { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
    { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer' },
    { name: 'Grace Wilson', email: 'grace@example.com', role: 'Editor' },
    { name: 'Hank Moore', email: 'hank@example.com', role: 'Viewer' }
];
</script>
