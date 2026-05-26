export const META_CONTENTS = {
  MAIN: {
    TITLE: 'Home',
    DESCRIPTION: 'Code Logs에 오신 것을 환영 합니다 - 웹개발과 관련된 정보를 기록하고 공유하는 개인공간 입니다.',
  },
  POSTS: {
    TITLE: 'Posts',
    DESCRIPTION: (page: number) => `Code Logs | 포스팅 목록 ${page} 페이지`,
  },
  POST: {
    TITLE: (title: string) => title,
    DESCRIPTION: (title: string, description: string, category: string, tags: string[]) =>
      `Code Logs ${title} - ${description} | ${category}, ${tags.join(', ')}`,
  },
  CATEGORIES_INDEX: {
    TITLE: 'Categories',
    DESCRIPTION: 'Code Logs | 전체 카테고리 목록',
  },
  CATEGORY_DETAIL: {
    TITLE: (category: string) => category,
    DESCRIPTION: (category: string, page: number) => `Code Logs | ${category} 연관 포스팅 목록 ${page} 페이지`
  },
  TAGS: {
    TITLE: 'Tags',
    DESCRIPTION: 'Code Logs | 태그별 포스팅 목록',
  },
  ABOUT: {
    TITLE: 'About',
    DESCRIPTION: 'Code Logs | 웹개발과 관련된 정보를 기록하고 공유하는 개인공간 입니다.'
  },
  LICENSES: {
    TITLE: 'Licenses',
    DESCRIPTION: 'Code Logs | 사용 중인 오픈소스 패키지 라이선스 목록',
  },
  NOT_FOUND: {
    TITLE: '페이지를 찾을 수 없음',
    DESCRIPTION: 'Code Logs | 페이지를 찾을 수 없습니다! 입력하신 URL을 확인해 주세요.',
    // On-page guidance copy (distinct from the SEO DESCRIPTION above), shown in
    // the 404 body. Centralized here so all NOT_FOUND strings live in one place.
    HEADING: '페이지를 찾을 수 없습니다',
    BODY: '찾으시는 페이지가 존재하지 않거나 이동되었습니다.',
  },
}
