# Quick Start

## Run tests in Docker

```bash
# Build and run all tests
npm run docker:test

# Run smoke tests only
npm run docker:smoke

# Access container shell for debugging
npm run docker:shell
```

## Docker Services

### 1. **playwright-tests** (default)

Runs the full test suite in a containerized environment.

```bash
docker-compose up playwright-tests
```

**Features:**

- Uses official Playwright Docker image (v1.57.0-noble)
- Pre-installed Chromium, Firefox, and WebKit browsers
- Mounts test results and reports to host machine

### 2. **smoke-tests** (profile: smoke)

Runs only smoke tests (`@smoke` tag).

```bash
docker-compose --profile smoke up smoke-tests
```

## Environment Variables

Create a `.env` file in the project root (use `.env.example` as template):

```env
PASSWORD='secret_sauce'
DASHBOARD_URL='/inventory.html'
TOKEN_EP='submit.backtrace.io/UNIVERSE/TOKEN/json'
DASHBOARD_PICTURE_URL='/static/media/'
ABOUT_URL='https://saucelabs.com/'
```

## Volume Mounts

| Host Path             | Container Path           | Purpose                                      |
| --------------------- | ------------------------ | -------------------------------------------- |
| `./playwright-report` | `/app/playwright-report` | HTML test reports                            |
| `./test-results`      | `/app/test-results`      | Test artifacts (screenshots, videos, traces) |
| `./allure-results`    | `/app/allure-results`    | Allure test results                          |
| `./src`               | `/app/src`               | Source code (for live development)           |
| `./tests`             | `/app/tests`             | Test files (for live development)            |

## Manual Docker Commands

### Build the image

```bash
docker build -t saucedemo-e2e .
```

### Interactive shell

```bash
docker run -it --rm saucedemo-e2e sh
```

## Troubleshooting

### Permission issues on Linux

If you encounter permission issues with mounted volumes:

```bash
docker-compose run --rm --user $(id -u):$(id -g) playwright-tests
```

### Clean up containers and volumes

```bash
docker-compose down -v
```

## Benefits of Docker Setup

✅ **Consistent Environment** - Same browser versions across all machines  
✅ **Isolated Testing** - No interference with host system  
✅ **CI/CD Ready** - Easy integration with pipelines  
✅ **No Local Setup** - No need to install browsers locally  
✅ **Reproducible** - Same results on Windows, Mac, Linux