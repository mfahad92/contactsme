# End-to-end journeys

An agent reads this every validation run, drives the running application, and reports what it observed.

## Healthcheck endpoint reports healthy status

1. Send an HTTP GET request to `/api/health`.
2. The response status code is 200.
3. The response body is JSON containing `{"status":"ok"}`.

**What would make this fail:** the endpoint returns an error status code, connection fails, or the body does not contain `{"status":"ok"}`.

## Root landing page loads successfully

1. Send an HTTP GET request to `/`.
2. The response status code is 200.
3. The HTML body loads successfully without server error.

**What would make this fail:** the root page returns 500 or fails to render.
