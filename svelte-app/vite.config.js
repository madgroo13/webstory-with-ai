import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

export default defineConfig({
	plugins: [sveltekit()],
	base: repo ? `/${repo}/` : '/',
});
