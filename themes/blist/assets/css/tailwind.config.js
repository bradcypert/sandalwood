const themeDir = __dirname + "/../../";

module.exports = {
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === "production",
    content: [
      themeDir + "layouts/**/*.html",
      themeDir + "content/**/*.html",
      "layouts/**/*.html",
      "config.toml",
      "content/**/*.html",
      "assets/js/search.js",
      "exampleSite/layouts/**/*.html",
      "exampleSite/config.toml",
      "exampleSite/content/**/*.html",
    ],
  },
  darkMode: "class",
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '880px',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            letterSpacing: '-0.003em',
            color: theme('colors.gray.800'),
            p: {
              marginTop: '1.75em',
              marginBottom: '1.75em',
              lineHeight: '1.75',
            },
            'p:first-of-type': {
              fontSize: '1.25rem',
              lineHeight: '1.7',
            },
            h1: {
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '0.5em',
              letterSpacing: '-0.022em',
            },
            h2: {
              fontSize: '2rem',
              fontWeight: '700',
              lineHeight: '1.3',
              marginTop: '1.5em',
              marginBottom: '0.75em',
              letterSpacing: '-0.019em',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              letterSpacing: '-0.014em',
            },
            h4: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.5',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              textDecorationColor: theme('colors.gray.300'),
              textUnderlineOffset: '2px',
              fontWeight: '500',
              '&:hover': {
                textDecorationColor: theme('colors.gray.800'),
              },
            },
            strong: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            blockquote: {
              fontStyle: 'italic',
              fontSize: '1.125rem',
              lineHeight: '1.75',
              paddingLeft: '1.5em',
              borderLeftWidth: '3px',
              borderLeftColor: theme('colors.gray.900'),
              marginTop: '1.75em',
              marginBottom: '1.75em',
            },
            code: {
              fontSize: '0.9em',
              fontWeight: '400',
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '3px',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: '1.75em',
              marginBottom: '1.75em',
              borderRadius: '8px',
              padding: '1.25em',
            },
            'ul, ol': {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            img: {
              marginTop: '2em',
              marginBottom: '2em',
            },
          },
        },
        lg: {
          css: {
            fontSize: '1.1875rem',
            lineHeight: '1.78',
            p: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            'p:first-of-type': {
              fontSize: '1.3125rem',
            },
            h1: {
              fontSize: '2.75rem',
            },
            h2: {
              fontSize: '2.25rem',
            },
            h3: {
              fontSize: '1.75rem',
            },
          },
        },
        dark: {
          css: [
            {
              color: theme("colors.gray.300"),
              '[class~="lead"]': {
                color: theme("colors.gray.300"),
              },
              a: {
                color: 'inherit',
                textDecorationColor: theme("colors.gray.600"),
                '&:hover': {
                  textDecorationColor: theme("colors.white"),
                },
              },
              strong: {
                color: theme("colors.white"),
                fontWeight: '600',
              },
              "ol > li::before": {
                color: theme("colors.gray.400"),
              },
              "ul > li::before": {
                backgroundColor: theme("colors.gray.600"),
              },
              hr: {
                borderColor: theme("colors.gray.200"),
              },
              blockquote: {
                color: theme("colors.gray.200"),
                borderLeftColor: theme("colors.white"),
              },
              h1: {
                color: theme("colors.white"),
              },
              h2: {
                color: theme("colors.white"),
              },
              h3: {
                color: theme("colors.white"),
              },
              h4: {
                color: theme("colors.white"),
              },
              "figure figcaption": {
                color: theme("colors.gray.400"),
              },
              code: {
                color: theme("colors.white"),
                backgroundColor: theme("colors.gray.800"),
              },
              "a code": {
                color: theme("colors.white"),
              },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.white"),
                borderBottomColor: theme("colors.gray.400"),
              },
              "tbody tr": {
                borderBottomColor: theme("colors.gray.600"),
              },
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
