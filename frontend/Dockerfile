# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage with Nginx + reverse proxy
FROM nginx:alpine

# Copy built React files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]