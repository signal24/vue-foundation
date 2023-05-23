import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, watch } from 'node:fs';
import { rm } from 'node:fs/promises';

import * as OpenAPI from 'openapi-typescript-codegen';

const DEFAULT_OUT_PATH = './src/openapi-client-generated';

let generatedHash: string | null = null;
let overridesMap: Record<string, string> | null = null;
let overridesInverseMap: Record<string, string> | null = null;

export function loadOpenapiOverrides() {
    if (!existsSync('./openapi-specs.dev.json')) {
        return;
    }

    try {
        const overridesContent = readFileSync('./openapi-specs.dev.json', 'utf8');
        overridesMap = JSON.parse(overridesContent);
        overridesInverseMap = Object.fromEntries(Object.entries(overridesMap!).map(([k, v]) => [v, k]));
    } catch (e) {
        console.error('Failed to load openapi-specs.dev.json:', e);
    }
}

export function openapiClientGeneratorPlugin(
    openapiYamlPath: string,
    outPath: string = DEFAULT_OUT_PATH
): {
    name: string;
    apply: 'serve';
    buildStart(): void;
    closeBundle(): void;
} {
    let generator: ReturnType<typeof getGenerator> = null;

    return {
        name: 'openapi-types-generator',
        apply: 'serve',

        buildStart() {
            // apply a slight delay so any output doesn't get pushed off screen
            setTimeout(() => {
                loadOpenapiOverrides();
                generator = getGenerator(openapiYamlPath, outPath);
            }, 250);
        },

        closeBundle() {
            generator?.close();
        }
    };
}

function getGenerator(openapiYamlPath: string, outPath: string) {
    const resolvedPath = overridesMap?.[openapiYamlPath] ?? openapiYamlPath;

    if (!existsSync(resolvedPath)) {
        console.log(`OpenAPI YAML file not found: ${resolvedPath}`);
        return null;
    }

    const watcher = watch(resolvedPath);
    watcher.on('change', () => {
        // give the writes a moment to settle
        setTimeout(() => generateOpenapiClient(resolvedPath, outPath), 100);
    });

    generateOpenapiClient(resolvedPath, outPath);

    return {
        close() {
            watcher.close();
        }
    };
}

async function generateOpenapiClientInternal(openapiYamlPath: string, outPath: string = DEFAULT_OUT_PATH) {
    const yaml = readFileSync(openapiYamlPath, 'utf8');
    const hash = createHash('sha256').update(yaml).digest('hex');

    if (hash === generatedHash) {
        return;
    }

    generatedHash = hash;

    try {
        try {
            await rm(outPath, { recursive: true });
        } catch (e) {
            // ignore
        }

        await OpenAPI.generate({
            input: openapiYamlPath,
            output: outPath,
            clientName: 'ApiClient',
            useOptions: true,
            useUnionTypes: true
        });

        if (overridesInverseMap?.[openapiYamlPath]) {
            copyFileSync(openapiYamlPath, overridesInverseMap[openapiYamlPath]);
        }

        console.log(`[${new Date().toISOString()}] Generated client from ${openapiYamlPath} to ${outPath}/`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error generating client from ${openapiYamlPath}:`, err);
    }
}

export async function generateOpenapiClient(openapiYamlPath: string, outPath: string = DEFAULT_OUT_PATH) {
    const resolvedPath = overridesMap?.[openapiYamlPath] ?? openapiYamlPath;
    return generateOpenapiClientInternal(resolvedPath, outPath);
}
