$(document).ready(function() {
  $('#boundsForm').validate({
    rules: {
      clbound: {
        required: true,
        number: true,
        min: 1,
        max: 50
      },
      cubound: {
        required: true,
        number: true,
        min: 1,
        max: 50
      },
      rlbound: {
        required: true,
        number: true,
        min: 1,
        max: 50
      },
      rubound: {
        required: true,
        number: true,
        min: 1,
        max: 50
      }
    },
    messages: {
      clbound: {
        required: "Column Lower Bound is required.",
        number: "Column Lower Bound should be a number.",
        min: "Column Lower Bound should be at least 1.",
        max: "Column Lower Bound should be at most 50."
      },
      cubound: {
        required: "Column Upper Bound is required.",
        number: "Column Upper Bound should be a number.",
        min: "Column Upper Bound should be at least 1.",
        max: "Column Upper Bound should be at most 50."
      },
      rlbound: {
        required: "Row Lower Bound is required.",
        number: "Row Lower Bound should be a number.",
        min: "Row Lower Bound should be at least 1.",
        max: "Row Lower Bound should be at most 50."
      },
      rubound: {
        required: "Row Upper Bound is required.",
        number: "Row Upper Bound should be a number.",
        min: "Row Upper Bound should be at least 1.",
        max: "Row Upper Bound should be at most 50."
      }
    },

    errorClass: 'custom-error-message', // Add a custom CSS class for error messages

    submitHandler: function(form) {
      var clbound = parseInt($('#clbound').val());
      var cubound = parseInt($('#cubound').val());
      var rlbound = parseInt($('#rlbound').val());
      var rubound = parseInt($('#rubound').val());

      var rangeValidationResult = rangeValidation(clbound, cubound, rlbound, rubound);
      if (rangeValidationResult !== true) {
        $('#lowerBoundError').html('<p>Error: ' + rangeValidationResult + '</p>');
        $('#multiTable').empty(); // Remove the table
        return false;
      }

      var lowerBoundLargerResult = lowerBoundLarger(clbound, cubound, rlbound, rubound);
      if (lowerBoundLargerResult !== true) {
        $('#lowerBoundError').html('<p>Error: ' + lowerBoundLargerResult + '</p>');
        $('#multiTable').empty(); // Remove the table
        return false;
      }

      var numRows = rubound - rlbound + 2;
      var numCols = cubound - clbound + 2;

      multiplicationTable(clbound, rlbound, numRows, numCols);
      $('#lowerBoundError').empty(); // Remove the error message

      return false;
    }
  });

  // Initialize sliders and bind their values to input fields
  $("#clSlider").slider({
    min: 1,
    max: 50,
    slide: function(event, ui) {
      $("#clbound").val(ui.value); // Update input field value
      updateTable();
    }
  });

  $("#cuSlider").slider({
    min: 1,
    max: 50,
    slide: function(event, ui) {
      $("#cubound").val(ui.value); // Update input field value
      updateTable();
    }
  });

  $("#rlSlider").slider({
    min: 1,
    max: 50,
    slide: function(event, ui) {
      $("#rlbound").val(ui.value); // Update input field value
      updateTable();
    }
  });

  $("#ruSlider").slider({
    min: 1,
    max: 50,
    slide: function(event, ui) {
      $("#rubound").val(ui.value); // Update input field value
      updateTable();
    }
  });

  // Update sliders when input values change
  $("#clbound").on("input", function() {
    var value = parseInt($(this).val());
    $("#clSlider").slider("value", value); // Update slider value
    updateTable();
  });

  $("#cubound").on("input", function() {
    var value = parseInt($(this).val());
    $("#cuSlider").slider("value", value); // Update slider value
    updateTable();
  });

  $("#rlbound").on("input", function() {
    var value = parseInt($(this).val());
    $("#rlSlider").slider("value", value); // Update slider value
    updateTable();
  });

  $("#rubound").on("input", function() {
    var value = parseInt($(this).val());
    $("#ruSlider").slider("value", value); // Update slider value
    updateTable();
  });

  function updateTable() {
    var clbound = parseInt($('#clbound').val());
    var cubound = parseInt($('#cubound').val());
    var rlbound = parseInt($('#rlbound').val());
    var rubound = parseInt($('#rubound').val());

    var rangeValidationResult = rangeValidation(clbound, cubound, rlbound, rubound);
    if (rangeValidationResult !== true) {
      $('#lowerBoundError').html('<p>Error: ' + rangeValidationResult + '</p>');
      $('#multiTable').empty(); // Remove the table
      return;
    }

    var lowerBoundLargerResult = lowerBoundLarger(clbound, cubound, rlbound, rubound);
    if (lowerBoundLargerResult !== true) {
      $('#lowerBoundError').html('<p>Error: ' + lowerBoundLargerResult + '</p>');
      $('#multiTable').empty(); // Remove the table
      return;
    }

    var numRows = rubound - rlbound + 2;
    var numCols = cubound - clbound + 2;

    multiplicationTable(clbound, rlbound, numRows, numCols);
    $('#lowerBoundError').empty(); // Remove the error message
  }

  function multiplicationTable(clbound, rlbound, numRows, numCols) {
    var multiTable = $("#multiTable");
    multiTable.empty();

    var table = $('<table>');

    var i, j, row, multiCell, currentRowVal, currentColVal;

    for (i = 0; i < numRows; i++) {
      row = $('<tr>');

      for (j = 0; j < numCols; j++) {
        multiCell = $('<td>');

        if (i === 0 && j === 0) {
          multiCell.html("X");
        } else if (i === 0) {
          currentColVal = clbound + j - 1;
          multiCell.html(currentColVal);
        } else if (j === 0) {
          currentRowVal = rlbound + i - 1;
          multiCell.html(currentRowVal);
        } else {
          currentRowVal = rlbound + i - 1;
          currentColVal = clbound + j - 1;
          multiCell.html(currentRowVal * currentColVal);
        }
        row.append(multiCell);
      }
      table.append(row);
    }
    multiTable.append(table);
  }

  function rangeValidation(clbound, cubound, rlbound, rubound) {
    if (clbound < 1 || clbound > 50) {
      return "Column Lower Bound should be between 1 and 50.";
    }

    if (cubound < 1 || cubound > 50) {
      return "Column Upper Bound should be between 1 and 50.";
    }

    if (rlbound < 1 || rlbound > 50) {
      return "Row Lower Bound should be between 1 and 50.";
    }

    if (rubound < 1 || rubound > 50) {
      return "Row Upper Bound should be between 1 and 50.";
    }

    return true;
  }

  function lowerBoundLarger(clbound, cubound, rlbound, rubound) {
    if (clbound > cubound) {
      return "Column Lower Bound is larger than the Column Upper Bound.";
    }

    if (rlbound > rubound) {
      return "Row Lower Bound is larger than the Row Upper Bound.";
    }

    return true;
  }
});
