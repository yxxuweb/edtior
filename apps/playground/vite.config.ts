import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@lowcode/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
            '@lowcode/renderer-react': path.resolve(__dirname, '../../packages/renderer-react/src/index.ts'),
            '@lowcode/utils-logger': path.resolve(__dirname, '../../packages/utils-logger/src/index.ts')
        }
    }
});
