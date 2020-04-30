FROM openjdk:8-jre
COPY application.yml application.yml
COPY main.jar main.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","main.jar"]