#!/bin/bash

html=""
js=""
css=

while read -r line; do
    css=$css$line
done < "style.css"

echo "$css}" > "test.css"