import { createHash } from 'node:crypto';
import { existsSync, readFileSync, watch } from 'node:fs';
import { rm } from 'node:fs/promises';

import * as OpenAPI from 'openapi-typescript-codegen';

let generatedHash: string | null = null;

export function openapiClientGeneratorPlugin(openapiYamlPath: string) {
    let generator: ReturnType<typeof getGenerator> = null;

    return {
        name: 'openapi-types-generator',
        apply: 'serve',

        buildStart() {
            generator = getGenerator(openapiYamlPath);
        },

        closeBundle() {
            generator?.close();
        }
    };
}

function getGenerator(openapiYamlPath: string) {
    if (!existsSync(openapiYamlPath)) {
        console.log(`OpenAPI YAML file not found: ${openapiYamlPath}`);
        return null;
    }

    const watcher = watch(openapiYamlPath);
    watcher.on('change', () => {
        // give the writes a moment to settle
        setTimeout(() => generateOpenapiClient(openapiYamlPath), 100);
    });

    generateOpenapiClient(openapiYamlPath);

    return {
        close() {
            watcher.close();
        }
    };
}

export async function generateOpenapiClient(openapiYamlPath: string) {
    const yaml = readFileSync(openapiYamlPath, 'utf8');
    const hash = createHash('sha256').update(yaml).digest('hex');

    if (hash === generatedHash) {
        return;
    }

    generatedHash = hash;

    try {
        try {
            await rm('./src/openapi-client-generated', { recursive: true });
        } catch (e) {
            // ignore
        }

        await OpenAPI.generate({
            input: openapiYamlPath,
            output: './src/openapi-client-generated',
            clientName: 'ApiClient',
            useOptions: true,
            useUnionTypes: true
        });

        console.log(`[${new Date().toISOString()}] Generated client from ${openapiYamlPath} to ./src/openapi-client/`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error generating client from ${openapiYamlPath}:`, err);
    }
}
