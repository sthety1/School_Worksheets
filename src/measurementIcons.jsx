/**
 * Simple black-and-white cues for Measurement / Compare (decorations next to A/B—word problems stay authoritative).
 */
const box = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 48 32', role: 'img', 'aria-hidden': true }

function Framed({ children }) {
  return (
    <svg {...box} className="h-16 w-24 shrink-0 text-black">
      <rect width="48" height="32" fill="#ffffff" stroke="currentColor" strokeWidth={0.4} rx={2} />
      {children}
    </svg>
  )
}

function PicPencil() {
  return (
    <Framed>
      <polygon points="26,22 38,10 41,13 29,26" stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <line x1={10} y1={18} x2={26} y2={22} stroke="currentColor" strokeWidth={1} />
      <polygon points="8,20 14,26 16,23 11,17" stroke="currentColor" strokeWidth={0.8} fill="#ffffff" />
    </Framed>
  )
}

function PicClip() {
  return (
    <Framed>
      <path
        d="M26 22 C18 26 14 22 17 13 C21 9 31 13 34 21 C35 25 34 29 31 31"
        stroke="currentColor"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={22} cy={11} rx={7} ry={5} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
    </Framed>
  )
}

function PicSnake() {
  return (
    <Framed>
      <path
        d="M8 20 Q16 8 24 14 T38 22"
        stroke="currentColor"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={8} cy={20} r={2} fill="currentColor" />
    </Framed>
  )
}

function PicWorm() {
  return (
    <Framed>
      <path
        d="M10 18 Q16 12 22 17 T38 21"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={10} cy={18} r={2} fill="currentColor" />
    </Framed>
  )
}

function PicRockHeavy() {
  return (
    <Framed>
      <polygon points="16,26 34,26 38,26 38,31 14,31 14,27" stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <path d="M18 26 L22 10 L34 26 Z" stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <path d="M12 26 L26 26 L26 24 L16 21 Z" fill="#eaeaea" stroke="currentColor" strokeWidth={0.8} />
    </Framed>
  )
}

function PicFeather() {
  return (
    <Framed>
      <path d="M14 29 Q24 6 36 29" stroke="currentColor" strokeWidth={1.2} fill="none" />
      <path d="M24 29 L26 31 L22 31 Z" stroke="currentColor" strokeWidth={0.8} fill="#ffffff" />
    </Framed>
  )
}

function PicBallHeavy() {
  return (
    <Framed>
      <circle cx={24} cy={20} r={12} stroke="currentColor" strokeWidth={2} fill="#eaeaea" />
      <ellipse cx={24} cy={31} rx={22} ry={8} opacity={0.15} />
    </Framed>
  )
}

function PicBalloonLite() {
  return (
    <Framed>
      <ellipse cx={24} cy={17} rx={10} ry={13} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <line x1={24} y1={30} x2={24} y2={31} stroke="currentColor" strokeWidth={1} />
    </Framed>
  )
}

function PicTallTree() {
  return (
    <Framed>
      <rect x={22} y={8} width={4} height={24} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={24} cy={13} r={10} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <ellipse cx={24} cy={12} rx={13} ry={11} stroke="currentColor" strokeWidth={1} fill="none" />
    </Framed>
  )
}

function PicSmallMouse() {
  return (
    <Framed>
      <ellipse cx={28} cy={21} rx={13} ry={9} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={39} cy={19} r={5} stroke="currentColor" strokeWidth={0.9} fill="#ffffff" />
    </Framed>
  )
}

function PicBucketWide() {
  return (
    <Framed>
      <rect x={13} y={22} width={22} height={9} rx={2} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <ellipse cx={24} cy={21} rx={14} ry={6} stroke="currentColor" strokeWidth={1} fill="#eaeaea" />
    </Framed>
  )
}

function PicSpoonNarrow() {
  return (
    <Framed>
      <ellipse cx={24} cy={29} rx={14} ry={4} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <line x1={24} y1={8} x2={24} y2={31} stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={24} cy={29} rx={6} ry={6} stroke="currentColor" strokeWidth={2} fill="#ffffff" />
    </Framed>
  )
}

function PicDoorWide() {
  return (
    <Framed>
      <rect x={13} y={14} width={22} height={17} stroke="currentColor" strokeWidth={2} fill="#ffffff" />
      <circle cx={31} cy={22} r={1.8} stroke="none" fill="currentColor" />
    </Framed>
  )
}

