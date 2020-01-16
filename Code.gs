function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function generate_result(ufamily) {
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit#gid=1201507778").getSheetByName("cval_spread").getDataRange().getValues()
  var search_list = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1L6DKpJK5QSRpyWJLB7YdwJEgGoDEEuPC0Bd9p0qYh4M/edit#gid=0")

  var ret_string = '<table style="width:75%">'
      ret_string = ret_string + "<th>"
      ret_string = ret_string + "<td>Species</td>" + "<td>Finished?</td>" + "<td>Link to form</td>"
      ret_string = ret_string + "</th>"
  for (var row in family_search){
    if (ufamily.toString().toLowerCase() == family_search[row][53].toString().toLowerCase()){
      ret_string = ret_string + "<tr>"
      ret_string = ret_string + "<td>" + family_search[row][1] + "</td>" + "<td>" + family_search[row][52] + "</td>" + "<td><a href=" + family_search[row][55] + ">Form link</a></td>"
      ret_string = ret_string + "</tr>"
    }
  }

  Logger.log(ret_string)
  ret_string = ret_string + "</table>"

  return ret_string
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

function print_text(text){
  Logger.log(text)
}
