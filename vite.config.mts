import { defineConfig } from "vite";
import path from "path";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig({
  resolve: {
    alias: {
      "@views": path.resolve(import.meta.dirname, "app/views/"),
      "@javascript": path.resolve(import.meta.dirname, "app/javascript/"),
      "@components": path.resolve(import.meta.dirname, "app/javascript/components/"),
      "@stylesheets": path.resolve(import.meta.dirname, "app/assets/stylesheets/"),
    },
  },
  plugins: [RubyPlugin()],
});
