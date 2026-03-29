# Enonic CLI and XP Compatibility

## CLI Version Requirements

| CLI Feature | Minimum CLI Version | Notes |
|-------------|-------------------|-------|
| Sandbox templates | 3.0.0+ | `-t` flag for sandbox create |
| Service account keys (`--cred-file`) | 3.0.0+ | Requires XP 7.15+ |
| Sandbox copy | 3.0.0+ | `enonic sandbox copy` command |
| Dev mode | 2.0.0+ | `enonic dev` command |

## XP Distribution Compatibility

The Enonic CLI downloads and manages XP distributions automatically. Each sandbox is pinned to a specific XP distribution version.

| XP Version Range | Status | Java Requirement |
|-----------------|--------|-----------------|
| 7.16.x | Current stable | Java 17+ |
| 7.15.x | Supported | Java 17+ |
| 7.14.x | Supported | Java 17+ |
| 7.13.x | Supported | Java 17+ |
| 7.12.x | Legacy | Java 11+ |
| 7.7.x – 7.11.x | Legacy | Java 11+ |
| 7.0.x – 7.6.x | End of life | Java 11 |

## Authentication Methods

| Method | XP Version | Flag |
|--------|-----------|------|
| Basic auth (user:password) | All | `--auth` or `-a` |
| Service account key file | 7.15+ | `--cred-file` |
| Client certificate (mTLS) | 7.15+ | `--client-key` + `--client-cert` |

Starting from XP 7.15, `--auth` is deprecated in favor of `--cred-file`.

## Default Ports

| Port | Service | Notes |
|------|---------|-------|
| 8080 | XP HTTP | Main web interface and API |
| 4848 | Management API | Used by CLI for XP commands |
| 5005 | Debug | Enabled with `--debug` flag |

## Sandbox Home Directory

The CLI stores sandboxes under `$HOME/.enonic/` by default. Override with the `ENONIC_CLI_HOME_PATH` environment variable to use a custom location (e.g., `/tmp` creates `/tmp/.enonic/`).
