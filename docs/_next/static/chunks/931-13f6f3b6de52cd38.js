(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{3454:function(e,t,n){"use strict";var r,o;e.exports=(null===(r=n.g.process)||void 0===r?void 0:r.env)&&"object"===typeof(null===(o=n.g.process)||void 0===o?void 0:o.env)?n.g.process:n(7663)},6166:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(5893),o=n(9008),i=n(8145),a=n(7294),c=function(){(0,a.useEffect)((function(){if(document.head){var e=document.createElement("script");e.async=!0,e.src=i.Z.adsenseURL,e.crossOrigin="anonymous",document.head.appendChild(e)}}),[])},s=function(e){var t=e.title,n=e.description,a=e.keywords,s=e.url,l=e.imageURL,u=e.customMeta;return c(),(0,r.jsxs)(o.default,{children:[(0,r.jsx)("link",{rel:"canonical",href:s}),(0,r.jsx)("link",{rel:"apple-touch-icon",href:i.Z.appleTouchIconPath}),(0,r.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,r.jsx)("meta",{name:"theme-color",content:i.Z.themeColor},"theme-color"),(0,r.jsx)("meta",{property:"og:type",content:"website"},"og:type"),(0,r.jsx)("meta",{property:"og:site_name",content:i.Z.title},"og:site_name"),(0,r.jsx)("meta",{name:"author",content:i.Z.author},"author"),(null===a||void 0===a?void 0:a.length)&&(0,r.jsx)("meta",{name:"keyword",content:a.join(", ")},"keyword"),(0,r.jsx)("meta",{name:"description",content:n},"description"),(0,r.jsx)("meta",{property:"og:description",content:n},"og:description"),(0,r.jsx)("meta",{property:"og:title",content:t},"og:title"),(0,r.jsx)("meta",{property:"og:url",content:s},"og:url"),(0,r.jsx)("meta",{property:"og:image",content:l},"og:image"),u&&u,(0,r.jsx)("title",{children:t})]})}},4187:function(e,t,n){"use strict";n.d(t,{Z:function(){return x}});var r=n(5893),o=n(1664),i=n(8145),a=n(4111),c=n(9443),s=n(8286),l=n(7594),u=n(4051),f=n.n(u),h=n(7294);function d(e,t,n,r,o,i,a){try{var c=e[i](a),s=c.value}catch(l){return void n(l)}c.done?t(s):Promise.resolve(s).then(r,o)}var p=function(e){var t=(0,h.useState)(0),n=t[0],r=t[1];return(0,h.useEffect)((function(){if(e){var t=function(){var t,n=(t=f().mark((function t(){var n,o,i;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(n=new URL("https://simple-hit-counter.herokuapp.com/hit_count")).search="pathname=".concat(e),t.next=4,fetch(n.href,{method:"GET",headers:{"content-type":"application/json"}});case 4:if((o=t.sent).ok){t.next=7;break}throw new Error(o.statusText);case 7:return t.next=9,o.json();case 9:if(t.t0=t.sent,t.t0){t.next=12;break}t.t0=0;case 12:i=t.t0.count,r(i);case 14:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(e){d(i,r,o,a,c,"next",e)}function c(e){d(i,r,o,a,c,"throw",e)}a(void 0)}))});return function(){return n.apply(this,arguments)}}();t()}}),[e]),n},g=function(e){var t=e.post,n=p(s.Z.normalizeTitle(t.title));return(0,r.jsx)(r.Fragment,{children:n||""})},v=n(7828),m=n.n(v),x=function(e){var t=e.titleLevel,n=void 0===t?3:t,u=e.post,f=(0,a.Z)(new Date(u.publishedAt));return(0,r.jsxs)("article",{className:m().card,children:[(0,r.jsx)(o.default,{href:"".concat(i.Z.baseURL,"/").concat(s.Z.normalizeTitle(u.title)),children:(0,r.jsxs)("a",{className:m().title,children:[1===n&&(0,r.jsx)("h1",{children:u.title}),2===n&&(0,r.jsx)("h2",{children:u.title}),3===n&&(0,r.jsx)("h3",{children:u.title})]})}),(0,r.jsx)("span",{className:m().category,children:u.category}),(0,r.jsx)("span",{className:m().publishedAt,children:f}),(0,r.jsxs)("span",{className:m().viewCount,children:["Views ",(0,r.jsx)(g,{post:u})]}),(0,r.jsx)(o.default,{href:"".concat(i.Z.baseURL,"/").concat(s.Z.normalizeTitle(u.title)),children:(0,r.jsx)("a",{className:m().description,children:(0,r.jsx)("p",{children:u.description})})}),u.thumbnailName&&(0,r.jsx)("div",{className:m().thumbnail,children:(0,r.jsx)(o.default,{href:"".concat(i.Z.baseURL,"/").concat(s.Z.normalizeTitle(u.title)),children:(0,r.jsx)("a",{children:(0,r.jsx)("img",{className:"thumbnail",src:c.Z.buildImagePath(u.thumbnailName),alt:u.description})})})}),(0,r.jsx)("section",{className:m().tags,children:(0,r.jsx)(l.Z,{tags:u.tags})})]})}},7594:function(e,t,n){"use strict";n.d(t,{Z:function(){return f}});var r=n(5893),o=n(1664),i=n(8145),a=n(2002),c=n.n(a),s=function(e){return(0,r.jsx)(o.default,{href:"".concat(i.Z.baseURL,"/posts/1?query=").concat(encodeURI(e.tag)),children:(0,r.jsx)("a",{children:(0,r.jsxs)("span",{className:c().tag,children:[e.tag," ",e.count&&e.count]})})})},l=n(8193),u=n.n(l),f=function(e){return(0,r.jsx)("ul",{className:u().tags,children:e.tags.map((function(e,t){return(0,r.jsx)("li",{children:"string"===typeof e?(0,r.jsx)(s,{tag:e}):(0,r.jsx)(s,{tag:e.tag,count:e.count})},t)}))})}},4111:function(e,t,n){"use strict";var r=n(7294);t.Z=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".",n=(0,r.useState)(""),o=n[0],i=n[1];return(0,r.useEffect)((function(){var n=String(e.getFullYear()).slice(2),r=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");i([n,r,o].join(t))}),[e,t]),o}},9443:function(e,t,n){"use strict";var r=n(8145);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,i;return t=e,i=[{key:"absolutePath",value:function(e,t){return e=e.replace(/^\//,""),[t||r.Z.baseURL,e].join("/")}},{key:"buildImagePath",value:function(e){return"/assets/images/".concat(e)}}],(n=null)&&o(t.prototype,n),i&&o(t,i),e}();t.Z=i},8286:function(e,t,n){"use strict";var r=n(1864),o=n.n(r);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"normalizeTitle",value:function(e){return e.replace(/\s/g,"-").toLowerCase()}},{key:"getMarkdownFilePath",value:function(e){return o().join("../posts",e.category,e.fileName)}}],(n=null)&&i(t.prototype,n),r&&i(t,r),e}();t.Z=a},7427:function(e,t,n){"use strict";var r=n(8145);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,i;return t=e,i=[{key:"buildPageTitle",value:function(e){return"".concat(e," | ").concat(r.Z.title)}}],(n=null)&&o(t.prototype,n),i&&o(t,i),e}();t.Z=i},7828:function(e){e.exports={card:"PostCard_card__RhSh8",title:"PostCard_title__sytFV",category:"PostCard_category__maLVP",publishedAt:"PostCard_publishedAt__jx58S",viewCount:"PostCard_viewCount__6a4gv",description:"PostCard_description__53x7j",thumbnail:"PostCard_thumbnail__RluzR",tags:"PostCard_tags__H0ViL"}},2002:function(e){e.exports={tag:"Tag_tag__tXphA"}},8193:function(e){e.exports={tags:"Tags_tags__mhykw"}},1864:function(e,t,n){var r=n(3454);!function(){"use strict";var t={977:function(e){function t(e){if("string"!==typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function n(e,t){for(var n,r="",o=0,i=-1,a=0,c=0;c<=e.length;++c){if(c<e.length)n=e.charCodeAt(c);else{if(47===n)break;n=47}if(47===n){if(i===c-1||1===a);else if(i!==c-1&&2===a){if(r.length<2||2!==o||46!==r.charCodeAt(r.length-1)||46!==r.charCodeAt(r.length-2))if(r.length>2){var s=r.lastIndexOf("/");if(s!==r.length-1){-1===s?(r="",o=0):o=(r=r.slice(0,s)).length-1-r.lastIndexOf("/"),i=c,a=0;continue}}else if(2===r.length||1===r.length){r="",o=0,i=c,a=0;continue}t&&(r.length>0?r+="/..":r="..",o=2)}else r.length>0?r+="/"+e.slice(i+1,c):r=e.slice(i+1,c),o=c-i-1;i=c,a=0}else 46===n&&-1!==a?++a:a=-1}return r}var o={resolve:function(){for(var e,o="",i=!1,a=arguments.length-1;a>=-1&&!i;a--){var c;a>=0?c=arguments[a]:(void 0===e&&(e=r.cwd()),c=e),t(c),0!==c.length&&(o=c+"/"+o,i=47===c.charCodeAt(0))}return o=n(o,!i),i?o.length>0?"/"+o:"/":o.length>0?o:"."},normalize:function(e){if(t(e),0===e.length)return".";var r=47===e.charCodeAt(0),o=47===e.charCodeAt(e.length-1);return 0!==(e=n(e,!r)).length||r||(e="."),e.length>0&&o&&(e+="/"),r?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,n=0;n<arguments.length;++n){var r=arguments[n];t(r),r.length>0&&(void 0===e?e=r:e+="/"+r)}return void 0===e?".":o.normalize(e)},relative:function(e,n){if(t(e),t(n),e===n)return"";if((e=o.resolve(e))===(n=o.resolve(n)))return"";for(var r=1;r<e.length&&47===e.charCodeAt(r);++r);for(var i=e.length,a=i-r,c=1;c<n.length&&47===n.charCodeAt(c);++c);for(var s=n.length-c,l=a<s?a:s,u=-1,f=0;f<=l;++f){if(f===l){if(s>l){if(47===n.charCodeAt(c+f))return n.slice(c+f+1);if(0===f)return n.slice(c+f)}else a>l&&(47===e.charCodeAt(r+f)?u=f:0===f&&(u=0));break}var h=e.charCodeAt(r+f);if(h!==n.charCodeAt(c+f))break;47===h&&(u=f)}var d="";for(f=r+u+1;f<=i;++f)f!==i&&47!==e.charCodeAt(f)||(0===d.length?d+="..":d+="/..");return d.length>0?d+n.slice(c+u):(c+=u,47===n.charCodeAt(c)&&++c,n.slice(c))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var n=e.charCodeAt(0),r=47===n,o=-1,i=!0,a=e.length-1;a>=1;--a)if(47===(n=e.charCodeAt(a))){if(!i){o=a;break}}else i=!1;return-1===o?r?"/":".":r&&1===o?"//":e.slice(0,o)},basename:function(e,n){if(void 0!==n&&"string"!==typeof n)throw new TypeError('"ext" argument must be a string');t(e);var r,o=0,i=-1,a=!0;if(void 0!==n&&n.length>0&&n.length<=e.length){if(n.length===e.length&&n===e)return"";var c=n.length-1,s=-1;for(r=e.length-1;r>=0;--r){var l=e.charCodeAt(r);if(47===l){if(!a){o=r+1;break}}else-1===s&&(a=!1,s=r+1),c>=0&&(l===n.charCodeAt(c)?-1===--c&&(i=r):(c=-1,i=s))}return o===i?i=s:-1===i&&(i=e.length),e.slice(o,i)}for(r=e.length-1;r>=0;--r)if(47===e.charCodeAt(r)){if(!a){o=r+1;break}}else-1===i&&(a=!1,i=r+1);return-1===i?"":e.slice(o,i)},extname:function(e){t(e);for(var n=-1,r=0,o=-1,i=!0,a=0,c=e.length-1;c>=0;--c){var s=e.charCodeAt(c);if(47!==s)-1===o&&(i=!1,o=c+1),46===s?-1===n?n=c:1!==a&&(a=1):-1!==n&&(a=-1);else if(!i){r=c+1;break}}return-1===n||-1===o||0===a||1===a&&n===o-1&&n===r+1?"":e.slice(n,o)},format:function(e){if(null===e||"object"!==typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,t){var n=t.dir||t.root,r=t.base||(t.name||"")+(t.ext||"");return n?n===t.root?n+r:n+e+r:r}("/",e)},parse:function(e){t(e);var n={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return n;var r,o=e.charCodeAt(0),i=47===o;i?(n.root="/",r=1):r=0;for(var a=-1,c=0,s=-1,l=!0,u=e.length-1,f=0;u>=r;--u)if(47!==(o=e.charCodeAt(u)))-1===s&&(l=!1,s=u+1),46===o?-1===a?a=u:1!==f&&(f=1):-1!==a&&(f=-1);else if(!l){c=u+1;break}return-1===a||-1===s||0===f||1===f&&a===s-1&&a===c+1?-1!==s&&(n.base=n.name=0===c&&i?e.slice(1,s):e.slice(c,s)):(0===c&&i?(n.name=e.slice(1,a),n.base=e.slice(1,s)):(n.name=e.slice(c,a),n.base=e.slice(c,s)),n.ext=e.slice(a,s)),c>0?n.dir=e.slice(0,c-1):i&&(n.dir="/"),n},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,e.exports=o}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var i=n[e]={exports:{}},a=!0;try{t[e](i,i.exports,o),a=!1}finally{a&&delete n[e]}return i.exports}o.ab="//";var i=o(977);e.exports=i}()},7663:function(e){!function(){var t={162:function(e){var t,n,r=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===o||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:o}catch(e){t=o}try{n="function"===typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var c,s=[],l=!1,u=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):u=-1,s.length&&h())}function h(){if(!l){var e=a(f);l=!0;for(var t=s.length;t;){for(c=s,s=[];++u<t;)c&&c[u].run();u=-1,t=s.length}c=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function p(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new d(e,t)),1!==s.length||l||a(h)},d.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=p,r.addListener=p,r.once=p,r.off=p,r.removeListener=p,r.removeAllListeners=p,r.emit=p,r.prependListener=p,r.prependOnceListener=p,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}},a=!0;try{t[e](i,i.exports,r),a=!1}finally{a&&delete n[e]}return i.exports}r.ab="//";var o=r(162);e.exports=o}()},9008:function(e,t,n){e.exports=n(5443)}}]);