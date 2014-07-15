#!/usr/bin/python
import csv


def csv_to_list(filename="app/static/data/vpr-lyme-disease-new-england.csv"):
    """Converts a very specific CSV file into a Python dictionary,
    nor for general use"""
    dont_include = ['State', 'Northern New England', 'New England']
    with open(filename, mode='rU') as infile:
        reader = csv.reader(infile)
        mydict = [(rows[0], rows[-3], rows[-1], rows[1], rows[-4])
            for rows in reader if rows[0] not in dont_include]
    return mydict
