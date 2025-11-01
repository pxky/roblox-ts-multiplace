local fs = require "@lune/fs"
local process = require "@lune/process"
local roblox = require "@lune/roblox"
local stdio = require "@lune/stdio"

local place = process.args[1]

if not place then
	warn(`no args in sync-place.luau`)
	process.exit(1)
end

local place_file_path = `places/{place}/build/dev.rbxl`
local out_path = "src/services.d.ts"

local SERVICE_BLACKLIST = {}

local success, game_file = pcall(function()
	return fs.readFile(place_file_path)
end)

if success then
	local game = roblox.deserializePlace(game_file)

	local output = ""
	local indent = ""

	local function push_indent()
		indent = indent .. "\t"
	end

	local function pop_indent()
		indent = string.sub(indent, 2)
	end

	local function write_line(str: string)
		if str == "" then
			output = output .. "\n"
		else
			output = output .. indent .. str .. "\n"
		end
	end

	local function write_service(service)
		local service_children = service:GetChildren()

		if next(service_children) == nil then
			return
		end

		write_line("interface " .. (service :: Instance).ClassName .. " {")
		push_indent()

		local function search(instance)
			local name = instance.Name
			if name == "node_modules" then
				return
			end
			local prefix = ""
			if name == "Terrain" and instance.Parent == game:FindFirstChild "Workspace" then
				prefix = "readonly "
			end
			if not string.match(name, "^[_a-zA-Z][_a-zA-Z0-9]*$") then
				name = '"' .. name .. '"'
			end
			local definition = prefix .. name .. ": " .. instance.ClassName
			local children = instance:GetChildren()
			if next(children) == nil then
				write_line(definition .. ";")
			else
				write_line(definition .. " & {")
				push_indent()
				local seen = {}
				for _, child in ipairs(children) do
					if not seen[child.Name] then
						seen[child.Name] = true
						search(child)
					end
				end
				pop_indent()
				write_line "};"
			end
		end

		for _, child in ipairs(service_children) do
			search(child)
		end

		pop_indent()
		write_line "}"
		write_line ""
	end

	for _, service in ipairs(game:GetChildren()) do
		if not SERVICE_BLACKLIST[service.Name] then
			write_service(service)
		end
	end

	fs.writeFile(out_path, string.match(output, "^(.-)%s*$") :: string .. "\n")

	stdio.write(stdio.color "green")
	print "[🌌]: Synced services.d.ts."
else
	stdio.write(stdio.color "red")
	print "no build to extract types from. skipping type syncing."
end
