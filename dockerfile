FROM node:22-alpine

WORKDIR /app

COPY dev-server.js .
COPY index.html .
COPY product-page-cro.html .
COPY thank-you.html .
COPY assets/ ./assets/
COPY products/ ./products/

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dev-server.js"]
