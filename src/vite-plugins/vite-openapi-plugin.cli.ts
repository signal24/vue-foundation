#!/usr/bin/env node

import { existsSync } from 'fs';

import { generateOpenapiClient } from './vite-openapi-plugin.js';

if (!process.argv[2]) {
    throw new Error('Usage: vf-generate-openapi-client <openapi-yaml-path>');
}

if (!existsSync(process.argv[2])) {
    throw new Error(`OpenAPI YAML file not found: ${process.argv[2]}`);
}

await generateOpenapiClient(process.argv[2]);
