import { warn } from "node:console"
import * as fs from "node:fs"
import * as path from "node:path"
import { branches, get_args, places } from "../util/get-args"
import { log_error, log_success } from "../util/log"

const output_path = "src/shared/constants/index.ts"

const [place, branch] = get_args()

try {
	const package_json_version = JSON.parse(fs.readFileSync("package.json", { encoding: "utf-8" })).version

	const constants = `// file generated via [${path.basename(__filename)}]
// any manual changes WILL get overridden
	
export const version = \"${package_json_version}\"

export const places = ${JSON.stringify(places)} as const
export const place: (typeof places)[number] = \"${place}\"

export const branches = ${JSON.stringify(branches)} as const
export const branch: (typeof branches)[number] = \"${branch}\"
`

	fs.writeFileSync(output_path, constants, { encoding: "utf-8" })
	log_success(`Synced constants. (Version: ${package_json_version})`)
} catch (err) {
	warn(err)
	log_error(`Failed to sync constants. ${__filename}`)
}
