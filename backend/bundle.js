#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

!(async () => {
    const version = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'),
    ).version.trim();

    let content = fs.readFileSync(path.join(__dirname, 'sub-store.min.js'), {
        encoding: 'utf8',
    });
    content = content.replace(
        /eval\(('|")(require\(('|").*?('|")\))('|")\)/g,
        '$2',
    );
    fs.writeFileSync(
        path.join(__dirname, 'dist/sub-store.no-bundle.js'),
        content,
        {
            encoding: 'utf8',
        },
    );

    let content_a = fs.readFileSync(path.join(__dirname, 'sub-store-node.min.js'), {
        encoding: 'utf8',
    });
    content_a = content_a.replace(
        /eval\(('|")(require\(('|").*?('|")\))('|")\)/g,
        '$2',
    );
    fs.writeFileSync(
        path.join(__dirname, 'dist/sub-store-node.no-bundle.js'),
        content_a,
        {
            encoding: 'utf8',
        },
    );

    await build({
        entryPoints: ['dist/sub-store.no-bundle.js'],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: 'node',
        format: 'cjs',
        outfile: 'dist/sub-store.bundle.js',
    });
    await build({
        entryPoints: ['dist/sub-store-node.no-bundle.js'],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: 'node',
        format: 'esm',
        outfile: 'dist/sub-store-node.bundle.js',
    });
    fs.writeFileSync(
        path.join(__dirname, 'dist/sub-store.bundle.js'),
        `// SUB_STORE_BACKEND_VERSION: ${version}
${fs.readFileSync(path.join(__dirname, 'dist/sub-store.bundle.js'), {
            encoding: 'utf8',
        })}`,
        {
            encoding: 'utf8',
        },
    );
    fs.writeFileSync(
        path.join(__dirname, 'dist/sub-store-node.bundle.js'),
        `// SUB_STORE_BACKEND_VERSION: ${version}
${fs.readFileSync(path.join(__dirname, 'dist/sub-store-node.bundle.js'), {
            encoding: 'utf8',
        })}`,
        {
            encoding: 'utf8',
        },
    );
})()
    .catch((e) => {
        console.log(e);
    })
    .finally(() => {
        console.log('done');
    });
