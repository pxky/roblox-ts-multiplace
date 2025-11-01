import { version } from "."

type Changelog = {
	[version]: string
} & Record<string, string>

export = {
	"0.0.0": "init",
} satisfies Changelog
