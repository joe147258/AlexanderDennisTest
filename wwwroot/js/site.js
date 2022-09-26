// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// I've tried to keep jQuery use to a minimum here to keep it similar to React, etc

const nonSelectedConst = "nonSelected";

// Functions to run on launch.
window.onload = function () {
    if (window.location.href.includes("SearchDatabase")) {
        initialiseDatabaseTable();
    }
    else {
        setMinDate();
    }
    
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
    
    let optDefault = document.createElement("option");
    optDefault.innerHTML = "Select time slot";
    optDefault.value = "";
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

    fetch("/api/GetBookedSlots/" + formDate, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (optOne.value === data[i]) {
                    optOne.disabled = true;
                    if (!optOne.innerHTML.includes('(BOOKED)')) optOne.innerHTML = optOne.innerHTML + " (BOOKED)";
                }
                if (optTwo.value === data[i]) {
                    optTwo.disabled = true;
                    if (!optTwo.innerHTML.includes('(BOOKED)')) optTwo.innerHTML = optTwo.innerHTML + " (BOOKED)";
                }
                if (optThree.value === data[i]) {
                    optThree.disabled = true;
                    if (!optThree.innerHTML.includes('(BOOKED)')) optThree.innerHTML = optThree.innerHTML + " (BOOKED)";
                }
            }
        });
    selectVar.appendChild(optDefault);
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

    if (!document.getElementById("engineerForm").reportValidity()) return;

    let formData = objectifyForm($('#engineerForm').serializeArray());
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

initialiseDatabaseTable = () => {
    fetch("/api/GetAllBookings/", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            let databaseTableBody = document.getElementById('databaseTableBody');
            for (var i = 0; i < data.length; i++) {
                let row = document.createElement('tr');

                let id = document.createElement('td');
                id.innerHTML = data[i].id;

                let addressLineOne = document.createElement('td');
                addressLineOne.innerHTML = data[i].AddressLineOne;

                let addressLineTwo = document.createElement('td');
                addressLineTwo.innerHTML = data[i].AddressLineTwo;

                let city = document.createElement('td');
                city.innerHTML = data[i].City;

                let county = document.createElement('td');
                county.innerHTML = data[i].County;

                let postCode = document.createElement('td');
                postCode.innerHTML = data[i].PostCode;

                let firstName = document.createElement('td');
                firstName.innerHTML = data[i].FirstName;

                let lastName = document.createElement('td');
                lastName.innerHTML = data[i].LastName;

                let email = document.createElement('td');
                email.innerHTML = data[i].Email;

                let number = document.createElement('td');
                number.innerHTML = data[i].ContactNumber;

                let jobCategory = document.createElement('td');
                jobCategory.innerHTML = data[i].JobCategory;

                let registration = document.createElement('td');
                registration.innerHTML = data[i].Registration;

                let date = document.createElement('td');
                date.innerHTML = data[i].BookingDate;

                let time = document.createElement('td');
                time.innerHTML = data[i].TimeSlot;

                let comment = document.createElement('td');
                comment.innerHTML = "<a href=\"#\" onclick=\"openComment(this)\" data-comment=\"" + data[i].Comment + "\">View Comment</a>"

                row.appendChild(id);
                row.appendChild(addressLineOne);
                row.appendChild(addressLineTwo);
                row.appendChild(city);
                row.appendChild(county);
                row.appendChild(postCode);
                row.appendChild(firstName);
                row.appendChild(lastName);
                row.appendChild(email);
                row.appendChild(number);
                row.appendChild(jobCategory);
                row.appendChild(registration);
                row.appendChild(date);
                row.appendChild(time);
                row.appendChild(comment);
                databaseTableBody.appendChild(row);
            }
        });
}

searchDatabaseTable = () => {
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("databaseTable");
    tr = table.getElementsByTagName("tr"), th = table.getElementsByTagName("th");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        for (var j = 0; j < th.length; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

openComment = (comment) => {
    let commentContent = comment.getAttribute("data-comment");
    let paragraph = document.getElementById('commentModalPara');
    paragraph.innerHTML = '';
    paragraph.innerHTML = commentContent;
    $('#commentModal').modal('show');
}

specificSearch = () => {
    fetch("/api/GetDatabaseBooking/" + document.getElementById('specificSearch').value, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            let paragraph = document.getElementById('specificEntryModalPara');
            paragraph.innerHTML = '';
            let id = document.createElement('p');
            id.innerHTML = "ID: " + data[0].id;

            let addressLineOne = document.createElement('p');
            addressLineOne.innerHTML = "Adress Line One: " + data[0].AddressLineOne;

            let addressLineTwo = document.createElement('p');
            addressLineTwo.innerHTML = "Adress Line Two: " + data[0].AddressLineTwo;

            let city = document.createElement('p');
            city.innerHTML = "City: " + data[0].City;

            let county = document.createElement('p');
            county.innerHTML = "County: " + data[0].County;

            let postCode = document.createElement('p');
            postCode.innerHTML = "Post Code: " +  data[0].PostCode;

            let firstName = document.createElement('p');
            firstName.innerHTML = "First Name: " + data[0].FirstName;

            let lastName = document.createElement('p');
            lastName.innerHTML = "Last Name: " + data[0].LastName;

            let email = document.createElement('p');
            email.innerHTML = "Email: " + data[0].Email;

            let number = document.createElement('p');
            number.innerHTML = "Contact Number: " + data[0].ContactNumber;

            let jobCategory = document.createElement('p');
            jobCategory.innerHTML = "Job Category: " + data[0].JobCategory;

            let registration = document.createElement('p');
            registration.innerHTML = "Registration: " + data[0].Registration;

            let date = document.createElement('p');
            date.innerHTML = "Date: " + data[0].BookingDate;

            let time = document.createElement('p');
            time.innerHTML = "Time: " + data[0].TimeSlot;

            let comment = document.createElement('p');
            comment.innerHTML = "Comment: " + data[0].Comment;

            paragraph.appendChild(id);
            paragraph.appendChild(addressLineOne);
            paragraph.appendChild(addressLineTwo);
            paragraph.appendChild(city);
            paragraph.appendChild(county);
            paragraph.appendChild(postCode);
            paragraph.appendChild(firstName);
            paragraph.appendChild(lastName);
            paragraph.appendChild(email);
            paragraph.appendChild(number);
            paragraph.appendChild(jobCategory);
            paragraph.appendChild(registration);
            paragraph.appendChild(date);
            paragraph.appendChild(time);
            paragraph.appendChild(comment);
            $('#specificEntryModal').modal('show');
        })
}