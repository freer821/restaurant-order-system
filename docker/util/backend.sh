cd $MALL_HOME
mvn clean package
echo "copy main.jar to docker/backend/"
cp -f $MALL_HOME/main/target/main-*-exec.jar $MALL_HOME/docker/backend/main.jar

echo "clean docker image mall"
docker rmi $(docker images -q 'mall' | uniq)

cd $MALL_HOME/docker/backend
echo "$PWD: docker build . -t mall"
docker build . -t mall