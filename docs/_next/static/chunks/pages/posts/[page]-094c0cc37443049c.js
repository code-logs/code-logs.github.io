(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[410],{3454:function(e,t,r){"use strict";var n,i;e.exports=(null===(n=r.g.process)||void 0===n?void 0:n.env)&&"object"===typeof(null===(i=r.g.process)||void 0===i?void 0:i.env)?r.g.process:r(7663)},122:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/posts/[page]",function(){return r(8118)}])},9337:function(e,t,r){"use strict";r.d(t,{Z:function(){return p}});var n=r(5893),i=r(7026),a=(0,i.Z)((0,n.jsx)("path",{d:"M14.71 6.71a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z"}),"ChevronLeftRounded"),o=(0,i.Z)((0,n.jsx)("path",{d:"M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"}),"MoreHorizRounded"),c=(0,i.Z)((0,n.jsx)("path",{d:"M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"}),"ChevronRightRounded"),s=r(1664),l=r(7294),u=r(2256),f=r.n(u);function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function d(e){return function(e){if(Array.isArray(e))return h(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return h(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return h(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var p=function(e){var t=e.page,r=e.lastPage,i=e.displayCount,u=void 0===i?5:i,h=e.query,p=e.baseURL,g=(0,l.useState)([]),m=g[0],v=g[1];(0,l.useEffect)((function(){for(var e=[],n=[],i=Math.floor(u/2),a=0;a<i;a++){var o=t-i+a;o>0&&e.push(o);var c=t+1+a;c<=r&&n.push(c)}v(d(e).concat([t],d(n)))}),[t,r,u]),(0,l.useEffect)((function(){}),[]);var x=function(e){var t="".concat(p,"/").concat(e);return h&&(t+="?query=".concat(h)),t};return(0,n.jsx)("div",{className:f().container,children:(0,n.jsxs)("ul",{children:[t>1&&(0,n.jsx)("li",{children:(0,n.jsx)(s.default,{href:x(t-1),children:(0,n.jsx)("a",{children:(0,n.jsx)(a,{})})})}),t>1&&!m.includes(1)&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:x(1),children:1})}),(0,n.jsx)(o,{})]}),m.map((function(e){return(0,n.jsx)("li",{children:(0,n.jsx)("a",{className:t===e?f().currentPage:"",href:x(e),children:e})},e)})),t<r&&!m.includes(r)&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o,{}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:x(r),children:r})})]}),t<r&&(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:x(t+1),children:(0,n.jsx)(c,{})})})]})})}},7221:function(e,t,r){"use strict";var n=r(5893),i=r(1664),a=r(4111),o=r(9443),c=r(8286),s=r(7594),l=r(7828),u=r.n(l);t.Z=function(e){var t=e.titleLevel,r=void 0===t?3:t,l=e.post,f=(0,a.Z)(new Date(l.publishedAt));return(0,n.jsxs)("article",{className:u().card,children:[(0,n.jsx)(i.default,{href:c.Z.buildLinkURLByTitle(l.title),children:(0,n.jsxs)("a",{className:u().title,children:[1===r&&(0,n.jsx)("h1",{children:l.title}),2===r&&(0,n.jsx)("h2",{children:l.title}),3===r&&(0,n.jsx)("h3",{children:l.title})]})}),(0,n.jsx)("span",{className:u().category,children:l.category}),(0,n.jsx)("span",{className:u().publishedAt,children:f}),(0,n.jsx)(i.default,{href:c.Z.buildLinkURLByTitle(l.title),children:(0,n.jsx)("a",{className:u().description,children:(0,n.jsx)("p",{children:l.description})})}),l.thumbnailName&&(0,n.jsx)("div",{className:u().thumbnail,children:(0,n.jsx)(i.default,{href:c.Z.buildLinkURLByTitle(l.title),children:(0,n.jsx)("a",{children:(0,n.jsx)("img",{className:"thumbnail",src:o.Z.buildImagePath(l.thumbnailName),alt:l.description})})})}),(0,n.jsx)("section",{className:u().tags,children:(0,n.jsx)(s.Z,{tags:l.tags})})]})}},7594:function(e,t,r){"use strict";r.d(t,{Z:function(){return f}});var n=r(5893),i=r(1664),a=r(8145),o=r(2002),c=r.n(o),s=function(e){return(0,n.jsx)(i.default,{href:"".concat(a.Z.baseURL,"/posts/1?query=").concat(encodeURI(e.tag)),children:(0,n.jsx)("a",{children:(0,n.jsxs)("span",{className:c().tag,children:[e.tag," ",e.count&&e.count]})})})},l=r(8193),u=r.n(l),f=function(e){return(0,n.jsx)("ul",{className:u().tags,children:e.tags.map((function(e,t){return(0,n.jsx)("li",{children:"string"===typeof e?(0,n.jsx)(s,{tag:e}):(0,n.jsx)(s,{tag:e.tag,count:e.count})},t)}))})}},8118:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return C},default:function(){return w}});var n=r(5893),i=r(1163),a=r(7294),o=r(6166),c=r(1780),s=r(9337),l=r(7221),u=(0,r(7026).Z)((0,n.jsx)("path",{d:"M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"SearchRounded"),f=r(3337),h=r.n(f);function d(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){d(e,t,r[t])}))}return e}var g=function(e){return(0,n.jsxs)("label",{className:h().label,children:[(0,n.jsx)(u,{className:h().icon}),(0,n.jsx)("input",p({className:h().input},e))]})},m=r(8145),v=r(2698),x=r(9443),y=r(7427),b=r(7498),j=r.n(b);function _(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function A(e){return function(e){if(Array.isArray(e))return _(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return _(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var C=!0,w=function(e){var t=e.page,r=e.totalCount,u=(0,a.useState)(e.lastPage),f=u[0],h=u[1],d=(0,a.useState)(e.posts),p=d[0],b=d[1],_=(0,a.useState)(),C=_[0],w=_[1],S=(0,i.useRouter)();return(0,a.useEffect)((function(){var e=new URL(x.Z.absolutePath(S.asPath));if(e.search){var r=new URLSearchParams(e.search).get("query");if(r){w(encodeURI(r));var n=m.Z.pageLimit,i=(t-1)*n;b(v.Z.query(r,n,i)),h(Math.ceil(v.Z.query(r).length/n))}}}),[t,S.asPath]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.Z,{title:y.Z.buildPageTitle("Posts"),description:"\ud3ec\uc2a4\ud305 \ubaa9\ub85d - ".concat(t," \ud398\uc774\uc9c0"),url:"".concat(m.Z.baseURL,"/posts/").concat(t),imageURL:"/icons/icon-512x512.png",keywords:p.map((function(e){return A(e.tags).concat([e.title,e.description])})).flat()}),(0,n.jsxs)("span",{className:j().totalCount,children:["Total posts ",r]}),(0,n.jsx)("h1",{children:"Posts "}),(0,n.jsx)("form",{onSubmit:function(e){e.preventDefault();var t=e.currentTarget,r=new FormData(t).get("query");if(r){var n=new URL(location.href);n.pathname="/posts/1",n.search="query=".concat(encodeURI(r.toString())),location.href=n.href}},children:(0,n.jsx)(g,{placeholder:"Search...",name:"query"})}),Boolean(null===p||void 0===p?void 0:p.length)&&p.map((function(e,t){return(0,n.jsx)(l.Z,{titleLevel:2,post:e},t)})),(0,n.jsx)(c.Z,{adClient:m.Z.googleAdsense.adClient,adSlot:"5391522351"}),(0,n.jsx)(s.Z,{page:t,lastPage:f,query:C,baseURL:"".concat(m.Z.baseURL,"/posts")})]})}},2256:function(e){e.exports={container:"Paginator_container__Jyd6p",currentPage:"Paginator_currentPage__uykCS"}},7828:function(e){e.exports={card:"PostCard_card__RhSh8",title:"PostCard_title__sytFV",category:"PostCard_category__maLVP",publishedAt:"PostCard_publishedAt__jx58S",description:"PostCard_description__53x7j",thumbnail:"PostCard_thumbnail__RluzR",tags:"PostCard_tags__H0ViL"}},3337:function(e){e.exports={"hide-clear":"SearchInput_hide-clear__OJzSU",label:"SearchInput_label__5WQ13",icon:"SearchInput_icon__7xWSN",input:"SearchInput_input__pcQeU"}},2002:function(e){e.exports={tag:"Tag_tag__tXphA"}},8193:function(e){e.exports={tags:"Tags_tags__mhykw"}},7498:function(e){e.exports={totalCount:"Posts_totalCount__8nFES"}},1864:function(e,t,r){var n=r(3454);!function(){"use strict";var t={977:function(e){function t(e){if("string"!==typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function r(e,t){for(var r,n="",i=0,a=-1,o=0,c=0;c<=e.length;++c){if(c<e.length)r=e.charCodeAt(c);else{if(47===r)break;r=47}if(47===r){if(a===c-1||1===o);else if(a!==c-1&&2===o){if(n.length<2||2!==i||46!==n.charCodeAt(n.length-1)||46!==n.charCodeAt(n.length-2))if(n.length>2){var s=n.lastIndexOf("/");if(s!==n.length-1){-1===s?(n="",i=0):i=(n=n.slice(0,s)).length-1-n.lastIndexOf("/"),a=c,o=0;continue}}else if(2===n.length||1===n.length){n="",i=0,a=c,o=0;continue}t&&(n.length>0?n+="/..":n="..",i=2)}else n.length>0?n+="/"+e.slice(a+1,c):n=e.slice(a+1,c),i=c-a-1;a=c,o=0}else 46===r&&-1!==o?++o:o=-1}return n}var i={resolve:function(){for(var e,i="",a=!1,o=arguments.length-1;o>=-1&&!a;o--){var c;o>=0?c=arguments[o]:(void 0===e&&(e=n.cwd()),c=e),t(c),0!==c.length&&(i=c+"/"+i,a=47===c.charCodeAt(0))}return i=r(i,!a),a?i.length>0?"/"+i:"/":i.length>0?i:"."},normalize:function(e){if(t(e),0===e.length)return".";var n=47===e.charCodeAt(0),i=47===e.charCodeAt(e.length-1);return 0!==(e=r(e,!n)).length||n||(e="."),e.length>0&&i&&(e+="/"),n?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,r=0;r<arguments.length;++r){var n=arguments[r];t(n),n.length>0&&(void 0===e?e=n:e+="/"+n)}return void 0===e?".":i.normalize(e)},relative:function(e,r){if(t(e),t(r),e===r)return"";if((e=i.resolve(e))===(r=i.resolve(r)))return"";for(var n=1;n<e.length&&47===e.charCodeAt(n);++n);for(var a=e.length,o=a-n,c=1;c<r.length&&47===r.charCodeAt(c);++c);for(var s=r.length-c,l=o<s?o:s,u=-1,f=0;f<=l;++f){if(f===l){if(s>l){if(47===r.charCodeAt(c+f))return r.slice(c+f+1);if(0===f)return r.slice(c+f)}else o>l&&(47===e.charCodeAt(n+f)?u=f:0===f&&(u=0));break}var h=e.charCodeAt(n+f);if(h!==r.charCodeAt(c+f))break;47===h&&(u=f)}var d="";for(f=n+u+1;f<=a;++f)f!==a&&47!==e.charCodeAt(f)||(0===d.length?d+="..":d+="/..");return d.length>0?d+r.slice(c+u):(c+=u,47===r.charCodeAt(c)&&++c,r.slice(c))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var r=e.charCodeAt(0),n=47===r,i=-1,a=!0,o=e.length-1;o>=1;--o)if(47===(r=e.charCodeAt(o))){if(!a){i=o;break}}else a=!1;return-1===i?n?"/":".":n&&1===i?"//":e.slice(0,i)},basename:function(e,r){if(void 0!==r&&"string"!==typeof r)throw new TypeError('"ext" argument must be a string');t(e);var n,i=0,a=-1,o=!0;if(void 0!==r&&r.length>0&&r.length<=e.length){if(r.length===e.length&&r===e)return"";var c=r.length-1,s=-1;for(n=e.length-1;n>=0;--n){var l=e.charCodeAt(n);if(47===l){if(!o){i=n+1;break}}else-1===s&&(o=!1,s=n+1),c>=0&&(l===r.charCodeAt(c)?-1===--c&&(a=n):(c=-1,a=s))}return i===a?a=s:-1===a&&(a=e.length),e.slice(i,a)}for(n=e.length-1;n>=0;--n)if(47===e.charCodeAt(n)){if(!o){i=n+1;break}}else-1===a&&(o=!1,a=n+1);return-1===a?"":e.slice(i,a)},extname:function(e){t(e);for(var r=-1,n=0,i=-1,a=!0,o=0,c=e.length-1;c>=0;--c){var s=e.charCodeAt(c);if(47!==s)-1===i&&(a=!1,i=c+1),46===s?-1===r?r=c:1!==o&&(o=1):-1!==r&&(o=-1);else if(!a){n=c+1;break}}return-1===r||-1===i||0===o||1===o&&r===i-1&&r===n+1?"":e.slice(r,i)},format:function(e){if(null===e||"object"!==typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,t){var r=t.dir||t.root,n=t.base||(t.name||"")+(t.ext||"");return r?r===t.root?r+n:r+e+n:n}("/",e)},parse:function(e){t(e);var r={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return r;var n,i=e.charCodeAt(0),a=47===i;a?(r.root="/",n=1):n=0;for(var o=-1,c=0,s=-1,l=!0,u=e.length-1,f=0;u>=n;--u)if(47!==(i=e.charCodeAt(u)))-1===s&&(l=!1,s=u+1),46===i?-1===o?o=u:1!==f&&(f=1):-1!==o&&(f=-1);else if(!l){c=u+1;break}return-1===o||-1===s||0===f||1===f&&o===s-1&&o===c+1?-1!==s&&(r.base=r.name=0===c&&a?e.slice(1,s):e.slice(c,s)):(0===c&&a?(r.name=e.slice(1,o),r.base=e.slice(1,s)):(r.name=e.slice(c,o),r.base=e.slice(c,s)),r.ext=e.slice(o,s)),c>0?r.dir=e.slice(0,c-1):a&&(r.dir="/"),r},sep:"/",delimiter:":",win32:null,posix:null};i.posix=i,e.exports=i}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,i),o=!1}finally{o&&delete r[e]}return a.exports}i.ab="//";var a=i(977);e.exports=a}()},7663:function(e){!function(){var t={162:function(e){var t,r,n=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function o(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:i}catch(e){t=i}try{r="function"===typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var c,s=[],l=!1,u=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):u=-1,s.length&&h())}function h(){if(!l){var e=o(f);l=!0;for(var t=s.length;t;){for(c=s,s=[];++u<t;)c&&c[u].run();u=-1,t=s.length}c=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function p(){}n.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new d(e,t)),1!==s.length||l||o(h)},d.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}}},r={};function n(e){var i=r[e];if(void 0!==i)return i.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,n),o=!1}finally{o&&delete r[e]}return a.exports}n.ab="//";var i=n(162);e.exports=i}()},9008:function(e,t,r){e.exports=r(5443)}},function(e){e.O(0,[992,774,888,179],(function(){return t=122,e(e.s=t);var t}));var t=e.O();_N_E=t}]);