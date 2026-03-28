# Troubleshooting

## Event Listener Issues

### Events not firing

1. **Listener registration location:** Event listeners must be registered in the application's `main.ts` (or `main.js`) controller. This file runs once when the application starts. Listeners registered in page or service controllers are unreliable since they only execute on HTTP requests.

2. **Event type pattern mismatch:** The `type` parameter uses modified patterns where `.` is literal and `*` is a wildcard. For node events use `node.*` (all node events), `node.pushed` (exact match), or `node.created` (exact match). The pattern does NOT use regex syntax.

3. **Local vs. distributed events:** If `localOnly` is `true`, only events originating on the same XP instance will be received. In a cluster, set `localOnly: false` to receive events from all nodes.

4. **Application not started:** Verify the application is running via the Applications admin tool. Check `XP_HOME/logs/server.log` for startup errors.

5. **Event timing on publish:** Content publish triggers `node.pushed` events when content moves from draft to master branch. Edits in draft trigger `node.updated` but not `node.pushed`.

### Listener callback errors

- Unhandled exceptions inside a listener callback are logged but do not crash the application. Check `server.log` for stack traces.
- Avoid long-running synchronous work inside callbacks. Delegate to `taskLib.executeFunction()` instead.

---

## Outbound Webhook Issues

### Webhook not delivered

1. **Config file location:** Verify the file is at `XP_HOME/config/com.enonic.xp.webhooks.cfg`. A `.cfg` extension means changes apply without restart.

2. **Event type mismatch:** Confirm the `events` property matches the exact event type names (e.g., `node.pushed`, not `content.published`).

3. **Network access:** Verify the XP instance can reach the target URL. Test connectivity from the server running XP.

4. **HTTPS certificate errors:** If the target uses a self-signed certificate, the JVM truststore may need to include it.

### Webhook delivered but rejected by target

- Check the target system's logs for the rejection reason.
- Verify the shared secret and HMAC signature computation match on both sides.
- Confirm the Content-Type header matches what the target expects.

---

## Inbound Webhook Issues

### Service endpoint returns 404

1. **Path convention:** The controller must be at `src/main/resources/services/<name>/<name>.ts` (file name must match directory name).
2. **Application deployed:** Verify the application is running.
3. **VHost mapping:** If vhosts are enabled, confirm the vhost configuration routes requests to the correct internal path (`/_/service/<appKey>/<serviceName>`).

### Service returns 405 Method Not Allowed

- Only exported functions matching the HTTP method are handled. For POST webhooks, export `function post(req)`. For GET, export `function get(req)`.

### Authentication failures

- Check that the expected header name matches exactly (headers may be case-transformed by proxies).
- Use `req.getHeader('x-api-key')` (XP 7.12+) for case-insensitive header lookups instead of direct `req.headers` access.

---

## Task Issues

### Task fails silently

- List tasks with `taskLib.list()` and filter by state `FAILED`.
- Check `server.log` for exceptions thrown inside the task function.

### Task not executing

- `executeFunction()` requires a running application context. It cannot be called during application shutdown.
- In clustered environments, confirm `distributable.acceptInbound` is `true` in `com.enonic.xp.task.cfg` if tasks are submitted from other nodes.

---

## HTTP Client Issues

### Connection timeout

- Increase `connectionTimeout` if the target is slow to accept connections.
- Verify DNS resolution and network routing from the XP server.

### SSL/TLS errors

- Ensure the JVM truststore includes the target's CA certificate.
- If using a proxy, confirm the proxy supports HTTPS passthrough.

### Large response bodies

- lib-httpClient buffers the entire response body in memory. For very large responses, consider streaming or pagination at the API level.
