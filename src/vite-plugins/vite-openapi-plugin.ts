import { createWatchfulOpenapiClientGenerators } from '@signal24/openapi-client-codegen/node';

export function openapiClientGeneratorPlugin(): {
    name: string;
    apply: 'serve';
    buildStart(): void;
    closeBundle(): void;
} {
    let generators: ReturnType<typeof createWatchfulOpenapiClientGenerators> | null = null;

    return {
        name: 'openapi-types-generator',
        apply: 'serve',

        buildStart() {
            // apply a slight delay so any output doesn't get pushed off screen
            setTimeout(() => {
                generators = createWatchfulOpenapiClientGenerators();
            }, 250);
        },

        closeBundle() {
            if (generators) {
                for (const generator of generators) {
                    generator?.close();
                }
            }
        }
    };
}
