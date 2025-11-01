export const places = ["game-1"] as const
export const branches = ["dev", "prod"] as const

export const package_manager = "pnpm"

type Place = (typeof places)[number]
type Branch = (typeof branches)[number]

function ensure_environment(args: string[]): [Place, Branch, ...string[]] {
	const [place, branch, ...rest] = args

	const valid_environment = places.includes(place as Place) && branches.includes(branch as Branch)

	if (!valid_environment) {
		console.error(`Environment incorrectly specified. Pick from: [${places}] & [${branches}].`)
		process.exit(1)
	}

	return [place as Place, branch as Branch, ...rest]
}

export function get_args() {
	return ensure_environment(process.argv.slice(2))
}
