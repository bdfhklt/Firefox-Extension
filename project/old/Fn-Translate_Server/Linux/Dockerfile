FROM ubuntu:18.04
RUN apt update -y
RUN apt install -y python3-pip firefox
COPY ./app /app
WORKDIR /app
RUN pip3 install -r ./requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]