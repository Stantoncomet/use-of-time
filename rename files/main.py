#!/usr/bin/env python3
import os
from datetime import datetime
import re


#dir_path = os.path.dirname(os.path.realpath(__file__))
dir_path = input("Please input operating path: ")
if not os.path.isdir(dir_path):
    dir_path = "./"
files = os.listdir(dir_path)


# Select target files
target_exts = [".png", ".txt", ".mp3"]
target_files = filter(lambda f: len(list(filter(lambda x: f.lower().endswith(x), target_exts))) > 0, files)
target_files = list(target_files)
#print(target_files)

print("Operating on files directly in \""+dir_path+"\" with the following types: "+str(target_exts).replace("[", "").replace("]", "").replace("'", ""))

# Date patterns
date_pattern = "%d-%m-%Y"
date_regex = r"\d*-\d*-\d* "

operation = input("Welcome, please select an operation:\n1) Rename files to include creation date\n2) Undo rename\n")

def dateRename():
    consent = input("Renaming "+str(len(target_files))+" files to include date created. Proceed? (y/n) ")

    if consent.lower() != "y":
        exit()

    # Get datetime and rename files
    for f in range(len(target_files)):
        file_name = target_files[f]
        file_ts = os.path.getmtime(os.path.join(dir_path, file_name))
        file_date = datetime.fromtimestamp(file_ts).strftime(date_pattern)
        new_file_name = file_date+" "+file_name
        os.rename(os.path.join(dir_path, file_name), os.path.join(dir_path, new_file_name))

    #print(target_files)
    print("Operation successful")

def undoRename():
    consent = input("Removing date from the name of "+str(len(target_files))+" files. Proceed? (y/n) ")

    if consent.lower() != "y":
        exit()

    successes = 0
    # Get files and remove date from name
    for f in range(len(target_files)):
        file_name = target_files[f]
        new_file_name, count = re.subn(date_regex, "" , file_name, 1)
        successes += count
        os.rename(os.path.join(dir_path, file_name), os.path.join(dir_path, new_file_name))

    print("Operation successfully affected "+str(successes)+" files")

match int(operation):
    case 1:
        dateRename()
    case 2:
        undoRename()
    case _:
        exit()

