import { get_args, package_manager } from "../util/constants"
import { run_command } from "../util/run"

const [place, branch] = get_args()

run_command(`mantle outputs places/${place} --environment ${branch} --output places/${place}/mantle-output.json`)
run_command(`${package_manager} sync ${place} ${branch}`)
