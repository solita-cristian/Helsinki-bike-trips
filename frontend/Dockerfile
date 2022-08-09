FROM node:16-alpine as build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

FROM nginx:alpine as frontend

ARG REACT_APP_BACKEND_HOST
ENV REACT_APP_BACKEND_HOST ${REACT_APP_BACKEND_HOST}}

ARG REACT_APP_BACKEND_PORT
ENV REACT_APP_BACKEND_PORT ${REACT_APP_BACKEND_PORT}}

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/build /frontend/build