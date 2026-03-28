#!/usr/bin/env node
/**
 * find-enonic-targets.mjs
 *
 * Scans the current workspace for Enonic XP project markers.
 * Outputs JSON with detected project info to stdout.
 * Exits 0 with results or 0 with empty array if nothing found.
 * Prints errors to stderr.
 *
 * Usage: node scripts/find-enonic-targets.mjs [root-path]
 *        Defaults to current working directory.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const rootPath = resolve(process.argv[2] || process.cwd());

async function fileExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

async function dirExists(dirPath) {
  try {
    const s = await stat(dirPath);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function readTextFile(filePath) {
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function scanProject(dir) {
  const result = { path: dir, markers: [] };

  // Check for .enonic directory
  if (await dirExists(join(dir, ".enonic"))) {
    result.markers.push(".enonic directory");

    // Try to read sandbox config
    const sandboxFile = join(dir, ".enonic", "sandbox.cfg");
    const sandboxContent = await readTextFile(sandboxFile);
    if (sandboxContent) {
      const match = sandboxContent.match(/sandbox\s*=\s*(.+)/);
      if (match) {
        result.linkedSandbox = match[1].trim();
      }
    }
  }

  // Check build.gradle for XP plugin
  const gradleFile = join(dir, "build.gradle");
  const gradleContent = await readTextFile(gradleFile);
  if (gradleContent) {
    if (gradleContent.includes("com.enonic.xp")) {
      result.markers.push("build.gradle with com.enonic.xp plugin");

      // Extract app name
      const appNameMatch = gradleContent.match(/app\s*\{\s*name\s*=\s*['"]([^'"]+)['"]/s);
      if (appNameMatch) {
        result.appName = appNameMatch[1];
      }
    }
  }

  // Check gradle.properties for xpVersion
  const propsFile = join(dir, "gradle.properties");
  const propsContent = await readTextFile(propsFile);
  if (propsContent) {
    const versionMatch = propsContent.match(/xpVersion\s*=\s*(.+)/);
    if (versionMatch) {
      result.xpVersion = versionMatch[1].trim();
      result.markers.push(`gradle.properties with xpVersion=${result.xpVersion}`);
    }

    const appNameMatch = propsContent.match(/appName\s*=\s*(.+)/);
    if (appNameMatch) {
      result.appName = appNameMatch[1].trim();
    }
  }

  return result.markers.length > 0 ? result : null;
}

async function scan(dir, depth = 0) {
  const results = [];

  // Check current directory
  const project = await scanProject(dir);
  if (project) {
    results.push(project);
  }

  // Only scan one level of subdirectories
  if (depth < 2) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          entry.name !== "node_modules" &&
          entry.name !== "build" &&
          entry.name !== ".gradle"
        ) {
          const subResults = await scan(join(dir, entry.name), depth + 1);
          results.push(...subResults);
        }
      }
    } catch (err) {
      process.stderr.write(`Warning: Cannot read directory ${dir}: ${err.message}\n`);
    }
  }

  return results;
}

try {
  const results = await scan(rootPath);
  process.stdout.write(JSON.stringify(results, null, 2) + "\n");
  if (results.length === 0) {
    process.stderr.write("No Enonic XP project markers found in workspace.\n");
  } else {
    process.stderr.write(`Found ${results.length} Enonic project(s).\n`);
  }
} catch (err) {
  process.stderr.write(`ERROR: ${err.message}\n`);
  process.exit(1);
}
