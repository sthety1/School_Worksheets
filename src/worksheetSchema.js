import { z } from 'zod'

export const worksheetTypeEnum = z.enum([
  'numberTracing',
  'countingObjects',
  'letterTracing',
  'sightWords',
  'nameWriting',
  'shapes',
  'addition',
  'subtraction',
  'matching',
  'phonics',
  'colorByNumber',
  'tenFrames',
  'cvcWords',
  'sentenceTracing',
  'patterns',
  'rhymeMatch',
  'syllableSort',
  'numberBonds',
  'subitizing',
  'measurementCompare',
  'numberLine',
])

// Keep 'animals' for backwards compatibility with saved profiles.
export const themeEnum = z.enum(['dogs', 'cats', 'animals', 'princesses', 'cars', 'dinosaurs', 'unicorns'])

export const skillLevelEnum = z.enum(['preK', 'kEarly', 'kMid', 'kEnd'])

export const sightWordSourceEnum = z.enum([
  'dolchPrePrimer',
  'dolchPrimer',
  'fryFirst100',
  'custom',
  'mixedRandom',
])

export const recentMemorySchema = z.object({
  numberTracing: z.array(z.string()).default([]),
  letterTracing: z.array(z.string()).default([]),
  sightWords: z.array(z.string()).default([]),
  matching: z.array(z.string()).default([]),
  phonics: z.array(z.any()).default([]),
})

export const worksheetConfigSchema = z.object({
  type: worksheetTypeEnum,
  problems: z.number().int().min(1).max(50),
  childName: z.string().default(''),
  theme: themeEnum,
  skillLevel: skillLevelEnum,
  sightWordSource: sightWordSourceEnum,
  customWordList: z.string().default(''),
  instructionOverride: z.string().optional().default(''),
  objectiveOverride: z.string().optional().default(''),
  paperStyle: z.enum(['baseline', 'primary', 'wideRuled', 'blank']).optional().default('baseline'),
  traceOpacity: z.number().min(0.2).max(1).optional().default(0.9),
  traceFont: z.enum(['playwrite', 'system']).optional().default('playwrite'),
})

export const generatorInputSchema = worksheetConfigSchema.extend({
  recentMemory: recentMemorySchema,
  seed: z.number().optional(),
})

