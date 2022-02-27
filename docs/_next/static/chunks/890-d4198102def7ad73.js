(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[890],{3454:function(e,t,r){"use strict";var n,i;e.exports=(null===(n=r.g.process)||void 0===n?void 0:n.env)&&"object"===typeof(null===(i=r.g.process)||void 0===i?void 0:i.env)?r.g.process:r(7663)},7276:function(e,t,r){"use strict";var n=r(5893),i=r(9008),a=r(8145);t.Z=function(e){var t=e.title,r=e.description,o=e.keywords,c=e.url,s=e.imageURL,l=e.customMeta;return(0,n.jsxs)(i.default,{children:[(0,n.jsx)("link",{rel:"canonical",href:a.Z.baseURL}),(0,n.jsx)("link",{rel:"apple-touch-icon",href:a.Z.appleTouchIconPath}),(0,n.jsx)("link",{rel:"manifest",href:"/manifest.json"}),(0,n.jsx)("meta",{name:"theme-color",content:a.Z.themeColor},"theme-color"),(0,n.jsx)("meta",{property:"og:type",content:"website"},"og:type"),(0,n.jsx)("meta",{property:"og:site_name",content:a.Z.title},"og:site_name"),(0,n.jsx)("meta",{name:"author",content:a.Z.author},"author"),(null===o||void 0===o?void 0:o.length)&&(0,n.jsx)("meta",{name:"keyword",content:o.join(", ")},"keyword"),(0,n.jsx)("meta",{name:"description",content:r},"description"),(0,n.jsx)("meta",{property:"og:description",content:r},"og:description"),(0,n.jsx)("meta",{property:"og:title",content:t},"og:title"),(0,n.jsx)("meta",{property:"og:url",content:c},"og:url"),(0,n.jsx)("meta",{property:"og:image",content:s},"og:image"),l&&l,(0,n.jsx)("title",{children:t})]})}},7221:function(e,t,r){"use strict";var n=r(5893),i=r(8286),a=r(7594),o=r(8145),c=r(7828),s=r.n(c),l=r(9443);t.Z=function(e){var t=e.titleLevel,r=void 0===t?3:t,c=e.post;return(0,n.jsxs)("article",{className:s().card,children:[(0,n.jsxs)("a",{className:s().title,href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(c.title)),children:[1===r&&(0,n.jsx)("h1",{children:c.title}),2===r&&(0,n.jsx)("h2",{children:c.title}),3===r&&(0,n.jsx)("h3",{children:c.title})]}),(0,n.jsx)("span",{className:s().category,children:c.category}),(0,n.jsx)("span",{className:s().publishedAt,children:function(e){"string"===typeof e&&(e=new Date(e));var t=String(e.getFullYear()).slice(2),r=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return"".concat(t,"/").concat(r,"/").concat(n)}(c.publishedAt)}),(0,n.jsx)("a",{className:s().description,href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(c.title)),children:(0,n.jsx)("p",{children:c.description})}),c.thumbnailName&&(0,n.jsx)("div",{className:s().thumbnail,children:(0,n.jsx)("a",{href:"".concat(o.Z.baseURL,"/").concat(i.Z.normalizeTitle(c.title)),children:(0,n.jsx)("img",{className:"thumbnail",src:l.Z.buildImagePath(c.thumbnailName),alt:c.description})})}),(0,n.jsx)("section",{className:s().tags,children:(0,n.jsx)(a.Z,{tags:c.tags})})]})}},7594:function(e,t,r){"use strict";r.d(t,{Z:function(){return u}});var n=r(5893),i=r(8145),a=r(2002),o=r.n(a),c=function(e){return(0,n.jsx)("a",{href:"".concat(i.Z.baseURL,"/posts/1?query=").concat(encodeURI(e.tag)),children:(0,n.jsxs)("span",{className:o().tag,children:[e.tag," ",e.count&&e.count]})})},s=r(8193),l=r.n(s),u=function(e){return(0,n.jsx)("ul",{className:l().tags,children:e.tags.map((function(e,t){return(0,n.jsx)("li",{children:"string"===typeof e?(0,n.jsx)(c,{tag:e}):(0,n.jsx)(c,{tag:e.tag,count:e.count})},t)}))})}},2698:function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function i(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.d(t,{Z:function(){return v}});var o,c=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.dataset=t}var t,r,n;return t=e,r=[{key:"find",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return void 0!==e?this.dataset.slice(t,t+e):a(this.dataset)}},{key:"count",value:function(e,t){return this.dataset.filter((function(r){return r[e]===t})).length}},{key:"sort",value:function(e){return this.dataset.sort(e),this}}],r&&i(t.prototype,r),n&&i(t,n),e}(),s=c,l=r(8286);!function(e){e.SEO="SEO",e.Javascript="javascript",e.CSS="CSS",e.React="react",e.UIandUX="UI and UX",e.Typescript="typescript",e.Elasticsearch="elasticsearch",e.Infrastructure="infrastructure",e.Svelt="svelte"}(o||(o={}));var u=[{title:"\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815",fileName:"config-for-seo.md",description:"\uac80\uc0c9 \uc5d4\uc9c4 \ucd5c\uc801\ud654\ub97c \uc704\ud55c \uc124\uc815 (Title, Meta Tag, \uc808\ub300\uacbd\ub85c, robots.txt, sitemap.xml)",category:o.SEO,published:!0,publishedAt:"2021-10-10",tags:["Search Engine Optimization","SEO","\uac80\uc0c9","\uba54\ud0c0","\uba54\ud0c0 \ud0dc\uadf8","meta tag","\uac80\uc0c9\uc5d4\uc9c4","\uac80\uc0c9\uc5d4\uc9c4 \ucd5c\uc801\ud654","robots.txt","sitemap.xml"],thumbnailName:"seo-thumbnail.jpg"},{title:"Tagged Template Literal",fileName:"tagged-template-literal.md",description:"Javascript ES6 Tagged Template Literal",category:o.Javascript,published:!0,publishedAt:"2021-10-11",tags:["javascript","tagged template","tagged template literal","es6"],thumbnailName:"tagged-template-literal.jpg"},{title:"Iterator and Generator",fileName:"iterator-generator.md",description:"Javascript ES6 Iterator & Generator, \uc5f4\uac70\ud615, \uc81c\ub108\ub808\uc774\ud130 \ud568\uc218, generator function, yield, function*",category:o.Javascript,published:!0,publishedAt:"2021-10-17",tags:["javascript","iterator","iterable","generator","es6","function*","yield"],thumbnailName:"iterator-generator.jpg"},{title:"Proxy",fileName:"proxy.md",description:"Javascript ES6 Proxy, Proxy, Trap, \ud504\ub77d\uc2dc\ub97c \uc774\uc6a9\ud55c \uac1d\uccb4 \uc870\uc791\uc758 \uc81c\uc5b4",category:o.Javascript,published:!0,publishedAt:"2021-10-25",tags:["javascript","proxy","trap","es6","\ud504\ub85d\uc2dc"],thumbnailName:"proxy.jpg"},{title:"CSS Position",fileName:"css-position.md",description:"CSS Position (Static, Absolute, Fixed, Sticky)\uc5d0 \ub530\ub978 \uace0\uc815 \ud5e4\ub354 \uc2a4\ud0c0\uc77c",category:o.CSS,published:!0,publishedAt:"2021-10-26",tags:["css","position","static","absolute","fixed","sticky","header","style","\uc2a4\ud0c0\uc77c","\ud3ec\uc9c0\uc158","\ud5e4\ub354"],thumbnailName:"css-position.jpg"},{title:"\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8 (HOC: Higher Order Component)",fileName:"hoc.md",description:"React - \uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8\ub97c \uc774\uc6a9\ud55c \ucef4\ud37c\ub10c\ud2b8\uc758 \uc7ac\uc0ac\uc6a9",category:o.React,published:!0,publishedAt:"2021-10-30",tags:["hoc","higher order component","\uace0\ucc28 \ucef4\ud37c\ub10c\ud2b8","react","\ub9ac\uc561\ud2b8"],thumbnailName:"hoc.jpg"},{title:"Scroll sequence animation",fileName:"scroll-sequence-animation.md",description:"Apple \uc81c\ud488 \ud398\uc774\uc9c0 \uac19\uc740 \uc560\ub2c8\uba54\uc774\uc158\uc744 \uad6c\ud604\ud574\ubcf4\uc790 - Scroll sequence animation",category:o.UIandUX,published:!0,publishedAt:"2021-10-31",tags:["scroll sequence","scroll sequence animation","ui","ux"],thumbnailName:"scroll-sequence.jpg"},{title:"Any | Unknown | Never",fileName:"any-unknown-never.md",description:"TypeScript - Any | Unknown | Never",category:o.Typescript,published:!0,publishedAt:"2021-11-15",tags:["typescript","any","unknown","never","\ud0c0\uc785\uc2a4\ud06c\ub9bd\ud2b8"],thumbnailName:"ts-any-unknown-never.jpg"},{title:"Elasticsearch: Full-text search (\uc804\ubb38\uac80\uc0c9)",fileName:"full-text-search.md",description:"Elasticsearch\ub97c \uc774\uc6a9\ud55c Full-text search",category:o.Elasticsearch,published:!0,publishedAt:"2021-11-16",tags:["elasticsearch","full-text search","searching engine","\uc5d8\ub77c\uc2a4\ud2f1\uc11c\uce58","\uc804\ubb38\uac80\uc0c9"],thumbnailName:"elasticsearch-full-text-search.jpg"},{title:"Nx build system \ub9db\ubcf4\uae30",fileName:"monorepo-with-nx.md",description:"Nx build system\uc744 \uc774\uc6a9\ud55c Monorepo \uad6c\uc131\ud558\uae30",category:o.Infrastructure,published:!0,publishedAt:"2022-02-12",tags:["nx","build","build system","monorepo","\ube4c\ub4dc","\ube4c\ub4dc \uc2dc\uc2a4\ud15c","\ubaa8\ub178\ub9ac\ud3ec"],thumbnailName:"monorepo-with-nx.jpg"},{title:"yarn berry\ub85c \uad6c\uc131\ud558\ub294 monorepo",fileName:"yarn-berry-monorepo.md",description:"yarn berry\uc640 yarn workspaces\ub97c \uc774\uc6a9\ud574 monorepo \uad6c\uc131 - \ud658\uacbd \uc124\uc815, \uc0d8\ud50c \ud504\ub85c\uc81d\ud2b8",category:o.Infrastructure,published:!0,publishedAt:"2022-02-26",tags:["yar","yarn berry","berry","monorepo","workspace","workspaces","\ubaa8\ub178\ub9ac\ud3ec","zero-install"],thumbnailName:"yarn-berry-monorepo.jpg",references:[{title:"yarn workspaces",url:"https://yarnpkg.com/features/workspaces"}]},{title:"Svelte - Let's get started",fileName:"get-started-svelte.md",description:"Svelte \ub9db\ubcf4\uae30",category:"svelte",published:!1,publishedAt:"2099-02-13",tags:["svelte","frontend","get started"],thumbnailName:"get-started-svelte.jpg",references:[{title:"Svelte",url:"https://svelte.dev/"},{title:"Naver",url:"https://naver.com/"}]}];function f(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function h(e){return h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},h(e)}function p(e,t){return!t||"object"!==g(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function d(e,t){return d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},d(e,t)}var g=function(e){return e&&"undefined"!==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};function m(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=h(e);if(t){var i=h(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return p(this,r)}}var y=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(a,e);var t,r,n,i=m(a);function a(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(e=i.call(this,u.filter((function(e){return e.published})))).sort((function(e,t){return new Date(e.publishedAt)>new Date(t.publishedAt)?-1:1})),e}return t=a,r=[{key:"findByTitle",value:function(e){return this.dataset.find((function(t){return l.Z.normalizeTitle(t.title)===e}))}},{key:"hasNewByCategory",value:function(e){return Boolean(this.dataset.filter((function(t){return t.category===e})).find((function(e){var t=new Date(e.publishedAt);return t.setDate(t.getDate()+7)>=Date.now()})))}},{key:"countByCategory",value:function(e){return this.dataset.filter((function(t){return t.category===e})).length}},{key:"countByTag",value:function(e){return this.dataset.filter((function(t){return t.tags.includes(e)})).length}},{key:"query",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=e.split(/\s/).map((function(e){return e.toLowerCase()})),i=this.dataset.filter((function(e){return n.some((function(t){return e.title.indexOf(t)>=0||e.description.indexOf(t)>=0||e.category.indexOf(t)>=0||e.tags.join("").indexOf(t)>=0}))}));return void 0!==t?i.slice(r,r+t):i}},{key:"findByCategory",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=this.dataset.filter((function(t){return t.category===e}));return void 0!==t?n.slice(r,r+t):n}},{key:"findByNormalizedTitle",value:function(e){return this.dataset.find((function(t){return l.Z.normalizeTitle(t.title)===e}))}}],r&&f(t.prototype,r),n&&f(t,n),a}(s),v=new y},9443:function(e,t,r){"use strict";var n=r(8145);function i(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,r,a;return t=e,a=[{key:"absolutePath",value:function(e,t){return e=e.replace(/^\//,""),[t||n.Z.baseURL,e].join("/")}},{key:"buildImagePath",value:function(e){return"/assets/images/".concat(e)}}],(r=null)&&i(t.prototype,r),a&&i(t,a),e}();t.Z=a},8286:function(e,t,r){"use strict";var n=r(1864),i=r.n(n);function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,r,n;return t=e,n=[{key:"normalizeTitle",value:function(e){return e.replace(/\s/g,"-").toLowerCase()}},{key:"getMarkdownFilePath",value:function(e){return i().join("../posts",e.category,e.fileName)}}],(r=null)&&a(t.prototype,r),n&&a(t,n),e}();t.Z=o},7427:function(e,t,r){"use strict";var n=r(8145);function i(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,r,a;return t=e,a=[{key:"buildPageTitle",value:function(e){return"".concat(e," | ").concat(n.Z.title)}}],(r=null)&&i(t.prototype,r),a&&i(t,a),e}();t.Z=a},7828:function(e){e.exports={card:"PostCard_card__RhSh8",title:"PostCard_title__sytFV",category:"PostCard_category__maLVP",description:"PostCard_description__53x7j",publishedAt:"PostCard_publishedAt__jx58S",thumbnail:"PostCard_thumbnail__RluzR",tags:"PostCard_tags__H0ViL"}},2002:function(e){e.exports={tag:"Tag_tag__tXphA"}},8193:function(e){e.exports={tags:"Tags_tags__mhykw"}},1864:function(e,t,r){var n=r(3454);!function(){"use strict";var t={977:function(e){function t(e){if("string"!==typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function r(e,t){for(var r,n="",i=0,a=-1,o=0,c=0;c<=e.length;++c){if(c<e.length)r=e.charCodeAt(c);else{if(47===r)break;r=47}if(47===r){if(a===c-1||1===o);else if(a!==c-1&&2===o){if(n.length<2||2!==i||46!==n.charCodeAt(n.length-1)||46!==n.charCodeAt(n.length-2))if(n.length>2){var s=n.lastIndexOf("/");if(s!==n.length-1){-1===s?(n="",i=0):i=(n=n.slice(0,s)).length-1-n.lastIndexOf("/"),a=c,o=0;continue}}else if(2===n.length||1===n.length){n="",i=0,a=c,o=0;continue}t&&(n.length>0?n+="/..":n="..",i=2)}else n.length>0?n+="/"+e.slice(a+1,c):n=e.slice(a+1,c),i=c-a-1;a=c,o=0}else 46===r&&-1!==o?++o:o=-1}return n}var i={resolve:function(){for(var e,i="",a=!1,o=arguments.length-1;o>=-1&&!a;o--){var c;o>=0?c=arguments[o]:(void 0===e&&(e=n.cwd()),c=e),t(c),0!==c.length&&(i=c+"/"+i,a=47===c.charCodeAt(0))}return i=r(i,!a),a?i.length>0?"/"+i:"/":i.length>0?i:"."},normalize:function(e){if(t(e),0===e.length)return".";var n=47===e.charCodeAt(0),i=47===e.charCodeAt(e.length-1);return 0!==(e=r(e,!n)).length||n||(e="."),e.length>0&&i&&(e+="/"),n?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,r=0;r<arguments.length;++r){var n=arguments[r];t(n),n.length>0&&(void 0===e?e=n:e+="/"+n)}return void 0===e?".":i.normalize(e)},relative:function(e,r){if(t(e),t(r),e===r)return"";if((e=i.resolve(e))===(r=i.resolve(r)))return"";for(var n=1;n<e.length&&47===e.charCodeAt(n);++n);for(var a=e.length,o=a-n,c=1;c<r.length&&47===r.charCodeAt(c);++c);for(var s=r.length-c,l=o<s?o:s,u=-1,f=0;f<=l;++f){if(f===l){if(s>l){if(47===r.charCodeAt(c+f))return r.slice(c+f+1);if(0===f)return r.slice(c+f)}else o>l&&(47===e.charCodeAt(n+f)?u=f:0===f&&(u=0));break}var h=e.charCodeAt(n+f);if(h!==r.charCodeAt(c+f))break;47===h&&(u=f)}var p="";for(f=n+u+1;f<=a;++f)f!==a&&47!==e.charCodeAt(f)||(0===p.length?p+="..":p+="/..");return p.length>0?p+r.slice(c+u):(c+=u,47===r.charCodeAt(c)&&++c,r.slice(c))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var r=e.charCodeAt(0),n=47===r,i=-1,a=!0,o=e.length-1;o>=1;--o)if(47===(r=e.charCodeAt(o))){if(!a){i=o;break}}else a=!1;return-1===i?n?"/":".":n&&1===i?"//":e.slice(0,i)},basename:function(e,r){if(void 0!==r&&"string"!==typeof r)throw new TypeError('"ext" argument must be a string');t(e);var n,i=0,a=-1,o=!0;if(void 0!==r&&r.length>0&&r.length<=e.length){if(r.length===e.length&&r===e)return"";var c=r.length-1,s=-1;for(n=e.length-1;n>=0;--n){var l=e.charCodeAt(n);if(47===l){if(!o){i=n+1;break}}else-1===s&&(o=!1,s=n+1),c>=0&&(l===r.charCodeAt(c)?-1===--c&&(a=n):(c=-1,a=s))}return i===a?a=s:-1===a&&(a=e.length),e.slice(i,a)}for(n=e.length-1;n>=0;--n)if(47===e.charCodeAt(n)){if(!o){i=n+1;break}}else-1===a&&(o=!1,a=n+1);return-1===a?"":e.slice(i,a)},extname:function(e){t(e);for(var r=-1,n=0,i=-1,a=!0,o=0,c=e.length-1;c>=0;--c){var s=e.charCodeAt(c);if(47!==s)-1===i&&(a=!1,i=c+1),46===s?-1===r?r=c:1!==o&&(o=1):-1!==r&&(o=-1);else if(!a){n=c+1;break}}return-1===r||-1===i||0===o||1===o&&r===i-1&&r===n+1?"":e.slice(r,i)},format:function(e){if(null===e||"object"!==typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,t){var r=t.dir||t.root,n=t.base||(t.name||"")+(t.ext||"");return r?r===t.root?r+n:r+e+n:n}("/",e)},parse:function(e){t(e);var r={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return r;var n,i=e.charCodeAt(0),a=47===i;a?(r.root="/",n=1):n=0;for(var o=-1,c=0,s=-1,l=!0,u=e.length-1,f=0;u>=n;--u)if(47!==(i=e.charCodeAt(u)))-1===s&&(l=!1,s=u+1),46===i?-1===o?o=u:1!==f&&(f=1):-1!==o&&(f=-1);else if(!l){c=u+1;break}return-1===o||-1===s||0===f||1===f&&o===s-1&&o===c+1?-1!==s&&(r.base=r.name=0===c&&a?e.slice(1,s):e.slice(c,s)):(0===c&&a?(r.name=e.slice(1,o),r.base=e.slice(1,s)):(r.name=e.slice(c,o),r.base=e.slice(c,s)),r.ext=e.slice(o,s)),c>0?r.dir=e.slice(0,c-1):a&&(r.dir="/"),r},sep:"/",delimiter:":",win32:null,posix:null};i.posix=i,e.exports=i}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,i),o=!1}finally{o&&delete r[e]}return a.exports}i.ab="//";var a=i(977);e.exports=a}()},7663:function(e){!function(){var t={162:function(e){var t,r,n=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function o(e){if(t===setTimeout)return setTimeout(e,0);if((t===i||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"===typeof setTimeout?setTimeout:i}catch(e){t=i}try{r="function"===typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var c,s=[],l=!1,u=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):u=-1,s.length&&h())}function h(){if(!l){var e=o(f);l=!0;for(var t=s.length;t;){for(c=s,s=[];++u<t;)c&&c[u].run();u=-1,t=s.length}c=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function d(){}n.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new p(e,t)),1!==s.length||l||o(h)},p.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=d,n.addListener=d,n.once=d,n.off=d,n.removeListener=d,n.removeAllListeners=d,n.emit=d,n.prependListener=d,n.prependOnceListener=d,n.listeners=function(e){return[]},n.binding=function(e){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}}},r={};function n(e){var i=r[e];if(void 0!==i)return i.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,n),o=!1}finally{o&&delete r[e]}return a.exports}n.ab="//";var i=n(162);e.exports=i}()},9008:function(e,t,r){e.exports=r(5443)}}]);