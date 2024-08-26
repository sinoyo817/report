import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

const subDir = "";
const prefix = "adsys-mng";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        Pages({
            dirs: [
                {
                    dir: `assets/pages-mng${subDir ? "/" + subDir : ""}`,
                    baseRoute: `${subDir}`,
                },
            ],
            exclude: [
                `assets/pages-mng${
                    subDir ? "/" + subDir + "/" : ""
                }${prefix}.tsx`,
            ],
        }),
        tsconfigPaths(),
        svgr(),
    ],
    build: {
        outDir: resolve(__dirname, "assets/dist-mng"),
        // outDir に manifest.json を出力
        assetsDir: `${subDir ? subDir + "/" : ""}${prefix}/assets`,
        manifest: true,
        rollupOptions: {
            // デフォルトの .html エントリを上書き
            input: {
                main: resolve(__dirname, "assets/main.tsx"),
                public: resolve(__dirname, "assets/public.tsx"),
            },
        },
    },
    cacheDir: "node_modules/.vite",
    server: {
        port: 5174,
    },
    define: {
        VITE_PREFIX: JSON.stringify(prefix),
        VITE_SUBDIR: JSON.stringify(subDir),
    },
});