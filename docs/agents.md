# Use Sensible UI with an agent

Sensible UI ships a portable `using-sensible-ui` skill with usage, component, and design references. It teaches your agent to use the library's actual HTML API and preserve your theme variables, fonts, and brand choices. It does not replace your project's DESIGN.md.

**No separate skill installation is needed.** Copy the prompt on the [homepage](https://sensibleui.com/#use-with-agent) into your agent, then describe what you want to build. For an installed package, you can point your agent directly to its bundled guidance below.

## Use the installed package's guidance

Paste this instruction into your agent. To reuse it in future tasks, save it in the project configuration your agent reads, such as AGENTS.md or CLAUDE.md:

```text
When using Sensible UI, read node_modules/@faith-tools/sensible-ui/skills/using-sensible-ui/SKILL.md and its referenced files. Preserve our existing theme overrides and DESIGN.md.
```

The agent reads the skill and references directly from your dependency, so the guidance tracks that installed version without copying or registering it elsewhere. It is not native skill registration: installing an npm dependency alone does **not** automatically register its skill with your agent. The prompt or saved instruction supplies the pointer. Yarn PnP and other layouts without `node_modules` need the package manager's resolved location instead.

## CDN and web-only projects

Give your agent [llms.txt](https://sensibleui.com/llms.txt) as an entry point, or point it directly to the [skill](https://sensibleui.com/skills/using-sensible-ui/SKILL.md). These website documents describe the current release. `llms.txt` is a navigation convention, not a guarantee that every agent discovers or loads it automatically.

For a pinned CDN version, read that version's documents at `https://cdn.jsdelivr.net/npm/@faith-tools/sensible-ui@VERSION/skills/using-sensible-ui/SKILL.md`, replacing `VERSION` with your version. Older releases before skill distribution do not contain that file; use their README/source rather than assuming newer APIs exist.

## Optional: register for native skill discovery

Use this only if you want your agent to list and select Sensible UI as an installed skill rather than following the direct pointer above. From your project, install the bundled directory with the skills CLI and select your agent:

```sh
npx skills add ./node_modules/@faith-tools/sensible-ui/skills/using-sensible-ui
```

For example, select Amp explicitly with:

```sh
npx skills add ./node_modules/@faith-tools/sensible-ui/skills/using-sensible-ui --agent amp
```

Amp and Codex support project skills in `.agents/skills/`; Claude Code uses `.claude/skills/`. An installer targets the appropriate directory. Confirm that it installs the whole skill directory, including `references/`, not just SKILL.md. A separately installed copy can become stale: reinstall it after updating Sensible UI. Restart or reload your agent's skills if required, and confirm the skill appears in its available skills before relying on activation.

For projects without the npm dependency, you can optionally install the repository skill:

```sh
npx skills add cameronapak/sensible-ui --skill using-sensible-ui
```

This uses the repository's current guidance, not necessarily your pinned package release. Prefer the bundled skill when available. A skill's matching description helps supported agents select it, but you can explicitly ask the agent to use `using-sensible-ui` if it does not activate.

The skills CLI also documents an experimental npm-linking workflow:

```sh
npx skills experimental_sync --include '@faith-tools/sensible-ui'
```

Review the proposed changes and choose your agent. This can link packaged skills into discovery directories so their contents track dependency updates; copied files require another sync. The command remains experimental. It is optional, and Sensible UI does not run it or edit your agent configuration during dependency installation. See the [skills CLI reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) for current options.

## What the documents cover

- [Usage](https://sensibleui.com/skills/using-sensible-ui/references/usage.md): global, scoped, and standalone imports; portal boundaries; optional scripts.
- [Components](https://sensibleui.com/skills/using-sensible-ui/references/components.md): examples shared with the gallery and exact imports.
- [DESIGN.md](https://sensibleui.com/DESIGN.md): token roles and customization. Default values are not mandatory; shared shadcn variable names do not imply complete interchangeability.

The skill needs no new service, runtime, MCP connection, or agent-specific hooks. Your agent remains responsible for checking the consuming app's rendering, accessibility, and behavior.
