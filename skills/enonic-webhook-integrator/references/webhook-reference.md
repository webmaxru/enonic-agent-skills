# Webhook Reference

## Outbound Webhooks (com.enonic.xp.webhooks.cfg)

Enonic XP can be configured to send outbound webhook HTTP POST requests when specific events occur. Configuration is placed in:

```
XP_HOME/config/com.enonic.xp.webhooks.cfg
```

### Configuration Format

Each webhook entry is defined with a unique mapping name:

```properties
# Basic webhook configuration
webhook.<name>.url = https://example.com/webhook-endpoint
webhook.<name>.events = node.pushed, node.deleted
webhook.<name>.secret = my-shared-secret
```

| Property                    | Description                                                         |
|-----------------------------|---------------------------------------------------------------------|
| `webhook.<name>.url`        | Target URL receiving the POST payload (use HTTPS)                   |
| `webhook.<name>.events`     | Comma-separated list of event types to trigger the webhook          |
| `webhook.<name>.secret`     | Optional shared secret for HMAC signature verification              |

### Example: Notify Slack on Content Publish

```properties
webhook.slack-notify.url = https://hooks.slack.com/services/T00/B00/xxxx
webhook.slack-notify.events = node.pushed
```

### Example: CDN Invalidation on Update and Delete

```properties
webhook.cdn-purge.url = https://api.cdn-provider.com/purge
webhook.cdn-purge.events = node.pushed, node.deleted
webhook.cdn-purge.secret = cdn-purge-secret-key
```

### Security Considerations

- Always use HTTPS URLs to prevent payload interception.
- Use a shared secret and verify HMAC signatures on the receiving end.
- Config file changes with `.cfg` extension are applied without restarting XP.

---

## Inbound Webhooks (HTTP Service Controllers)

Enonic XP applications can expose HTTP service endpoints to receive webhook payloads from external systems.

### Service Controller Location

```
src/main/resources/services/<serviceName>/<serviceName>.ts
```

The service is accessible at:

```
/_/service/<appKey>/<serviceName>
```

### HTTP Request Object

The request object passed to service controllers follows the standard Enonic XP HTTP request structure:

| Property       | Type   | Description                                      |
|----------------|--------|--------------------------------------------------|
| method         | string | HTTP method (GET, POST, PUT, DELETE)              |
| scheme         | string | `http` or `https`                                |
| host           | string | Host header value                                |
| port           | string | Port number                                      |
| path           | string | Request path                                     |
| url            | string | Full request URL                                 |
| remoteAddress  | string | Client IP (X-Forwarded-For honored)              |
| body           | string | Request body (parse JSON with `JSON.parse()`)    |
| params         | object | Query/form parameters                            |
| headers        | object | HTTP headers (use `getHeader(name)` from XP 7.12)|
| cookies        | object | Request cookies                                  |

### HTTP Response Object

| Property    | Type           | Description                                        |
|-------------|----------------|----------------------------------------------------|
| status      | number         | HTTP status code (default 200)                     |
| body        | string/object  | Response body                                      |
| contentType | string         | MIME type (default `text/plain; charset=utf-8`)     |
| headers     | object         | Response headers                                   |

### Payload Validation

Before processing any inbound webhook payload:

1. Parse the body: `const payload = JSON.parse(req.body);`
2. Check required fields exist.
3. Verify authentication: check `Authorization` header, API key in query params, or HMAC signature in a custom header.
4. Return `401` immediately if authentication fails.
5. Return `400` if the payload is malformed or missing required fields.

### Securing Service Endpoints

- Restrict access via vhost configuration to limit which hosts can reach the service.
- Use API keys or HMAC signatures to authenticate incoming requests.
- Rate-limit inbound endpoints through XP's DoS filter or reverse proxy configuration.

---

## HTTP Client (lib-httpClient)

For making outbound HTTP calls from event listeners or service controllers.

### Dependency

```groovy
dependencies {
  include "com.enonic.lib:lib-http-client:3.2.2"
}
```

Import:

```typescript
import httpClient from '/lib/http-client';
```

### request(params)

| Parameter      | Type    | Description                                    |
|----------------|---------|------------------------------------------------|
| url            | string  | Target URL                                     |
| method         | string  | HTTP method (GET, POST, PUT, DELETE)            |
| headers        | object  | Request headers                                |
| body           | string  | Request body                                   |
| contentType    | string  | Content-Type header                            |
| connectionTimeout | number | Connection timeout in ms                    |
| readTimeout    | number  | Read timeout in ms                             |

**Returns:** Response object with `status`, `body`, `headers`, `contentType`, `message`.

### Example: POST to External API

```typescript
import httpClient from '/lib/http-client';

const response = httpClient.request({
  url: 'https://api.example.com/webhook',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer my-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ event: 'content.published', paths: ['/site/blog/post-1'] }),
  connectionTimeout: 5000,
  readTimeout: 10000
});

if (response.status !== 200) {
  log.error('Webhook delivery failed: %s %s', response.status, response.message);
}
```
