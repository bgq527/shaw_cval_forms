function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function generate_result(ufamily, utnstatus, ukystatus, uwetlanda, uwetlande) {
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit#gid=1201507778").getSheetByName("cval_spread").getDataRange().getValues()
  var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit#gid=0").getSheetByName("responses").getDataRange().getValues()
  var search_list = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1L6DKpJK5QSRpyWJLB7YdwJEgGoDEEuPC0Bd9p0qYh4M/edit#gid=0")
  var uemail = Session.getActiveUser().getEmail()

  var user_row = -1
  for (var row=1; row < response_sheet_read.length; row++){
    var sheet_row = parseInt(row) + 1
    if (uemail == response_sheet_read[row][0]){
      user_row = row
    }
  }


  var ret_string = '<table style="width:100%" id=customers>'
  ret_string = ret_string + "<th>Species</th>" + "<th>Your Submitted C-value</th>"
  for (var row in family_search){
    if (ufamily.toString().toLowerCase() == family_search[row][54].toString().toLowerCase() &&
      utnstatus.toString().toLowerCase() == family_search[row][50].toString().toLowerCase() &&
      ukystatus.toString().toLowerCase() == family_search[row][51].toString().toLowerCase() &&
      uwetlanda.toString().toLowerCase() == family_search[row][52].toString().toLowerCase() &&
      uwetlande.toString().toLowerCase() == family_search[row][53].toString().toLowerCase()
      ){
        var finished_str = ""
        var species_col = parseInt(row) + 9
        if (user_row != -1){
          Logger.log(family_search[row][1])
          Logger.log(response_sheet_read[user_row][species_col])
          if (response_sheet_read[user_row][species_col] != undefined && response_sheet_read[user_row][species_col].toString() != ""){
          finished_str = response_sheet_read[user_row][species_col].toString()
          }
        }
      ret_string = ret_string + "<tr>"
      ret_string = ret_string + '<td><a href="javascript:;" onclick="select_species(this.innerText)">'+ family_search[row][1] + '</a></td>' + "<td>" + finished_str + "</td>"
      ret_string = ret_string + "</tr>"
    }
  }
  ret_string = ret_string + "</table>"

  return ret_string
}

function gather_species_info(species_name){

  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit#gid=1201507778").getSheetByName("cval_spread").getDataRange().getValues()
  var search_list = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1L6DKpJK5QSRpyWJLB7YdwJEgGoDEEuPC0Bd9p0qYh4M/edit#gid=0")

  var species_row = -1

  for (var row in family_search){
    if (species_name.toString().toLowerCase() == family_search[row][1].toString().toLowerCase()){
      species_row = row
      break
    }
  }

  var ret_string = '<table width="50%" id=customers><tr><td><h2 id="species_name">' + species_name + '</h2><a target="_blank" href="https://dev.tnky.plantatlas.usf.edu/Plant.aspx?id='+ family_search[species_row][0] + '">View this specie on the TNKY Plant Atlas</a></td></tr>'
  ret_string = ret_string + '<tr><td><strong>Give this species a C-value: </strong><select id="ucval"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>'
  ret_string = ret_string + '<input type="button" value="Submit C-value" onclick="submit_cval()"/></tr></td></table><br>'

  var temp_ret_string = ret_string + '<hr><h3>C-values</h3><p>Taken from their respective region or database file.</p><table style="width:50%" id=customers><th>Location</th><th>C-value</th>'
  var num_info = 0
  for (var col = 2; col < 47; col++){
    if (family_search[species_row][col] != ""){
      temp_ret_string = temp_ret_string + "<tr>"
      temp_ret_string = temp_ret_string + '<td><a href="javascript:;">'+ family_search[0][col] + ' </a></td>' + "<td>" + family_search[species_row][col] + "</td>"
      temp_ret_string = temp_ret_string + "</tr>"
      num_info = num_info + 1
    }
  }

  temp_ret_string = temp_ret_string + "</table>" + "</table>"
  if (num_info != 0){

    ret_string = temp_ret_string
  }



  var temp_ret_string = ret_string + '<hr><h3>General Information</h3><p>Below are general information found, such as their global conservation status.</p><table style="width:50%" id=customers><th>Information</th><th>Value</th>'
  var num_info = 0
  for (var col = 47; col < 54; col++){
    if (family_search[species_row][col] != ""){
      temp_ret_string = temp_ret_string + "<tr>"
      temp_ret_string = temp_ret_string + '<td><a href="javascript:;">'+ family_search[0][col] + ' </a></td>' + "<td>" + family_search[species_row][col] + "</td>"
      temp_ret_string = temp_ret_string + "</tr>"
      num_info = num_info + 1
    }
  }

  temp_ret_string = temp_ret_string + "</table>" + "</table>"
  if (num_info != 0){

    ret_string = temp_ret_string
  }

  ret_string = ret_string + '<h4 id="species_row">'+ species_row +'</h4>'

  return ret_string
}

function generate_dropdown(){
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit#gid=1201507778").getSheetByName("cval_spread").getDataRange().getValues()
  var search_list = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1L6DKpJK5QSRpyWJLB7YdwJEgGoDEEuPC0Bd9p0qYh4M/edit#gid=0")
  var ret_string = '<div id="myDropdown" class="dropdown-content"><input type="text" placeholder="Search..." id="familysearch" onkeyup="filterFunction()">'

  var family_array = [];

  for (var row = 1; row < family_search.length; row++){
    var family_string = family_search[row][54].toString().toLowerCase()

    if (family_array.indexOf(family_string) == -1){
      ret_string = ret_string + '<p></p><a href="javascript:;" onclick="update_search(this.innerText)">'+ family_string + ' </a>'
      family_array.push(family_string)
    }
  }

  ret_string = ret_string + "</div>"
  return ret_string
}

function cval_to_sheet(species_name, species_row, ucval){
  var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit#gid=0").getSheetByName("responses").getDataRange().getValues()
  var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit#gid=0")
  var uemail = Session.getActiveUser().getEmail()

  Logger.log(ucval)
  Logger.log(uemail)
  Logger.log(species_name)

  species_row = parseInt(species_row) + 10

  var hrows = 1
  for (var row=1; row < response_sheet_read.length; row++){
    var sheet_row = parseInt(row) + 1
    if (uemail == response_sheet_read[row][0]){
      response_sheet.getRange("R" + sheet_row + "C" + species_row).setValue(ucval)
      hrows = -1
      break
    }
    hrows = row
  }

  if (hrows != -1){
    hrows = parseInt(hrows) + 1
    response_sheet.getRange("R" + hrows + "C1").setValue(uemail)
    response_sheet.getRange("R" + hrows + "C" + species_row).setValue(ucval)
//    response_sheet.getRange("R" + hrows + "C2").setValue(uemail)
  }

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

function print_text(text){
}
