(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[133],{3201:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[title]",function(){return n(5942)}])},7276:function(e,t,n){"use strict";var r=n(5893),o=n(9008),i=n(8145);t.Z=function(e){var t=e.title,n=e.description,a=e.keywords,s=e.url,c=e.imageURL,l=e.customMeta;return(0,r.jsxs)(o.default,{children:[(0,r.jsx)("link",{rel:"apple-touch-icon",href:i.Z.appleTouchIconPath}),(0,r.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,r.jsx)("meta",{name:"theme-color",content:i.Z.themeColor},"theme-color"),(0,r.jsx)("meta",{property:"og:type",content:"website"},"og:type"),(0,r.jsx)("meta",{property:"og:site_name",content:i.Z.title},"og:site_name"),(0,r.jsx)("meta",{name:"author",content:i.Z.author},"author"),(null===a||void 0===a?void 0:a.length)&&(0,r.jsx)("meta",{name:"keyword",content:a.join(", ")},"keyword"),(0,r.jsx)("meta",{name:"description",content:n},"description"),(0,r.jsx)("meta",{property:"og:description",content:n},"og:description"),(0,r.jsx)("meta",{property:"og:title",content:t},"og:title"),(0,r.jsx)("meta",{property:"og:url",content:s},"og:url"),(0,r.jsx)("meta",{property:"og:image",content:c},"og:image"),l&&l,(0,r.jsx)("title",{children:t})]})}},5942:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return g},default:function(){return b}});var r=n(5893),o=n(7276),i=n(9443),a=n(8286),s=n(7427),c=n(7294),l=function(e){var t=e.repo,n=e.issueTerm,o=e.theme,i=e.issueLabel,a=(0,c.useRef)(null);return(0,c.useEffect)((function(){if(a.current){var e=document.createElement("script");e.src="https://utteranc.es/client.js",e.crossOrigin="anonymous",e.async=!0,e.setAttribute("repo",t),e.setAttribute("issue-term",n),e.setAttribute("theme",o),i&&e.setAttribute("label",i),a.current.append(e)}}),[i,n,t,o]),(0,r.jsx)("div",{ref:a})},u=n(8145),f=n(637),p=n(3494),m=n.n(p);function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function d(e){return function(e){if(Array.isArray(e))return h(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var g=!0,b=function(e){var t;return(0,c.useEffect)((function(){f.Z.highlightAll()}),[]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.Z,{title:s.Z.buildPageTitle(e.post.title),description:e.post.description,url:"".concat(u.Z.baseURL,"/").concat(a.Z.normalizeTitle(e.post.title)),imageURL:i.Z.buildImagePath(e.post.thumbnailName),keywords:d(e.post.tags).concat([e.post.title,e.post.description,e.post.category])}),(0,r.jsxs)("article",{className:m().container,children:[(0,r.jsx)("section",{className:m().thumbnailWrapper,children:e.post.thumbnailName&&(0,r.jsx)("img",{src:i.Z.buildImagePath(e.post.thumbnailName),alt:e.post.description})}),(0,r.jsxs)("section",{children:[(0,r.jsx)("h1",{children:e.post.title}),(0,r.jsx)("p",{className:m().description,children:e.post.description})]}),(0,r.jsx)("section",{dangerouslySetInnerHTML:{__html:e.content}}),(null===(t=e.post.references)||void 0===t?void 0:t.length)&&(0,r.jsxs)("section",{children:[(0,r.jsx)("h2",{children:"References"}),(0,r.jsx)("ul",{className:m().references,children:e.post.references.map((function(e,t){return(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:e.url,target:"_blank",rel:"noreferrer",children:e.title})},t)}))})]})]}),(0,r.jsxs)("section",{className:m().utterances,children:[(0,r.jsx)("h2",{children:"Comments"}),(0,r.jsx)(l,{repo:"code-logs/code-logs.github.io",theme:"github-light",issueTerm:"title",issueLabel:"Comment"})]})]})}},9443:function(e,t,n){"use strict";var r=n(8145);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,i;return t=e,i=[{key:"absolutePath",value:function(e,t){return e=e.replace(/^\//,""),[t||r.Z.baseURL,e].join("/")}},{key:"buildImagePath",value:function(e){return"/assets/images/".concat(e)}}],(n=null)&&o(t.prototype,n),i&&o(t,i),e}();t.Z=i},8286:function(e,t,n){"use strict";var r=n(1864),o=n.n(r);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"normalizeTitle",value:function(e){return e.replace(/\s/g,"-").toLowerCase()}},{key:"getMarkdownFilePath",value:function(e){return o().join("../posts",e.category,e.fileName)}}],(n=null)&&i(t.prototype,n),r&&i(t,r),e}();t.Z=a},7427:function(e,t,n){"use strict";var r=n(8145);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,i;return t=e,i=[{key:"buildPageTitle",value:function(e){return"".concat(e," | ").concat(r.Z.title)}}],(n=null)&&o(t.prototype,n),i&&o(t,i),e}();t.Z=i},3494:function(e){e.exports={thumbnailWrapper:"PostDetail_thumbnailWrapper__oALCg",container:"PostDetail_container__Ma_26",description:"PostDetail_description__l6wHC",references:"PostDetail_references__EU_hH",utterances:"PostDetail_utterances__jZeOm"}}},function(e){e.O(0,[294,774,888,179],(function(){return t=3201,e(e.s=t);var t}));var t=e.O();_N_E=t}]);