import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 12,
    color: '#000000',
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 11,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 11,
    marginBottom: 10,
  },
  standards: {
    fontSize: 9,
    marginTop: 10,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell2: {
    width: '48%',
  },
  row: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  answerLine: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  subitWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 140,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 0.75,
    borderColor: '#000000',
    padding: 2,
  },
  subitCell: {
    width: 26,
    height: 26,
    borderWidth: 0.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subitDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
})

function prettyWorksheetType(type) {
  const map = {
    numberTracing: 'Number Tracing (1-20)',
    countingObjects: 'Counting Objects',
    letterTracing: 'Letter Tracing (A–Z)',
    sightWords: 'Sight Word Tracing',
    nameWriting: 'Name Writing Practice',
    shapes: 'Shapes Recognition',
    addition: 'Beginning Addition',
    subtraction: 'Beginning Subtraction',
    tenFrames: 'Ten-Frames',
    cvcWords: 'CVC Words',
    sentenceTracing: 'Sentence Tracing',
    patterns: 'Patterns',
    rhymeMatch: 'Rhyme Match',
    syllableSort: 'Syllable Sort (Tap Clap)',
    numberBonds: 'Number Bonds (within 10)',
    subitizing: 'Subitizing (Quick-Look Dots)',
    measurementCompare: 'Measurement / Compare',
    matching: 'Matching Pictures to Words',
    phonics: 'Beginning Sounds / Phonics',
    colorByNumber: 'Color by Number',
  }
  return map[type] ?? type
}

