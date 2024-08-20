bun astro build
docker compose up -d
bunx prisma generate
bun ./dist/server/entry.mjs