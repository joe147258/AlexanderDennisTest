// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const nonSelectedConst = "nonSelected";

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
        case 2:
        case 4:
            optOne.innerHTML = "9:00 - 11:00";
            optOne.value = "9:00 - 11:00";

            optTwo.innerHTML = "12:00 - 14:00";
            optTwo.value = "12:00 - 14:00";

            optThree.innerHTML = "15:00 - 17:00";
            optThree.value = "15:00 - 17:00";
        case 5:
            optOne.innerHTML = "8:00 - 10:00";
            optOne.value = "8:00 - 10:00";

            optTwo.innerHTML = "11:00 - 13:00";
            optTwo.value = "11:00 - 13:00";
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
}

setTimeSlot = () => {
    const timeSlot = document.getElementById('formTimeSlotSelect').value;
    document.getElementById('formTimeSlot').value = timeSlot;
}

clearTimeSlot = () => {
    document.getElementById('formTimeSlot').value = '';
}