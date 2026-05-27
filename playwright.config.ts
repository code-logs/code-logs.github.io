import { defineConfig, devices } from '@playwright/test'

// Playwright는 회귀용 baseline 스냅샷이 아니라, 브라우저를 직접 볼 수 없는 환경에서
// 에이전트가 "그때그때" 현재 소스의 렌더 결과를 확인하기 위한 도구다(이슈 #209).
// dev 서버를 자동 기동해 현재 소스 상태를 그대로 검증한다.
const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  // 검증 용도이므로 실패를 빠르게 드러낸다. 재시도/병렬은 최소화.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    // 실패 분석용으로만 보존(커밋하지 않음 — .gitignore 처리).
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  // 햄버거는 768px 미만에서만 노출되므로(md:hidden) 모바일 프리셋으로 검증한다.
  // iPhone 13 프리셋의 기본 엔진은 WebKit이지만, 설치 비용을 줄이려 chromium만
  // 설치하므로 엔진을 chromium으로 오버라이드한다(chromium도 isMobile/hasTouch
  // 모바일 에뮬레이션을 지원 — 레이아웃 검증 목적에 충분).
  projects: [
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    // 로컬에서 이미 dev 서버를 띄워둔 경우 재사용한다. CI에서는 항상 새로 기동.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
