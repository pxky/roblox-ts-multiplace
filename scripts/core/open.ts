import * as fs from "fs"
import * as yaml from "js-yaml"
import { get_args } from "../util/constants"
import { run_command, run_platform } from "../util/run"

const [place, branch] = get_args()

interface MantleStateEntry {
	id: string
}

interface MantleStateExperienceSingleton extends MantleStateEntry {
	outputs: {
		experience: {
			startPlaceId: number
		}
	}
}

interface MantleStateFile {
	environments: {
		dev: MantleStateEntry[]
	}
}

try {
	const mantle_state = yaml.load(fs.readFileSync(`places/${place}/.mantle-state.yml`, "utf-8")) as MantleStateFile
	const experience_singleton = mantle_state.environments[branch].find(
		(obj) => obj.id === "experience_singleton",
	) as MantleStateExperienceSingleton
	const dev_place_id = experience_singleton.outputs.experience.startPlaceId

	run_platform({
		win32: () =>
			run_command(`start roblox-studio:1+task:EditPlace+placeId:${dev_place_id}+universeId:${dev_place_id}`),
		darwin: () =>
			run_command(
				`open -a "RobloxStudio" --args "EditPlace" "placeId=${dev_place_id}" "universeId=${dev_place_id}"`,
			),
	})
} catch (err) {
	console.error(`Error opening dev place: ${err}`)
	process.exit(1)
}
