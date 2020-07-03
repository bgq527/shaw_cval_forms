function create_headers() {
  var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing")
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit?usp=sharing").getSheetByName("cval_spread").getDataRange().getValues()

  var species = []
  for (var row = 1; row < family_search.length; row++) {
    species.push(family_search[row][1])
  }



  response_sheet.getRange("EWW1:KFB1").setValues([species])
}
