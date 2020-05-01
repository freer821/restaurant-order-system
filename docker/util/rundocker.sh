docker build . -t mall
docker run --name mall -d --link ub-mariadb:ub-mariadb -p 8001:8080 mall
