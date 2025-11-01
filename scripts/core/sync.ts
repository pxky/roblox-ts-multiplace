import { get_args } from "../util/get-args"
import { run_command } from "../util/run"

const [place, branch] = get_args()

run_command(`npx tsx scripts/sync/sync-mantle.ts ${place} ${branch}`)
run_command(`lune run scripts/sync/sync-place.luau ${place} ${branch}`)
run_command(`lune run scripts/sync/sync-types.luau ${place} ${branch}`)
run_command(`npx tsx scripts/sync/sync-constants.ts ${place} ${branch}`)
