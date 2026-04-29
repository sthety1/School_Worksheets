const strokeProps = {
  fill: 'none',
  stroke: 'black',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ThemeIcon({ theme, className = 'h-7 w-7', title }) {
  const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }

  if (theme === 'unicorns') {
    return (
      <svg viewBox="0 0 48 48" className={className} {...ariaProps}>
        {/* head */}
        <path
          d="M12 30c0-10 7-18 16-18 4 0 7 2 9 4 2 2 3 6 3 9 0 9-7 13-16 13-7 0-12-2-12-8Z"
          {...strokeProps}
        />
        {/* horn */}
        <path d="M31 8l4 9-8-5 4-4Z" {...strokeProps} />
        {/* ear */}
        <path d="M22 14l-6-6 1 9" {...strokeProps} />
        {/* mane */}
        <path d="M16 22c2-4 6-8 12-10" {...strokeProps} />
        <path d="M14 26c2-3 6-6 10-7" {...strokeProps} />
        {/* eye */}
        <circle cx="28" cy="23" r="1.6" fill="black" />
        {/* nose */}
        <path d="M36 28c-1 2-3 3-5 3" {...strokeProps} />
        {/* sparkle */}
        <path d="M10 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" {...strokeProps} />
      </svg>
    )
  }

  if (theme === 'dinosaurs') {
    return (
      <svg viewBox="0 0 48 48" className={className} {...ariaProps}>
        {/* body */}
        <path
          d="M10 30c2-10 10-16 20-14 6 1 8 6 8 11 0 7-6 11-16 11-8 0-14-2-12-8Z"
          {...strokeProps}
        />
        {/* tail */}
        <path d="M10 30c-2 0-5 2-6 4 4 1 8 0 10-1" {...strokeProps} />
        {/* neck/head */}
        <path d="M24 16c0-4 2-8 6-10" {...strokeProps} />
        <circle cx="31" cy="6" r="1.6" fill="black" />
        {/* spikes */}
        <path d="M18 18l-2-4-2 4" {...strokeProps} />
        <path d="M24 16l-2-4-2 4" {...strokeProps} />
        <path d="M30 16l-2-4-2 4" {...strokeProps} />
        {/* legs */}
        <path d="M18 38v6" {...strokeProps} />
        <path d="M28 38v6" {...strokeProps} />
      </svg>
    )
  }

  if (theme === 'cars') {
    return (
      <svg viewBox="0 0 48 48" className={className} {...ariaProps}>
        <path d="M10 28h28c2 0 4 2 4 4v4H6v-4c0-2 2-4 4-4Z" {...strokeProps} />
        <path d="M14 28l4-10h12l4 10" {...strokeProps} />
        <circle cx="16" cy="38" r="3.5" {...strokeProps} />
        <circle cx="32" cy="38" r="3.5" {...strokeProps} />
        <path d="M20 22h8" {...strokeProps} />
      </svg>
    )
  }

  if (theme === 'princesses') {
    return (
      <svg viewBox="0 0 48 48" className={className} {...ariaProps}>
        <path d="M10 34l4-18 10 10 10-10 4 18H10Z" {...strokeProps} />
        <circle cx="14" cy="14" r="2" fill="black" />
        <circle cx="24" cy="12" r="2" fill="black" />
        <circle cx="34" cy="14" r="2" fill="black" />
        <path d="M14 34v4h20v-4" {...strokeProps} />
      </svg>
    )
  }

  // animals
  return (
    <svg viewBox="0 0 48 48" className={className} {...ariaProps}>
      {/* simple cat face */}
      <path d="M14 18l-4-6v10" {...strokeProps} />
      <path d="M34 18l4-6v10" {...strokeProps} />
      <circle cx="24" cy="28" r="14" {...strokeProps} />
      <circle cx="19" cy="26" r="1.6" fill="black" />
      <circle cx="29" cy="26" r="1.6" fill="black" />
      <path d="M24 28l-2 2 2 2 2-2-2-2Z" fill="black" />
      <path d="M16 30h6" {...strokeProps} />
      <path d="M26 30h6" {...strokeProps} />
    </svg>
  )
}

