# Own the harness; don't fork upstream

**Stance:** Extract the *logic* of the upstream skills and re-author it under our own names and
structure, dropping what we don't want and adding what we do. Not a fork, not a consume-as-is
install.

**Why:** The Matt Pocock installer model is built for consuming as-is — re-running setup clobbers
edits (hash-tracked) and there's no home for cross-skill wiring or own hooks/agents. We already
diverge (slugged stances replace numbered ADRs; caveman re-authored to the lite ruleset, not
forked). Owning makes divergence legitimate and gives
one place to extend + interconnect. Cost — losing free upstream improvements — is mitigated by
`docs/integrations/<src>.md` recording source URLs + pinned hashes for future cherry-picking.

**Rejected:** Forking caveman/karpathy wholesale — caused dragging in compression skills / MCP /
multi-level filtering we don't want; we re-author only the pieces we keep.
