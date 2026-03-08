import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    resolve: {
        alias: {
            '@lowcode/utils-logger': path.resolve(__dirname, '../utils-logger/src/index.ts')
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LowCodeModel',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['@lowcode/utils-logger', 'immer']
        }
    }
});
