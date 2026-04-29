import pawUrl from './icons/paw.svg?url'
import catUrl from './icons/cat.svg?url'
import carUrl from './icons/car.svg?url'
import crownUrl from './icons/crown.svg?url'
import dinosaurUrl from './icons/dinosaur.svg?url'
import unicornUrl from './icons/unicorn.svg?url'

const themeToUrl = {
  // 'animals' kept for backwards compatibility with saved profiles.
  animals: pawUrl,
  dogs: pawUrl,
  cats: catUrl,
  cars: carUrl,
  princesses: crownUrl,
  dinosaurs: dinosaurUrl,
  unicorns: unicornUrl,
}

export function ThemeIcon({ theme, className = 'h-7 w-7', title }) {
  const src = themeToUrl[theme] ?? pawUrl
  const alt = title ?? ''

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={title ? undefined : true}
      className={`${className} object-contain`}
      draggable={false}
    />
  )
}

