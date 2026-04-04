/**
 * HTTP Service Endpoint Template for Enonic XP
 *
 * Place this file at:
 *   src/main/resources/services/<serviceName>/<serviceName>.ts
 *
 * The service will be accessible at:
 *   /_/service/<appKey>/<serviceName>
 *
 * Note: This template uses TypeScript/ESM syntax. For .js targets, convert
 * `import X from 'Y'` to `var X = require('Y')` and `export function` to
 * `exports.xxx = function`.
 *
 * Customize:
 *   - Authentication logic (API key, HMAC, Bearer token)
 *   - Payload validation
 *   - Processing logic
 */

// Uncomment if content manipulation is needed:
// import contentLib from '/lib/xp/content';
// import contextLib from '/lib/xp/context';

// IMPORTANT: webhook.apiKey MUST be set in app.config for production use.
// Do not write actual secret values in source code — configure via XP_HOME/config/<appKey>.cfg.
const EXPECTED_API_KEY = app.config['webhook.apiKey'] || '';

// Maximum accepted payload size in bytes (reject oversized requests early)
const MAX_PAYLOAD_BYTES = 1048576; // 1 MB

/**
 * Handle incoming POST requests (webhook payloads).
 */
export function post(req) {
  // --- Authentication (required — reject if not configured) ---
  if (!EXPECTED_API_KEY) {
    log.error('webhook.apiKey is not configured — rejecting request');
    return {
      status: 500,
      body: JSON.stringify({ error: 'Server misconfigured' }),
      contentType: 'application/json'
    };
  }
  const apiKey = req.headers['X-Api-Key'] || req.headers['x-api-key'] || '';
  if (apiKey !== EXPECTED_API_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      contentType: 'application/json'
    };
  }

  // --- Payload size check ---
  if (req.body && req.body.length > MAX_PAYLOAD_BYTES) {
    return {
      status: 413,
      body: JSON.stringify({ error: 'Payload too large' }),
      contentType: 'application/json'
    };
  }

  // --- Parse payload ---
  let payload;
  try {
    payload = JSON.parse(req.body);
  } catch (e) {
    return {
      status: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
      contentType: 'application/json'
    };
  }

  // --- Validate required fields ---
  // Customize this validation for the specific external system
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      status: 400,
      body: JSON.stringify({ error: 'Missing required payload' }),
      contentType: 'application/json'
    };
  }

  // --- Sanitize and allowlist fields ---
  // Only extract known, expected fields — never pass the raw payload to content APIs.
  // Customize the allowed fields for the specific external system.
  // const sanitized = {
  //   id: sanitizeString(payload.id, 128),
  //   name: sanitizeString(payload.name, 256),
  // };

  // --- Process the webhook payload ---
  try {
    // Replace with actual processing logic using sanitized fields
    log.info('Received webhook payload with keys: %s', Object.keys(payload).join(', '));
  } catch (e) {
    log.error('Webhook processing failed: %s', e.message);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      contentType: 'application/json'
    };
  }

  return {
    status: 200,
    body: JSON.stringify({ status: 'ok' }),
    contentType: 'application/json'
  };
}

/**
 * Sanitize a string field from an external payload.
 * Trims whitespace, enforces max length, and rejects path traversal sequences.
 * Returns empty string if the value is unsafe or not a string.
 */
function sanitizeString(value, maxLength) {
  if (typeof value !== 'string') return '';
  let s = value.trim().substring(0, maxLength);
  // Reject path traversal
  if (s.includes('..') || s.includes('/') || s.includes('\\')) return '';
  // Strip HTML tags
  s = s.replace(/<[^>]*>/g, '');
  return s;
}

/**
 * Reject non-POST methods with 405.
 */
export function all(req) {
  return {
    status: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
    contentType: 'application/json'
  };
}
