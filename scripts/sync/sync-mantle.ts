import { readFileSync, writeFileSync } from "node:fs"
import * as path from "node:path"
import { get_args } from "../util/get-args"
import { log_error, log_success } from "../util/log"

const [place, branch] = get_args()
const transformed_path = "src/shared/assets/mantle"
const output_typescript_types = true
const asset_file_message = `file generated via [${path.basename(
	__filename,
)}]. any manual changes WILL get overridden  \n`
const eslint_message = `// eslint-disable-next-line @typescript-eslint/no-empty-object-type  \n`

interface SortedMantleAssets {
	image: Record<string, string>
	sound: Record<string, string>
	badge: Record<string, { id: number; icon: string }>
	gamepass: Record<string, { id: number; icon: string }>
	product: Record<string, { id: number; icon: string }>
}

interface RawMantleAssets {
	[k: string]: {
		assetAlias?: {
			name: string
		}
		productIcon?: {
			assetId: number
		}
		badge?: {
			assetId: number
			initialIconAssetId: number
		}
		pass?: {
			assetId: number
			iconAssetId: number
		}
		product?: {
			assetId: number
		}
	}
}

function sort_mantle_output(output: RawMantleAssets) {
	const assets: SortedMantleAssets = {
		image: {},
		sound: {},
		badge: {},
		gamepass: {},
		product: {},
	}

	for (const [entry, value] of Object.entries(output)) {
		if (value.assetAlias) {
			let name = value.assetAlias.name
			if (name.includes("Images/")) {
				name = name.replace("Images/", "")
				assets.image[name] = `rbxgameasset://Images/${name}`
			} else if (name.includes("Audio/")) {
				name = name.replace("Audio/", "")
				assets.sound[name] = `rbxgameasset://Audio/${name}`
			}
		} else if (value.badge) {
			assets.badge[entry.replace("badge_", "")] = {
				id: value.badge.assetId,
				icon: `rbxassetid://${value.badge.initialIconAssetId}`,
			}
		} else if (value.pass) {
			assets.gamepass[entry.replace("pass_", "")] = {
				id: value.pass.assetId,
				icon: `rbxassetid://${value.pass.iconAssetId}`,
			}
		} else if (value.product) {
			const obj = output["productIcon_" + entry.replace("product_", "")]
			if (!obj) continue

			const icon_id = obj.productIcon.assetId
			assets.product[entry.replace("product_", "")] = {
				id: value.product.assetId,
				icon: `rbxassetid://${icon_id}`,
			}
		}
	}

	return assets
}

function stringify_data(data: any, typescript_mode: boolean) {
	const assignment_operator = typescript_mode ? ": " : " = "

	if (typeof data === "object") {
		let output_string = ""
		for (const [key, value] of Object.entries(data)) {
			output_string = output_string + `${key}${assignment_operator}${stringify_data(value, typescript_mode)}, `
		}
		return `\{${output_string}\}`
	} else if (typeof data === "string") {
		return `"${data}"`
	}

	return data as string
}

function write_sorted_assets(assets: SortedMantleAssets) {
	for (const [asset_group, asset_dump] of Object.entries(assets)) {
		let output_string = ""
		let output_string_ts = ""

		for (const [name, asset_data] of Object.entries(asset_dump)) {
			output_string = output_string + `	["${name}"] = ${stringify_data(asset_data, false)},\n`
			output_string_ts = output_string_ts + `	["${name}"]: ${stringify_data(asset_data, true)},\n`
		}

		const luau_result = `return \{\n${output_string}\}`
		const ts_result = `const ${asset_group}_ids = \{\n${output_string_ts}\} as const\nexport = ${asset_group}_ids\n`

		const luau_file_contents = `-- ` + asset_file_message + "\n" + luau_result
		const ts_file_contents = `// ` + asset_file_message + eslint_message + "\n" + ts_result

		writeFileSync(`${transformed_path}/${asset_group}-ids.luau`, luau_file_contents, {
			encoding: "utf-8",
		})

		if (output_typescript_types)
			writeFileSync(`${transformed_path}/${asset_group}-ids.ts`, ts_file_contents, { encoding: "utf-8" })
	}
}

try {
	const output_file = readFileSync(`places/${place}/mantle-output.json`, {
		encoding: "utf-8",
	})
	const sorted_assets = sort_mantle_output(JSON.parse(output_file))
	write_sorted_assets(sorted_assets)
	log_success(`Synced mantle assets.`)
} catch (err) {
	console.warn(err)
	log_error(`Failed to sync mantle-output.json for [${place}, ${branch}]. ${__filename}`)
}
