#!/usr/bin/env python3

import json
import pprint
import sys

if len(sys.argv) != 4:
    print("Wrong number of arguments")
    print("prefix.py SRC_FILE DEST_FILE PREFIX")
    exit(1)

_, src_file, dest_file, prefix = sys.argv

def update_values(node):
    result = {}
    for key, item in node.items():
        if isinstance(item, dict):
          update_values(item)
        else:
          node[key] = prefix + node[key]


pp = pprint.PrettyPrinter(indent=4, width=10000)

json_data = json.load(open(src_file, 'r'))
pp.pprint(json_data)
update_values(json_data)

f = open(dest_file, 'w')
json.dump(json_data, f, indent=4)