function renderWorksheetBody({ page }) {
  const { config, student } = page

  if (config.type === 'addition') {
    return (
      <View style={styles.grid2}>
        {student.map((row, idx) => (
          <View key={`add-${idx}`} style={styles.cell2}>
            <Text style={styles.answerLine}>
              {row.a} + {row.b} = ____
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'subtraction') {
    return (
      <View style={styles.grid2}>
        {student.map((row, idx) => (
          <View key={`sub-${idx}`} style={styles.cell2}>
            <Text style={styles.answerLine}>
              {row.a} - {row.b} = ____
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'countingObjects') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`count-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. Count the {row.themeNoun ?? 'items'}: ______
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'matching') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`match-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.wordLeft}  ———————→  {row.wordRight}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'phonics') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`ph-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.pictureLabel ?? row.word}: trace letter “{row.letter}”
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'tenFrames') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`tf-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. Ten-frame total: ______
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'cvcWords') {
    return (
      <View>
        {student.map((word, idx) => (
          <View key={`cvc-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {String(word).toUpperCase()}  →  Write: ____________
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'patterns') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`pat-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. ({row.kind}) {row.sequence.join(' ')}   Next: ____
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'rhymeMatch') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`rhyme-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. Cue: {row.cueWord} — choices: {row.choices.join(' | ')}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'syllableSort') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`syl-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.word} — {row.options.join(' | ')}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'numberBonds') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`bond-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.a} + {row.b} = {row.total}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'subitizing') {
    return (
      <View>
        {student.map((row, idx) => {
          const filled = new Set(row.cells.map((c) => `${c.row},${c.col}`))
          return (
            <View key={`sub-${idx}`} style={styles.row}>
              <Text>{idx + 1}. How many dots? _____</Text>
              <View style={styles.subitWrap}>
                {Array.from({ length: 25 }, (_, i) => {
                  const r = Math.floor(i / 5)
                  const col = i % 5
                  const on = filled.has(`${r},${col}`)
                  return (
                    <View key={`subc-${idx}-${i}`} style={styles.subitCell}>
                      {on ? <View style={styles.subitDot} /> : null}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  if (config.type === 'measurementCompare') {
    return (
      <View>
        {student.map((row, idx) => (
          <View key={`meas-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.prompt} A · {row.leftLabel} · B · {row.rightLabel}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  // Tracing-style worksheets: show the prompt and a blank line.
  if (config.type === 'numberTracing' || config.type === 'letterTracing' || config.type === 'sightWords' || config.type === 'nameWriting' || config.type === 'shapes' || config.type === 'sentenceTracing') {
    return (
      <View>
        {student.map((item, idx) => (
          <View key={`trace-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {String(item)}  →  Trace: _______________________
            </Text>
          </View>
        ))}
      </View>
    )
  }

  // Fallback: render each item on its own row.
  return (
    <View>
      {student.map((item, idx) => (
        <View key={`row-${idx}`} style={styles.row}>
          <Text>
            {idx + 1}. {JSON.stringify(item)}
          </Text>
        </View>
      ))}
    </View>
  )
}

function renderAnswerKeyBody({ page }) {
  const { config, answers } = page
  if (!answers) return <Text>No answer key for this worksheet.</Text>

  if (config.type === 'addition') {
    return (
      <View style={styles.grid2}>
        {answers.map((row, idx) => (
          <View key={`add-ak-${idx}`} style={styles.cell2}>
            <Text style={styles.answerLine}>
              {row.a} + {row.b} = {row.sum}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'subtraction') {
    return (
      <View style={styles.grid2}>
        {answers.map((row, idx) => (
          <View key={`sub-ak-${idx}`} style={styles.cell2}>
            <Text style={styles.answerLine}>
              {row.a} - {row.b} = {row.diff}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'countingObjects' || config.type === 'tenFrames') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`count-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.total}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'matching') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`match-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.word}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'phonics') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`ph-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.word} → {row.letter}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'cvcWords') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`cvc-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.word}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (config.type === 'patterns') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`pat-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. ({row.kind}) {row.next}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'rhymeMatch') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`rhyme-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.cueWord} → {row.correctRhyme}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'syllableSort') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`syl-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.correct}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'numberBonds') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`bond-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.a} + {row.b} = {row.total}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'subitizing') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`sub-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.count}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  if (config.type === 'measurementCompare') {
    return (
      <View>
        {answers.map((row, idx) => (
          <View key={`meas-ak-${idx}`} style={styles.row}>
            <Text>
              {idx + 1}. {row.correctLabel}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  return <Text>No answer key for this worksheet.</Text>
}

export function WorksheetPdfDocument({ pages, filenameLabel }) {
  const safeLabel = String(filenameLabel ?? '').trim()

  return (
    <Document title={safeLabel || 'Worksheet'}>
      {pages.map((page, idx) => {
        const title =
          page.kind === 'answerKey'
            ? `${prettyWorksheetType(page.config.type)} — Answer Key`
            : prettyWorksheetType(page.config.type)

        return (
          <Page key={`${page.kind}-${idx}`} size="LETTER" style={styles.page}>
            <Text style={styles.headerLabel}>{page.kind === 'answerKey' ? 'Answer Key' : 'Printable Kindergarten Worksheet'}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Theme: {String(page.config.theme ?? '').toUpperCase()}</Text>
              {page.config.childName ? <Text style={styles.metaText}>Child: {page.config.childName}</Text> : <Text style={styles.metaText}>Child: __________</Text>}
            </View>
            <View style={styles.divider} />

            {page.kind === 'worksheet' && page.config.instructionOverride ? (
              <Text style={styles.instruction}>{page.config.instructionOverride}</Text>
            ) : null}

            <View>
              {page.kind === 'answerKey' ? renderAnswerKeyBody({ page }) : renderWorksheetBody({ page })}
            </View>

            {Array.isArray(page.standards) && page.standards.length > 0 ? (
              <Text style={styles.standards}>Standards: {page.standards.join(', ')}</Text>
            ) : null}

            <Text style={{ ...styles.badge, position: 'absolute', bottom: 40, right: 48 }}>
              {idx + 1} / {pages.length}
            </Text>
          </Page>
        )
      })}
    </Document>
  )
}

