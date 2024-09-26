#!/bin/bash

ls -R .zeabur

cp -r dist/* .zeabur/output/static && cp -r api .zeabur/output/functions

for name in `ls -R .zeabur/output/functions/api/v1/car_orders/*.js`
do
  mv $name ${name%}.func
done