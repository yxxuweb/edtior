import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

// @ts-ignore
import type { UserConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        react(),
        dts({ rollupTypes: true })
    ],
    resolve: {
        alias: {
            '@lowcode/model': path.resolve(__dirname, '../model/src/index.ts'),
            '@lowcode/renderer': path.resolve(__dirname, '../renderer/src/index.ts')
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LowCodeRendererReact',
            fileName: 'index'
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react-dom/client',
                '@lowcode/model',
                '@lowcode/renderer'
            ]
        }
    },
    test: {
        environment: 'jsdom'
    }
} as UserConfig);
