// One file map for development delivery, static output, and distribution checks.
export const agentDocuments = {
  "/llms.txt": "llms.txt",
  "/agents.md": "docs/agents.md",
  "/DESIGN.md": "DESIGN.md",
  "/skills/using-sensible-ui/SKILL.md": "skills/using-sensible-ui/SKILL.md",
  "/skills/using-sensible-ui/references/usage.md":
    "skills/using-sensible-ui/references/usage.md",
  "/skills/using-sensible-ui/references/components.md":
    "skills/using-sensible-ui/references/components.md",
  "/skills/using-sensible-ui/references/design.md":
    "skills/using-sensible-ui/references/design.md",
} as const;
