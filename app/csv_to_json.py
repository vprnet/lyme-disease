import csv
import json

f = csv.reader(open('app/static/data/lyme-disease-data.csv', 'rU'))
states = [l for l in f]

del states[0]

py_dict = {}
for state in states:
    cases = state[1:-2]
    py_dict[state[0]] = {'cases': cases,
        'growthRate': state[-1].rstrip("0"),
        'incidentRate': state[-2].rstrip("0")}

with open('app/static/data/lyme-data.json', 'w') as outfile:
    json.dump(py_dict, outfile)
