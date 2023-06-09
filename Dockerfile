FROM node:18.16.0-alpine3.17

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install

EXPOSE ${PORT}

CMD ["sh", "-c", "npm run start --PORT=${PORT}"]