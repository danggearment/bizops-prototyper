import { spawn } from "child_process"
import { existsSync, promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SETTINGS_PATH = path.join(__dirname, "settings.json")
const REPO_ROOT = path.resolve(__dirname, "..")

async function loadSettings() {
  const raw = await fs.readFile(SETTINGS_PATH, "utf8")
  return JSON.parse(raw)
}

function runCommand(command, { runInBackground }) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ")

    const child = spawn(cmd, args, {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
      detached: !!runInBackground,
    })

    if (runInBackground) {
      // Detach and resolve immediately for background processes (e.g. dev server)
      child.unref()
      resolve()
      return
    }

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed: ${command} (exit code ${code})`))
      }
    })

    child.on("error", (err) => {
      reject(err)
    })
  })
}

export async function ensureProjectSetup() {
  const settings = await loadSettings()
  const config = settings.autoProjectSetup

  if (!config) return

  const needsSetup = (config.checks || []).some((check) => {
    if (check.type === "path_missing") {
      const checkPath = path.join(REPO_ROOT, check.path)
      return !existsSync(checkPath)
    }
    return false
  })

  if (!needsSetup) return

  for (const step of config.steps || []) {
    console.log(`[autoProjectSetup] Running: ${step.name} -> ${step.command}`)
    await runCommand(step.command, { runInBackground: !!step.runInBackground })
  }
}

export async function runAutoGitWorkflow() {
  const settings = await loadSettings()
  const config = settings.autoGitWorkflow

  if (!config || !config.enabled) return

  for (const step of config.steps || []) {
    console.log(`[autoGitWorkflow] Running: ${step.name} -> ${step.command}`)
    await runCommand(step.command, { runInBackground: !!step.runInBackground })
  }
}

// Allow running from CLI: `node .claude/claude-auto-services.js setup|git`
if (process.argv[1] === __filename) {
  const mode = process.argv[2]

  ;(async () => {
    if (mode === "setup") {
      await ensureProjectSetup()
    } else if (mode === "git") {
      await runAutoGitWorkflow()
    } else {
      console.log("Usage: node .claude/claude-auto-services.js [setup|git]")
    }
  })().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
