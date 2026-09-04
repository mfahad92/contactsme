# Holdout scenarios

<!--
  THE BUILDER CANNOT READ THIS FILE. That is the only thing that makes it worth
  anything, and it is the only honest reason to merge code nobody reviewed.
-->

## Verify healthcheck endpoint is active and returns expected payload

1. Issue an HTTP GET request to `/api/health`.
2. Assert the HTTP response status code is 200.
3. Assert the response body contains `"status"` with value `"ok"`.

## Application root route is responsive

1. Issue an HTTP GET request to `/`.
2. Assert the response status code is 200.
