FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
RUN bun install -p

COPY . .

USER bun

CMD ["bun", "src/index.ts"]