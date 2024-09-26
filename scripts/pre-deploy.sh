#!/bin/bash

mkdir .zeabur
mkdir .zeabur/output
mkdir .zeabur/output/static
mkdir .zeabur/output/functions

cp -r dist/* .zeabur/output/static && cp -r api .zeabur/output/functions

for name in `ls -R .zeabur/output/functions/api/v1/car_orders/*.js`
do
  mv $name ${name%}.func
done

ls -R .zeabur/output