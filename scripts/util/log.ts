import chalk from "chalk"

export function log_success(message: string) {
	console.log(chalk.green(`[🌌]: ${message}`))
}

export function log_error(message: string) {
	console.warn(chalk.red(`[❌]: ${message}`))
	process.exit(1)
}
