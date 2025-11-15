# ziptie-shortlinks ✂️

> Developed by [TanmayRokde](https://github.com/TanmayRokde) & [pradnyaakumbhar](https://github.com/pradnyaakumbhar)

![npm](https://img.shields.io/npm/v/%40ziptie-shortlink%2Fziptie-shortlinks?label=SDK&color=blueviolet)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![bundle](https://img.shields.io/badge/minified-<2kb-blue)
![status](https://img.shields.io/badge/status-experimental-orange)

> **TL;DR**  
> Convert any long URL into a branded ZipTie link with two function calls.  
> Zero boilerplate. No guessing of endpoints. Built for quick automations.

---

## Table of Contents

1. [Feature Highlights](#feature-highlights)
2. [How It Works](#how-it-works)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Error Handling](#error-handling)
8. [Development Scripts](#development-scripts)
9. [Release Process](#release-process)
10. [Troubleshooting](#troubleshooting)

---

## Feature Highlights ✨

- 🚦 **One-line health checks** – sanity check the backend or NGROK tunnel.
- 🔗 **Short link creation** – strongly typed params with friendly errors.
- ⚡ **Axios-powered** – reuse interceptors, proxies, and retry strategies.
- ♻️ **CommonJS module** – require it anywhere, from cron jobs to AWS Lambda.

> 📝 **Note**  
> The SDK intentionally stays tiny and dependency-light so you can embed it into existing services without worrying about bundle bloat.

## How It Works 🧩

```
┌────────────┐   checkHealth()    ┌────────────────────────────────┐
│ Your code  │ ─────────────────► │ https://<gateway>/student/health│
└────────────┘                    └────────────────────────────────┘

┌────────────┐   createShortUrl() ┌───────────────────────────────┐
│ Your code  │ ─────────────────► │ MVP backend /shorten endpoint │
└────────────┘                    └───────────────────────────────┘
```

`createShortUrl` automatically sends JSON with `{ longUrl, userId, ttl }` to the backend defined via environment variables. Errors bubble up as `Error` objects with human-friendly messages.

## Installation 📦

```bash
npm install @ziptie-shortlink/ziptie-shortlinks
# or
yarn add @ziptie-shortlink/ziptie-shortlinks
```

## Configuration ⚙️

Set the backend base URL through an environment variable before requiring the package:

```
MVP_BACKEND_URL=https://links.api.ziptie.dev
```

If you need to target staging versus production you can switch URLs at runtime (e.g., per process, per test) without changing the code.

## Usage Examples 🚀

```js
const { createShortUrl, checkHealth } = require('@ziptie-shortlink/ziptie-shortlinks');

async function bootstrap() {
  const health = await checkHealth();
  console.info('[health]', health);

  const result = await createShortUrl({
    longUrl: 'https://example.com/some/long/path?utm_source=ziptie',
    userId: 'user_123',
    ttl: 60 * 60 // seconds
  });

  console.info('[shortlink]', result.shortUrl);
}

bootstrap().catch((error) => {
  console.error('Unexpected failure', error);
});
```

## API Reference 📚

| Function | Params | Returns |
| -------- | ------ | ------- |
| `checkHealth(endpoint?)` | `endpoint` optional string (defaults to `/is-healthy` and is appended to the NGROK root) | Resolves with `{ success, status, data }` or `{ success: false, error, status }`. |
| `createShortUrl({ longUrl, userId, ttl })` | All fields are required; `ttl` represents seconds. | Resolves with the backend payload (typically `{ shortKey, shortUrl, expiresIn }`). Throws on failure. |

## Error Handling 🧯

- Network/timeout issues throw `Error('URL shortener service is unavailable')`.
- Backend responses with JSON errors are rethrown with the server-provided message when present.
- Wrap calls in your own retry/circuit breaker logic if you need extra resilience.

## Development Scripts 🛠️

| Command | Description |
| ------- | ----------- |
| `npm install` | Install dependencies |
| `npm test` | Placeholder (exits with error). Replace with real tests as you expand the SDK. |

Because this is a thin wrapper, tests are intentionally omitted for now. Feel free to add Jest/Vitest when expanding the surface area.

## Release Process 🚢

1. Update `package.json` version (semver).
2. Run `npm publish --access public`.
3. Create a Git tag and GitHub release if desired.
4. Update changelog/README with any new endpoints or env vars.

## Troubleshooting 🧪

- **`MVP_BACKEND_URL` not set** – the SDK will attempt to hit `undefined/shorten`. Always set the variable or inject it via `.env`.
- **NGROK tunnel rotating** – supply the fresh base URL and redeploy consumers (health checks will start failing first).
- **TLS/proxy errors** – configure `axios.defaults.proxy` or set `HTTPS_PROXY` in the host environment if traffic must go through a proxy.
- **CommonJS import errors** – ensure your bundler understands `type: "commonjs"` modules or switch to `require()` instead of `import`.
