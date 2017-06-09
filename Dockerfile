FROM ruby:latest

RUN mkdir usr/src/sc-app

WORKDIR usr/src/sc-app

ADD . usr/src/sc-app

RUN usr/src/sc-app/bin/box-setup.sh

CMD ["echo", "build successfull"]
