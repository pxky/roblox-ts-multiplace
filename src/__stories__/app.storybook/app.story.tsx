import { CreateVideStory } from "@rbxts/ui-labs"
import Vide from "@rbxts/vide"
import { App } from "client/app/app"

export = CreateVideStory({ name: "App", vide: Vide }, () => {
	// use_px()
	return <App />
})
