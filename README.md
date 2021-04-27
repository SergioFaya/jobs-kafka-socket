# Deploy

https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

```
docker build -t sergiofaya/job-browser-sockets .
docker run -p 3000:3000 -d sergiofaya/job-browser-sockets

```