#!/bin/bash

mongoimport --host mongodb --db delivery --collection users --type json --file /users.json --jsonArray
mongoimport --host mongodb --db delivery --collection items --type json --file /items.json --jsonArray
mongoimport --host mongodb --db delivery --collection categories --type json --file /categories.json --jsonArray
