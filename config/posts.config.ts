export interface PostRef {
  title: string
  url: string
}

export interface Post {
  title: string
  fileName: string
  description: string
  category: typeof CATEGORIES[keyof typeof CATEGORIES]
  published: boolean
  publishedAt: string
  thumbnailName: string
  tags: string[]
  references?: PostRef[]
  series?: {
    prevPostTitle?: string
    nextPostTitle?: string
  }
}

export const CATEGORIES = {
  ['cloud']: 'cloud',
  ['css']: 'css',
  ['elasticsearch']: 'elasticsearch',
  ['infrastructure']: 'infrastructure',
  ['javascript']: 'javascript',
  ['nodejs']: 'nodejs',
  ['react']: 'react',
  ['react-native']: 'react native',
  ['roadmap-frontend']: 'roadmap frontend',
  ['security']: 'security',
  ['seo']: 'seo',
  ['typescript']: 'typescript',
  ['ui-and-ux']: 'ui and ux',
  ['web-component']: 'web component',
  ['개발환경']: '개발환경',
}

export const posts: Post[] = [
  {
    title: `검색 엔진 최적화를 위한 설정`,
    description: `검색 엔진 최적화를 위한 설정 (Title, Meta Tag, 절대경로, robots.txt, sitemap.xml)`,
    fileName: 'config-for-seo.md',
    category: 'seo',
    published: true,
    publishedAt: `2021-10-10`,
    thumbnailName: `seo-thumbnail.jpg`,
    tags: [`SEO`, `Search Engine Optimization`, `meta tag`, `robots.txt`, `sitemap.xml`, `검색`, `검색엔진`, `검색엔진 최적화`, `메타`, `메타 태그`],
  },
  {
    title: `Tagged Template Literal`,
    description: `Javascript ES6 Tagged Template Literal`,
    fileName: 'tagged-template-literal.md',
    category: 'javascript',
    published: true,
    publishedAt: `2021-10-11`,
    thumbnailName: `tagged-template-literal.png`,
    tags: [`es6`, `javascript`, `tagged template`, `tagged template literal`],
  },
  {
    title: `Iterator and Generator`,
    description: `Javascript ES6 Iterator & Generator, 열거형, 제너레이터 함수, generator function, yield, function*`,
    fileName: 'iterator-generator.md',
    category: 'javascript',
    published: true,
    publishedAt: `2021-10-17`,
    thumbnailName: `iterator-generator.png`,
    tags: [`es6`, `function*`, `generator`, `iterable`, `iterator`, `javascript`, `yield`],
  },
  {
    title: `Proxy`,
    description: `Javascript ES6 Proxy, Proxy, Trap, 프락시를 이용한 객체 조작의 제어`,
    fileName: 'proxy.md',
    category: 'javascript',
    published: true,
    publishedAt: `2021-10-25`,
    thumbnailName: `proxy.png`,
    tags: [`es6`, `javascript`, `proxy`, `trap`, `프록시`],
  },
  {
    title: `CSS Position`,
    description: `CSS Position (Static, Absolute, Fixed, Sticky)에 따른 고정 헤더 스타일`,
    fileName: 'css-position.md',
    category: 'css',
    published: true,
    publishedAt: `2021-10-26`,
    thumbnailName: `css-position.png`,
    tags: [`absolute`, `css`, `fixed`, `header`, `position`, `static`, `sticky`, `style`, `스타일`, `포지션`, `헤더`],
  },
  {
    title: `고차 컴퍼넌트 (HOC: Higher Order Component)`,
    description: `React - 고차 컴퍼넌트를 이용한 컴퍼넌트의 재사용`,
    fileName: 'hoc.md',
    category: 'react',
    published: true,
    publishedAt: `2021-10-30`,
    thumbnailName: `hoc.png`,
    tags: [`higher order component`, `hoc`, `react`, `고차 컴퍼넌트`, `리액트`],
  },
  {
    title: `Scroll sequence animation`,
    description: `Apple 제품 페이지 같은 애니메이션을 구현해보자 - Scroll sequence animation`,
    fileName: 'scroll-sequence-animation.md',
    category: 'ui-and-ux',
    published: true,
    publishedAt: `2021-10-31`,
    thumbnailName: `scroll-sequence.png`,
    tags: [`scroll sequence`, `scroll sequence animation`, `ui`, `ux`],
  },
  {
    title: `Any | Unknown | Never`,
    description: `TypeScript - Any | Unknown | Never`,
    fileName: 'any-unknown-never.md',
    category: 'typescript',
    published: true,
    publishedAt: `2021-11-15`,
    thumbnailName: `ts-any-unknown-never.png`,
    tags: [`any`, `never`, `typescript`, `unknown`, `타입스크립트`],
  },
  {
    title: `Elasticsearch: Full-text search (전문검색)`,
    description: `Elasticsearch를 이용한 Full-text search`,
    fileName: 'full-text-search.md',
    category: 'elasticsearch',
    published: true,
    publishedAt: `2021-11-16`,
    thumbnailName: `elasticsearch-full-text-search.png`,
    tags: [`elasticsearch`, `full-text search`, `searching engine`, `엘라스틱서치`, `전문검색`],
  },
  {
    title: `Nx build system 맛보기`,
    description: `Nx build system을 이용한 Monorepo 구성하기`,
    fileName: 'monorepo-with-nx.md',
    category: 'infrastructure',
    published: true,
    publishedAt: `2022-02-12`,
    thumbnailName: `monorepo-with-nx.png`,
    tags: [`build`, `build system`, `monorepo`, `nx`, `모노리포`, `빌드`, `빌드 시스템`],

    series: {
      prevPostTitle: `Nx build system 맛보기`,
      nextPostTitle: `yarn berry로 구성하는 monorepo`,
    },
  },
  {
    title: `yarn berry로 구성하는 monorepo`,
    description: `yarn berry와 yarn workspaces를 이용해 monorepo 구성 - 환경 설정, 샘플 프로젝트`,
    fileName: 'yarn-berry-monorepo.md',
    category: 'infrastructure',
    published: true,
    publishedAt: `2022-02-26`,
    thumbnailName: `yarn-berry-monorepo.png`,
    tags: [`berry`, `monorepo`, `workspace`, `workspaces`, `yarn`, `yarn berry`, `zero-install`, `모노리포`],
    references: [
      {
        title: `yarn workspaces`,
        url: `https://yarnpkg.com/features/workspaces`,
      },
    ],

    series: {
      prevPostTitle: `Nx build system 맛보기`,
    },
  },
  {
    title: `ESLint - Plugin and Extends`,
    description: `ESLint의 Plugin과 Extends의 차이는 무엇일까?`,
    fileName: 'eslint-plugin-and-extends.md',
    category: '개발환경',
    published: true,
    publishedAt: `2022-02-27`,
    thumbnailName: `eslint-plugin-and-extends.png`,
    tags: [`eslint`, `eslint extends`, `eslint plugin`, `extends`, `lint`, `plugin`, `개발환경`],
    references: [
      {
        title: `eslint-plugin-react Github repository`,
        url: `https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L118-L179`,
      },
    ],
  },
  {
    title: `Focus on Button - Safari VS Chrome`,
    description: `Safari, Chrome 브라우저에 따라 달라지는 button의 focus 속성`,
    fileName: 'focus-on-button-safari-vs-chrome.md',
    category: 'css',
    published: true,
    publishedAt: `2022-02-28`,
    thumbnailName: `focus-on-button.png`,
    tags: [`CSS`, `browser`, `chrome`, `focus`, `focus-visible`, `focus-within`, `safari`, `브라우저`, `사파리`, `크롬`],
    references: [
      {
        title: `Clicking and focus - MDN Web Docs`,
        url: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus`,
      },
    ],
  },
  {
    title: `Heroku로 Node.js 애플리케이션 배포하기`,
    description: `Heroku를 이용한 NodeJS  애플리케이션 배포하기`,
    fileName: 'deploy-nodejs-via-heroku.md',
    category: 'cloud',
    published: true,
    publishedAt: `2022-03-04`,
    thumbnailName: `deploy-node-js-via-heroku.png`,
    tags: [`cloud`, `cloud service`, `deploy`, `heroku`, `node.js`, `paas`, `배포`],
    references: [
      {
        title: `Heroku Dev Center`,
        url: `https://devcenter.heroku.com/`,
      },
      {
        title: `Wiki - PaaS`,
        url: `https://en.wikipedia.org/wiki/Platform_as_a_service`,
      },
    ],
  },
  {
    title: `브라우저 보안 정책 CHIPS - (feat. Chrome 쿠키 입력 불가)`,
    description: `CHIPS - Cookies Having Independent Partitioned State
(Chrome 98 버그를 찾아 헤매다 발견하게 된 브라우저의 Cookie 관리 정책)`,
    fileName: 'chips.md',
    category: 'security',
    published: true,
    publishedAt: `2022-03-06`,
    thumbnailName: `chips.png`,
    tags: [`CHIPS`, `browser`, `chrome`, `cookie`, `policy`, `security`],
    references: [
      {
        title: `Chrome Platform Status`,
        url: `https://chromestatus.com/feature/5179189105786880`,
      },
    ],
  },
  {
    title: `Apollo Server + TypeGraphQL을 이용한 GraphQL API 서버 구성하기`,
    description: `Apollo Server와 TypeGraphQL을 사용한 Node.JS GraphQL API 서버 구성하기`,
    fileName: 'graphql-with-apollo-server-typegraphql.md',
    category: 'nodejs',
    published: true,
    publishedAt: `2022-03-10`,
    thumbnailName: `graphql-apollo-typegraphql.png`,
    tags: [`api`, `api server`, `apollo`, `apollo-server`, `graphql`, `node.js`, `typegraphql`, `typescript`],
    references: [
      {
        title: `Apollo Server`,
        url: `https://www.apollographql.com`,
      },
      {
        title: `DataLoader - GitHub Repository`,
        url: `https://github.com/graphql/dataloader`,
      },
      {
        title: `GraphQL`,
        url: `https://graphql.org`,
      },
      {
        title: `Sample Repository`,
        url: `https://github.com/possible819/graphql-sample`,
      },
      {
        title: `TypeGraphQL`,
        url: `https://typegraphql.com`,
      },
    ],
  },
  {
    title: `React Native - 개발환경 구성하기`,
    description: `Mac OS에서 iOS 애플리케이션 개발을 위한 React Native 개발환경 구성하기`,
    fileName: 'react-native-dev-env.md',
    category: 'react-native',
    published: true,
    publishedAt: `2022-03-26`,
    thumbnailName: `react-native-dev-env.png`,
    tags: [`RN`, `cross platform`, `ios`, `macos`, `react native`, `react native cli`, `개발환경`, `개발환경 구성하기`, `리액트 네이티브`],
    references: [
      {
        title: `NVM`,
        url: `https://github.com/nvm-sh/nvm`,
      },
      {
        title: `React Native`,
        url: `https://reactnative.dev/docs/environment-setup`,
      },
    ],
  },
  {
    title: `How does internet work - Roadmap.sh`,
    description: `How does internet work - Roadmap.sh
Roadmap.sh frontend 학습 순서에 따라 정리하는 포스팅 1`,
    fileName: 'internet.md',
    category: 'roadmap-frontend',
    published: true,
    publishedAt: `2022-07-20`,
    thumbnailName: `8f9addf2ea4c66ed60b8989c8fc537dc`,
    tags: [`internet`, `network`, `packet`, `routing`, `네트워크`, `라우팅`, `인터넷`, `패킷`],
    references: [
      {
        title: `roadmap.sh`,
        url: `https://roadmap.sh/frontend`,
      },
    ],

    series: {
      nextPostTitle: `HTTP - Roadmap.sh`,
    },
  },
  {
    title: `Web component - custom element`,
    description: `웹 컴포넌트로 만드는 나만의 custom element`,
    fileName: 'web-component-web-component---custom-element.md',
    category: 'web-component',
    published: true,
    publishedAt: `2022-07-31`,
    thumbnailName: `1b85d15d3e19b99e3d6350d8b69cc39a`,
    tags: [`Shadow DOM`, `shadow`],
    references: [
      {
        title: `Custom element naming convention`,
        url: `https://html.spec.whatwg.org/#valid-custom-element-name`,
      },
      {
        title: `WebComponent org`,
        url: `https://www.webcomponents.org/`,
      },
      {
        title: `https://web.dev/custom-elements-v1/#custom-element-reactions`,
        url: `https://web.dev/custom-elements-v1/#custom-element-reactions`,
      },
    ],

    series: {
      nextPostTitle: `Web component - Shadow DOM`,
    },
  },
  {
    title: `How HTTPS works - Roadmap.sh`,
    description: `How HTTPS works? - Roadmap.sh
Roadmap.sh frontend 학습 순서에 따라 정리하는 포스팅 3
`,
    fileName: 'roadmap-frontend-how-https-works---roadmap.sh.md',
    category: 'roadmap-frontend',
    published: true,
    publishedAt: `2022-08-08`,
    thumbnailName: `f3702044e1663b02ce927069f9e7553f`,
    tags: [`https`, `internet`, `protocol`, `roadmap`, `roadmap.sh`, `인터넷`, `프로토콜`],
    references: [
      {
        title: `roadmap.sh`,
        url: `https://roadmap.sh/frontend`,
      },
    ],

    series: {
      prevPostTitle: `HTTP - Roadmap.sh`,
      nextPostTitle: `The differences between HTTPS, SSL and TLS - Roadmap.sh`,
    },
  },
  {
    title: `HTTP - Roadmap.sh`,
    description: `HTTP - Roadmap.sh
Roadmap.sh frontend 학습 순서에 따라 정리하는 포스팅 2`,
    fileName: 'roadmap-frontend-http---roadmap.sh.md',
    category: 'roadmap-frontend',
    published: true,
    publishedAt: `2022-08-08`,
    thumbnailName: `f6fbea21688b383dae1962023159a9ae`,
    tags: [`http`, `internet`, `protocol`, `roadmap`, `roadmap.sh`, `인터넷`],
    references: [
      {
        title: `Cloudflare - HTTP`,
        url: `https://www.cloudflare.com/en-gb/learning/ddos/glossary/hypertext-transfer-protocol-http/`,
      },
      {
        title: `Roadmap.sh`,
        url: `https://roadmap.sh`,
      },
    ],

    series: {
      prevPostTitle: `How does internet work - Roadmap.sh`,
      nextPostTitle: `How HTTPS works - Roadmap.sh`,
    },
  },
  {
    title: `The differences between HTTPS, SSL and TLS - Roadmap.sh`,
    description: `The differences between HTTPS, SSL and TLS - Roadmap.sh
Roadmap.sh frontend 학습 순서에 따라 정리하는 포스팅 4`,
    fileName: 'roadmap-frontend-the-differences-between-https,-ssl-and-tls---roadmap.sh.md',
    category: 'roadmap-frontend',
    published: true,
    publishedAt: `2022-08-08`,
    thumbnailName: `5e72230d754a480cf5218eeba9dd15fb`,
    tags: [`internet`, `protocol`, `roadmap`, `roadmap.sh`, `security`, `인터넷`, `프로토콜`],
    references: [
      {
        title: `roadmap.sh`,
        url: `https://roadmap.sh/frontend`,
      },
    ],

    series: {
      prevPostTitle: `How HTTPS works - Roadmap.sh`,
    },
  },
  {
    title: `Web component - Shadow DOM`,
    description: `Web component의 핵심인 encapsulation은 어떻게 이루어질까?
Shadow DOM의 이해`,
    fileName: 'web-component-web-component---shadow-dom.md',
    category: 'web-component',
    published: true,
    publishedAt: `2022-08-10`,
    thumbnailName: `752fbf06b172dc96f8f10c87b1d91872`,
    tags: [
      `Shadow DOM`,
      `custom element`,
      `encapsulation`,
      `shadow`,
      `shadow tree`,
      `web component`,
      `쉐도우`,
      `쉐도우 돔`,
      `쉐도우 트리`,
      `웹 컴포넌트`,
      `은닉화`,
      `커스텀 엘리먼트`,
    ],
    references: [
      {
        title: `MDN - Composed`,
        url: `https://developer.mozilla.org/en-US/docs/Web/API/Event/composed`,
      },
      {
        title: `MDN - Using shadow DOM`,
        url: `https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM`,
      },
    ],

    series: {
      prevPostTitle: `Web component - custom element`,
      nextPostTitle: `Web component - slot`,
    },
  },
  {
    title: `Web component - slot`,
    description: `<slot> 태그를 이용해 커스텀 엘리먼트에 자식 엘리먼트를 주입할 수 있는 방법을 소개 합니다.
<slot> 태그를 이용해 조금더 유연한 형태의 dialog 커스텀 엘리먼트를 만들기
`,
    fileName: 'web-component-web-component---slot.md',
    category: 'web-component',
    published: true,
    publishedAt: `2022-08-18`,
    thumbnailName: `c96f4eff2512178b9b4e02d5aad66827`,
    tags: [`custom dialog`, `custom element`, `dialog`, `slot`, `web component`, `웹 컴포넌트`, `커스텀 엘리먼트`],
    references: [
      {
        title: `MDN - Using templates and slots`,
        url: `https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots`,
      },
      {
        title: `MDN - slot`,
        url: `https://developer.mozilla.org/ko/docs/Web/HTML/Element/slot`,
      },
      {
        title: `MDN - pseudo-elements`,
        url: `https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements`,
      },
    ],

    series: {
      prevPostTitle: `Web component - Shadow DOM`,
    },
  },
  {
    title: `Turbo repo (pnpm) 환경에서 Next.js Dockerizing`,
    description: `Turbo repo와 pnpm 환경에서 Next.js Dockerizing 하기`,
    fileName: 'turbo-repo-nextjs-dockerizing.md',
    category: CATEGORIES.infrastructure,
    published: true,
    publishedAt: `2023-05-01`,
    thumbnailName: `turbo-pnpm-nextjs-dockerizing.webp`,
    tags: ['docker', 'dockerizing', 'monorepo', 'next.js', 'pnpm', 'turbo', 'turbo repo', '개발환경', '모노리포', '빌드', '빌드 시스템'],
    references: [
      {
        title: 'Turbo - Deploying with Docker',
        url: 'https://turbo.build/repo/docs/handbook/deploying-with-docker'
      }
    ]
  }
]

export default posts
