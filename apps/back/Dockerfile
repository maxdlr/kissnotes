FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/types ./packages/types
COPY apps/back ./apps/back
RUN npm ci --workspace=packages/types --workspace=apps/back
RUN npm run build --workspace=packages/types
RUN npm run build --workspace=apps/back

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/types ./packages/types
COPY --from=build /app/apps/back/package.json ./apps/back/
COPY --from=build /app/apps/back/dist ./apps/back/dist
RUN npm ci --workspace=apps/back --omit=dev
WORKDIR /app/apps/back
CMD ["node", "dist/index.js"]
