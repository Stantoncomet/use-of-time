#!/bin/bash

html=""
js=""
css=""

while read -r line; do
    css=$css+"\n"+$line
done < "style.css"

echo "$css"