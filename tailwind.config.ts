import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        warmWhite: "hsl(var(--warmWhite))",
        beige: "hsl(var(--beige))",
        darkBrown: "hsl(var(--darkBrown))",

        /* New Cosmetics Theme Colors */
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          dark: "hsl(var(--gold-dark))",
        },
        espresso: {
          DEFAULT: "hsl(var(--espresso))",
          light: "hsl(var(--espresso-light))",
        },
        rose: {
          DEFAULT: "hsl(var(--rose))",
          dark: "hsl(var(--rose-dark))",
        },

        liminara: {
          skin: "hsl(var(--liminara-skin))",
          beige: "hsl(var(--liminara-beige))",
          cream: "hsl(var(--liminara-cream))",
          brown: "hsl(var(--liminara-brown))",
          dark: "hsl(var(--liminara-dark))",
          white: "hsl(var(--liminara-white))",
          /* Legacy compatibility */
          mint: "hsl(var(--liminara-mint))",
          // rose: "hsl(var(--liminara-rose))", // Conflict with new theme
          rosegold: "hsl(var(--liminara-rosegold))",
          sage: "hsl(var(--liminara-sage))",
          charcoal: "hsl(var(--liminara-charcoal))",
        },
        /* Skin-tone palette direct access */
        skin: {
          light: "#FFF4E8",
          DEFAULT: "#F5D7B0",
          medium: "#E3C7A0",
          dark: "#D4B590",
        },
        nude: {
          50: "#FFFAF5",
          100: "#FFF4E8",
          200: "#F5D7B0",
          300: "#E3C7A0",
          400: "#D4B590",
          500: "#C4A580",
          600: "#A08060",
          700: "#806040",
          800: "#4B3A2F",
          900: "#3B2D25",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-50px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInRight: {
          from: {
            opacity: "0",
            transform: "translateX(50px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInDown: {
          from: {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.8s ease-in",
        fadeIn: "fadeIn 0.8s ease-out",
        slideInLeft: "slideInLeft 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        slideInDown: "slideInDown 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
