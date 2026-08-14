import { readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const declarationSuffix = '.d.vue.ts';

async function normalizeDirectory(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            await normalizeDirectory(path);
            continue;
        }

        if (!entry.name.endsWith(declarationSuffix)) {
            continue;
        }

        const normalizedPath = `${path.slice(0, -declarationSuffix.length)}.d.ts`;
        await rename(path, normalizedPath);
    }
}

await normalizeDirectory('dist');
