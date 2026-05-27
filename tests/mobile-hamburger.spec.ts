import { expect, test, type Page } from '@playwright/test'

// 모바일 햄버거 메뉴(Header → MobileSheet) 렌더 검증(이슈 #209).
// 셀렉터는 구현 클래스가 아니라 접근성 속성(aria-label, role)을 기준으로 잡아
// 스타일 변경에 강건하게 한다. 참고: .claude/docs/header-interaction-gotchas.md

const hamburger = (page: Page) => page.getByRole('button', { name: 'Open menu' })
const sheet = (page: Page) => page.getByRole('dialog', { name: 'Navigation menu' })
const closeButton = (page: Page) => page.getByRole('button', { name: 'Close menu' })

// scrollWidth가 표시 영역(clientWidth)을 넘으면 가로 오버플로가 발생한 것.
const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

const bodyOverflow = (page: Page) => page.evaluate(() => document.body.style.overflow)

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('햄버거 버튼이 모바일 뷰포트에 노출된다', async ({ page }) => {
  await expect(hamburger(page)).toBeVisible()
  await expect(hamburger(page)).toHaveAttribute('aria-expanded', 'false')
  // 닫힌 상태에서는 시트가 a11y 트리에서 숨겨져 있어야 한다.
  await expect(sheet(page)).not.toBeVisible()
})

test('햄버거를 누르면 시트가 열리고 aria-expanded가 켜진다', async ({ page }) => {
  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()
  await expect(hamburger(page)).toHaveAttribute('aria-expanded', 'true')
})

test('닫기 버튼으로 시트가 닫히고 포커스가 햄버거로 복귀한다', async ({ page }) => {
  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()

  await closeButton(page).click()
  await expect(sheet(page)).not.toBeVisible()
  // MobileSheet는 닫힐 때 직전 포커스(햄버거 버튼)로 포커스를 되돌린다.
  await expect(hamburger(page)).toBeFocused()
})

// ── 알려진 버그(이슈 #210, https://github.com/code-logs/code-logs.github.io/issues/210):
// 헤더의 backdrop-filter가 모바일 시트 fixed 포지셔닝을 가둠 ──
// Header(<header>)에 `backdrop-filter: blur(8px)`가 걸려 있어 position:fixed의
// containing block이 뷰포트가 아니라 헤더 박스(높이 ~55px)가 된다. 그 결과 MobileSheet의
// `fixed inset-0` 오버레이가 뷰포트 전체가 아니라 헤더 영역에만 그려진다 → (1) 백드롭이
// 본문 영역을 덮지 못해 클릭으로 닫히지 않고, (2) 화면 밖 패널(translate-x-full)이 우측으로
// 삐져나가 가로 오버플로를 만든다. Escape는 열림 시 자동 포커스가 시트로 이동하지 않아
// 패널 onKeyDown에 도달하지 못한다. 아래 3개는 "올바른 동작"을 문서화하되, 버그 수정
// 전까지는 fixme로 보류한다. 수정되면 test.fixme → test로 되돌린다.

test.fixme('Escape로 시트가 닫힌다', async ({ page }) => {
  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(sheet(page)).not.toBeVisible()
})

test.fixme('백드롭 클릭으로 시트가 닫힌다', async ({ page }) => {
  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()

  // 패널은 우측 min(80vw, 320px) 영역. 좌측 상단은 백드롭이므로 그 지점을 클릭한다.
  await page.mouse.click(10, 200)
  await expect(sheet(page)).not.toBeVisible()
})

test.fixme('열림/닫힘 모두 가로 오버플로가 없다', async ({ page }) => {
  expect(await horizontalOverflow(page), '닫힌 상태에서 가로 오버플로 없음').toBeLessThanOrEqual(0)

  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()
  expect(await horizontalOverflow(page), '시트가 열린 상태에서 가로 오버플로 없음').toBeLessThanOrEqual(0)
})

test('시트 패널 폭이 min(80vw, 320px) 범위를 따른다', async ({ page }) => {
  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()

  const panelWidth = await sheet(page).evaluate((el) => el.getBoundingClientRect().width)
  const viewportWidth = page.viewportSize()!.width
  const expected = Math.min(viewportWidth * 0.8, 320)
  // 서브픽셀 반올림 여유 1px.
  expect(Math.abs(panelWidth - expected)).toBeLessThanOrEqual(1)
})

test('열림 시 body 스크롤이 잠기고 닫힘 시 복원된다', async ({ page }) => {
  expect(await bodyOverflow(page)).toBe('')

  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()
  expect(await bodyOverflow(page), '열림 시 body overflow=hidden').toBe('hidden')

  await closeButton(page).click()
  await expect(sheet(page)).not.toBeVisible()
  expect(await bodyOverflow(page), '닫힘 시 body overflow 복원').toBe('')
})

test('닫힘/열림 상태 스크린샷을 캡처한다', async ({ page }) => {
  // 회귀 비교가 아니라 육안 확인용. test-results/ 아래에 남기고 커밋하지 않는다.
  await page.screenshot({ path: 'test-results/hamburger-closed.png', fullPage: true })

  await hamburger(page).click()
  await expect(sheet(page)).toBeVisible()
  // 슬라이드 트랜지션(--duration-slow) 안정화 후 캡처.
  await page.waitForTimeout(400)
  await page.screenshot({ path: 'test-results/hamburger-open.png', fullPage: true })
})
