# Stage 1
FROM node:16-alpine as build
WORKDIR /app

COPY package.json ./
RUN npm install --only=prod --force --silent

COPY . /app
RUN npm run build

# # Stage 2 - the production environment
# FROM nginx:alpine

# COPY --from=build /app /usr/share/nginx/html/
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM python:3.10.5-bullseye

COPY --from=build /app/build ./
EXPOSE 8000
CMD ["python3", "-m", "http.server"]