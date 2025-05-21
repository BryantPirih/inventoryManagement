# frontend/Dockerfile
# Stage 1: Build Vue app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY ./frontend/package*.json ./
RUN npm install

# Copy the rest of frontend source
COPY ./frontend/. .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
