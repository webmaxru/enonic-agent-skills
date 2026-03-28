# Enonic CLI Troubleshooting Guide

## Sandbox Won't Start

### Port 8080 Already in Use

**Symptom:** Sandbox start fails or hangs with a port conflict error.

**Resolution:**
1. Identify the process occupying port 8080:
   - Linux/macOS: `lsof -i :8080`
   - Windows: `netstat -ano | findstr :8080`
2. Stop the conflicting process, or use `--http.port <port>` to start the sandbox on a different port.
3. Use `enonic sandbox stop` to stop any previously running sandbox.

### Another Sandbox Already Running

**Symptom:** Error indicating only one sandbox can run at a time.

**Resolution:**
1. Run `enonic sandbox stop` to stop the current sandbox.
2. Run `enonic sandbox ls` to verify no sandbox is marked with `*`.
3. Start the desired sandbox: `enonic sandbox start <name>`

### Java Version Mismatch

**Symptom:** Sandbox fails to start with Java-related errors.

**Resolution:**
1. Check the XP version's Java requirement in the compatibility reference.
2. Verify the system Java version: `java -version`
3. XP 7.12+ requires Java 17+. XP 7.7–7.11 requires Java 11+.
4. Install the correct Java version, or use `enonic project shell` to use the sandbox's bundled Java.

## Project Creation Fails

### Starter Not Found

**Symptom:** Error when specifying `-r <starter>` during project creation.

**Resolution:**
1. Verify the starter name. Common starters: `starter-vanilla`, `starter-headless`, `starter-nextjs`.
2. For full URLs, use: `-r https://github.com/<org>/<repo>.git`
3. Check available starters: https://market.enonic.com/starters

### Gradle Build Fails

**Symptom:** `enonic project build` or `enonic dev` fails with Gradle errors.

**Resolution:**
1. Ensure the project has `gradlew` (Linux/macOS) or `gradlew.bat` (Windows) in the root.
2. Check `gradle.properties` for correct `xpVersion` matching the linked sandbox.
3. Run `enonic project clean` then `enonic project build` to retry.
4. Verify network access to Maven repositories for dependency downloads.

## Dev Mode Issues

### enonic dev Fails Immediately

**Symptom:** `enonic dev` exits with an error about missing `dev` task.

**Resolution:**
1. Confirm the project was created from an official Enonic starter (they include the `dev` Gradle task).
2. For custom projects, add a `dev` Gradle task that runs the app in watch mode.
3. Check `build.gradle` for the `com.enonic.xp.app` plugin.

### Changes Not Reflected in Dev Mode

**Symptom:** Source changes are not picked up during `enonic dev`.

**Resolution:**
1. Verify `enonic dev` is running (check terminal output).
2. For client-side changes, ensure the build tool (webpack, etc.) is configured for watch mode in the `dev` task.
3. Restart dev mode: `Ctrl-C` then `enonic dev`.

## Deployment Issues

### Cannot Connect to XP Instance

**Symptom:** `enonic project install` or `enonic app install` fails to connect.

**Resolution:**
1. Verify XP is running: `enonic system info`
2. Check management API URL (default: `localhost:4848`). Override with `ENONIC_CLI_REMOTE_URL`.
3. Verify authentication credentials are set via environment variables or `--cred-file`.
4. Check firewall rules for ports 4848 and 8080.

### App Install Fails

**Symptom:** `enonic app install` returns an error.

**Resolution:**
1. For file install: verify the `.jar` file path and that the file exists.
2. For URL install: verify the URL is accessible and points to a valid `.jar`.
3. Check XP version compatibility — some apps require specific XP versions.

## macOS Quarantine Warning

**Symptom:** macOS shows "cannot verify the developer" warning when running `enonic`.

**Resolution:**
1. Click "Done" (not "Move to Bin").
2. Run: `xattr -d com.apple.quarantine $(which enonic)`
3. Or go to System Settings → Privacy & Security → "Allow Anyway".
