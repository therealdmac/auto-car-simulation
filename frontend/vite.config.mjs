import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            tailwindcss(),
            react()
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },
        server: {
            proxy: {
                '/simulate': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/simulate/, '/simulate'),
                },
            },
        },
        define: {
            __API_URL__: JSON.stringify(env.VITE_API_URL),
        }
    }
})