function PicBookNarrow() {
  return (
    <Framed>
      <rect x={15} y={23} width={22} height={8} rx={2} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <rect x={19} y={26} width={12} height={4} rx={1} stroke="currentColor" strokeWidth={0.8} fill="none" />
    </Framed>
  )
}

function PicTowerTall() {
  return (
    <Framed>
      <rect x={12} y={6} width={24} height={25} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <line x1={16} y1={12} x2={32} y2={12} stroke="currentColor" strokeWidth={0.8} />
      <line x1={16} y1={18} x2={32} y2={18} stroke="currentColor" strokeWidth={0.8} />
    </Framed>
  )
}

function PicFenceShort() {
  return (
    <Framed>
      <rect x={8} y={18} width={32} height={13} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <line x1={14} y1={18} x2={14} y2={31} stroke="currentColor" strokeWidth={1} />
      <line x1={24} y1={18} x2={24} y2={31} stroke="currentColor" strokeWidth={1} />
      <line x1={34} y1={18} x2={34} y2={31} stroke="currentColor" strokeWidth={1} />
    </Framed>
  )
}

function PicPillowLight() {
  return (
    <Framed>
      <rect x={10} y={18} width={28} height={12} rx={4} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <path d="M14 24 H34" stroke="currentColor" strokeWidth={0.8} />
    </Framed>
  )
}

function PicBrickHeavy() {
  return (
    <Framed>
      <rect x={12} y={16} width={24} height={14} stroke="currentColor" strokeWidth={1} fill="#eaeaea" />
      <line x1={12} y1={23} x2={36} y2={23} stroke="currentColor" strokeWidth={0.8} />
      <line x1={18} y1={16} x2={18} y2={30} stroke="currentColor" strokeWidth={0.8} />
      <line x1={30} y1={16} x2={30} y2={30} stroke="currentColor" strokeWidth={0.8} />
    </Framed>
  )
}

function PicBusLong() {
  return (
    <Framed>
      <rect x={8} y={16} width={32} height={12} rx={2} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={16} cy={29} r={3} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={32} cy={29} r={3} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
    </Framed>
  )
}

function PicToyShort() {
  return (
    <Framed>
      <rect x={18} y={19} width={12} height={9} rx={2} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={24} cy={29} r={3} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
    </Framed>
  )
}

function PicMelonBig() {
  return (
    <Framed>
      <ellipse cx={24} cy={20} rx={16} ry={12} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <path d="M12 20 Q24 8 36 20" stroke="currentColor" strokeWidth={0.8} fill="none" />
    </Framed>
  )
}

function PicGrapeSmall() {
  return (
    <Framed>
      <circle cx={24} cy={24} r={5} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={20} cy={16} r={3} stroke="currentColor" strokeWidth={0.8} fill="#ffffff" />
      <circle cx={28} cy={16} r={3} stroke="currentColor" strokeWidth={0.8} fill="#ffffff" />
    </Framed>
  )
}

function PicTreeTall() {
  return (
    <Framed>
      <rect x={22} y={16} width={4} height={15} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <circle cx={24} cy={15} r={11} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
    </Framed>
  )
}

function PicPotShort() {
  return (
    <Framed>
      <path d="M16 31 L32 31 L30 24 L18 24 Z" stroke="currentColor" strokeWidth={1} fill="#ffffff" />
      <ellipse cx={24} cy={24} rx={8} ry={3} stroke="currentColor" strokeWidth={1} fill="#ffffff" />
    </Framed>
  )
}

const TABLE = {
  pencil: PicPencil,
  clip: PicClip,
  snake: PicSnake,
  worm: PicWorm,
  rock: PicRockHeavy,
  feather: PicFeather,
  bowlingBall: PicBallHeavy,
  balloon: PicBalloonLite,
  giraffe: PicTallTree,
  mouse: PicSmallMouse,
  bucket: PicBucketWide,
  spoon: PicSpoonNarrow,
  door: PicDoorWide,
  book: PicBookNarrow,
  skyscraper: PicTowerTall,
  fencePost: PicFenceShort,
  pillow: PicPillowLight,
  brick: PicBrickHeavy,
  schoolBus: PicBusLong,
  toyCar: PicToyShort,
  watermelon: PicMelonBig,
  grape: PicGrapeSmall,
  tree: PicTreeTall,
  flowerPot: PicPotShort,
}

export function MeasurementPairArtWeb({ leftId, rightId }) {
  const L = TABLE[leftId] ?? PicPencil
  const R = TABLE[rightId] ?? PicClip
  return (
    <span className="flex flex-shrink-0 items-center gap-2">
      <L />
      <R />
    </span>
  )
}
