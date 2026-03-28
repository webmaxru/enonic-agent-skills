#!/usr/bin/env bash
# Enonic XP Local Sandbox Setup Script
# Creates a sandbox, scaffolds a project, and starts dev mode.
#
# Usage:
#   chmod +x sandbox-setup.template.sh
#   ./sandbox-setup.template.sh [project-name] [starter] [xp-version]
#
# Defaults:
#   project-name: my-enonic-app
#   starter:      starter-vanilla
#   xp-version:   (latest stable)

set -euo pipefail

PROJECT_NAME="${1:-my-enonic-app}"
STARTER="${2:-starter-vanilla}"
XP_VERSION="${3:-}"

echo "=== Enonic XP Local Setup ==="
echo "Project:  $PROJECT_NAME"
echo "Starter:  $STARTER"
echo "Version:  ${XP_VERSION:-latest}"
echo ""

# Check CLI availability
if ! command -v enonic &> /dev/null; then
  echo "ERROR: Enonic CLI not found. Install it first:" >&2
  echo "  npm install -g @enonic/cli" >&2
  exit 1
fi

SANDBOX_NAME="${PROJECT_NAME}-sandbox"

# Create sandbox
echo ">>> Creating sandbox: $SANDBOX_NAME"
if [ -n "$XP_VERSION" ]; then
  enonic sandbox create "$SANDBOX_NAME" -v "$XP_VERSION" --skip-template -f
else
  enonic sandbox create "$SANDBOX_NAME" --skip-template -f
fi

# Create project
echo ">>> Creating project: $PROJECT_NAME"
enonic create "$PROJECT_NAME" -r "$STARTER" -s "$SANDBOX_NAME" --skip-start -f

echo ""
echo "=== Setup Complete ==="
echo "To start developing:"
echo "  cd $PROJECT_NAME"
echo "  enonic dev"
