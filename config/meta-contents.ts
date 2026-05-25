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
    DESCRIPTION: 'Browse all categories on code-logs.',
  },
  CATEGORY_DETAIL: {
    TITLE: (category: string) => category,
    DESCRIPTION: (category: string, page: number) => `Code Logs | ${category} 연관 포스팅 목록 ${page} 페이지`
  },
  TAGS: {
    TITLE: 'Tags',
    DESCRIPTION: 'Browse posts by tag on code-logs.',
  },
  ABOUT: {
    TITLE: 'About',
    DESCRIPTION: 'Code Logs | 웹개발과 관련된 정보를 기록하고 공유하는 개인공간 입니다.'
  },
  NOT_FOUND: {
    TITLE: '페이지를 찾을 수 없음',
    DESCRIPTION: 'Code Logs | 페이지를 찾을 수 없습니다! 입력하신 URL을 확인해 주세요.',
  },
}
