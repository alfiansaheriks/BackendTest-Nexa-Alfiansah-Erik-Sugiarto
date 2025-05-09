FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy env file
COPY .env ./

EXPOSE 3000

CMD ["npm", "run", "start"]