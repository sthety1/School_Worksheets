import { generateWorksheetData, getStandardsTagsForType } from '../worksheetEngine'

/**
 * Build a simple, deterministic list of PDF pages based on current UI state.
 * This keeps PDF generation data-driven (no DOM rasterization).
 */
export function buildPdfPages({
  mode,
  config,
  worksheetSeed,
  packetPages,
  packetPageRerolls,
  generationId,
  recentMemory,
  showAnswerKey,
  showStandardsTags,
  packetTemplate = 'mixed',
}) {
  if (mode === 'packet') {
    const pages = Array.isArray(packetPages) ? packetPages : []
    const rerolls = Array.isArray(packetPageRerolls) ? packetPageRerolls : []

    let built = pages.flatMap((pageConfig, idx) => {
      const seed = generationId + idx + 1 + (rerolls[idx] ?? 0) * 10000
      const data = generateWorksheetData({ ...pageConfig, seed, recentMemory })
      const standards = showStandardsTags ? getStandardsTagsForType(pageConfig.type) : []
      const packetPage = {
        kind: 'worksheet',
        config: pageConfig,
        title: pageConfig.type,
        student: data.student,
        answers: data.answers,
        standards,
      }

      if (!showAnswerKey) return [packetPage]
      if (!data.answers) return [packetPage]
      return [
        packetPage,
        {
          kind: 'answerKey',
          config: pageConfig,
          title: `${pageConfig.type} — Answer Key`,
          student: data.student,
          answers: data.answers,
          standards,
        },
      ]
    })
    if (packetTemplate === 'placement' && pages.length > 0) {
      built = [
        ...built,
        {
          kind: 'placementScoreSheet',
          config: pages[0] ?? config,
        },
      ]
    }
    return built
  }

  const data = generateWorksheetData({ ...config, seed: worksheetSeed, recentMemory })
  const standards = showStandardsTags ? getStandardsTagsForType(config.type) : []
  const singlePage = {
    kind: 'worksheet',
    config,
    title: config.type,
    student: data.student,
    answers: data.answers,
    standards,
  }

  if (!showAnswerKey) return [singlePage]
  if (!data.answers) return [singlePage]
  return [
    singlePage,
    {
      kind: 'answerKey',
      config,
      title: `${config.type} — Answer Key`,
      student: data.student,
      answers: data.answers,
      standards,
    },
  ]
}

