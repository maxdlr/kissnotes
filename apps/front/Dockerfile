FROM node:22-slim AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY package.json ./
COPY packages/types ./packages/types
COPY apps/front ./apps/front
RUN npm install
RUN npm run build --workspace=packages/types
RUN npm run build --workspace=apps/front

FROM node:22-slim
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/packages/types ./packages/types
COPY --from=build /app/apps/front/package.json ./apps/front/
COPY --from=build /app/apps/front/.next ./apps/front/.next
COPY --from=build /app/apps/front/public ./apps/front/public
# opengraph-image.tsx reads these at request time via fs.readFile, so they must
# exist in the runtime image alongside the build output.
COPY --from=build /app/apps/front/src/assets/fonts ./apps/front/src/assets/fonts
COPY --from=build /app/node_modules ./node_modules
WORKDIR /app/apps/front
CMD ["npx", "next", "start", "-p", "3000"]
