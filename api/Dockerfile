FROM node:22-slim
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .

USER node

EXPOSE 9001

CMD ["npm", "start"]