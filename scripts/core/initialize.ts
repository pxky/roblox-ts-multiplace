import chalk from "chalk"
import { get_args, package_manager } from "../util/constants"
import { run_command } from "../util/run"

const [place, branch] = get_args()

function spam_exclamations() {
	console.log(
		chalk.red("!!!!!!!!!!"),
		chalk.magenta("!!!!!!!!!!"),
		chalk.red("!!!!!!!!!!"),
		chalk.magenta("!!!!!!!!!!"),
		chalk.red("!!!!!!!!!!"),
		chalk.magenta("!!!!!!!!!!"),
		chalk.red("!!!!!!!!!!"),
	)
}

run_command(`${package_manager} build ${place} ${branch}`)

try {
	run_command(`rojo build ship.project.json --output places/${place}/build/${branch}.rbxl`)
	run_command(`mantle deploy places/${place} --environment ${branch}`)
} catch (err) {
	spam_exclamations()
	console.log(chalk.red(`[🌌] MAKE SURE YOU ADD [DEV, PROD] PLACES TO MANTLE API KEY PERMISSIONS!`))
	spam_exclamations()
}
