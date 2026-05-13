// SERVER-ONLY module. Never import from a client component.
if (typeof window !== 'undefined') {
  throw new Error('CodexClient must only be imported in server-side (Node.js) code.')
}

import { spawn } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

export interface CodexRunOptions {
  prompt: string
  /** Path to a JSON Schema file passed via --output-schema */
  schemaPath?: string
  /** Timeout in milliseconds (default 300_000 = 5 min) */
  timeoutMs?: number
  /** Working directory for the codex process (default: process.cwd()) */
  cwd?: string
}

/**
 * Invoke `codex exec` non-interactively and return the last message text.
 *
 * Prerequisite: `codex` must be installed and on $PATH, and the user must
 * have authenticated with `codex login`. This wrapper surfaces auth errors
 * via the thrown Error's message.
 */
export async function runCodex(options: CodexRunOptions): Promise<string> {
  const { prompt, schemaPath, timeoutMs = 300_000, cwd = process.cwd() } = options

  // Write the last-message output to a temp file so we can read it reliably.
  const tmpFile = path.join(os.tmpdir(), `codex-output-${Date.now()}.json`)

  const args = [
    'exec',
    '--json',
    '--skip-git-repo-check',
    '--sandbox',
    'workspace-write',
    '--output-last-message',
    tmpFile,
    ...(schemaPath ? ['--output-schema', schemaPath] : []),
    '-', // read prompt from stdin
  ]

  return new Promise((resolve, reject) => {
    const child = spawn('codex', args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    })

    let stderrBuf = ''
    let stdoutBuf = ''
    child.stderr.on('data', (chunk: Buffer) => {
      stderrBuf += chunk.toString()
    })
    // With --json, codex emits JSONL events (including failure events) on stdout.
    // Capture it so non-zero exits surface a useful diagnostic.
    child.stdout.on('data', (chunk: Buffer) => {
      stdoutBuf += chunk.toString()
    })

    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      try { fs.unlinkSync(tmpFile) } catch { /* ignore ENOENT and other errors */ }
      reject(new Error(`codex timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    child.on('error', (err) => {
      clearTimeout(timer)
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error('codex CLI not found on $PATH. Install it and run `codex login` before using the authoring page.'))
      } else {
        reject(err)
      }
    })

    child.on('close', (code) => {
      clearTimeout(timer)

      if (code !== 0) {
        // Clean up the temp file on non-zero exit (it may not exist; ignore errors).
        try { fs.unlinkSync(tmpFile) } catch { /* ignore ENOENT and other errors */ }
        const tail = stdoutBuf.slice(-2000)
        reject(new Error(`codex exited with code ${code}.\n\nstderr:\n${stderrBuf}\n\nstdout (last 2KB):\n${tail}`))
        return
      }

      let output: string
      try {
        output = fs.readFileSync(tmpFile, 'utf8')
      } catch {
        reject(new Error(`codex completed but output file not found at ${tmpFile}.\n\nstderr:\n${stderrBuf}`))
        return
      } finally {
        // Clean up the temp file regardless of whether read succeeded.
        try { fs.unlinkSync(tmpFile) } catch { /* ignore ENOENT and other errors */ }
      }

      resolve(output)
    })

    // Write the prompt to stdin and close it.
    // Suppress EPIPE / ECONNRESET if Codex exits before reading stdin.
    child.stdin.on('error', () => {})
    child.stdin.write(prompt, 'utf8')
    child.stdin.end()
  })
}
