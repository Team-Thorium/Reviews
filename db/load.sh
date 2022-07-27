#!/bin/sh
## 1. move all target csv files into ./data folder.
## 2. modify <database_name> to desired database name
DATABASE_NAME=<database_name>
## 3. execute this shell script as follow
##  ./load.sh

SCRIPTS_DIR='./etl_scripts'
for file in $SCRIPTS_DIR/*.sql
  echo "executing ${file} ..."
  do sudo -u postgres psql $DATABASE_NAME -f $file
  echo "done executing ${file}"
done

echo "done loading data."