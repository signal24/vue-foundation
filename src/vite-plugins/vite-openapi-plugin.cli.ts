#!/usr/bin/env node

import { existsSync } from 'fs';

import { generateOpenapiClient, loadOpenapiOverrides } from './vite-openapi-plugin.js';

if (!process.argv[2]) {
    throw new Error('Usage: vf-generate-openapi-client <openapi-yaml-path> [<openapi-output-path>]');
}

if (!existsSync(process.argv[2])) {
    throw new Error(`OpenAPI YAML file not found: ${process.argv[2]}`);
}

loadOpenapiOverrides();
await generateOpenapiClient(process.argv[2], process.argv[3]);
