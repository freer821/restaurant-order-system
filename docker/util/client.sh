cd $MALL_HOME/frontend/admin
echo "$PWD: npm run build:dep"
npm run build:dep
echo "copy frontend/admin"
rm -rf $MALL_HOME/docker/frontend/admin/*
cp -avr $MALL_HOME/frontend/admin/dist/* $MALL_HOME/docker/frontend/admin/
cd $MALL_HOME/frontend/touchscreen
echo "$PWD: npm run build:dep"
npm run build:dep
rm -rf $MALL_HOME/docker/frontend/client/*
cp -avr $MALL_HOME/frontend/touchscreen/dist/* $MALL_HOME/docker/frontend/client/
