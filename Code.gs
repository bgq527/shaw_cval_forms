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

function get_read_sheet(){
  var family_search = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1rH7K7ytcVMY-8k3piNH19z899FEJpZSD7G7p8-yUEKU/edit?usp=sharing").getSheetByName("cval_spread").getDataRange().getValues()
  return family_search
}

function generate_result(urow, family_search, ufamily, umajorgroup, utnstatus, ukystatus, uwetlanda, uwetlande, usupport, ufinished) {

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
    SpreadsheetApp.flush()
    SpreadsheetApp.flush()
    SpreadsheetApp.flush()
    var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing").getSheetByName("responses").getDataRange().getValues()
    SpreadsheetApp.flush()
    SpreadsheetApp.flush()
    SpreadsheetApp.flush()
    if (response_sheet_read[urow][2] != 'writing') {
      response_sheet.getRange("R" + srow + "C" + 3).setValue('')
      break
    }
  }

  var ret_string = '<h2>Search results</h2><table style="width:80%" id=customers>'
  ret_string = ret_string + "<th>Species</th>" + "<th>Your Submitted C-value</th>" + "<th>Your Submitted Additional Notes</th>"
  for (var row = 1; row < family_search.length; row++) {

    var cval_str = ""
    var notes_str = ""
    var species_col = parseInt(row) + 9
    var notes_col = parseInt(row) + 3999
    if (urow != -1) {
      if (response_sheet_read[urow][species_col] != undefined && response_sheet_read[urow][species_col].toString() != "") {
        cval_str = response_sheet_read[urow][species_col].toString()
      }

      if (response_sheet_read[urow][notes_col] != undefined && response_sheet_read[urow][notes_col].toString() != "") {
        notes_str = response_sheet_read[urow][notes_col].toString()
      }
    }

    if (ufamily.toString() == "") {

      ufamily = "any"
    }

    if (check_equality(ufamily.toString().toLowerCase(), family_search[row][54].toString().toLowerCase()) &&
      check_equality(umajorgroup.toString().toLowerCase(), family_search[row][56].toString().toLowerCase()) &&
      check_equality(utnstatus.toString().toLowerCase(), family_search[row][50].toString().toLowerCase()) &&
      check_equality(ukystatus.toString().toLowerCase(), family_search[row][51].toString().toLowerCase()) &&
      check_equality(uwetlanda.toString().toLowerCase(), family_search[row][52].toString().toLowerCase()) &&
      check_equality(uwetlande.toString().toLowerCase(), family_search[row][53].toString().toLowerCase()) &&
//      check_equality(usupport.toString().toLowerCase(), family_search[row][57].toString().toLowerCase()) &&
      check_equality(ufinished.toString().toLowerCase(), cval_str) &&
      (family_search[row][58].toString() == "*" || family_search[row][59].toString() == "*")
    ) {


      ret_string = ret_string + "<tr>"
      ret_string = ret_string + '<td><a href="javascript:;" onclick="select_species(this.innerText)">' + family_search[row][1] + '</a></td>' + "<td>" + cval_str + "</td>" + "<td>" + notes_str + "</td>"
      ret_string = ret_string + "</tr>"
    }
  }
  ret_string = ret_string + "</table>"

  return [-1, ret_string]
}

function gather_species_info(species_name, family_search) {
  var species_row = -1
  for (var row in family_search) {
    if (species_name.toString().toLowerCase() == family_search[row][1].toString().toLowerCase()) {
      species_row = row
      break
    }
  }

  var ret_string = '<table style="width:60%" id=customers><tr><td><h2 id="species_name">' + species_name + '</h2><a target="_blank" href="https://dev.tnky.plantatlas.usf.edu/Plant.aspx?id=' + family_search[species_row][0] + '">View this specie on the TNKY Plant Atlas</a></td></tr>'
  ret_string = ret_string + '<tr><td><strong>Give this species a C-value: </strong><select id="ucval"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="*">Mark as seen/Skip</option><option value="">Delete</option></select>'
  ret_string = ret_string + ' <input type="text" id="speciesnotes" placeholder="Additional notes"/> <input type="button" class="create" value="Submit C-value" onclick="submit_cval()"/></tr></td></table><br>'

  var temp_ret_string = ret_string + '<hr width="60%"><h2>C-values</h2><table style="width:60%" id=customers><th>Location</th><th>C-value</th>'
  var num_info = 0
  var exclude_columns = [
    '"Appalachian Mountains of KY, TN, NC, SC, GA, AL"',
    "Coastal Plain of the Southeast",
    "Illinois",
    "Indiana",
    '"Interior Plateau of KY, TN, AL"',
    "Missouri",
    '"Piedmont Region of the Southeast NC, SC, GA, AL, MS, FL, TN, KY"',
    "Southern Coastal Plain",
    "West Virginia"
]
  for (var col = 2; col < 47; col++) {
    if ((family_search[species_row][col] != "" || family_search[species_row][col] == "0") && !(exclude_columns.indexOf(family_search[0][col]) >= 0)) {
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

function generate_dropdown(urow, family_search, save_family) {

  function getAllIndexes(arr, val) {
    var indexes = [],
      i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
    return indexes;
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

  var response_sheet_read = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing").getSheetByName("responses").getDataRange().getValues()
  var ret_string = '<input type="text" value="' + save_family + '" placeholder="Search family" id="familysearch" onkeyup="filterFunction()"><div id="myDropdown" class="dropdown-content">'

  var family_array = []
  var full_family_array = []

  for (var row in family_search) {
      full_family_array.push(family_search[row][54].toString().toLowerCase())
  }

  for (var row = 1; row < family_search.length; row++) {
    var family_string = family_search[row][54].toString().toLowerCase()

    if (family_array.indexOf(family_string) == -1 && (family_search[row][58].toString() == "*" || family_search[row][59].toString() == "*")) {
      var all_occurences = getAllIndexes(full_family_array, family_string)
      var complete = 2

      for (var index in all_occurences) {
        var occurence_col = parseInt(all_occurences[index]) + 9
        if (response_sheet_read[urow][occurence_col] == "" || response_sheet_read[urow][occurence_col] == undefined) {
          complete = 0
        } else if (response_sheet_read[urow][occurence_col] == "*") {

          complete = 1
        }
      }

      if (complete == 2) {

        ret_string = ret_string + '<p></p><a href="javascript:;" onclick="update_search(this.innerText)" style="color: #75e091;">' + family_string + ' </a>'
      } else if (complete == 1) {

        ret_string = ret_string + '<p></p><a href="javascript:;" onclick="update_search(this.innerText)" style="color: yellow;">' + family_string + ' </a>'
      } else {

        ret_string = ret_string + '<p></p><a href="javascript:;" onclick="update_search(this.innerText)" style="color: white;">' + family_string + ' </a>'
      }

      family_array.push(family_string)
    }
  }

  ret_string = ret_string + "</div>"
  return ret_string
}

function cval_to_sheet(urow, species_row, ucval, unotes) {

  var response_sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VfRA50cj9PO5sTcqdBrl8riJZqzcmWbpmoRZRlOJlOw/edit?usp=sharing")
  urow = parseInt(urow) + 1
  var notes_col = parseInt(species_row) + 4000
  species_row = parseInt(species_row) + 10

  response_sheet.getRange("R" + urow + "C" + 3).setValue('writing')
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  response_sheet.getRange("R" + urow + "C" + species_row).setValue(ucval)
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  response_sheet.getRange("R" + urow + "C" + notes_col).setValue(unotes)
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  SpreadsheetApp.flush()
  response_sheet.getRange("R" + urow + "C" + 3).setValue('')

  return 0

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
