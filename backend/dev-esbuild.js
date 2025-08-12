#!/usr/bin/env node
const { build } = require('esbuild');

!(async () => {
    const artifacts = [
        { src: 'src/main.js', dest: 'sub-store.min.js' }
    ];
    const artifacts_a = [
        { src: 'src/core/proxy-utils/index.js', dest: 'sub-store-node.min.js' },
    ];

    for await (const artifact of artifacts) {
        await build({
            entryPoints: [artifact.src],
            bundle: true,
            minify: false,
            sourcemap: false,
            platform: 'node',
            format: 'cjs',
            outfile: artifact.dest,
        });
    }
    for await (const artifact_a of artifacts_a) {
        await build({
            entryPoints: [artifact_a.src],
            bundle: true,
            minify: false,
            sourcemap: false,
            platform: 'node',
            format: 'esm',
            outfile: artifact_a.dest,
        });
    }
})()
    .catch((e) => {
        console.log(e);
    })
    .finally(() => {
        console.log('done');
    });
