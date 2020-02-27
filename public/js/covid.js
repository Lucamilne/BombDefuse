//enables dropdown
$('.ui.dropdown')
  .dropdown()
  ;

//enable household-size segment once province is chosen
$("#province-dropdown").change(function () {
  $("#household-size").removeClass("disabled")
  $("#household-size-selector .button").removeClass("disabled")
});

//add active class to clicked button
$(".ui.inverted.button").click(function () {
  $(this).addClass("active")
  $(this).siblings().removeClass("active")
});

//--- household-size section 

//enable household-status part of form once household-size is selected
$("#household-size-selector .button").click(function () {
  $("#household-status").removeClass("disabled")
  $("#household-status .ui.buttons").children().removeClass("disabled")
});

//updates household-size input with value of btn clicked
$("#household-size-selector .button").click(function () {
  $("#household-size-selector input").val($(this).val());
})

//--- #household-status section

//toggle form #infected-query
$("#infected-query .button").click(function () {
  toggleForm("infected");
});

//toggle form #deceased-query
$("#deceased-query .button").click(function () {
  toggleForm("deceased");
});

function toggleForm(str) {
  if ($(`#${str}-query .yes.button`).hasClass("active")) {
    $(`#${str}-number`).show();
  } else {
    $(`#${str}-number`).hide();
  }
}

//adds value "1" to infected input when clicked
$("#infected-query .no").click(function () {
  $("#infected-query input").val("1");
  $("#infected-number").dropdown("clear")
})

//removes input value if nothing is selected from infected dropdown
$("#infected-query .yes").click(function () {
  if ($("#infected-number").dropdown("get value") === "") {
    $("#infected-query input").val("");
  }
})

//adds value "0" to deceased input when clicked
$("#deceased-query .no").click(function () {
  $("#deceased-query input").val("0");
  $("#deceased-number").dropdown("clear")
})

//removes input value if nothing is selected from deceased dropdown
$("#deceased-query .yes").click(function () {
  if ($("#deceased-number").dropdown("get value") === "") {
    $("#deceased-query input").val("");
  }
})

//adds value #infected-number based on dropdown selection
$("#infected-number").change(function () {
  var value = $(this).dropdown("get value");
  $("#infected-query input").val(value);
});

//adds value #deceased-number based on dropdown selection
$("#deceased-number").change(function () {
  var value = $(this).dropdown("get value");
  $("#deceased-query input").val(value);
});

//checks if form is complete and enables the submit btn (needs cleaning up)
$("#household-status").on("click change", function () {
  if (
    $("#infected-query input").val() !== ""
    &&
    $("#deceased-query input").val() !== ""
  ) {
    $("#submit").removeClass("disabled");
    $("#submit-btn").removeClass("disabled");
  } else {
    $("#submit").addClass("disabled");
    $("#submit-btn").addClass("disabled");
  }
});
