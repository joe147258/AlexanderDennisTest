// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// I've tried to keep jQuery use to a minimum here to keep it similar to React, etc

const nonSelectedConst = "nonSelected";

// Functions to run on launch.
window.onload = function () {
    setMinDate();
};

configureTimeSlot = () => {
    // Get Date from date selector
    let formDate = document.getElementById('formDate').value;
    let date = new Date(formDate);
    console.log(date.getDay());
    // Select and Options DOM element
    let timeSlotDiv = document.getElementById('formTimeSlotDiv');
    let selectVar = document.createElement("select");
    selectVar.setAttribute('class', 'form-select');
    selectVar.setAttribute('id', 'formTimeSlotSelect');
    let optOne = document.createElement("option");
    let optTwo = document.createElement("option");
    let optThree = document.createElement("option");
    
    let div = document.createElement('div');
    div.setAttribute('class', 'alert alert-primary');
    // Remove all children from div in DOM
    timeSlotDiv.innerHTML = '';

    // Check if date is selected
    if (!formDate) {
        div.innerHTML = "Please select a date.";
        timeSlotDiv.append(div);
        return;
    }

    // Check if weekday
    if (date.getDay() === 6 || date.getDay() === 0) {
        div.innerHTML = "Please select a week day.";
        timeSlotDiv.append(div);
        return;
    }

    switch (date.getDay()) {
        case 1:
        case 3:
            optOne.innerHTML = "8:00 - 10:00";
            optOne.value = "8:00 - 10:00";

            optTwo.innerHTML = "11:00 - 13:00";
            optTwo.value = "11:00 - 13:00";

            optThree.innerHTML = "14:00 - 16:00";
            optThree.value = "14:00 - 16:00";
            break;
        case 2:
        case 4:
            optOne.innerHTML = "9:00 - 11:00";
            optOne.value = "9:00 - 11:00";

            optTwo.innerHTML = "12:00 - 14:00";
            optTwo.value = "12:00 - 14:00";

            optThree.innerHTML = "15:00 - 17:00";
            optThree.value = "15:00 - 17:00";
            break;
        case 5:
            optOne.innerHTML = "8:00 - 10:00";
            optOne.value = "8:00 - 10:00";

            optTwo.innerHTML = "11:00 - 13:00";
            optTwo.value = "11:00 - 13:00";
            break;
    }

    selectVar.appendChild(optOne);
    selectVar.appendChild(optTwo);
    if (date.getDay() != 5) selectVar.appendChild(optThree);
    
    timeSlotDiv.appendChild(selectVar);
}

removeInvalid = (id) => {
    document.getElementById(id).classList.remove("is-invalid");
    $('#contactNumberPopover').popover('hide');
    $('#jobCatPopover').popover('hide');
    $('#jobCatPopover').popover('disable');
}

validateFormInputs = (e) => {
    e.preventDefault();
    document.getElementById("engineerForm").reportValidity();;


    const phoneNumber = document.getElementById('formContactNumber').value;
    const jobCategory = document.getElementById('formJobCategory').value;

    const phoneNumberPattern = /^(\+)?([ 0-9]){10,16}$/

    if (!phoneNumberPattern.test(phoneNumber)) {
        document.getElementById('formContactNumber').classList.add("is-invalid");
        $('#contactNumberPopover').popover('show');
        return;
    }
    
    if (jobCategory === nonSelectedConst) {
        document.getElementById('formJobCategory').classList.add("is-invalid");
        $('#jobCatPopover').popover('enable');
        $('#jobCatPopover').popover('show');
        return;
    }

    let formData = objectifyForm($('#engineerForm').serializeArray());
    console.log(formData)
    fetch("/api/book", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(res => {
            if (res.ok) {
                document.getElementById("engineerForm").reset();
                $('#successModal').modal('show');
            }
            else {
                alert("Failed to send data.");
            }
        })
        .catch((error) => {
            alert("Failed to send data.");
        });
}

setTimeSlot = () => {
    const timeSlot = document.getElementById('formTimeSlotSelect').value;
    document.getElementById('formTimeSlot').value = timeSlot;
}

clearTimeSlot = () => {
    document.getElementById('formTimeSlot').value = '';
}

// Serialize data function
// https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

 setMinDate = () => {
    var minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    
    const dateInput = document.getElementById('formDate');

    let month = minDate.getMonth() + 1;
    let day = minDate.getDate();
    let year = minDate.getFullYear();

    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();
    var minDateString = year + '-' + month + '-' + day;

    dateInput.setAttribute('min', minDateString)
}