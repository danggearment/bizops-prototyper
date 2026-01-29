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

  // Nếu đã setup (ví dụ đã có node_modules), vẫn nên đảm bảo dev server được start.
  // - Khi needsSetup = true: chạy tất cả steps (install + dev).
  // - Khi needsSetup = false: chỉ chạy các step chạy nền (thường là dev server).
  const stepsToRun = needsSetup
    ? config.steps || []
    : (config.steps || []).filter((step) => step.runInBackground)

  for (const step of stepsToRun) {
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

export async function stopDevServers() {
  // Thử kill theo command line pattern; không fail cứng nếu không có process nào.
  try {
    console.log("[autoProjectSetup] Stopping dev servers (pnpm dev / vite)...")
    await runCommand('pkill -f "pnpm dev" || true', { runInBackground: false })
    await runCommand('pkill -f "vite" || true', { runInBackground: false })
    // Sau khi dừng dev server, tự động chạy git workflow nếu được bật
    await runAutoGitWorkflow()
  } catch (err) {
    console.error("[autoProjectSetup] Error while stopping dev servers:", err)
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
    } else if (mode === "stop") {
      await stopDevServers()
    } else {
      console.log("Usage: node .claude/claude-auto-services.js [setup|git]")
    }
  })().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
