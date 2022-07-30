#!/bin/bash
# this file should be executed by a postgres accessible user
## 1. move all target csv files into ./data folder.
## 2. modify database name as needed
DATABASE_NAME=reviews
## 3. execute this shell script as follow
##  ./load.sh

CURRENTDATE=`date +"%Y%m%d-%s"`
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
OUTPUT_FILE="logs/${CURRENTDATE}-load.out"
SCRIPTS1='./etl_scripts/create_table.sql'
SCRIPTS2='./etl_scripts/create_index.sql'
SCRIPTS3='./etl_scripts/create_view.sql'
SCRIPTS4='./etl_scripts/load_data.sql'
SCRIPTS=($SCRIPTS1 $SCRIPTS2 $SCRIPTS3 $SCRIPTS4)

echo "start script" 2> $OUTPUT_FILE

for script in ${SCRIPTS[@]}; do
  echo "executing ${script} ..." 2>> $OUTPUT_FILE
  psql $DATABASE_NAME -f $script 2>> $OUTPUT_FILE
  echo "done executing ${script}" >> $OUTPUT_FILE 2>&1
done

echo "done executing file. check ${OUTPUT_FILE} for log."