# backend/Dockerfile
FROM node:18

WORKDIR /app

# Copy only backend's package.json
COPY ./backend/package*.json ./

RUN npm install

# Copy rest of the backend code
COPY ./backend/. .

EXPOSE 3000

CMD ["npm", "start"]
