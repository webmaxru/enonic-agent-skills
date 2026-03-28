#!/usr/bin/env node

/**
 * find-enonic-targets.mjs
 *
 * Scans a workspace directory for Enonic XP project markers and existing
 * content operation files. Outputs a JSON summary to stdout.
 *
 * Usage: node find-enonic-targets.mjs [directory]
 *
 * Exit codes:
 *   0 - Enonic XP project detected
 *   1 - No Enonic XP project markers found
 *   2 - Invalid arguments or directory not found
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const MAX_DEPTH = 5;
const ENONIC_MARKERS = [
  'build.gradle',
  'gradle.properties',
  'src/main/resources'
];
const CONTENT_PATTERNS = [
  /from\s+['"]\/lib\/xp\/content['"]/,
  /require\(['"]\/lib\/xp\/content['"]\)/,
  /from\s+['"]\/lib\/xp\/node['"]/,
  /require\(['"]\/lib\/xp\/node['"]\)/,
  /from\s+['"]\/lib\/xp\/task['"]/,
  /contentLib\.(query|create|modify|delete|publish|move)/,
  /repo\.(query|create|modify|delete|push|diff)/
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function detectXpVersion(dir) {
  const gradleProps = join(dir, 'gradle.properties');
  try {
    const content = await readFile(gradleProps, 'utf-8');
    const match = content.match(/xpVersion\s*=\s*([\d.]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function detectAppName(dir) {
  const gradleFile = join(dir, 'build.gradle');
  try {
    const content = await readFile(gradleFile, 'utf-8');
    const match = content.match(/app\s*\{\s*name\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function findContentFiles(dir, depth = 0) {
  if (depth > MAX_DEPTH) return [];
  const results = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.name === 'node_modules' || entry.name === '.gradle' || entry.name === 'build') {
        continue;
      }

      if (entry.isDirectory()) {
        const sub = await findContentFiles(fullPath, depth + 1);
        results.push(...sub);
      } else if (entry.isFile() && /\.(js|ts|mjs)$/.test(entry.name)) {
        try {
          const content = await readFile(fullPath, 'utf-8');
          const matches = CONTENT_PATTERNS.filter(p => p.test(content));
          if (matches.length > 0) {
            results.push(fullPath);
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  } catch {
    // Skip unreadable directories
  }

  return results;
}

async function main() {
  const targetDir = resolve(process.argv[2] || '.');

  if (!(await exists(targetDir))) {
    process.stderr.write(`ERROR: Directory not found: ${targetDir}\n`);
    process.exit(2);
  }

  // Check for Enonic XP markers
  const markerResults = {};
  let isEnonicProject = false;

  for (const marker of ENONIC_MARKERS) {
    const markerPath = join(targetDir, marker);
    const found = await exists(markerPath);
    markerResults[marker] = found;
    if (found) isEnonicProject = true;
  }

  if (!isEnonicProject) {
    process.stderr.write('No Enonic XP project markers found.\n');
    process.exit(1);
  }

  const xpVersion = await detectXpVersion(targetDir);
  const appName = await detectAppName(targetDir);
  const contentFiles = await findContentFiles(targetDir);

  const report = {
    isEnonicProject: true,
    projectDir: targetDir,
    xpVersion: xpVersion || 'unknown',
    appName: appName || 'unknown',
    markers: markerResults,
    contentOperationFiles: contentFiles.map(f => f.replace(targetDir, '.').replace(/\\/g, '/')),
    contentFileCount: contentFiles.length
  };

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(0);
}

main();
