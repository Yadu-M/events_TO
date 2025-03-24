import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env variables based on the mode (development, production, etc.)
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api': {
					target: env.VITE_API_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
