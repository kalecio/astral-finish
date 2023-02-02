FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY . .
RUN npm ci --only=production

EXPOSE 8081
CMD [ "node", "index.js" ]