FROM alpine:3.6

WORKDIR /opt

RUN apk add --no-cache protobuf
RUN apk add --no-cache --virtual .build-deps \
    bash \
    gcc \
    musl-dev \
    openssl \
    go

RUN apk add --no-cache git

RUN go get github.com/dnephin/filewatcher
CMD ./entrypoint.sh
