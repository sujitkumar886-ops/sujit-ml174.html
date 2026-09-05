// ================= LOGIN =================

function login(event) {

    if (event) {
        event.preventDefault();
    }

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {

        alert("Login Successful");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Username or Password");

    }
}


// ================= ADD STUDENT =================

function addStudent() {

    const name = document.getElementById("studentName").value;
    const roll = document.getElementById("rollNumber").value;
    const studentClass = document.getElementById("studentClass").value;

    if (name === "" || roll === "" || studentClass === "") {

        alert("Please fill all fields!");
        return;

    }

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    students.push({
        name: name,
        roll: roll,
        studentClass: studentClass
    });

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    document.getElementById("studentName").value = "";
    document.getElementById("rollNumber").value = "";
    document.getElementById("studentClass").value = "";

    displayStudents();

    updateDashboardStats();
}


// ================= DISPLAY STUDENTS =================

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    if (!table) {
        return;
    }

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    table.innerHTML = "";

    students.forEach((student, index) => {

        table.innerHTML += `
            <tr>

                <td>${student.name}</td>

                <td>${student.roll}</td>

                <td>${student.studentClass}</td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>

            </tr>
        `;

    });

}


// ================= DELETE STUDENT =================

function deleteStudent(index) {

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    students.splice(index, 1);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();

    updateDashboardStats();

}


// ================= ATTENDANCE =================

let attendanceData = {};


// ================= LOAD STUDENTS =================

