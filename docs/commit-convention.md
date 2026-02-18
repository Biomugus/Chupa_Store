# Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by **commitlint** + **husky**.

---

## How to commit

### Recommended: interactive wizard

```bash
npm run commit
```

This runs **Commitizen** — it asks you questions step by step and builds a valid commit message automatically.

### Manual commit

```bash
git commit -m "type(scope): short description"
```

---

## Format

```
type(scope): subject

[optional body]

[optional footer]
```

### Rules
| Rule | Value |
|------|-------|
| Header max length | **72 characters** |
| Subject case | **lower-case** |
| Subject ending | **no period `.`** |
| Type case | **lower-case** |

---

## Allowed types

| Type | When to use |
|------|-------------|
| `feat` | New feature for the user |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration |
| `chore` | Misc tasks (configs, scripts) |
| `revert` | Revert a previous commit |

---

## Examples

```bash
# Good
feat(auth): add google oauth login
fix(cart): prevent duplicate items on add
refactor(ui): centralize button styles with css variables
docs: update readme with setup instructions
chore: upgrade eslint to v9

# Bad — header too long (> 72 chars)
refactor: Centralize button styles and implement CSS variables for a consistent design system.

# Bad — uppercase subject
feat(auth): Add Google OAuth Login

# Bad — period at the end
fix(cart): prevent duplicate items.
```

---

## How it works under the hood

1. **`npm run commit`** → runs `git add -A && cz` (Commitizen wizard)
2. You answer the prompts → Commitizen builds the message
3. **`commit-msg` hook** → runs `commitlint` to validate the message
4. If validation fails → commit is rejected with a clear error

Config files:
- `commitlint.config.js` — validation rules
- `.husky/commit-msg` — git hook that triggers commitlint
