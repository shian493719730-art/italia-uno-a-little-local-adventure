import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// Relative asset URLs let the same dist folder run at / or under a repository path.
export default defineConfig({base:'./',plugins:[react()]});
