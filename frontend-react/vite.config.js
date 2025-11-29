import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production to hide source code
    minify: 'terser', // Use terser for better minification (smaller output, better obfuscation)
    cssMinify: true, // Minify CSS as well
    terserOptions: {
      compress: {
        // Aggressive compression options for deep minification
        drop_console: true, // Remove all console statements
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
        passes: 3, // Multiple passes for better compression (default: 1)
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true, // Compress comparisons
        unsafe_math: true, // Optimize mathematical expressions
        unsafe_methods: true, // Optimize method calls
        unsafe_proto: true, // Optimize prototype access
        unsafe_regexp: true, // Optimize regular expressions
        unsafe_undefined: true, // Replace undefined with void 0
        dead_code: true, // Remove unreachable code
        evaluate: true, // Evaluate constant expressions
        reduce_vars: true, // Reduce variable declarations
        reduce_funcs: true, // Reduce function declarations
        collapse_vars: true, // Collapse single-use variables
        inline: true, // Inline functions
        keep_fargs: false, // Remove unused function arguments
        keep_fnames: false, // Remove function names (better obfuscation)
        keep_classnames: false, // Remove class names (better obfuscation)
        toplevel: true, // Enable top-level optimizations
        module: false, // Not ES modules (allows more aggressive optimizations)
        hoist_funs: true, // Hoist function declarations
        hoist_vars: false, // Don't hoist vars (can cause issues)
        side_effects: false, // Assume no side effects for better optimization
        unused: true, // Remove unused variables
        warnings: false // Suppress warnings
      },
      format: {
        comments: false, // Remove all comments
        beautify: false, // Don't beautify output
        preserve_annotations: false, // Remove annotations
        ascii_only: false, // Allow non-ASCII characters (smaller output)
        ecma: 2020, // Target ECMAScript version
        safari10: false, // Don't add Safari 10 workarounds
        webkit: false, // Don't add WebKit workarounds
        wrap_iife: false, // Don't wrap IIFEs
        preamble: null // No preamble
      },
      mangle: {
        toplevel: true, // Mangle top-level names
        eval: true, // Mangle names in eval
        keep_classnames: false, // Don't keep class names
        keep_fnames: false, // Don't keep function names
        properties: {
          regex: /^_/ // Mangle properties starting with _
        },
        safari10: false // Don't add Safari 10 workarounds
      },
      ecma: 2020, // Target ECMAScript 2020
      module: false, // Not ES modules
      toplevel: true // Enable top-level optimizations
    }
  }
})
