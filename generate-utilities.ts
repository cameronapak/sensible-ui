import { mkdir } from 'node:fs/promises'

const spacing = {
  0: '0rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
} as const

const staticUtilities = {
  'sr-only': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    'white-space': 'nowrap',
    'border-width': '0',
  },
  block: { display: 'block' },
  'inline-block': { display: 'inline-block' },
  inline: { display: 'inline' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  grid: { display: 'grid' },
  'inline-grid': { display: 'inline-grid' },
  hidden: { display: 'none' },
  'flex-row': { 'flex-direction': 'row' },
  'flex-col': { 'flex-direction': 'column' },
  'flex-wrap': { 'flex-wrap': 'wrap' },
  'flex-nowrap': { 'flex-wrap': 'nowrap' },
  grow: { 'flex-grow': '1' },
  'grow-0': { 'flex-grow': '0' },
  shrink: { 'flex-shrink': '1' },
  'shrink-0': { 'flex-shrink': '0' },
  'items-start': { 'align-items': 'flex-start' },
  'items-center': { 'align-items': 'center' },
  'items-end': { 'align-items': 'flex-end' },
  'items-stretch': { 'align-items': 'stretch' },
  'items-baseline': { 'align-items': 'baseline' },
  'justify-start': { 'justify-content': 'flex-start' },
  'justify-center': { 'justify-content': 'center' },
  'justify-end': { 'justify-content': 'flex-end' },
  'justify-between': { 'justify-content': 'space-between' },
  'justify-around': { 'justify-content': 'space-around' },
  'justify-evenly': { 'justify-content': 'space-evenly' },
  'self-auto': { 'align-self': 'auto' },
  'self-start': { 'align-self': 'flex-start' },
  'self-center': { 'align-self': 'center' },
  'self-end': { 'align-self': 'flex-end' },
  'self-stretch': { 'align-self': 'stretch' },
  'grid-cols-1': { 'grid-template-columns': 'repeat(1, minmax(0, 1fr))' },
  'grid-cols-2': { 'grid-template-columns': 'repeat(2, minmax(0, 1fr))' },
  'grid-cols-3': { 'grid-template-columns': 'repeat(3, minmax(0, 1fr))' },
  'grid-cols-4': { 'grid-template-columns': 'repeat(4, minmax(0, 1fr))' },
  'col-span-full': { 'grid-column': '1 / -1' },
  'w-auto': { width: 'auto' },
  'w-full': { width: '100%' },
  'h-auto': { height: 'auto' },
  'h-full': { height: '100%' },
  'min-w-0': { 'min-width': '0' },
  'min-w-full': { 'min-width': '100%' },
  'max-w-xs': { 'max-width': '20rem' },
  'max-w-sm': { 'max-width': '24rem' },
  'max-w-md': { 'max-width': '28rem' },
  'max-w-lg': { 'max-width': '32rem' },
  'max-w-xl': { 'max-width': '36rem' },
  'max-w-full': { 'max-width': '100%' },
  'max-w-none': { 'max-width': 'none' },
  'min-h-0': { 'min-height': '0' },
  'min-h-full': { 'min-height': '100%' },
  'min-h-screen': { 'min-height': '100dvh' },
  'max-h-none': { 'max-height': 'none' },
  'max-h-full': { 'max-height': '100%' },
  'max-h-screen': { 'max-height': '100dvh' },
  'overflow-auto': { overflow: 'auto' },
  'overflow-hidden': { overflow: 'hidden' },
  'overflow-clip': { overflow: 'clip' },
  'overflow-visible': { overflow: 'visible' },
  'overflow-scroll': { overflow: 'scroll' },
  'overflow-x-auto': { 'overflow-x': 'auto' },
  'overflow-x-hidden': { 'overflow-x': 'hidden' },
  'overflow-y-auto': { 'overflow-y': 'auto' },
  'overflow-y-hidden': { 'overflow-y': 'hidden' },
  'text-start': { 'text-align': 'start' },
  'text-center': { 'text-align': 'center' },
  'text-end': { 'text-align': 'end' },
  'text-justify': { 'text-align': 'justify' },
  truncate: {
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  },
  'text-ellipsis': { 'text-overflow': 'ellipsis' },
  'text-clip': { 'text-overflow': 'clip' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'aspect-auto': { 'aspect-ratio': 'auto' },
  'aspect-square': { 'aspect-ratio': '1 / 1' },
  'aspect-video': { 'aspect-ratio': '16 / 9' },
  static: { position: 'static' },
  fixed: { position: 'fixed' },
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  sticky: { position: 'sticky' },
  'z-auto': { 'z-index': 'auto' },
  'z-0': { 'z-index': '0' },
  'z-10': { 'z-index': '10' },
  'z-20': { 'z-index': '20' },
  'z-30': { 'z-index': '30' },
  'z-40': { 'z-index': '40' },
  'z-50': { 'z-index': '50' },
} as const

const spacingProperties = {
  m: ['margin'],
  mt: ['margin-top'],
  mr: ['margin-right'],
  mb: ['margin-bottom'],
  ml: ['margin-left'],
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  p: ['padding'],
  pt: ['padding-top'],
  pr: ['padding-right'],
  pb: ['padding-bottom'],
  pl: ['padding-left'],
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
  gap: ['gap'],
  'gap-x': ['column-gap'],
  'gap-y': ['row-gap'],
  inset: ['inset'],
  'inset-x': ['left', 'right'],
  'inset-y': ['top', 'bottom'],
  top: ['top'],
  right: ['right'],
  bottom: ['bottom'],
  left: ['left'],
} as const

const lines = ['/* This file is generated by generate-utilities.ts. Do not edit it directly. */', '@layer utilities {', '  :root {']

for (const [name, value] of Object.entries(spacing)) {
  lines.push(`    --space-${name}: ${value};`)
}

lines.push('  }', '')

for (const [className, declarations] of Object.entries(staticUtilities)) {
  lines.push(`  .${className} {`)
  for (const [property, value] of Object.entries(declarations)) {
    lines.push(`    ${property}: ${value};`)
  }
  lines.push('  }', '')
}

for (const [prefix, properties] of Object.entries(spacingProperties)) {
  for (const name of Object.keys(spacing)) {
    lines.push(`  .${prefix}-${name} {`)
    for (const property of properties) {
      lines.push(`    ${property}: var(--space-${name});`)
    }
    lines.push('  }', '')
  }
}

for (const name of Object.keys(spacing)) {
  lines.push(
    `  .size-${name} {`,
    `    width: var(--space-${name});`,
    `    height: var(--space-${name});`,
    '  }',
    '',
    `  .w-${name} {`,
    `    width: var(--space-${name});`,
    '  }',
    '',
    `  .h-${name} {`,
    `    height: var(--space-${name});`,
    '  }',
    '',
  )
}

lines.push('}', '')

await mkdir('./src/css/generated', { recursive: true })
await Bun.write('./src/css/generated/utilities.css', lines.join('\n'))

console.log('Generated CSS utilities')
