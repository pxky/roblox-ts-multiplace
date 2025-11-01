import Vide, { mount } from "@rbxts/vide"
import { Players } from "@rbxts/services"
import { App } from "./app"

mount(() => <App />, Players.LocalPlayer.WaitForChild("PlayerGui"))
