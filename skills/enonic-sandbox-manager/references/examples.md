# Common Enonic CLI Workflow Examples

## Workflow 1: First-Time Setup (Greenfield)

```bash
# 1. Install CLI
npm install -g @enonic/cli

# 2. Create a sandbox with latest XP
enonic sandbox create dev-sandbox -f

# 3. Create a project from vanilla starter linked to the sandbox
enonic create my-app -r starter-vanilla -s dev-sandbox -f

# 4. Enter project folder and start dev mode
cd my-app
enonic dev
```

## Workflow 2: Create Sandbox with Specific Version

```bash
# Create sandbox with XP 7.14.0 and no template
enonic sandbox create staging-box -v 7.14.0 --skip-template -f

# Verify it was created
enonic sandbox ls
```

## Workflow 3: Switch Project Sandbox

```bash
# Inside project directory
enonic project sandbox staging-box
```

## Workflow 4: Build and Deploy to Sandbox

```bash
# One-time deploy
enonic project deploy

# Continuous deploy (watch mode)
enonic project deploy -c

# Deploy to a named sandbox (override linked sandbox)
enonic project deploy staging-box -c
```

## Workflow 5: Dev Mode with Visible XP Logs

```bash
# Terminal 1: Start sandbox with visible logs
enonic sandbox start dev-sandbox

# Terminal 2: Start dev mode (sandbox already running)
enonic dev
```

## Workflow 6: Install App to Remote XP Instance

```bash
# Set environment variables
export ENONIC_CLI_REMOTE_URL=https://xp.example.com:4848
export ENONIC_CLI_CRED_FILE=/path/to/cred-file.json

# Install from file
enonic app install --file build/libs/myapp-1.0.0.jar

# Or install from URL
enonic app install --url https://repo.enonic.com/public/com/enonic/app/superhero/2.0.5/superhero-2.0.5.jar
```

## Workflow 7: Upgrade Sandbox XP Version

```bash
# List current sandboxes to see versions
enonic sandbox ls

# Upgrade to a specific version
enonic sandbox upgrade dev-sandbox -v 7.14.0
```

## Workflow 8: Copy Sandbox for Testing

```bash
# Make a copy before risky operations
enonic sandbox copy dev-sandbox test-sandbox

# Delete the test sandbox when done
enonic sandbox delete test-sandbox -f
```

## Workflow 9: Full Build and Test Pipeline (Local)

```bash
# Clean, build, and test
enonic project clean
enonic project build
enonic project test

# Deploy to sandbox
enonic project deploy
```

## Workflow 10: Headless CMS Project Setup

```bash
# Create sandbox
enonic sandbox create headless-box -f

# Scaffold headless project
enonic create my-headless-app -r starter-headless -s headless-box -f

# Start dev mode
cd my-headless-app
enonic dev
```
