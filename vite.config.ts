import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@captain/shipping-protection-react':
        '/Users/liliangrong/Desktop/work/cw3-insurance-captain-web-client/SDK/shipping-protection-react/src/index.tsx',
      '@captain/shipping-protection-sdk':
        '/Users/liliangrong/Desktop/work/cw3-insurance-captain-web-client/SDK/shipping-protection-sdk/src/index.ts',
    },
  },
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
    fs: {
      allow: [
        '/Users/liliangrong/Desktop/work/cw3-insurance-headless-storefront',
        '/Users/liliangrong/Desktop/work/cw3-insurance-captain-web-client/SDK',
      ],
    },
  },
});
