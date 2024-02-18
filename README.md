# Logbun

<p align="center">
  <a href="https://logbun.com/">
    <img src="./packages/ui/assets/main/logo.png" width="300px" alt="Logbun" />
  </a>
</p>
<p align="center" style="margin-top: 20px">
  <p align="center">
  Simple, Open Source, Privacy-Friendly JavaScript Error Tracking.
  <br>
    <a href="https://logbun.com"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/nhVEnBbB">Discord</a>
    ·
    <a href="https://logbun.com">Website</a>
    ·
    <a href="https://github.com/logbun/logbun/issues">Issues</a>
    ·
    <a href="https://github.com/orgs/logbun/projects/2/views/1">Roadmap</a>
  </p>
</p>

[Logbun](https://logbun.com/) is your go-to solution for **Simple**, **100% Open Source**, **Privacy-Friendly** javascript error tracking tailored for **SaaS founders** who ship fast🔥.

We want you to ship fast, fail fast, and catch errors fast without compromising user data. Therefore, we ensure our error tracking remains simple, transparent, efficient, and secure.

No need for cookie banners. Managed and hosted in the EU 🇪🇺

![Logbun](./packages/ui/assets/main/dashboard.png)

## Why Choose Logbun Over Alternatives?

Here's what sets Logbun apart as the ideal JavaScript error tracking platform for SaaS founders:

- **Simplicity at its Core**: Logbun offers straightforward error tracking for SaaS applications. No complex setups or convoluted reports. Get actionable insights without the hassle.

- **Open Source**: Logbun is fully open source, unlike many other error tracking software that claim to be open source but only share a small part of their codebase. We are fully transparent and share 100% of all out code.

- **Privacy-Focused**: We prioritize user privacy. We don't collect things like IP addresses and other unnecessary data collection, no invasive practices. Compliant with privacy regulations, Logbun keeps your users' data confidential.

- **Self host**: You can download the code and host it yourself.

## Tech Stack

- [Typescript](https://www.typescriptlang.org/) - Language
- [Next.js](https://nextjs.org/) - Framework
- [Drizzle](https://www.drizzle.io/) - ORM
- [Tailwind](https://tailwindcss.com/) - CSS
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Hetzner](https://hetzner.cloud) - Hosting
- [Turborepo](https://turbo.build/repo) – Monorepo
- [PostgreSQL](https://www.postgresql.org) - SQL Database
- [Clickhouse](https://clickhouse.com) - Analytical Database

## Supported Platforms

We support the following SDK platforms. Please refer to the README and instructions of those SDKs for more detailed information:

- [`@logbun/js`](https://github.com/logbun/logbun/tree/master/sdks/js): SDK for Browser Javascript
- [`@logbun/node`](https://github.com/logbun/logbun/tree/master/sdks/node): SDK for Node
- [`@logbun/react`](https://github.com/logbun/logbun/tree/master/sdks/react): Browser SDK for React
- [`@logbun/nextjs`](https://github.com/logbun/logbun/tree/master/sdks/nextjs): SDK for Next.js
- [`@logbun/webpack`](https://github.com/logbun/logbun/tree/master/sdks/webpack): SDK for Webpack
- [`@logbun/upload-sourcemaps`](https://github.com/logbun/logbun/tree/master/sdks/upload-sourcemaps): SDK and CLI for uploading sourcemaps

## Getting Started

### Prerequisites

Here's what you need to be able to run Logbun:

- Node.js (version >= 18)
- PostgreSQL
- Docker

### 1. Clone the repository

```shell
git clone https://github.com/logbun/logbun.git
cd logbun
```

### 2. Install npm dependencies

```shell
pnpm install
```

### 3. Copy the environment variables to `.env` and configure

```shell
cp .env.example .env
```

### 5. Initialize docker

```shell
docker compose -f "docker-compose.dev.yml" up -d --build
```

### 6. Run the dev server

```shell
pnpm run dev
```

### 7. Open the app in your browser

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

To contribute, please see our [contribution guide](https://github.com/logbun/logbun/blob/main/CONTRIBUTING.md).

## License

Inspired by [Plausible](https://plausible.io), Logbun is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find it here](https://github.com/logbun/logbun/blob/main/LICENSE).
