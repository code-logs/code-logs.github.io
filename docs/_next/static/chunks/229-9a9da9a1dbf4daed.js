(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[229],{3454:function(e,t,n){"use strict";var r,i;e.exports=(null===(r=n.g.process)||void 0===r?void 0:r.env)&&"object"===typeof(null===(i=n.g.process)||void 0===i?void 0:i.env)?n.g.process:n(7663)},7221:function(e,t,n){"use strict";var r=n(5893),i=n(8286),a=n(7594),o=n(8145),l=n(7828),s=n.n(l),c=n(9443);t.Z=function(e){var t=e.titleLevel,n=void 0===t?3:t,l=e.post;return(0,r.jsxs)("article",{className:s().card,children:[(0,r.jsxs)("a",{className:s().title,href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(l.title)),children:[1===n&&(0,r.jsx)("h1",{children:l.title}),2===n&&(0,r.jsx)("h2",{children:l.title}),3===n&&(0,r.jsx)("h3",{children:l.title})]}),(0,r.jsx)("span",{className:s().category,children:l.category}),(0,r.jsx)("span",{className:s().publishedAt,children:function(e){"string"===typeof e&&(e=new Date(e));var t=String(e.getFullYear()).slice(2),n=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return"".concat(t,"/").concat(n,"/").concat(r)}(l.publishedAt)}),(0,r.jsx)("a",{className:s().description,href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(l.title)),children:(0,r.jsx)("p",{children:l.description})}),l.thumbnailName&&(0,r.jsx)("div",{className:s().thumbnail,children:(0,r.jsx)("a",{href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(l.title)),children:(0,r.jsx)("img",{className:"thumbnail",src:c.Z.buildImagePath(l.thumbnailName),alt:l.description})})}),(0,r.jsx)("section",{className:s().tags,children:(0,r.jsx)(a.Z,{tags:l.tags})})]})}},7594:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var r=n(5893),i=n(8145),a=n(2002),o=n.n(a),l=function(e){return(0,r.jsx)("a",{href:"".concat(i.Z.baseURL,"/posts/1?query=").concat(encodeURI(e.tag)),children:(0,r.jsxs)("span",{className:o().tag,children:[e.tag," ",e.count&&e.count]})})},s=n(8193),c=n.n(s),u=function(e){return(0,r.jsx)("ul",{className:c().tags,children:e.tags.map((function(e,t){return(0,r.jsx)("li",{children:"string"===typeof e?(0,r.jsx)(l,{tag:e}):(0,r.jsx)(l,{tag:e.tag,count:e.count})},t)}))})}},2698:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e){return function(e){if(Array.isArray(e))return r(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}n.d(t,{Z:function(){return g}});var o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.dataset=t}var t,n,r;return t=e,(n=[{key:"find",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return void 0!==e?this.dataset.slice(t,t+e):a(this.dataset)}},{key:"count",value:function(e,t){return this.dataset.filter((function(n){return n[e]===t})).length}},{key:"sort",value:function(e){return this.dataset.sort(e),this}}])&&i(t.prototype,n),r&&i(t,r),e}(),l=n(8286),s=[{title:"\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815",fileName:"config-for-seo.md",description:"\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815 (Title, Meta Tag, \uc808\ub300\uacbd\ub85c, robots.txt, sitemap.xml)",category:"SEO",published:!0,publishedAt:"2021-10-10",tags:["Search Engine Optimization","SEO","\uac80\uc0c9","\uba54\ud0c0","\uba54\ud0c0 \ud0dc\uadf8","meta tag","\uac80\uc0c9\uc5d4\uc9c4","\uac80\uc0c9\uc5d4\uc9c4 \ucd5c\uc801\ud654","robots.txt","sitemap.xml"],thumbnailName:"seo-thumbnail.jpg"},{title:"Tagged Template Literal",fileName:"tagged-template-literal.md",description:"Javascript ES6 Tagged Template Literal",category:"javascript",published:!0,publishedAt:"2021-10-11",tags:["javascript","tagged template","tagged template literal","es6"],thumbnailName:"tagged-template-literal.jpg"},{title:"Iterator and Generator",fileName:"iterator-generator.md",description:"Javascript ES6 Iterator & Generator, \uc5f4\uac70\ud615, \uc81c\ub108\ub808\uc774\ud130 \ud568\uc218, generator function, yield, function*",category:"javascript",published:!0,publishedAt:"2021-10-17",tags:["javascript","iterator","iterable","generator","es6","function*","yield"],thumbnailName:"iterator-generator.jpg"},{title:"Proxy",fileName:"proxy.md",description:"Javascript ES6 Proxy, Proxy, Trap, \ud504\ub77d\uc2dc\ub97c \uc774\uc6a9\ud55c \uac1d\uccb4 \uc870\uc791\uc758 \uc81c\uc5b4",category:"javascript",published:!0,publishedAt:"2021-10-25",tags:["javascript","proxy","trap","es6"],thumbnailName:"proxy.jpg"},{title:"CSS Position",fileName:"css-position.md",description:"CSS Position (Static, Absolute, Fixed, Sticky)\uc5d0 \ub530\ub978 \uace0\uc815 \ud5e4\ub354 \uc2a4\ud0c0\uc77c",category:"CSS",published:!0,publishedAt:"2021-10-26",tags:["css","position","static","absolute","fixed","sticky","header","style"],thumbnailName:"css-position.jpg"},{title:"\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8 (HOC: Higher Order Component)",fileName:"hoc.md",description:"React - \uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8\ub97c \uc774\uc6a9\ud55c \ucef4\ud37c\ub10c\ud2b8\uc758 \uc7ac\uc0ac\uc6a9",category:"react",published:!0,publishedAt:"2021-10-30",tags:["hoc","higher order component","\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8","react"],thumbnailName:"hoc.jpg"},{title:"Scroll sequence animation",fileName:"scroll-sequence-animation.md",description:"Apple \uc81c\ud488 \ud398\uc774\uc9c0 \uac19\uc740 \uc560\ub2c8\uba54\uc774\uc158\uc744 \uad6c\ud604\ud574\ubcf4\uc790 - Scroll sequence animation",category:"UI and UX",published:!0,publishedAt:"2021-10-31",tags:["scroll sequence","scroll sequence animation","ui","ux"],thumbnailName:"scroll-sequence.jpg"},{title:"Any | Unknown | Never",fileName:"any-unknown-never.md",description:"TypeScript - Any | Unknown | Never",category:"typescript",published:!0,publishedAt:"2021-11-15",tags:["typescript","any","unknown","never"],thumbnailName:"ts-any-unknown-never.jpg"},{title:"Elasticsearch: Full-text search (\uc804\ubb38\uac80\uc0c9)",fileName:"full-text-search.md",description:"Elasticsearch\ub97c \uc774\uc6a9\ud55c Full-text search",category:"elasticsearch",published:!0,publishedAt:"2021-11-16",tags:["elasticsearch","full-text search","searching engine"],thumbnailName:"elasticsearch-full-text-search.jpg"},{title:"Nx build system \ub9db\ubcf4\uae30",fileName:"monorepo-with-nx.md",description:"Nx build system\uc744 \uc774\uc6a9\ud55c Monorepo \uad6c\uc131\ud558\uae30",category:"infrastructure",published:!0,publishedAt:"2022-02-12",tags:["nx","build","build system","monorepo","\ube4c\ub4dc","\ube4c\ub4dc \uc2dc\uc2a4\ud15c","\ubaa8\ub178\ub9ac\ud3ec"],thumbnailName:"monorepo-with-nx.jpg"},{title:"Svelte - Let's get started",fileName:"get-started-svelte.md",description:"Svelte \ub9db\ubcf4\uae30",category:"svelte",published:!1,publishedAt:"2022-02-13",tags:["svelte","frontend","get started"],thumbnailName:"get-started-svelte.jpg",references:[{title:"Svelte",url:"https://svelte.dev/"},{title:"Naver",url:"https://naver.com/"}]}];function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){return!t||"object"!==d(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var d=function(e){return e&&"undefined"!==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};function p(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=u(e);if(t){var i=u(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}var g=new(function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(a,e);var t,n,r,i=p(a);function a(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(e=i.call(this,s.filter((function(e){return e.published})))).sort((function(e,t){return new Date(e.publishedAt)>new Date(t.publishedAt)?-1:1})),e}return t=a,(n=[{key:"findByTitle",value:function(e){return this.dataset.find((function(t){return l.Z.normalizeTitle(t.title)===e}))}},{key:"hasNewByCategory",value:function(e){return Boolean(this.dataset.filter((function(t){return t.category===e})).find((function(e){var t=new Date(e.publishedAt);return t.setDate(t.getDate()+7)>=Date.now()})))}},{key:"countByCategory",value:function(e){return this.dataset.filter((function(t){return t.category===e})).length}},{key:"countByTag",value:function(e){return this.dataset.filter((function(t){return t.tags.includes(e)})).length}},{key:"query",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=e.split(/\s/).map((function(e){return e.toLowerCase()})),i=this.dataset.filter((function(e){return r.some((function(t){return e.title.indexOf(t)>=0||e.description.indexOf(t)>=0||e.category.indexOf(t)>=0||e.tags.join("").indexOf(t)>=0}))}));return void 0!==t?i.slice(n,n+t):i}}])&&c(t.prototype,n),r&&c(t,r),a}(o))},9443:function(e,t,n){"use strict";var r=n(8145);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,a;return t=e,a=[{key:"absolutePath",value:function(e,t){return e=e.replace(/^\//,""),[t||r.Z.baseURL,e].join("/")}},{key:"buildImagePath",value:function(e){return"/assets/images/".concat(e)}}],(n=null)&&i(t.prototype,n),a&&i(t,a),e}();t.Z=a},8286:function(e,t,n){"use strict";var r=n(1864),i=n.n(r);function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"normalizeTitle",value:function(e){return e.replace(/\s/g,"-").toLowerCase()}},{key:"getMarkdownFilePath",value:function(e){return i().join("../posts",e.category,e.fileName)}}],(n=null)&&a(t.prototype,n),r&&a(t,r),e}();t.Z=o},7828:function(e){e.exports={card:"PostCard_card__RhSh8",title:"PostCard_title__sytFV",category:"PostCard_category__maLVP",description:"PostCard_description__53x7j",publishedAt:"PostCard_publishedAt__jx58S",thumbnail:"PostCard_thumbnail__RluzR",tags:"PostCard_tags__H0ViL"}},2002:function(e){e.exports={tag:"Tag_tag__tXphA"}},8193:function(e){e.exports={tags:"Tags_tags__mhykw"}},1864:function(e,t,n){var r=n(3454);!function(){"use strict";var t={977:function(e){function t(e){if("string"!==typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function n(e,t){for(var n,r="",i=0,a=-1,o=0,l=0;l<=e.length;++l){if(l<e.length)n=e.charCodeAt(l);else{if(47===n)break;n=47}if(47===n){if(a===l-1||1===o);else if(a!==l-1&&2===o){if(r.length<2||2!==i||46!==r.charCodeAt(r.length-1)||46!==r.charCodeAt(r.length-2))if(r.length>2){var s=r.lastIndexOf("/");if(s!==r.length-1){-1===s?(r="",i=0):i=(r=r.slice(0,s)).length-1-r.lastIndexOf("/"),a=l,o=0;continue}}else if(2===r.length||1===r.length){r="",i=0,a=l,o=0;continue}t&&(r.length>0?r+="/..":r="..",i=2)}else r.length>0?r+="/"+e.slice(a+1,l):r=e.slice(a+1,l),i=l-a-1;a=l,o=0}else 46===n&&-1!==o?++o:o=-1}return r}var i={resolve:function(){for(var e,i="",a=!1,o=arguments.length-1;o>=-1&&!a;o--){var l;o>=0?l=arguments[o]:(void 0===e&&(e=r.cwd()),l=e),t(l),0!==l.length&&(i=l+"/"+i,a=47===l.charCodeAt(0))}return i=n(i,!a),a?i.length>0?"/"+i:"/":i.length>0?i:"."},normalize:function(e){if(t(e),0===e.length)return".";var r=47===e.charCodeAt(0),i=47===e.charCodeAt(e.length-1);return 0!==(e=n(e,!r)).length||r||(e="."),e.length>0&&i&&(e+="/"),r?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,n=0;n<arguments.length;++n){var r=arguments[n];t(r),r.length>0&&(void 0===e?e=r:e+="/"+r)}return void 0===e?".":i.normalize(e)},relative:function(e,n){if(t(e),t(n),e===n)return"";if((e=i.resolve(e))===(n=i.resolve(n)))return"";for(var r=1;r<e.length&&47===e.charCodeAt(r);++r);for(var a=e.length,o=a-r,l=1;l<n.length&&47===n.charCodeAt(l);++l);for(var s=n.length-l,c=o<s?o:s,u=-1,f=0;f<=c;++f){if(f===c){if(s>c){if(47===n.charCodeAt(l+f))return n.slice(l+f+1);if(0===f)return n.slice(l+f)}else o>c&&(47===e.charCodeAt(r+f)?u=f:0===f&&(u=0));break}var h=e.charCodeAt(r+f);if(h!==n.charCodeAt(l+f))break;47===h&&(u=f)}var d="";for(f=r+u+1;f<=a;++f)f!==a&&47!==e.charCodeAt(f)||(0===d.length?d+="..":d+="/..");return d.length>0?d+n.slice(l+u):(l+=u,47===n.charCodeAt(l)&&++l,n.slice(l))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var n=e.charCodeAt(0),r=47===n,i=-1,a=!0,o=e.length-1;o>=1;--o)if(47===(n=e.charCodeAt(o))){if(!a){i=o;break}}else a=!1;return-1===i?r?"/":".":r&&1===i?"//":e.slice(0,i)},basename:function(e,n){if(void 0!==n&&"string"!==typeof n)throw new TypeError('"ext" argument must be a string');t(e);var r,i=0,a=-1,o=!0;if(void 0!==n&&n.length>0&&n.length<=e.length){if(n.length===e.length&&n===e)return"";var l=n.length-1,s=-1;for(r=e.length-1;r>=0;--r){var c=e.charCodeAt(r);if(47===c){if(!o){i=r+1;break}}else-1===s&&(o=!1,s=r+1),l>=0&&(c===n.charCodeAt(l)?-1===--l&&(a=r):(l=-1,a=s))}return i===a?a=s:-1===a&&(a=e.length),e.slice(i,a)}for(r=e.length-1;r>=0;--r)if(47===e.charCodeAt(r)){if(!o){i=r+1;break}}else-1===a&&(o=!1,a=r+1);return-1===a?"":e.slice(i,a)},extname:function(e){t(e);for(var n=-1,r=0,i=-1,a=!0,o=0,l=e.length-1;l>=0;--l){var s=e.charCodeAt(l);if(47!==s)-1===i&&(a=!1,i=l+1),46===s?-1===n?n=l:1!==o&&(o=1):-1!==n&&(o=-1);else if(!a){r=l+1;break}}return-1===n||-1===i||0===o||1===o&&n===i-1&&n===r+1?"":e.slice(n,i)},format:function(e){if(null===e||"object"!==typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,t){var n=t.dir||t.root,r=t.base||(t.name||"")+(t.ext||"");return n?n===t.root?n+r:n+e+r:r}("/",e)},parse:function(e){t(e);var n={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return n;var r,i=e.charCodeAt(0),a=47===i;a?(n.root="/",r=1):r=0;for(var o=-1,l=0,s=-1,c=!0,u=e.length-1,f=0;u>=r;--u)if(47!==(i=e.charCodeAt(u)))-1===s&&(c=!1,s=u+1),46===i?-1===o?o=u:1!==f&&(f=1):-1!==o&&(f=-1);else if(!c){l=u+1;break}return-1===o||-1===s||0===f||1===f&&o===s-1&&o===l+1?-1!==s&&(n.base=n.name=0===l&&a?e.slice(1,s):e.slice(l,s)):(0===l&&a?(n.name=e.slice(1,o),n.base=e.slice(1,s)):(n.name=e.slice(l,o),n.base=e.slice(l,s)),n.ext=e.slice(o,s)),l>0?n.dir=e.slice(0,l-1):a&&(n.dir="/"),n},sep:"/",delimiter:":",win32:null,posix:null};i.posix=i,e.exports=i}},n={};function i(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}},o=!0;try{t[e](a,a.exports,i),o=!1}finally{o&&delete n[e]}return a.exports}i.ab="//";var a=i(977);e.exports=a}()},7663:function(e){!function(){var t={162:function(e){var t,n,r=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function o(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:i}catch(e){t=i}try{n="function"===typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var l,s=[],c=!1,u=-1;function f(){c&&l&&(c=!1,l.length?s=l.concat(s):u=-1,s.length&&h())}function h(){if(!c){var e=o(f);c=!0;for(var t=s.length;t;){for(l=s,s=[];++u<t;)l&&l[u].run();u=-1,t=s.length}l=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function p(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new d(e,t)),1!==s.length||c||o(h)},d.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=p,r.addListener=p,r.once=p,r.off=p,r.removeListener=p,r.removeAllListeners=p,r.emit=p,r.prependListener=p,r.prependOnceListener=p,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}}},n={};function r(e){var i=n[e];if(void 0!==i)return i.exports;var a=n[e]={exports:{}},o=!0;try{t[e](a,a.exports,r),o=!1}finally{o&&delete n[e]}return a.exports}r.ab="//";var i=r(162);e.exports=i}()}}]);