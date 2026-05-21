export const getInstructionByType = (type) => {
  const instructions = {
    numberTracing: 'Trace each number with your pencil. Say each number aloud as you write.',
    countingObjects: 'Count the objects carefully, then write the number on each line.',
    letterTracing: 'Trace each uppercase and lowercase letter. Keep letters on the writing lines.',
    sightWords: 'Trace each sight word three times, then read the word out loud.',
    nameWriting: 'Trace your name on each line. Try to keep letters neat and on the guides.',
    shapes: 'Say each shape name, then trace the word neatly on the writing guides.',
    addition: 'Solve each addition problem. Use your fingers or draw dots if needed.',
    subtraction: 'Solve each subtraction problem. Make sure your answer is not negative.',
    tenFrames: 'Count the dots in each ten-frame, then write the total.',
    cvcWords: 'Sound out each word, then write it on the line.',
    sentenceTracing: 'Trace each sentence neatly on the writing guides.',
    patterns: 'Look at the pattern. Write what comes next.',
    rhymeMatch:
      'Read each cue word aloud. Circle the word in the row that rhymes with the cue word. Say both words together to check the rhyme.',
    syllableSort: 'Say the word slowly. Tap each syllable. Circle how the word breaks into syllables.',
    numberBonds: 'Find two parts that make the whole. Write the missing part on the line.',
    subitizing:
      'Look at each group of dots quickly. Write how many you see. Try to tell without counting each dot one-by-one.',
    measurementCompare:
      'Read each question. Circle the picture or word that shows the longer, shorter, taller, heavier, or greater amount.',
    numberLine: 'Read the number line. Write the missing number on the line.',
    matching: 'Draw a line to match each picture word to the same word on the right.',
    phonics: 'Say the beginning sound, read the picture word, then trace the focus letter.',
    colorByNumber: 'Use the key to color each shape by number. Stay inside the lines.',
  }
  return instructions[type] ?? 'Complete each problem neatly.'
}

export const getObjectiveByType = (type) => {
  const objectives = {
    numberTracing: 'I can write numbers neatly.',
    countingObjects: 'I can count objects and write the total.',
    letterTracing: 'I can write uppercase and lowercase letters on the lines.',
    sightWords: 'I can read and write sight words.',
    nameWriting: 'I can write my name neatly.',
    shapes: 'I can name basic shapes.',
    addition: 'I can solve simple addition problems.',
    subtraction: 'I can solve simple subtraction problems.',
    tenFrames: 'I can show numbers using a ten-frame.',
    cvcWords: 'I can read and write CVC words.',
    sentenceTracing: 'I can write a sentence neatly.',
    patterns: 'I can find and complete patterns.',
    rhymeMatch: 'I can listen for rhyming words.',
    syllableSort: 'I can separate a word into syllables.',
    numberBonds: 'I can break a number into two parts.',
    subitizing: 'I can recognize small groups of dots at a glance.',
    measurementCompare: 'I can compare length, height, weight, and capacity with words and pictures.',
    numberLine: 'I can find a missing number on a number line.',
    matching: 'I can match pictures and words.',
    phonics: 'I can say the first sound in a word.',
    colorByNumber: 'I can follow a key to color by number.',
  }
  return objectives[type] ?? 'I can practice carefully.'
}
