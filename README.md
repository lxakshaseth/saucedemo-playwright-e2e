# SauceDemo Playwright E2E

End-to-end test automation for [SauceDemo](https://www.saucedemo.com/) using **Playwright and TypeScript**, with Page Object Model, reusable fixtures, cross-browser testing, Docker support, Allure results, and GitHub Actions.

## Test coverage

- Login with supported users, missing credentials, and invalid credentials
- Input handling checks for SQL injection strings, XSS strings, and long inputs
- Inventory details, sorting, sidebar navigation, and logout
- Shopping cart updates, adding and removing products, and continuing shopping
- Checkout validation, cancellation, and order completion

These tests exercise the demo application's UI; the security-tagged cases are input handling checks, not a comprehensive security assessment.

## Getting started

Requires Node.js 20 or later and npm. Docker is optional.

```bash
git clone https://github.com/lxakshaseth/saucedemo-playwright-e2e.git
cd saucedemo-playwright-e2e
npm ci
npx playwright install
```

Copy `.env.example` to `.env`:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS / Linux
cp .env.example .env
```

The example contains SauceDemo's public demo password and URL settings. Keep private credentials out of version control.

Run the desktop Chromium tests and open the report:

```bash
npx playwright test --project=chromium
npm run report
```

## Running tests

| Command | Purpose |
| --- | --- |
| `npm test` | Run all configured browser projects |
| `npm run test:smoke` | Run smoke tests in Chromium |
| `npm run test:security` | Run security-tagged input checks in Chromium |
| `npx playwright test --project=firefox` | Run Firefox tests |
| `npx playwright test --project=webkit` | Run WebKit tests |
| `npx playwright test tests/e2e/login.spec.ts --project=chromium` | Run login tests in Chromium |
| `npx playwright test --ui` | Open Playwright's interactive test runner |
| `npx playwright test --debug --project=chromium` | Debug Chromium tests |

The configured projects are Chromium, Firefox, WebKit, Pixel 5 emulation (`mobile chrome`), and iPhone 12 emulation (`Mobile Safari`). The `mobile chrome` project uses the Google Chrome channel, which must also be installed:

```bash
npx playwright install chrome
npx playwright test --project="mobile chrome"
```

## Project structure

```text
saucedemo-playwright-e2e/
|-- src/
|   |-- components/     # Shared UI components
|   |-- config/         # Environment configuration
|   |-- data/           # Test data and expected labels
|   |-- fixtures/       # Shared setup and verification helpers
|   |-- locators/       # Element locators
|   |-- pages/          # Page Object Model classes
|   |-- types/          # TypeScript definitions
|   `-- utils/          # Utility functions
|-- tests/e2e/          # Login, inventory, cart, and checkout tests
|-- docs/              # Additional documentation
|-- .github/workflows/ # Automated smoke and on-demand full tests
|-- playwright.config.ts
|-- Dockerfile
`-- docker-compose.yml
```

## Configuration

[playwright.config.ts](playwright.config.ts) defines browser projects, timeouts, retries, and reporters. Tests run headlessly by default, with two retries in CI and no retries locally. Traces are enabled, screenshots are captured on failure, and video is recorded on the first retry.

Use [.env.example](.env.example) as the configuration reference:

| Variable | Purpose |
| --- | --- |
| `PASSWORD` | SauceDemo login password |
| `DASHBOARD_URL` | Inventory page path |
| `TOKEN_EP` | Backtrace endpoint match used by tests |
| `DASHBOARD_PICTURE_URL` | Product image path prefix |
| `ABOUT_URL` | Expected About destination |

## Docker

Install Docker with Compose support, prepare `.env`, then run:

```bash
# Full suite
docker compose run --build --rm playwright-tests

# Chromium smoke tests
docker compose --profile smoke run --build --rm smoke-tests
```

Reports are written to mounted local directories. The full service also mounts source and test files. See [Docker documentation](docs/DOCKER.md) for additional details.

## GitHub Actions

- [Smoke tests](.github/workflows/pr-check.yml) run on pushes and pull requests to `main`, and can be started manually.
- [Full suite](.github/workflows/full-tests.yml) runs manually from the Actions tab. Its browser input is currently not wired to the test command; it runs all configured projects.

Both workflows build and run tests in Docker, upload Playwright HTML and JUnit reports, and publish test results.

Both Docker services use the public SauceDemo defaults from `.env.example` when a value is missing or empty, so CI runs without additional repository configuration. To override these defaults, use **Settings > Secrets and variables > Actions**:

- Secret: `SAUCE_PASSWORD` (the public demo password is `secret_sauce`)
- Variables: `DASHBOARD_URL`, `TOKEN_EP`, `DASHBOARD_PICTURE_URL`, and `ABOUT_URL`, using the values in `.env.example`

## Reports

```bash
# Interactive HTML report
npm run report
```

Additional outputs include `results.json`, `test-results/junit.xml`, and `allure-results/`. To view Allure results, install a compatible Allure command-line tool and its runtime prerequisites, then generate and open a report from `allure-results`.

Generated reports, dependencies, and local environment files are excluded from Git.

## License and attribution

Licensed under the [MIT License](LICENSE). Based on the original [SauceDemo Playwright project by Filip Gajdos (johnnyForever)](https://github.com/johnnyForever/saucedemo-playwright-e2e). The original copyright notice is retained in `LICENSE`.
