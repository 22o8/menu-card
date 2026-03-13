import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pkgDir = path.join(root, 'node_modules', 'tinyexec')
const distDir = path.join(pkgDir, 'dist')
const mainFile = path.join(distDir, 'main.js')
const pkgFile = path.join(pkgDir, 'package.json')

async function exists(file) {
  try {
    await access(file, constants.F_OK)
    return true
  } catch {
    return false
  }
}

const shim = `import { spawn } from 'node:child_process'

function normalizeStdio(value) {
  if (value === undefined || value === null) return 'pipe'
  return value
}

export async function x(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...(options.env || {}) },
      shell: options.shell ?? false,
      stdio: [normalizeStdio(options.stdin), 'pipe', 'pipe'],
      windowsHide: true
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', reject)

    child.on('close', (exitCode) => {
      const result = {
        command,
        args,
        exitCode: exitCode ?? 0,
        stdout,
        stderr,
        failed: (exitCode ?? 0) !== 0,
        ok: (exitCode ?? 0) === 0
      }

      if (result.failed && options.reject !== false) {
        const error = new Error(stderr || stdout || \
          \`Command failed: \${command} \${args.join(' ')}\`)
        Object.assign(error, result)
        reject(error)
        return
      }

      resolve(result)
    })
  })
}

export default { x }
`

if (!(await exists(mainFile))) {
  await mkdir(distDir, { recursive: true })
  await writeFile(mainFile, shim, 'utf8')
}

if (!(await exists(pkgFile))) {
  await mkdir(pkgDir, { recursive: true })
  await writeFile(
    pkgFile,
    JSON.stringify(
      {
        name: 'tinyexec',
        version: '1.0.2',
        type: 'module',
        exports: {
          '.': './dist/main.js'
        }
      },
      null,
      2
    ),
    'utf8'
  )
}

console.log('tinyexec compatibility check completed')
