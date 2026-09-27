const { packageManager } = await Bun.file('./package.json').json()
const expectedVersion = packageManager.split('@')[1]

if (Bun.version !== expectedVersion) {
  console.error(`Build with ${packageManager}; found bun@${Bun.version}`)
  process.exit(1)
}

if (Bun.argv.includes('--version-only')) process.exit(0)

const paths = [
  'src/css/generated/utilities.css',
  'dist/sensible-ui.css',
  'dist/sensible-ui.min.css',
  'dist/sensible-ui.utilities.css',
  'dist/sensible-ui.utilities.min.css',
  'dist/sensible-code.js',
  'dist/scoped',
]
const result = Bun.spawnSync([
  'git',
  'status',
  '--short',
  '--untracked-files=all',
  '--',
  ...paths,
])
if (result.exitCode !== 0) {
  console.error(result.stderr.toString())
  process.exit(result.exitCode)
}

const changed = result.stdout.toString().trimEnd()
if (changed) {
  console.error(`Generated files differ from the committed build:\n${changed}`)
  process.exit(1)
}

export {}
