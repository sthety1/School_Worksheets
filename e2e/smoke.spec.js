import { test, expect } from '@playwright/test'

test.describe('release smoke', () => {
  test('single worksheet preview loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-page="worksheet"]')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: /kindergarten worksheet generator/i })).toBeVisible()
  })

  test('weekly packet flow produces five worksheet frames', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Mode').selectOption('packet')
    await page.getByRole('button', { name: 'Generate Weekly Packet' }).click()
    await expect(page.locator('[data-page="worksheet"]')).toHaveCount(5)
  })

  test('print preview opens and closes', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Print Preview', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Exit Preview' })).toBeVisible()
    await page.getByRole('button', { name: 'Exit Preview' }).click()
    await expect(page.getByRole('button', { name: 'Exit Preview' })).toHaveCount(0)
  })

  test('browser PDF download runs for a single worksheet', async ({ page }) => {
    await page.goto('/')
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 })
    await page.getByRole('button', { name: 'Download PDF' }).first().click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/worksheet_.*\.pdf$/)
  })
})
