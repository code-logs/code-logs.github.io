import { Html, Head, Main, NextScript } from 'next/document'

// FOUC guard: runs before <body> paints so the first frame already carries the
// correct `.dark` class. Mirrors next-themes' own logic (storageKey "theme",
// "system" → prefers-color-scheme) so the pre-hydration paint matches what the
// ThemeProvider resolves. CSP is unset on this site, so inline script needs no
// nonce (issue #148 Notes).
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s||'system';var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.classList.toggle('dark',r==='dark');}catch(e){}})();`

const Document = () => {
  return (
    <Html lang="ko" suppressHydrationWarning>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Adapt the mobile address-bar color to the active scheme. Matches the
            light --color-bg-page (#ffffff) and dark --color-neutral-0 (#09090b).
            Note: a static <meta> can only follow the OS prefers-color-scheme, not
            the manual toggle — an OS-light user who picks Dark keeps a light
            address bar. This is an inherent HTML limitation (no JS hook). */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
