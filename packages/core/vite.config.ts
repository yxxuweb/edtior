import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    resolve: {
        alias: {
            '@lowcode/model': path.resolve(__dirname, '../model/src/index.ts'),
            '@lowcode/plugin': path.resolve(__dirname, '../plugin/src/index.ts'),
            '@lowcode/material': path.resolve(__dirname, '../material/src/index.ts'),
            '@lowcode/renderer': path.resolve(__dirname, '../renderer/src/index.ts'),
            '@lowcode/utils-logger': path.resolve(__dirname, '../utils-logger/src/index.ts')
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LowCodeCore',
            fileName: 'index'
        },
        rollupOptions: {
            external: [
                '@lowcode/model',
                '@lowcode/plugin',
                '@lowcode/material',
                '@lowcode/renderer',
                '@lowcode/utils-logger',
                'immer'
            ]
        }
    }
});
