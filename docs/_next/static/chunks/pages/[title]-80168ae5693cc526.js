;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [133],
  {
    3201: function (e, t, r) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/[title]',
        function () {
          return r(2727)
        },
      ])
    },
    2727: function (e, t, r) {
      'use strict'
      r.r(t),
        r.d(t, {
          __N_SSG: function () {
            return S
          },
          default: function () {
            return Z
          },
        })
      var n = r(5893),
        i = r(637),
        s = r(7294),
        l = r(8286),
        o = r(6778),
        a = r.n(o)
      function c(e, t) {
        ;(null == t || t > e.length) && (t = e.length)
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r]
        return n
      }
      function u(e) {
        return (
          (function (e) {
            if (Array.isArray(e)) return c(e)
          })(e) ||
          (function (e) {
            if (('undefined' !== typeof Symbol && null != e[Symbol.iterator]) || null != e['@@iterator']) return Array.from(e)
          })(e) ||
          (function (e, t) {
            if (!e) return
            if ('string' === typeof e) return c(e, t)
            var r = Object.prototype.toString.call(e).slice(8, -1)
            'Object' === r && e.constructor && (r = e.constructor.name)
            if ('Map' === r || 'Set' === r) return Array.from(r)
            if ('Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return c(e, t)
          })(e) ||
          (function () {
            throw new TypeError(
              'Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            )
          })()
        )
      }
      var d = function (e) {
          var t = e.posts,
            r = (0, s.useState)([]),
            i = r[0],
            o = r[1],
            c = (0, s.useState)([]),
            d = c[0],
            h = c[1]
          return (
            (0, s.useEffect)(
              function () {
                var e = u(t)
                o(e.slice(0, 3)), h(e.slice(3))
              },
              [t]
            ),
            (0, n.jsxs)(n.Fragment, {
              children: [
                (0, n.jsx)('dl', {
                  className: a().container,
                  children: i.map(function (e) {
                    return (0,
                    n.jsxs)('a', { href: l.Z.buildLinkURLByTitle(e.title), children: [(0, n.jsx)('dt', { children: (0, n.jsx)('h3', { children: e.title }) }), (0, n.jsx)('dd', { children: e.description })] }, e.fileName)
                  }),
                }),
                !!d.length &&
                  (0, n.jsxs)('details', {
                    className: a().details,
                    children: [
                      (0, n.jsx)('summary', { children: '\ub354\ubcf4\uae30' }),
                      (0, n.jsx)('dl', {
                        className: a().container,
                        children: t.map(function (e) {
                          return (0,
                          n.jsxs)('a', { href: l.Z.buildLinkURLByTitle(e.title), children: [(0, n.jsx)('dt', { children: (0, n.jsx)('h3', { children: e.title }) }), (0, n.jsx)('dd', { children: e.description })] }, e.fileName)
                        }),
                      }),
                    ],
                  }),
              ],
            })
          )
        },
        h = r(6166),
        f = r(1780),
        p = r(2698),
        m = r(5114),
        j = r.n(m),
        x = function (e) {
          var t,
            r,
            i,
            s,
            o,
            a,
            c = e.post
          return (0, n.jsxs)('dl', {
            className: j().container,
            children: [
              (null === (t = c.series) || void 0 === t ? void 0 : t.prevPostTitle) &&
                (0, n.jsxs)('a', {
                  href: l.Z.buildLinkURLByTitle(c.series.prevPostTitle),
                  children: [
                    (0, n.jsxs)('dt', {
                      children: [(0, n.jsx)('span', { children: '\uc774\uc804\uae00 - ' }), (0, n.jsx)('h3', { children: c.series.prevPostTitle })],
                    }),
                    (0, n.jsx)('dd', {
                      children:
                        (null === (i = p.Z.findByTitle(null === (r = c.series) || void 0 === r ? void 0 : r.prevPostTitle)) || void 0 === i
                          ? void 0
                          : i.description) || '',
                    }),
                  ],
                }),
              (null === (s = c.series) || void 0 === s ? void 0 : s.nextPostTitle) &&
                (0, n.jsxs)('a', {
                  href: l.Z.buildLinkURLByTitle(c.series.nextPostTitle),
                  children: [
                    (0, n.jsxs)('dt', {
                      children: [(0, n.jsx)('span', { children: '\ub2e4\uc74c\uae00 - ' }), (0, n.jsx)('h3', { children: c.series.nextPostTitle })],
                    }),
                    (0, n.jsx)('dd', {
                      children:
                        (null === (a = p.Z.findByTitle(null === (o = c.series) || void 0 === o ? void 0 : o.nextPostTitle)) || void 0 === a
                          ? void 0
                          : a.description) || '',
                    }),
                  ],
                }),
            ],
          })
        },
        _ = function (e) {
          var t = e.repo,
            r = e.issueTerm,
            i = e.theme,
            l = e.issueLabel,
            o = (0, s.useRef)(null)
          return (
            (0, s.useEffect)(
              function () {
                if (o.current) {
                  var e = document.createElement('script')
                  ;(e.src = 'https://utteranc.es/client.js'),
                    (e.crossOrigin = 'anonymous'),
                    (e.async = !0),
                    e.setAttribute('repo', t),
                    e.setAttribute('issue-term', r),
                    e.setAttribute('theme', i),
                    l && e.setAttribute('label', l),
                    o.current.append(e)
                }
              },
              [l, r, t, i]
            ),
            (0, n.jsx)('div', { ref: o })
          )
        },
        b = r(8145),
        y = r(4111),
        g = r(9443),
        v = r(7427),
        P = r(3494),
        A = r.n(P)
      function N(e, t) {
        ;(null == t || t > e.length) && (t = e.length)
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r]
        return n
      }
      function T(e) {
        return (
          (function (e) {
            if (Array.isArray(e)) return N(e)
          })(e) ||
          (function (e) {
            if (('undefined' !== typeof Symbol && null != e[Symbol.iterator]) || null != e['@@iterator']) return Array.from(e)
          })(e) ||
          (function (e, t) {
            if (!e) return
            if ('string' === typeof e) return N(e, t)
            var r = Object.prototype.toString.call(e).slice(8, -1)
            'Object' === r && e.constructor && (r = e.constructor.name)
            if ('Map' === r || 'Set' === r) return Array.from(r)
            if ('Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return N(e, t)
          })(e) ||
          (function () {
            throw new TypeError(
              'Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            )
          })()
        )
      }
      var S = !0,
        Z = function (e) {
          var t,
            r = e.post,
            o = e.content,
            a = e.postsByCategory,
            c = (0, y.Z)(new Date(r.publishedAt))
          return (
            (0, s.useEffect)(function () {
              i.Z.highlightAll()
            }, []),
            (0, n.jsxs)(n.Fragment, {
              children: [
                (0, n.jsx)(h.Z, {
                  title: v.Z.buildPageTitle(r.title),
                  description: r.description,
                  url: ''.concat(b.Z.baseURL, '/').concat(l.Z.normalizeTitle(r.title)),
                  imageURL: g.Z.buildImagePath(r.thumbnailName),
                  keywords: T(r.tags).concat([r.title, r.description, r.category]),
                }),
                (0, n.jsxs)('article', {
                  className: A().container,
                  children: [
                    (0, n.jsx)('p', { className: A().publishedAt, children: (0, n.jsx)('span', { children: c }) }),
                    (0, n.jsx)('section', {
                      className: A().thumbnailWrapper,
                      children: (0, n.jsx)('img', { src: g.Z.buildImagePath(r.thumbnailName), alt: r.description }),
                    }),
                    (0, n.jsxs)('section', {
                      children: [(0, n.jsx)('h1', { children: r.title }), (0, n.jsx)('p', { className: A().description, children: r.description })],
                    }),
                    (0, n.jsx)('section', { dangerouslySetInnerHTML: { __html: o } }),
                  ],
                }),
                r.series &&
                  (0, n.jsxs)('section', {
                    className: A().relatedPosting,
                    children: [(0, n.jsx)('h2', { children: '\uc5f0\uad00 \ud3ec\uc2a4\ud305' }), (0, n.jsx)(x, { post: r })],
                  }),
                !!a.length &&
                  (0, n.jsxs)('section', {
                    className: A().categoryGroup,
                    children: [(0, n.jsx)('h2', { children: '\uce74\ud14c\uace0\ub9ac \ub354\ubcf4\uae30' }), (0, n.jsx)(d, { posts: a })],
                  }),
                !!(null === (t = r.references) || void 0 === t ? void 0 : t.length) &&
                  (0, n.jsxs)('section', {
                    className: A().references,
                    children: [
                      (0, n.jsx)('h2', { children: '\ucc38\uace0' }),
                      (0, n.jsx)('ul', {
                        className: A().references,
                        children: r.references.map(function (e, t) {
                          return (0, n.jsx)('li', { children: (0, n.jsx)('a', { href: e.url, target: '_blank', rel: 'noreferrer', children: e.title }) }, t)
                        }),
                      }),
                    ],
                  }),
                (0, n.jsxs)('section', {
                  className: A().utterances,
                  children: [
                    (0, n.jsx)('h2', { children: '\ub313\uae00' }),
                    (0, n.jsx)(_, { repo: 'code-logs/code-logs.github.io', theme: 'preferred-color-scheme', issueTerm: 'title', issueLabel: 'Comment' }),
                  ],
                }),
                (0, n.jsx)(f.Z, { adClient: b.Z.googleAdsense.adClient, adSlot: '5391522351' }),
              ],
            })
          )
        }
    },
    6778: function (e) {
      e.exports = { container: 'CategoryPostGroup_container__MDFUe', details: 'CategoryPostGroup_details__S_rtz' }
    },
    5114: function (e) {
      e.exports = { container: 'PostSeriesLink_container__jtRUh' }
    },
    3494: function (e) {
      e.exports = {
        thumbnailWrapper: 'PostDetail_thumbnailWrapper__oALCg',
        container: 'PostDetail_container__Ma_26',
        publishedAt: 'PostDetail_publishedAt__7GOQm',
        description: 'PostDetail_description__l6wHC',
        relatedPosting: 'PostDetail_relatedPosting__VlXXV',
        categoryGroup: 'PostDetail_categoryGroup___S2ib',
        references: 'PostDetail_references__EU_hH',
        utterances: 'PostDetail_utterances__jZeOm',
      }
    },
  },
  function (e) {
    e.O(0, [294, 992, 774, 888, 179], function () {
      return (t = 3201), e((e.s = t))
      var t
    })
    var t = e.O()
    _N_E = t
  },
])