function loadAttendanceStudents() {

    const table =
        document.getElementById("attendanceTable");

    if (!table) {
        return;
    }

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    table.innerHTML = "";

    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No students found.
                    Please add students first.
                </td>
            </tr>
        `;

        return;
    }


    students.forEach((student, index) => {

        table.innerHTML += `
            <tr>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.studentClass}</td>

                <td>

                    <button
                        class="present-btn"
                        onclick="markStatus(
                            ${index},
                            'Present',
                            this
                        )">
                        Present
                    </button>

                    <button
                        class="absent-btn"
                        onclick="markStatus(
                            ${index},
                            'Absent',
                            this
                        )">
                        Absent
                    </button>

                </td>

            </tr>
        `;

    });

}


// ================= MARK ATTENDANCE =================

function markStatus(index, status, button) {

    attendanceData[index] = status;

    const parent =
        button.parentElement;

    const buttons =
        parent.querySelectorAll("button");

    buttons.forEach(btn => {

        btn.classList.remove("selected");

    });

    button.classList.add("selected");

}


// ================= SAVE ATTENDANCE =================

function saveAttendance() {

    const date =
        document.getElementById("attendanceDate").value;

    if (date === "") {

        alert("Please select a date!");
        return;

    }

    let students =
        JSON.parse(localStorage.getItem("students")) || [];

    if (students.length === 0) {

        alert("Please add students first!");
        return;

    }

    let records =
        JSON.parse(
            localStorage.getItem("attendance")
        ) || {};


    records[date] = {};


    students.forEach((student, index) => {

        records[date][student.roll] =
            attendanceData[index] || "Not Marked";

    });


    localStorage.setItem(
        "attendance",
        JSON.stringify(records)
    );


    alert("Attendance saved successfully! ✅");

    updateDashboardStats();

}


// ================= SHOW RECORDS =================

function showRecords() {

    const date =
        document.getElementById("recordDate").value;

    const table =
        document.getElementById("recordsTable");

    const summary =
        document.getElementById("recordSummary");


    if (!date) {

        summary.innerHTML =
            "Select a date to view attendance.";

        table.innerHTML = "";

        return;

    }


    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const records =
        JSON.parse(localStorage.getItem("attendance")) || {};


    const selectedRecord =
        records[date];


    if (!selectedRecord) {

        summary.innerHTML =
            "No attendance found for this date.";

        table.innerHTML = "";

        return;

    }


    table.innerHTML = "";

    let present = 0;
    let absent = 0;
    let notMarked = 0;


    students.forEach(student => {

        const status =
            selectedRecord[student.roll] ||
            "Not Marked";


        if (status === "Present") {

            present++;

        } else if (status === "Absent") {

            absent++;

        } else {

            notMarked++;

        }


        let statusClass =
            "status-not-marked";


        if (status === "Present") {

            statusClass =
                "status-present";

        }


        if (status === "Absent") {

            statusClass =
                "status-absent";

        }


        table.innerHTML += `
            <tr>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.studentClass}</td>

                <td class="${statusClass}">
                    ${status}
                </td>

            </tr>
        `;

    });


    summary.innerHTML = `
        <strong>Present:</strong> ${present}

        &nbsp;&nbsp; | &nbsp;&nbsp;

        <strong>Absent:</strong> ${absent}

        &nbsp;&nbsp; | &nbsp;&nbsp;

        <strong>Not Marked:</strong> ${notMarked}
    `;

}


// ================= DASHBOARD =================

function updateDashboardStats() {

    const totalStudentsBox =
        document.getElementById("totalStudents");

    const presentBox =
        document.getElementById("presentStudents");

    const absentBox =
        document.getElementById("absentStudents");

    const percentageBox =
        document.getElementById(
            "attendancePercentage"
        );


    // Dashboard page नहीं है
    if (
        !totalStudentsBox ||
        !presentBox ||
        !absentBox ||
        !percentageBox
    ) {

        return;

    }


    // Students
    const students =
        JSON.parse(localStorage.getItem("students")) || [];


    // Attendance
    const attendance =
        JSON.parse(
            localStorage.getItem("attendance")
        ) || {};


    let present = 0;
    let absent = 0;


    // सभी dates की attendance पढ़ना

    Object.keys(attendance).forEach(date => {

        const dayRecord =
            attendance[date];


        Object.keys(dayRecord).forEach(roll => {

            if (
                dayRecord[roll] === "Present"
            ) {

                present++;

            }


            if (
                dayRecord[roll] === "Absent"
            ) {

                absent++;

            }

        });

    });


    const totalMarked =
        present + absent;


    let percentage = 0;


    if (totalMarked > 0) {

        percentage =
            Math.round(
                (present / totalMarked) * 100
            );

    }


    // Dashboard values

    totalStudentsBox.textContent =
        students.length;

    presentBox.textContent =
        present;

    absentBox.textContent =
        absent;

    percentageBox.textContent =
        percentage + "%";

}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayStudents();

        loadAttendanceStudents();

        updateDashboardStats();

    }
);
button.classList.add("selected");



let students =
    JSON.parse(localStorage.getItem("students")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || {};


// Today's Date
function getToday() {

    const d = new Date();

    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}


// Load Students
function showAttendance() {

    const tableBody =
        document.getElementById("attendanceTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    const date = getToday();

    students.forEach((student, index) => {

        let status = "";

        if (attendance[date] &&
            attendance[date][student.roll]) {

            status = attendance[date][student.roll];
        }

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <input
                    type="checkbox"
                    class="student-check"
                    value="${student.roll}">
            </td>

            <td>${index + 1}</td>

            <td>${student.name}</td>

            <td>${student.roll}</td>

            <td>${student.class}</td>

            <td id="status-${student.roll}">
                ${status || "Not Marked"}
            </td>

        `;

        tableBody.appendChild(row);
    });
}


// Select All
function selectAllStudents() {

    const checkboxes =
        document.querySelectorAll(".student-check");

    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}


// Mark Selected Students Present
function markSelectedPresent() {

    const selected =
        document.querySelectorAll(
            ".student-check:checked"
        );

    if (selected.length === 0) {

        alert("Please select students first!");

        return;
    }

    const date = getToday();

    if (!attendance[date]) {
        attendance[date] = {};
    }

    selected.forEach(checkbox => {

        const roll = checkbox.value;

        attendance[date][roll] = "Present";

    });

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    showAttendance();

    alert(
        selected.length +
        " students marked Present successfully!"
    );
}


