;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [165],
  {
    4333: function (t, n, e) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/tags',
        function () {
          return e(7437)
        },
      ])
    },
    6166: function (t, n, e) {
      'use strict'
      e.d(n, {
        Z: function () {
          return c
        },
      })
      var o = e(5893),
        r = e(9008),
        a = e(8145),
        i = e(7294),
        s = function () {
          ;(0, i.useEffect)(function () {
            if (document.head) {
              var t = document.createElement('script')
              ;(t.async = !0),
                (t.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='.concat(a.Z.googleAdsense.adClient)),
                (t.crossOrigin = 'anonymous'),
                document.head.appendChild(t)
            }
          }, [])
        },
        c = function (t) {
          var n = t.title,
            e = t.description,
            i = t.keywords,
            c = t.url,
            u = t.imageURL,
            l = t.customMeta
          return (
            s(),
            (0, o.jsxs)(r.default, {
              children: [
                (0, o.jsx)('link', { rel: 'canonical', href: c }),
                (0, o.jsx)('link', { rel: 'apple-touch-icon', href: a.Z.appleTouchIconPath }),
                (0, o.jsx)('link', { rel: 'manifest', href: '/manifest.json' }),
                (0, o.jsx)('meta', { name: 'theme-color', content: a.Z.themeColor }, 'theme-color'),
                (0, o.jsx)('meta', { property: 'og:type', content: 'website' }, 'og:type'),
                (0, o.jsx)('meta', { property: 'og:site_name', content: a.Z.title }, 'og:site_name'),
                (0, o.jsx)('meta', { name: 'author', content: a.Z.author }, 'author'),
                (null === i || void 0 === i ? void 0 : i.length) && (0, o.jsx)('meta', { name: 'keyword', content: i.join(', ') }, 'keyword'),
                (0, o.jsx)('meta', { name: 'description', content: e }, 'description'),
                (0, o.jsx)('meta', { property: 'og:description', content: e }, 'og:description'),
                (0, o.jsx)('meta', { property: 'og:title', content: n }, 'og:title'),
                (0, o.jsx)('meta', { property: 'og:url', content: c }, 'og:url'),
                (0, o.jsx)('meta', { property: 'og:image', content: u }, 'og:image'),
                l && l,
                (0, o.jsx)('title', { children: n }),
              ],
            })
          )
        }
    },
    1780: function (t, n, e) {
      'use strict'
      var o = e(5893),
        r = e(7294)
      n.Z = function (t) {
        return (
          (0, r.useEffect)(function () {
            ;(window.adsbygoogle = window.adsbygoogle || []), window.adsbygoogle.push({})
          }, []),
          (0, o.jsx)('ins', {
            className: 'adsbygoogle',
            style: { display: 'block' },
            'data-ad-client': t.adClient,
            'data-ad-slot': t.adSlot,
            'data-ad-format': 'auto',
            'data-full-width-responsive': 'true',
            onLoad: function () {
              return console.log('loaded')
            },
          })
        )
      }
    },
    7594: function (t, n, e) {
      'use strict'
      e.d(n, {
        Z: function () {
          return d
        },
      })
      var o = e(5893),
        r = e(1664),
        a = e(8145),
        i = e(2002),
        s = e.n(i),
        c = function (t) {
          return (0, o.jsx)(r.default, {
            href: ''.concat(a.Z.baseURL, '/posts/1?query=').concat(encodeURI(t.tag)),
            children: (0, o.jsx)('a', { children: (0, o.jsxs)('span', { className: s().tag, children: [t.tag, ' ', t.count && t.count] }) }),
          })
        },
        u = e(8193),
        l = e.n(u),
        d = function (t) {
          return (0, o.jsx)('ul', {
            className: l().tags,
            children: t.tags.map(function (t, n) {
              return (0, o.jsx)('li', { children: 'string' === typeof t ? (0, o.jsx)(c, { tag: t }) : (0, o.jsx)(c, { tag: t.tag, count: t.count }) }, n)
            }),
          })
        }
    },
    5505: function (t, n, e) {
      'use strict'
      var o = e(5893),
        r = e(7260),
        a = e.n(r)
      n.Z = function (t) {
        var n = (0, o.jsxs)(o.Fragment, { children: [t.title, ' ', (0, o.jsxs)('span', { className: a().postCount, children: ['(', t.count, ')'] })] })
        switch (t.level) {
          case 1:
          default:
            return (0, o.jsx)('h1', { children: n })
          case 2:
            return (0, o.jsx)('h2', { children: n })
          case 3:
            return (0, o.jsx)('h3', { children: n })
        }
      }
    },
    7437: function (t, n, e) {
      'use strict'
      e.r(n),
        e.d(n, {
          __N_SSG: function () {
            return m
          },
          default: function () {
            return j
          },
        })
      var o = e(5893),
        r = e(6166),
        a = e(1780),
        i = e(7594),
        s = e(6545),
        c = e.n(s),
        u = function (t) {
          return (0, o.jsx)('ol', {
            className: c().container,
            children: t.indexGroups.map(function (n, e) {
              return (0, o.jsx)(
                'ol',
                {
                  children: n
                    .filter(function (n) {
                      return t.tagsByIndexes[n].length
                    })
                    .map(function (n, e) {
                      return (0, o.jsxs)('li', { children: [(0, o.jsx)('h2', { id: n, children: n }), (0, o.jsx)(i.Z, { tags: t.tagsByIndexes[n] })] }, e)
                    }),
                },
                e
              )
            }),
          })
        },
        l = e(1664),
        d = e(327),
        f = e.n(d),
        g = function (t) {
          var n = new Set(t.activatedIndexes)
          return (0, o.jsx)('div', {
            className: f().container,
            children: t.indexGroups.map(function (t, e) {
              return (0, o.jsx)(
                'ol',
                {
                  children: t.map(function (t) {
                    return (0,
                    o.jsx)(l.default, { href: '#'.concat(t), children: (0, o.jsx)('a', { className: n.has(t) ? f().active : '', children: (0, o.jsx)('li', { children: t }) }) }, t)
                  }),
                },
                e
              )
            }),
          })
        },
        p = e(5505),
        h = e(8145),
        x = e(7427),
        m = !0,
        j = function (t) {
          var n = t.tags,
            e = [
              ['\uac00', '\ub098', '\ub2e4', '\ub77c', '\ub9c8', '\ubc14', '\uc0ac', '\uc544', '\uc790', '\ucc28', '\uce74', '\ud0c0', '\ud558'],
              Array(26)
                .fill('')
                .map(function (t, n) {
                  return String.fromCharCode(n + 65)
                }),
            ],
            i = n.reduce(function (t, n) {
              var e = t.findIndex(function (t) {
                return t.tag === n
              })
              return e >= 0 ? t[e].count++ : t.push({ tag: n, count: 1 }), t
            }, []),
            s = e.flat(),
            c = s.reduce(function (t, n) {
              return (t[n] = []), t
            }, {})
          i.forEach(function (t) {
            for (var n = t.tag.toUpperCase().charCodeAt(0), e = 0; e < s.length; e++) {
              var o = s[e],
                r = s[e + 1],
                a = o.toUpperCase().charCodeAt(0),
                i = void 0
              if ((r && (i = r.toUpperCase().charCodeAt(0)), void 0 !== i)) {
                if (n >= a && n < i) {
                  c[o].push(t)
                  break
                }
              } else c[o].push(t)
            }
          })
          var l = s.reduce(function (t, n) {
            return c[n].length && t.push(n), t
          }, [])
          return (0, o.jsxs)('section', {
            children: [
              (0, o.jsx)(r.Z, {
                title: x.Z.buildPageTitle('Tags \ubaa9\ub85d'),
                description: 'Tag\ub97c \uae30\uc900\uc73c\ub85c \ud3ec\uc2a4\ud305\uc744 \uc0c9\uc778\ud569\ub2c8\ub2e4.',
                url: ''.concat(h.Z.baseURL, '/tags'),
                imageURL: '/icons/icon-512x512.png',
              }),
              (0, o.jsx)(p.Z, { level: 1, title: 'Tags', count: n.length }),
              (0, o.jsx)(g, { activatedIndexes: l, indexGroups: e }),
              (0, o.jsx)(u, { indexGroups: e, tagsByIndexes: c }),
              (0, o.jsx)(a.Z, { adClient: h.Z.googleAdsense.adClient, adSlot: '5391522351' }),
            ],
          })
        }
    },
    7427: function (t, n, e) {
      'use strict'
      var o = e(8145)
      function r(t, n) {
        for (var e = 0; e < n.length; e++) {
          var o = n[e]
          ;(o.enumerable = o.enumerable || !1), (o.configurable = !0), 'value' in o && (o.writable = !0), Object.defineProperty(t, o.key, o)
        }
      }
      var a = (function () {
        function t() {
          !(function (t, n) {
            if (!(t instanceof n)) throw new TypeError('Cannot call a class as a function')
          })(this, t)
        }
        var n, e, a
        return (
          (n = t),
          (a = [
            {
              key: 'buildPageTitle',
              value: function (t) {
                return ''.concat(t, ' | ').concat(o.Z.title)
              },
            },
          ]),
          (e = null) && r(n.prototype, e),
          a && r(n, a),
          t
        )
      })()
      n.Z = a
    },
    6545: function (t) {
      t.exports = { container: 'TagList_container__e_mLL' }
    },
    327: function (t) {
      t.exports = { container: 'TagNavigator_container__LKTJr', active: 'TagNavigator_active__9hURi' }
    },
    2002: function (t) {
      t.exports = { tag: 'Tag_tag__tXphA' }
    },
    8193: function (t) {
      t.exports = { tags: 'Tags_tags__mhykw' }
    },
    7260: function (t) {
      t.exports = { postCount: 'TitleWithCount_postCount__E9bRh' }
    },
    9008: function (t, n, e) {
      t.exports = e(5443)
    },
  },
  function (t) {
    t.O(0, [774, 888, 179], function () {
      return (n = 4333), t((t.s = n))
      var n
    })
    var n = t.O()
    _N_E = n
  },
])
