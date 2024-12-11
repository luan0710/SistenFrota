FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${MAINTENANCE_SERVICE_PORT}

CMD ["npm", "run", "dev"] 