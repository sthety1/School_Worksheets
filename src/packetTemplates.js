import { getMaxProblems } from './worksheetEngine'

export const packetTemplates = [
  { value: 'mixed', label: 'Mixed Review (5 pages)' },
  { value: 'handwriting', label: 'Handwriting Focus (5 pages)' },
  { value: 'math', label: 'Math Focus (5 pages)' },
]

export const packetTemplateToTypes = {
  mixed: ['letterTracing', 'numberTracing', 'sightWords', 'addition', 'phonics'],
  handwriting: ['letterTracing', 'sightWords', 'nameWriting', 'shapes', 'phonics'],
  math: ['numberTracing', 'countingObjects', 'addition', 'colorByNumber', 'matching'],
}

export const buildPacketConfigs = ({ baseConfig, template, pageCount = 5, getPresetProblems }) => {
  const types = packetTemplateToTypes[template] ?? packetTemplateToTypes.mixed
  return Array.from({ length: pageCount }, (_, idx) => {
    const type = types[idx % types.length]
    return {
      ...baseConfig,
      type,
      problems: Math.min(getPresetProblems(type, baseConfig.skillLevel), getMaxProblems(type)),
    }
  })
}

