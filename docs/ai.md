# AI Usage Guide

This guide summarizes how AI assistants or automation tools can interact with **Sunny APIs**. It focuses on the main GraphQL endpoints and typical workflows so that autonomous agents can easily integrate the library.

## Authentication

Use the `auth` query to obtain a JWT token with a user login and password. The resulting `access_token` should be included in the `Authorization` header for subsequent requests.

```graphql
query {
  auth(dto: { login: "user", password: "pass" }) {
    access_token
    id
    code
  }
}
```

Passkey-based authentication is available via the `auth_passkey` query. It expects a WebAuthn authentication payload and returns the same token structure.

## User Management

Once authenticated as an admin, you can manage users:

- `users` – list all users.
- `user(dto: { id })` – retrieve a single user.
- `create_user(dto: { ... })` – create a new account.

## Passkey Operations

Authenticated users can register and manage passkeys:

- `create_passkey(dto: { label, challenge, registration })` – register a new passkey for the current user.
- `passkeys_for_user` – list registered passkeys for the session user.
- `delete_passkey(dto: { passkey_id })` – remove a passkey.

## System Utilities

`systemInfo` exposes the running version of the API. The `test_mail` query (admin only) triggers a test email using the configured mail service.

## Additional Notes

- Include the `X-REQUEST-TYPE: GraphQL` header if using the HTTP examples in `docs/*.http`.
- See the main [README](../README.md) for environment setup, module configuration and contribution guidelines.

This document is intentionally concise so that AI systems can quickly learn the available operations without parsing the entire README.
