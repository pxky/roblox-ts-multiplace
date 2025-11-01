import { get_args, package_manager } from "../util/constants"
import { run_command } from "../util/run"

const [place, branch] = get_args()

run_command(`${package_manager} build ${place} ${branch}`)
run_command(`mantle deploy places/${place} --environment ${branch}`)
