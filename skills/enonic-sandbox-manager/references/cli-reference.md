# Enonic CLI Command Reference

Source: https://developer.enonic.com/docs/enonic-cli/stable

## Installation

| OS | Method | Command |
|----|--------|---------|
| Any | npm | `npm install -g @enonic/cli` |
| macOS | Homebrew | `brew tap enonic/cli && brew install --no-quarantine enonic` |
| Linux | wget | `wget -qO- https://repo.enonic.com/public/com/enonic/cli/installer/cli-linux/1.0.0/cli-linux-1.0.0.sh \| sh` |
| Linux | Snap | `sudo snap install enonic` |
| Windows | Scoop | `scoop bucket add enonic https://github.com/enonic/cli-scoop.git && scoop install enonic` |

Upgrade: `enonic upgrade`
Check latest: `enonic latest`
Uninstall: `enonic uninstall`

## Sandbox Commands

Sandboxes are isolated local XP instances, each linked to a specific XP distribution version with its own home folder.

### enonic sandbox create

```
enonic sandbox create [name] [-v <version>] [-t <template>] [--skip-template] [-a] [--prod] [--skip-start] [-f]
```

| Flag | Description |
|------|-------------|
| `name` | Sandbox name |
| `-t, --template` | Use specific template (e.g., "Headless Demo") |
| `--skip-template` | Skip template selection (no apps pre-installed) |
| `-v, --version` | Specific XP distro version (e.g., `7.14.0`) |
| `-a, --all` | Include pre-release versions in version list |
| `--prod` | Run XP in non-development (production) mode |
| `--skip-start` | Do not start sandbox after creation |
| `-f, --force` | Non-interactive mode, accept defaults |

Examples:
- `enonic sandbox create myBox -f` — latest stable version
- `enonic sandbox create myBox -v 7.14.0` — specific version
- `enonic sandbox create myBox -t "Headless Demo" -f` — with template
- `enonic sandbox create myBox --skip-template -f` — no apps

### enonic sandbox ls

```
enonic sandbox ls
```

Lists all sandboxes. Asterisk (`*`) marks the currently running sandbox.

### enonic sandbox start

```
enonic sandbox start [name] [--prod] [--debug] [-d] [--http.port <port>] [-f]
```

| Flag | Description |
|------|-------------|
| `name` | Sandbox name |
| `--prod` | Run in non-development (production) mode |
| `--debug` | Enable debug on port 5005 |
| `-d, --detach` | Run as background process |
| `--http.port` | HTTP port for availability check (default: 8080) |
| `-f, --force` | Non-interactive mode |

Default mode is **development**. Use `--prod` for production mode.

### enonic sandbox stop

```
enonic sandbox stop
```

Stops the currently running sandbox (only works for sandboxes started via CLI).

### enonic sandbox upgrade

```
enonic sandbox upgrade [name] [-v <version>] [-a] [-f]
```

Upgrades the XP distribution for a sandbox. Downgrades are not permitted.

### enonic sandbox delete

```
enonic sandbox delete [name] [-f]
```

Deletes a sandbox and all its data permanently.

### enonic sandbox copy

```
enonic sandbox copy [source] [target] [-f]
```

Copies a sandbox with all content to a new sandbox.

## Create Command (Simplified Project Creation)

```
enonic create [project-name] [-r <starter>] [-s <sandbox>] [--prod] [--skip-start] [-f]
```

| Flag | Description |
|------|-------------|
| `project-name` | Project name (also used as folder name) |
| `-r, --repo, --repository` | Starter repository: `<enonic-repo>`, `<org>/<repo>`, or full URL |
| `-s, --sandbox` | Existing sandbox name to link |
| `--prod` | Run XP in non-development (production) mode |
| `--skip-start` | Do not start sandbox after creation |
| `-f, --force` | Non-interactive mode |

Default `destination` and `version` will equal the project name and `1.0.0-SNAPSHOT` respectively.

Examples:
- `enonic create foo` — interactive wizard
- `enonic create foo -f -r starter-vanilla -s Sandbox1` — fully automated

