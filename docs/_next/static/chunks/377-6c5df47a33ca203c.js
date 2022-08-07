'use strict'
;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [377],
  {
    6166: function (e, t, n) {
      n.d(t, {
        Z: function () {
          return l
        },
      })
      var a = n(5893),
        o = n(9008),
        r = n(8145),
        i = n(7294),
        s = function () {
          ;(0, i.useEffect)(function () {
            if (document.head) {
              var e = document.createElement('script')
              ;(e.async = !0),
                (e.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='.concat(r.Z.googleAdsense.adClient)),
                (e.crossOrigin = 'anonymous'),
                document.head.appendChild(e)
            }
          }, [])
        },
        l = function (e) {
          var t = e.title,
            n = e.description,
            i = e.keywords,
            l = e.url,
            c = e.imageURL,
            p = e.customMeta
          return (
            s(),
            (0, a.jsxs)(o.default, {
              children: [
                (0, a.jsx)('link', { rel: 'canonical', href: l }),
                (0, a.jsx)('link', { rel: 'apple-touch-icon', href: r.Z.appleTouchIconPath }),
                (0, a.jsx)('link', { rel: 'manifest', href: '/manifest.json' }),
                (0, a.jsx)('meta', { name: 'theme-color', content: r.Z.themeColor }, 'theme-color'),
                (0, a.jsx)('meta', { property: 'og:type', content: 'website' }, 'og:type'),
                (0, a.jsx)('meta', { property: 'og:site_name', content: r.Z.title }, 'og:site_name'),
                (0, a.jsx)('meta', { name: 'author', content: r.Z.author }, 'author'),
                (null === i || void 0 === i ? void 0 : i.length) && (0, a.jsx)('meta', { name: 'keyword', content: i.join(', ') }, 'keyword'),
                (0, a.jsx)('meta', { name: 'description', content: n }, 'description'),
                (0, a.jsx)('meta', { property: 'og:description', content: n }, 'og:description'),
                (0, a.jsx)('meta', { property: 'og:title', content: t }, 'og:title'),
                (0, a.jsx)('meta', { property: 'og:url', content: l }, 'og:url'),
                (0, a.jsx)('meta', { property: 'og:image', content: c }, 'og:image'),
                p && p,
                (0, a.jsx)('title', { children: t }),
              ],
            })
          )
        }
    },
    1780: function (e, t, n) {
      var a = n(5893),
        o = n(7294)
      t.Z = function (e) {
        return (
          (0, o.useEffect)(function () {
            ;(window.adsbygoogle = window.adsbygoogle || []), window.adsbygoogle.push({})
          }, []),
          (0, a.jsx)('ins', {
            className: 'adsbygoogle',
            style: { display: 'block' },
            'data-ad-client': e.adClient,
            'data-ad-slot': e.adSlot,
            'data-ad-format': 'auto',
            'data-full-width-responsive': 'true',
            onLoad: function () {
              return console.log('loaded')
            },
          })
        )
      }
    },
    5500: function (e, t, n) {
      function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : (e[t] = n), e
      }
      var o
      n.d(t, {
        aA: function () {
          return r
        },
      })
      var r =
        (a((o = {}), 'cloud', 'cloud'),
        a(o, 'css', 'css'),
        a(o, 'elasticsearch', 'elasticsearch'),
        a(o, 'infrastructure', 'infrastructure'),
        a(o, 'javascript', 'javascript'),
        a(o, 'nodejs', 'nodejs'),
        a(o, 'react', 'react'),
        a(o, 'react-native', 'react native'),
        a(o, 'roadmap-frontend', 'roadmap frontend'),
        a(o, 'security', 'security'),
        a(o, 'seo', 'seo'),
        a(o, 'typescript', 'typescript'),
        a(o, 'ui-and-ux', 'ui and ux'),
        a(o, 'web-component', 'web component'),
        a(o, '\uac1c\ubc1c\ud658\uacbd', '\uac1c\ubc1c\ud658\uacbd'),
        o)
      t.ZP = [
        {
          title: '\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815',
          description:
            '\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815 (Title, Meta Tag, \uc808\ub300\uacbd\ub85c, robots.txt, sitemap.xml)',
          fileName: 'config-for-seo.md',
          category: 'seo',
          published: !0,
          publishedAt: '2021-10-10',
          thumbnailName: 'seo-thumbnail.jpg',
          tags: [
            'SEO',
            'Search Engine Optimization',
            'meta tag',
            'robots.txt',
            'sitemap.xml',
            '\uac80\uc0c9',
            '\uac80\uc0c9\uc5d4\uc9c4',
            '\uac80\uc0c9\uc5d4\uc9c4 \ucd5c\uc801\ud654',
            '\uba54\ud0c0',
            '\uba54\ud0c0 \ud0dc\uadf8',
          ],
        },
        {
          title: 'Tagged Template Literal',
          description: 'Javascript ES6 Tagged Template Literal',
          fileName: 'tagged-template-literal.md',
          category: 'javascript',
          published: !0,
          publishedAt: '2021-10-11',
          thumbnailName: 'tagged-template-literal.png',
          tags: ['es6', 'javascript', 'tagged template', 'tagged template literal'],
        },
        {
          title: 'Iterator and Generator',
          description:
            'Javascript ES6 Iterator & Generator, \uc5f4\uac70\ud615, \uc81c\ub108\ub808\uc774\ud130 \ud568\uc218, generator function, yield, function*',
          fileName: 'iterator-generator.md',
          category: 'javascript',
          published: !0,
          publishedAt: '2021-10-17',
          thumbnailName: 'iterator-generator.png',
          tags: ['es6', 'function*', 'generator', 'iterable', 'iterator', 'javascript', 'yield'],
        },
        {
          title: 'Proxy',
          description: 'Javascript ES6 Proxy, Proxy, Trap, \ud504\ub77d\uc2dc\ub97c \uc774\uc6a9\ud55c \uac1d\uccb4 \uc870\uc791\uc758 \uc81c\uc5b4',
          fileName: 'proxy.md',
          category: 'javascript',
          published: !0,
          publishedAt: '2021-10-25',
          thumbnailName: 'proxy.png',
          tags: ['es6', 'javascript', 'proxy', 'trap', '\ud504\ub85d\uc2dc'],
        },
        {
          title: 'CSS Position',
          description: 'CSS Position (Static, Absolute, Fixed, Sticky)\uc5d0 \ub530\ub978 \uace0\uc815 \ud5e4\ub354 \uc2a4\ud0c0\uc77c',
          fileName: 'css-position.md',
          category: 'css',
          published: !0,
          publishedAt: '2021-10-26',
          thumbnailName: 'css-position.png',
          tags: ['absolute', 'css', 'fixed', 'header', 'position', 'static', 'sticky', 'style', '\uc2a4\ud0c0\uc77c', '\ud3ec\uc9c0\uc158', '\ud5e4\ub354'],
        },
        {
          title: '\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8 (HOC: Higher Order Component)',
          description: 'React - \uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8\ub97c \uc774\uc6a9\ud55c \ucef4\ud37c\ub10c\ud2b8\uc758 \uc7ac\uc0ac\uc6a9',
          fileName: 'hoc.md',
          category: 'react',
          published: !0,
          publishedAt: '2021-10-30',
          thumbnailName: 'hoc.png',
          tags: ['higher order component', 'hoc', 'react', '\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8', '\ub9ac\uc561\ud2b8'],
        },
        {
          title: 'Scroll sequence animation',
          description:
            'Apple \uc81c\ud488 \ud398\uc774\uc9c0 \uac19\uc740 \uc560\ub2c8\uba54\uc774\uc158\uc744 \uad6c\ud604\ud574\ubcf4\uc790 - Scroll sequence animation',
          fileName: 'scroll-sequence-animation.md',
          category: 'ui-and-ux',
          published: !0,
          publishedAt: '2021-10-31',
          thumbnailName: 'scroll-sequence.png',
          tags: ['scroll sequence', 'scroll sequence animation', 'ui', 'ux'],
        },
        {
          title: 'Any | Unknown | Never',
          description: 'TypeScript - Any | Unknown | Never',
          fileName: 'any-unknown-never.md',
          category: 'typescript',
          published: !0,
          publishedAt: '2021-11-15',
          thumbnailName: 'ts-any-unknown-never.png',
          tags: ['any', 'never', 'typescript', 'unknown', '\ud0c0\uc785\uc2a4\ud06c\ub9bd\ud2b8'],
        },
        {
          title: 'Elasticsearch: Full-text search (\uc804\ubb38\uac80\uc0c9)',
          description: 'Elasticsearch\ub97c \uc774\uc6a9\ud55c Full-text search',
          fileName: 'full-text-search.md',
          category: 'elasticsearch',
          published: !0,
          publishedAt: '2021-11-16',
          thumbnailName: 'elasticsearch-full-text-search.png',
          tags: ['elasticsearch', 'full-text search', 'searching engine', '\uc5d8\ub77c\uc2a4\ud2f1\uc11c\uce58', '\uc804\ubb38\uac80\uc0c9'],
        },
        {
          title: 'Nx build system \ub9db\ubcf4\uae30',
          description: 'Nx build system\uc744 \uc774\uc6a9\ud55c Monorepo \uad6c\uc131\ud558\uae30',
          fileName: 'monorepo-with-nx.md',
          category: 'infrastructure',
          published: !0,
          publishedAt: '2022-02-12',
          thumbnailName: 'monorepo-with-nx.png',
          tags: ['build', 'build system', 'monorepo', 'nx', '\ubaa8\ub178\ub9ac\ud3ec', '\ube4c\ub4dc', '\ube4c\ub4dc \uc2dc\uc2a4\ud15c'],
          series: { prevPostTitle: 'Nx build system \ub9db\ubcf4\uae30', nextPostTitle: 'yarn berry\ub85c \uad6c\uc131\ud558\ub294 monorepo' },
        },
        {
          title: 'yarn berry\ub85c \uad6c\uc131\ud558\ub294 monorepo',
          description:
            'yarn berry\uc640 yarn workspaces\ub97c \uc774\uc6a9\ud574 monorepo \uad6c\uc131 - \ud658\uacbd \uc124\uc815, \uc0d8\ud50c \ud504\ub85c\uc81d\ud2b8',
          fileName: 'yarn-berry-monorepo.md',
          category: 'infrastructure',
          published: !0,
          publishedAt: '2022-02-26',
          thumbnailName: 'yarn-berry-monorepo.png',
          tags: ['berry', 'monorepo', 'workspace', 'workspaces', 'yarn', 'yarn berry', 'zero-install', '\ubaa8\ub178\ub9ac\ud3ec'],
          references: [{ title: 'yarn workspaces', url: 'https://yarnpkg.com/features/workspaces' }],
          series: { prevPostTitle: 'Nx build system \ub9db\ubcf4\uae30' },
        },
        {
          title: 'ESLint - Plugin and Extends',
          description: 'ESLint\uc758 Plugin\uacfc Extends\uc758 \ucc28\uc774\ub294 \ubb34\uc5c7\uc77c\uae4c?',
          fileName: 'eslint-plugin-and-extends.md',
          category: '\uac1c\ubc1c\ud658\uacbd',
          published: !0,
          publishedAt: '2022-02-27',
          thumbnailName: 'eslint-plugin-and-extends.png',
          tags: ['eslint', 'eslint extends', 'eslint plugin', 'extends', 'lint', 'plugin', '\uac1c\ubc1c\ud658\uacbd'],
          references: [
            { title: 'eslint-plugin-react Github repository', url: 'https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L118-L179' },
          ],
        },
        {
          title: 'Focus on Button - Safari VS Chrome',
          description: 'Safari, Chrome \ube0c\ub77c\uc6b0\uc800\uc5d0 \ub530\ub77c \ub2ec\ub77c\uc9c0\ub294 button\uc758 focus \uc18d\uc131',
          fileName: 'focus-on-button-safari-vs-chrome.md',
          category: 'css',
          published: !0,
          publishedAt: '2022-02-28',
          thumbnailName: 'focus-on-button.png',
          tags: [
            'CSS',
            'browser',
            'chrome',
            'focus',
            'focus-visible',
            'focus-within',
            'safari',
            '\ube0c\ub77c\uc6b0\uc800',
            '\uc0ac\ud30c\ub9ac',
            '\ud06c\ub86c',
          ],
          references: [
            { title: 'Clicking and focus - MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus' },
          ],
        },
        {
          title: 'Heroku\ub85c Node.js \uc560\ud50c\ub9ac\ucf00\uc774\uc158 \ubc30\ud3ec\ud558\uae30',
          description: 'Heroku\ub97c \uc774\uc6a9\ud55c NodeJS  \uc560\ud50c\ub9ac\ucf00\uc774\uc158 \ubc30\ud3ec\ud558\uae30',
          fileName: 'deploy-nodejs-via-heroku.md',
          category: 'cloud',
          published: !0,
          publishedAt: '2022-03-04',
          thumbnailName: 'deploy-node-js-via-heroku.png',
          tags: ['cloud', 'cloud service', 'deploy', 'heroku', 'node.js', 'paas', '\ubc30\ud3ec'],
          references: [
            { title: 'Heroku Dev Center', url: 'https://devcenter.heroku.com/' },
            { title: 'Wiki - PaaS', url: 'https://en.wikipedia.org/wiki/Platform_as_a_service' },
          ],
        },
        {
          title: '\ube0c\ub77c\uc6b0\uc800 \ubcf4\uc548 \uc815\ucc45 CHIPS - (feat. Chrome \ucfe0\ud0a4 \uc785\ub825 \ubd88\uac00)',
          description:
            'CHIPS - Cookies Having Independent Partitioned State\n(Chrome 98 \ubc84\uadf8\ub97c \ucc3e\uc544 \ud5e4\ub9e4\ub2e4 \ubc1c\uacac\ud558\uac8c \ub41c \ube0c\ub77c\uc6b0\uc800\uc758 Cookie \uad00\ub9ac \uc815\ucc45)',
          fileName: 'chips.md',
          category: 'security',
          published: !0,
          publishedAt: '2022-03-06',
          thumbnailName: 'chips.png',
          tags: ['CHIPS', 'browser', 'chrome', 'cookie', 'policy', 'security', 'security policy'],
          references: [{ title: 'Chrome Platform Status', url: 'https://chromestatus.com/feature/5179189105786880' }],
        },
        {
          title: 'Apollo Server + TypeGraphQL\uc744 \uc774\uc6a9\ud55c GraphQL API \uc11c\ubc84 \uad6c\uc131\ud558\uae30',
          description: 'Apollo Server\uc640 TypeGraphQL\uc744 \uc0ac\uc6a9\ud55c Node.JS GraphQL API \uc11c\ubc84 \uad6c\uc131\ud558\uae30',
          fileName: 'graphql-with-apollo-server-typegraphql.md',
          category: 'nodejs',
          published: !0,
          publishedAt: '2022-03-10',
          thumbnailName: 'graphql-apollo-typegraphql.png',
          tags: ['api', 'api server', 'apollo', 'apollo-server', 'graphql', 'node.js', 'typegraphql', 'typescript'],
          references: [
            { title: 'Apollo Server', url: 'https://www.apollographql.com' },
            { title: 'DataLoader - GitHub Repository', url: 'https://github.com/graphql/dataloader' },
            { title: 'GraphQL', url: 'https://graphql.org' },
            { title: 'Sample Repository', url: 'https://github.com/possible819/graphql-sample' },
            { title: 'TypeGraphQL', url: 'https://typegraphql.com' },
          ],
        },
        {
          title: 'React Native - \uac1c\ubc1c\ud658\uacbd \uad6c\uc131\ud558\uae30',
          description:
            'Mac OS\uc5d0\uc11c iOS \uc560\ud50c\ub9ac\ucf00\uc774\uc158 \uac1c\ubc1c\uc744 \uc704\ud55c React Native \uac1c\ubc1c\ud658\uacbd \uad6c\uc131\ud558\uae30',
          fileName: 'react-native-dev-env.md',
          category: 'react-native',
          published: !0,
          publishedAt: '2022-03-26',
          thumbnailName: 'react-native-dev-env.png',
          tags: [
            'RN',
            'cross platform',
            'ios',
            'macos',
            'react native',
            'react native cli',
            '\uac1c\ubc1c\ud658\uacbd',
            '\uac1c\ubc1c\ud658\uacbd \uad6c\uc131\ud558\uae30',
            '\ub9ac\uc561\ud2b8 \ub124\uc774\ud2f0\ube0c',
          ],
          references: [
            { title: 'NVM', url: 'https://github.com/nvm-sh/nvm' },
            { title: 'React Native', url: 'https://reactnative.dev/docs/environment-setup' },
          ],
        },
        {
          title: 'How does internet work? - Roadmap.sh',
          description:
            'How does internet work? - Roadmap.sh\nRoadmap.sh frontend \ud559\uc2b5 \uc21c\uc11c\uc5d0 \ub530\ub77c \uc815\ub9ac\ud558\ub294 \ud3ec\uc2a4\ud305 1',
          fileName: 'internet.md',
          category: 'roadmap-frontend',
          published: !0,
          publishedAt: '2022-07-20',
          thumbnailName: 'roadmap-frontend-internet.png',
          tags: [
            'frontend',
            'internet',
            'packet',
            'protocol',
            'roadmap',
            'roadmap.sh',
            'routing',
            '\ub77c\uc6b0\ud305',
            '\uc778\ud130\ub137',
            '\ud328\ud0b7',
            '\ud504\ub85c\ud1a0\ucf5c',
          ],
          references: [{ title: 'Roadmap.sh', url: 'https://roadmap.sh/frontend' }],
        },
        {
          title: 'Web component - custom element',
          description: '\uc6f9 \ucef4\ud3ec\ub10c\ud2b8\ub85c \ub9cc\ub4dc\ub294 \ub098\ub9cc\uc758 custom element',
          fileName: 'web-component-web-component---custom-element.md',
          category: 'web-component',
          published: !0,
          publishedAt: '2022-07-31',
          thumbnailName: 'e0e40e28cf11f896033c8650f19188b7',
          tags: ['custom element', 'web component', '\uc6f9 \ucef4\ud3ec\ub10c\ud2b8', '\ucee4\uc2a4\ud140 \uc5d8\ub9ac\uba3c\ud2b8'],
          references: [
            { title: 'Custom element naming convention', url: 'https://html.spec.whatwg.org/#valid-custom-element-name' },
            { title: 'WebComponent org', url: 'https://www.webcomponents.org/' },
            { title: 'https://web.dev/custom-elements-v1/#custom-element-reactions', url: 'https://web.dev/custom-elements-v1/#custom-element-reactions' },
          ],
        },
      ]
    },
    4111: function (e, t, n) {
      var a = n(7294)
      t.Z = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '.',
          n = (0, a.useState)(''),
          o = n[0],
          r = n[1]
        return (
          (0, a.useEffect)(
            function () {
              var n = String(e.getFullYear()).slice(2),
                a = String(e.getMonth() + 1).padStart(2, '0'),
                o = String(e.getDate()).padStart(2, '0')
              r([n, a, o].join(t))
            },
            [e, t]
          ),
          o
        )
      }
    },
    9443: function (e, t, n) {
      var a = n(8145)
      function o(e, t) {
        for (var n = 0; n < t.length; n++) {
          var a = t[n]
          ;(a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
        }
      }
      var r = (function () {
        function e() {
          !(function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
          })(this, e)
        }
        var t, n, r
        return (
          (t = e),
          (r = [
            {
              key: 'absolutePath',
              value: function (e, t) {
                return (e = e.replace(/^\//, '')), [t || a.Z.baseURL, e].join('/')
              },
            },
            {
              key: 'buildImagePath',
              value: function (e) {
                return '/assets/images/'.concat(e)
              },
            },
          ]),
          (n = null) && o(t.prototype, n),
          r && o(t, r),
          e
        )
      })()
      t.Z = r
    },
    8286: function (e, t, n) {
      var a = n(1864),
        o = n.n(a),
        r = n(8145)
      function i(e, t) {
        for (var n = 0; n < t.length; n++) {
          var a = t[n]
          ;(a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
        }
      }
      var s = (function () {
        function e() {
          !(function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
          })(this, e)
        }
        var t, n, a
        return (
          (t = e),
          (a = [
            {
              key: 'normalizeTitle',
              value: function (e) {
                return e.replace(/\s/g, '-').toLowerCase()
              },
            },
            {
              key: 'getMarkdownFilePath',
              value: function (e) {
                return o().join('../posts', e.category, e.fileName)
              },
            },
            {
              key: 'buildLinkURLByTitle',
              value: function (e) {
                return ''.concat(r.Z.baseURL, '/').concat(this.normalizeTitle(e))
              },
            },
          ]),
          (n = null) && i(t.prototype, n),
          a && i(t, a),
          e
        )
      })()
      t.Z = s
    },
    7427: function (e, t, n) {
      var a = n(8145)
      function o(e, t) {
        for (var n = 0; n < t.length; n++) {
          var a = t[n]
          ;(a.enumerable = a.enumerable || !1), (a.configurable = !0), 'value' in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
        }
      }
      var r = (function () {
        function e() {
          !(function (e, t) {
            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
          })(this, e)
        }
        var t, n, r
        return (
          (t = e),
          (r = [
            {
              key: 'buildPageTitle',
              value: function (e) {
                return ''.concat(e, ' | ').concat(a.Z.title)
              },
            },
          ]),
          (n = null) && o(t.prototype, n),
          r && o(t, r),
          e
        )
      })()
      t.Z = r
    },
  },
])