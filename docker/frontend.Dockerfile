FROM node:24-bookworm-slim

LABEL org.opencontainers.image.source="https://github.com/Team-Decipher/onboardFlow"

COPY frontend-entrypoint.sh /usr/local/bin/frontend-entrypoint.sh
RUN chmod +x /usr/local/bin/frontend-entrypoint.sh

WORKDIR /app
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/frontend-entrypoint.sh"]