## Project Commands

All project commands must be run from the project root folder.

### enonic project create

```
enonic project create [name] [-n <name>] [-r <starter>] [-b <branch>] [-c <commit>] [-d <dest>] [-v <version>] [-s <sandbox>] [--prod] [--skip-start] [-f]
```

Full project creation wizard with all options.

### enonic project sandbox

```
enonic project sandbox [name] [-f]
```

Change the sandbox linked to the current project.

### enonic project build

```
enonic project build [-f]
```

Compile code, run tests, create artifacts via Gradle.

### enonic project clean

```
enonic project clean [-f]
```

Alias for `gradlew clean`.

### enonic project test

```
enonic project test [-f]
```

Alias for `gradlew test`.

### enonic project deploy

```
enonic project deploy [sandbox-name] [--prod] [--debug] [-c] [--skip-start] [-f]
```

| Flag | Description |
|------|-------------|
| `sandbox-name` | Override the linked sandbox for this deployment |
| `--prod` | Run XP in production mode |
| `--debug` | Enable debug on port 5005 |
| `-c, --continuous` | Watch changes and redeploy continuously |
| `--skip-start` | Do not start sandbox |
| `-f, --force` | Non-interactive mode |

### enonic project install

```
enonic project install [-a <auth>] [--cred-file <path>] [--client-key <path>] [--client-cert <path>] [-f]
```

Build and install to a running XP instance via management API.

### enonic project shell

```
enonic project shell
```

Open a new shell with project `JAVA_HOME` and `XP_HOME` set. Use `quit` to exit.

### enonic project gradle

```
enonic project gradle [tasks/flags ...]
```

Run arbitrary Gradle tasks. All text after `gradle` is forwarded to `gradlew`.

### enonic project dev / enonic dev

```
enonic dev
```

Start the project in dev mode with hot-reload:
1. Starts the linked sandbox in detached dev mode.
2. Deploys the app once and watches for source changes.

Terminate with `Ctrl-C` (also stops the detached sandbox).

**Requirement:** The project must have a Gradle `dev` task (included in all official starters).

To see XP logs during dev mode, start the sandbox separately first:
```
# Terminal 1
enonic sandbox start
# Terminal 2
enonic dev
```

### enonic project env

```
eval $(enonic project env)
```

Export `JAVA_HOME` and `XP_HOME` to the current shell. Not available on Windows.

## XP Instance Commands

These commands require access to the XP management API (default: `localhost:4848`).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ENONIC_CLI_REMOTE_URL` | XP management URL (default: `localhost:4848`) |
| `ENONIC_CLI_REMOTE_USER` | Authentication username |
| `ENONIC_CLI_REMOTE_PASS` | Authentication password |
| `ENONIC_CLI_HTTP_PROXY` | Proxy server URL |
| `ENONIC_CLI_HOME_PATH` | Override CLI home directory |
| `ENONIC_CLI_CRED_FILE` | Service account key file path (XP 7.15+) |
| `ENONIC_CLI_CLIENT_KEY` | Private key file for client certificate (mTLS) authentication |
| `ENONIC_CLI_CLIENT_CERT` | Client certificate file for mTLS authentication |

### App Commands

```
enonic app install [--url <url>] [--file <path>] [--cred-file <path>] [--client-key <path>] [--client-cert <path>] [-f]
enonic app start <app-key> [--cred-file <path>] [--client-key <path>] [--client-cert <path>] [-f]
enonic app stop <app-key> [--cred-file <path>] [--client-key <path>] [--client-cert <path>] [-f]
```

### System Info

```
enonic system info
```

Shows version, installation name, run mode, and build details of the running XP instance.

## Common Starters

| Starter | Repository | Description |
|---------|------------|-------------|
| Vanilla | `starter-vanilla` | Minimal XP app starter |
| Headless | `starter-headless` | Headless CMS with Guillotine API |
| Next.js | `starter-nextjs` | Next.js frontend with XP backend |

Full list: https://market.enonic.com/starters
