import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'

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

  test('placement packet template previews five worksheets', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Mode').selectOption('packet')
    await page.getByLabel('Packet Template').selectOption('placement')
    await page.getByRole('button', { name: 'Generate Placement Packet' }).click()
    await expect(page.locator('[data-page="worksheet"]')).toHaveCount(5)
    await expect(page.getByText(/Placement check/i).first()).toBeVisible()
  })

  test('single worksheet plus answer key for addition renders two worksheet frames', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Worksheet Type').selectOption('addition')
    await page.getByLabel('Include answer key on screen and when printing').click()
    await expect(page.locator('[data-page="worksheet"]')).toHaveCount(2)
  })

  test('generate weekly packet enables use last packet settings', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Mode').selectOption('packet')
    await expect(page.getByRole('button', { name: /Use last packet settings/i })).toBeDisabled()
    await page.getByRole('button', { name: 'Generate Weekly Packet' }).click()
    await expect(page.getByRole('button', { name: /Use last packet settings/i })).toBeEnabled()
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

  test('placement packet PDF has six pages (five worksheets plus scorer)', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.getByLabel('Mode').selectOption('packet')
    await page.getByLabel('Packet Template').selectOption('placement')
    await page.getByRole('button', { name: 'Generate Placement Packet' }).click()
    await expect(page.locator('[data-page="worksheet"]')).toHaveCount(5)

    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 })
    await page.getByRole('button', { name: 'Download Packet PDF' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/weekly_packet_.*\.pdf$/)

    const saved = testInfo.outputPath('placement-packet.pdf')
    await download.saveAs(saved)
    const bytes = await readFile(saved)
    const pdfDoc = await PDFDocument.load(bytes)
    expect(pdfDoc.getPageCount()).toBe(6)
  })
})
