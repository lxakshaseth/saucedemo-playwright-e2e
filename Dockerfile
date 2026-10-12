# Use official Playwright image with browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV CI=true

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

CMD ["npm", "test"]
