FROM node:16-alpine as node


FROM node as builder
WORKDIR /build
COPY package*.json .
RUN npm install
COPY . .

RUN npm run build

FROM node as backend
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev

COPY ./src/api/spec ./src/api/spec
COPY --from=builder /build/dist .

EXPOSE 8080

ENTRYPOINT ["node", "index.js"]