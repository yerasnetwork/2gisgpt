import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   "hsl(var(--color-primary) / <alpha-value>)",
        accent:    "hsl(var(--color-accent) / <alpha-value>)",
        "accent-warm": "hsl(var(--color-accent-warm) / <alpha-value>)",
        bg:        "hsl(var(--color-bg) / <alpha-value>)",
        "bg-2":    "hsl(var(--color-bg-2) / <alpha-value>)",
        card:      "hsl(var(--color-bg-card) / <alpha-value>)",
        border:    "hsl(var(--color-border) / <alpha-value>)",
        "border-bright": "hsl(var(--color-border-bright) / <alpha-value>)",
        muted:     "hsl(var(--color-text-muted) / <alpha-value>)",
        dim:       "hsl(var(--color-text-dim) / <alpha-value>)",
        rating:    "hsl(var(--color-rating) / <alpha-value>)",
        success:   "hsl(var(--color-success) / <alpha-value>)",
        warning:   "hsl(var(--color-warning) / <alpha-value>)",
        danger:    "hsl(var(--color-error) / <alpha-value>)",
      },
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        "glow-blue":  "var(--shadow-glow-blue)",
        "glow-green": "var(--shadow-glow-green)",
        card:         "var(--shadow-card)",
      },
      animation: {
        float:   "float 9s ease-in-out infinite",
        blink:   "blink 1s step-end infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        fadeUp:  "fadeUp 0.6s ease both",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
