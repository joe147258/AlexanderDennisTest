// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
configureTimeSlot = () => {
    // Get Date from date selector
    let formDate = document.getElementById('formDate').value;
    let date = new Date(formDate);
    console.log(date.getDay());
    // Select and Options DOM element
    let timeSlotDiv = document.getElementById('formTimeSlotDiv');
    let selectVar = document.createElement("select");
    let optOne = document.createElement("option");
    let optTwo = document.createElement("option");
    let optThree = document.createElement("option");
    
    let pTag = document.createElement('p');

    // Remove all children in DOM
    timeSlotDiv.innerHTML = '';

    // Check if date is selected
    if (!formDate) {
        pTag.innerHTML = "Please select a date.";
        timeSlotDiv.append(pTag);
        return;
    }

    // Check if weekday
    if (date.getDay() === 6 || date.getDay() === 0) {
        pTag.innerHTML = "Please select a week day.";
        timeSlotDiv.append(pTag);
        return;
    }

    switch (date.getDay()) {
        case 1:
            optOne.innerHTML = "8:00 - 10:00";
            optOne.value = "8-10";

            optTwo.innerHTML = "11:00 - 13:00";
            optTwo.value = "11-13";

            optThree.innerHTML = "14:00 - 16:00";
            optThree.value = "14-16";
        case 2:
            console.log("Tues");
        case 3:
            console.log("Weds");
        case 4:
            console.log("Thurs");
        case 5:
            console.log("Fri");
    }

    selectVar.appendChild(optOne);
    selectVar.appendChild(optTwo);
    selectVar.appendChild(optThree);

    timeSlotDiv.appendChild(selectVar);
    
}