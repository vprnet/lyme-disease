from google_spreadsheet.api import SpreadsheetAPI
from config import GOOGLE_SPREADSHEET


def list_sheets():
    """The API sheet_key is not the same as the key in the URL. This function
    just prints out all sheet keys"""
    api = SpreadsheetAPI(GOOGLE_SPREADSHEET['USER'],
        GOOGLE_SPREADSHEET['PASSWORD'],
        GOOGLE_SPREADSHEET['SOURCE'])
    spreadsheets = api.list_spreadsheets()
    for sheet in spreadsheets:
        print sheet


def get_google_sheet(sheet_key='1gvZaPys4MZxUT1qwXQJkPqupnfdxODgLEA-f4MJzAM8', sheet_id='od7'):
    """Uses python_google_spreadsheet API to interact with sheet"""
    api = SpreadsheetAPI(GOOGLE_SPREADSHEET['USER'],
        GOOGLE_SPREADSHEET['PASSWORD'],
        GOOGLE_SPREADSHEET['SOURCE'])
    sheet = api.get_worksheet(sheet_key, sheet_id)
    print sheet
    sheet_object = sheet.get_rows()
    return sheet_object


def sheet_to_json():
    sheet = get_google_sheet()
    print sheet

sheet_to_json()
