#!/usr/bin/env bash

export MYJOURNAL_SOCKET="/Applications/MAMP/tmp/mysql/mysql.sock"
export MYJOURNAL_DB_HOST="localhost"
export MYJOURNAL_DB_USER="myjournal"
export MYJOURNAL_DB_PASS="myjournal"
export MYJOURNAL_DB_NAME="myjournal"

./bin/myjournal-api --port=3580
