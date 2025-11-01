import { get_args, package_manager } from "../util/constants"
import { run_command } from "../util/run"

const [place, branch] = get_args()

run_command(`${package_manager} output ${place} ${branch}`)
run_command(`rbxtsc --project places/${place} --rojo places/${place}/ship.project.json`)
run_command(`rojo build places/${place}/ship.project.json --output places/${place}/build/${branch}.rbxl`)
