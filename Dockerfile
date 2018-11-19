FROM alpine:3.7
COPY ./dist/tcpinger_alpine /tcpinger
COPY dockerHealthChecks.json /healthChecks.json
RUN apk add --no-cache libstdc++
RUN apk add --no-cache libgcc
RUN chmod +x /tcpinger

ENTRYPOINT ["/tcpinger"]
