FROM ruby:2.3
# FROM ruby:alpine
WORKDIR /code

RUN apt-get update && apt-get install -y unzip curl
RUN curl -OL https://github.com/google/protobuf/releases/download/v3.2.0/protoc-3.2.0-linux-x86_64.zip
RUN unzip protoc-3.2.0-linux-x86_64.zip -d protoc3
RUN mv protoc3/bin/* /usr/local/bin/
RUN mv protoc3/include/* /usr/local/include/

# RUN curl -o /tmp/go.tgz https://storage.googleapis.com/golang/go1.9.1.linux-amd64.tar.gz
# RUN tar -zxf /tmp/go.tgz -C /usr/local/
# RUN ln -s /usr/local/go/bin/go /usr/bin/go
# ENV GOPATH /root/go
# RUN go get github.com/dnephin/filewatcher

# ADD . /code
# RUN bundle

CMD make run
