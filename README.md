# 1-src-multi-place-template

A [fully-manged](https://rojo.space/docs/v7/workflows/#development-places) [roblox-ts](https://roblox-ts.com) game template with instance handling.

> [!CAUTION]
> You should only use this template if you know what you're doing!

### Setup

This template deploys empty `dev` & `prod` places when initialized.

1. Edit `mantle.yml` & `asphalt.toml` to specify where to be deploy.
2. Create a `.env` file & enter in `MANTLE_OPEN_CLOUD_API_KEY` & `ASPHALT_API_KEY`.  
   (Mantle key should have no places yet.)
3. Run `pnpm initialize game1 dev`.
4. Edit mantle api key & give both generated places `write` permissions under `universes-places`.
5. Run `pnpm initialize game1 dev` again. This should successfully deploy an empty place.

### Workflow

Running `pnpm open` will open the `dev` place where the source of truth for all instances lies.  
Commands are all called with the place as the first argument & either `dev` or `prod` as the 2nd argument.  
(eg: `pnpm build game1 dev`)
