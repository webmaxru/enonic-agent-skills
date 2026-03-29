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

// NOTE: When no apiKey is set in app.config, all requests are allowed through. Configure webhook.apiKey in production.
const EXPECTED_API_KEY = app.config['webhook.apiKey'] || '';

/**
 * Handle incoming POST requests (webhook payloads).
 */
export function post(req) {
  // --- Authentication ---
  const apiKey = req.headers['X-Api-Key'] || req.headers['x-api-key'] || '';
  if (EXPECTED_API_KEY && apiKey !== EXPECTED_API_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
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
  if (!payload || typeof payload !== 'object') {
    return {
      status: 400,
      body: JSON.stringify({ error: 'Missing required payload' }),
      contentType: 'application/json'
    };
  }

  // --- Process the webhook payload ---
  try {
    // Replace with actual processing logic
    log.info('Received webhook payload: %s', JSON.stringify(payload));
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
 * Reject non-POST methods with 405.
 */
export function all(req) {
  return {
    status: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
    contentType: 'application/json'
  };
}
