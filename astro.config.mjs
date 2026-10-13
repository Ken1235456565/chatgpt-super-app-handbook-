import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';

const site = process.env.SITE_URL || 'https://chatgpt-super-app-handbook.vercel.app';

const chapters = [
  ['Chapter 1 · Understanding the Application', '/chapter-01/'],
  ['Chapter 2 · What Is a Super-App?', '/chapter-02/'],
  ['Chapter 3 · Navigating the Workspace', '/chapter-03/'],
  ['Chapter 4 · How to Work With ChatGPT', '/chapter-04/'],
  ['Chapter 5 · Coding With ChatGPT and Codex', '/chapter-05/'],
  ['Chapter 6 · Codex for Developers', '/chapter-06/'],
  ['Chapter 7 · Building Digital Tools', '/chapter-07/'],
  ['Chapter 8 · Writing and Communication', '/chapter-08/'],
  ['Chapter 9 · Research and Learning', '/chapter-09/'],
  ['Chapter 10 · Everyday Productivity', '/chapter-10/'],
  ['Chapter 11 · Creativity', '/chapter-11/'],
  ['Chapter 12 · Business and Work', '/chapter-12/'],
  ['Chapter 13 · Trust, Safety, Responsibility', '/chapter-13/'],
  ['Chapter 14 · The Future of AI Super-Apps', '/chapter-14/'],
];

const serverSecret = { context: 'server', access: 'secret', optional: true };

export default defineConfig({
  site,
  // Pages stay prerendered; only the guestbook routes opt into on-demand rendering.
  adapter: vercel(),
  env: {
    schema: {
      SUPABASE_URL: envField.string(serverSecret),
      SUPABASE_SECRET_KEY: envField.string(serverSecret),
      OPENAI_API_KEY: envField.string(serverSecret),
      OPENAI_TRANSLATE_MODEL: envField.string(serverSecret),
      TURNSTILE_SECRET_KEY: envField.string(serverSecret),
      ADMIN_PASSWORD_HASH: envField.string(serverSecret),
      SESSION_SECRET: envField.string(serverSecret),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  integrations: [
    starlight({
      title: 'Understanding ChatGPT',
      description: 'A practical handbook for using ChatGPT as an AI super-app for work, creativity, and code.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagination: true,
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Handbook home', link: '/' },
            { label: 'Guestbook', link: '/guestbook/' },
          ],
        },
        {
          label: 'The handbook',
          items: chapters.map(([label, link]) => ({ label, link })),
        },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#111827' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Understanding ChatGPT' } },
        { tag: 'script', attrs: { src: '/scripts/figure-lightbox.js', defer: true } },
      ],
    }),
    sitemap({ filter: (page) => !page.includes('/guestbook/admin') }),
  ],
});
