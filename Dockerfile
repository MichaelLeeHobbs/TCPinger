FROM alpine:3.7
COPY ./dist/tcpinger_linux_x64 /tcpinger
COPY healthChecks.json /healthChecks.json

ENTRYPOINT ["tcpinger"]
