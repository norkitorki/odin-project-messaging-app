import { defineConfig } from "vite";
import path from "path";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig({
  resolve: {
    alias: {
      "@views": path.resolve(__dirname, "app/views"),
      "@javascript": path.resolve(__dirname, "app/javascript"),
      "@stylesheets": path.resolve(__dirname, "app/assets/stylesheets/"),
    },
  },
  plugins: [RubyPlugin()],
});
