import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const rootPkg = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const appPkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/** اطلاعات پروژه برای صفحه‌ی «درباره» */
const metadata = {
  buildTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
  dependencies: appPkg.dependencies,
  devDependencies: { ...rootPkg.devDependencies, ...appPkg.devDependencies },
  description: rootPkg.description,
  homepage: 'https://doc.vben.pro',
  license: rootPkg.license,
  version: rootPkg.version,
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE || '/',
    build: {
      chunkSizeWarningLimit: 2000,
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
              { name: 'antd', test: /node_modules[\\/](antd|@ant-design|rc-[^\\/]+|@rc-component)[\\/]/ },
              { name: 'echarts', test: /node_modules[\\/](echarts|zrender)[\\/]/ },
            ],
          },
        },
      },
      target: 'es2022',
    },
    define: {
      __VBEN_ADMIN_METADATA__: JSON.stringify(metadata),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '#': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT) || 5666,
      proxy: {
        '/api': {
          changeOrigin: true,
          target: env.VITE_MOCK_TARGET || 'http://localhost:5320',
          ws: true,
        },
      },
    },
  };
});
