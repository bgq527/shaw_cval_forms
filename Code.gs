function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);

}

function check_id(id) {
  var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing").getSheetByName("responses").getDataRange().getValues()
  var user_name = ''
  var uid = ''
  var urow = ''

  for (var row = 1; row < response_sheet_read.length; row++) {
    var sheet_row = parseInt(row) + 1
    if (id == response_sheet_read[row][0]) {

      user_name = response_sheet_read[row][1]
      urow = row
      uid = id
    }
  }

  if (urow == '') {

    return 0
  } else {
    var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing")
    var srow = parseInt(urow) + 1
    response_sheet.getRange("R" + srow + "C" + 3).setValue('login')
    return [uid, urow, user_name]
  }

}

function generate_result(urow, ufamily, utnstatus, ukystatus, uwetlanda, uwetlande, ufinished) {

  function check_equality(search_parameter, found_value) {

    if (search_parameter == "any") {
      return true
    } else if (search_parameter == found_value) {

      return true
    } else if (search_parameter == "no" && found_value == "") {

      return true
    } else {

      return false
    }
  }

  var srow = parseInt(urow) + 1
  while (true) {
    var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing")
    var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing").getSheetByName("responses").getDataRange().getValues()
    SpreadsheetApp.flush()
    if (response_sheet_read[urow][2] != 'writing') {
      response_sheet.getRange("R" + srow + "C" + 3).setValue('')
      break
    }
  }
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit?usp=sharing").getSheetByName("cval_spread").getDataRange().getValues()
  var ret_string = '<h2>Search results</h2><table style="width:60%" id=customers>'
  ret_string = ret_string + "<th>Species</th>" + "<th>Your Submitted C-value</th>"
  for (var row = 1; row < family_search.length; row++) {

    var finished_str = ""
    var species_col = parseInt(row) + 9
    if (urow != -1) {
      if (response_sheet_read[urow][species_col] != undefined && response_sheet_read[urow][species_col].toString() != "") {
        finished_str = response_sheet_read[urow][species_col].toString()
      }
    }

    if (ufamily.toString() == "") {

      ufamily = "any"
    }

    if (check_equality(ufamily.toString().toLowerCase(), family_search[row][54].toString().toLowerCase()) &&
      check_equality(utnstatus.toString().toLowerCase(), family_search[row][50].toString().toLowerCase()) &&
      check_equality(ukystatus.toString().toLowerCase(), family_search[row][51].toString().toLowerCase()) &&
      check_equality(uwetlanda.toString().toLowerCase(), family_search[row][52].toString().toLowerCase()) &&
      check_equality(uwetlande.toString().toLowerCase(), family_search[row][53].toString().toLowerCase()) &&
      check_equality(ufinished.toString().toLowerCase(), finished_str)
    ) {


      ret_string = ret_string + "<tr>"
      ret_string = ret_string + '<td><a href="javascript:;" onclick="select_species(this.innerText)">' + family_search[row][1] + '</a></td>' + "<td>" + finished_str + "</td>"
      ret_string = ret_string + "</tr>"
    }
  }
  ret_string = ret_string + "</table>"

  return [-1, ret_string]
}

function gather_species_info(species_name) {
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit?usp=sharing").getSheetByName("cval_spread").getDataRange().getValues()

  var species_row = -1
  for (var row in family_search) {
    if (species_name.toString().toLowerCase() == family_search[row][1].toString().toLowerCase()) {
      species_row = row
      break
    }
  }

  var ret_string = '<table style="width:60%" id=customers><tr><td><h2 id="species_name">' + species_name + '</h2><a target="_blank" href="https://dev.tnky.plantatlas.usf.edu/Plant.aspx?id=' + family_search[species_row][0] + '">View this specie on the TNKY Plant Atlas</a></td></tr>'
  ret_string = ret_string + '<tr><td><strong>Give this species a C-value: </strong><select id="ucval"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>'
  ret_string = ret_string + ' <input type="button" class="create" value="Submit C-value" onclick="submit_cval()"/></tr></td></table><br>'

  var temp_ret_string = ret_string + '<hr width="60%"><h2>C-values</h2><table style="width:60%" id=customers><th>Location</th><th>C-value</th>'
  var num_info = 0
  for (var col = 2; col < 47; col++) {
    if (family_search[species_row][col] != "") {
      temp_ret_string = temp_ret_string + "<tr>"
      temp_ret_string = temp_ret_string + '<td><a href="javascript:;">' + family_search[0][col] + ' </a></td>' + "<td>" + family_search[species_row][col] + "</td>"
      temp_ret_string = temp_ret_string + "</tr>"
      num_info = num_info + 1
    }
  }

  temp_ret_string = temp_ret_string + '</table></table><br>'
  if (num_info != 0) {

    ret_string = temp_ret_string
  }

  var temp_ret_string = ret_string + '<hr width="60%"><h2>General Information</h2><table style="width:60%" id=customers><th>Information</th><th>Value</th>'
  var num_info = 0
  for (var col = 47; col < 54; col++) {
    if (family_search[species_row][col] != "") {
      temp_ret_string = temp_ret_string + "<tr>"
      temp_ret_string = temp_ret_string + '<td><a href="javascript:;">' + family_search[0][col] + ' </a></td>' + "<td>" + family_search[species_row][col] + "</td>"
      temp_ret_string = temp_ret_string + "</tr>"
      num_info = num_info + 1
    }
  }

  temp_ret_string = temp_ret_string + '</table></table><br>'
  if (num_info != 0) {

    ret_string = temp_ret_string
  }

  return [species_row, ret_string]
}

function generate_dropdown() {
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit?usp=sharing").getSheetByName("cval_spread").getDataRange().getValues()
  var ret_string = '<div id="myDropdown" class="dropdown-content"><input type="text" placeholder="Search family" id="familysearch" onkeyup="filterFunction()">'

  var family_array = [];

  for (var row = 1; row < family_search.length; row++) {
    var family_string = family_search[row][54].toString().toLowerCase()

    if (family_array.indexOf(family_string) == -1) {
      ret_string = ret_string + '<p></p><a href="javascript:;" onclick="update_search(this.innerText)" style="color: white;">' + family_string + ' </a>'
      family_array.push(family_string)
    }
  }
  ret_string = ret_string + "</div>"
  return ret_string
}

function cval_to_sheet(urow, species_row, ucval) {

  var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing")
  urow = parseInt(urow) + 1
  species_row = parseInt(species_row) + 10

  response_sheet.getRange("R" + urow + "C" + 3).setValue('writing')
  SpreadsheetApp.flush()
  response_sheet.getRange("R" + urow + "C" + species_row).setValue(ucval)
  SpreadsheetApp.flush()
  response_sheet.getRange("R" + urow + "C" + 3).setValue('')

  return 0

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
