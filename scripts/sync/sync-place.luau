local fs = require "@lune/fs"
local net = require "@lune/net"
local process = require "@lune/process"
local roblox = require "@lune/roblox"
local serde = require "@lune/serde"
local stdio = require "@lune/stdio"

local function download_place_asset(placeId)
	local cookie = `.ROBLOSECURITY={serde.decode("toml", fs.readFile ".env")["ROBLOSECURITY"]}`
		or roblox.getAuthCookie()
	assert(cookie, "Failed to get auth cookie")

	local result = net.request {
		url = "https://assetdelivery.roblox.com/v1/asset/",
		headers = { Cookie = cookie },
		query = { id = tostring(placeId) },
	}

	assert(result.ok, result.body)
	return result.body
end

local function _find_mantle_experience_singleton(tables, target_id): { [string]: { [string]: { [string]: number } } }
	for _, entry in ipairs(tables) do
		if entry.id == target_id then
			return entry
		end
	end
	return {}
end

local place = process.args[1]

if not place then
	warn(`no args in sync-place.luau`)
	process.exit(1)
end

local mantle_state = serde.decode("yaml", fs.readFile(`places/{place}/.mantle-state.yml`))
local mantle_place_info = _find_mantle_experience_singleton(mantle_state.environments.dev, "experience_singleton")
local dev_place_id = mantle_place_info.outputs.experience.startPlaceId

local place_file = download_place_asset(dev_place_id)
local game = roblox.deserializePlace(place_file)

local ROJO_TREE = serde.decode("json", fs.readFile(`places/{place}/ship.project.json`)).tree
local SAVE_LIST = {} :: { [string]: string }

for service_name, service_data in ROJO_TREE do
	if service_name:sub(1, 1) == "$" then
		continue
	end
	for entry_name, entry_data in service_data do
		if entry_name ~= "$path" then
			continue
		elseif typeof(entry_data) ~= "string" then
			continue
		end

		if entry_data:sub(-5) == ".rbxm" then
			SAVE_LIST[service_name] = entry_data
		end
	end
end

for service_name, output_name in pairs(SAVE_LIST) do
	local service = game:GetService(service_name)
	if not service then
		continue
	end

	if ROJO_TREE[service_name] then
		for key, _ in ROJO_TREE[service_name] do
			if key:sub(1, 1) == "$" then
				continue
			end
			local inst = service:FindFirstChild(key)
			if inst then
				inst:Destroy()
			end
		end
	end

	fs.writeFile(`places/{place}/{output_name}`, roblox.serializeModel { service })
end

stdio.write(stdio.color "green")
print "[🌌]: Synced place services."
