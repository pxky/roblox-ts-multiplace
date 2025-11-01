import { execSync } from "child_process"
import { platform as OsPlatform } from "node:os"

const platform = OsPlatform()

export function run_command(command: string) {
	try {
		execSync(command, { stdio: "inherit" })
	} catch (err) {
		console.error(`Error running: ${err}`)
		process.exit(1)
	}
}

export function run_platform<R>(callbacks: {
	[T in NodeJS.Platform]?: () => R
}) {
	const callback = callbacks[platform]
	if (callback) return callback()
	throw `run_platform callback not implemented for platform ${platform}.`
}
