const STUDENTS_API = "/api/students/";
const studentForm = document.getElementById("student-form");
const studentId = document.getElementById("student-id");
const studentFirstName = document.getElementById("student-first-name");
const studentLastName = document.getElementById("student-last-name");
const studentsTableBody = document.getElementById("students-table-body");
const studentFormTitle = document.getElementById("student-form-title");
const studentSaveButton = document.getElementById("student-save-button");
const studentCancelButton = document.getElementById("student-cancel-button");
const studentMessage = document.getElementById("student-message");

function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function showStudentMessage(text, type = "success") {
    studentMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
    setTimeout(() => studentMessage.innerHTML = "", 3000);
}

async function loadStudents() {
    try {
        const response = await fetch(STUDENTS_API);
        if (!response.ok) throw new Error("No fue posible obtener los estudiantes.");
        const students = await response.json();
        studentsTableBody.innerHTML = "";
        if (!students.length) {
            studentsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No existen estudiantes registrados.</td></tr>`;
            return;
        }
        students.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${student.id}</td><td>${escapeHtml(student.first_name)}</td><td>${escapeHtml(student.last_name)}</td><td>
                <button type="button" class="btn btn-sm btn-warning me-1">Editar</button>
                <button type="button" class="btn btn-sm btn-danger">Eliminar</button>
            </td>`;
            row.children[3].children[0].addEventListener("click", () => editStudent(student));
            row.children[3].children[1].addEventListener("click", () => deleteStudent(student.id));
            studentsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        studentsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los estudiantes.</td></tr>`;
    }
}

function editStudent(student) {
    studentId.value = student.id;
    studentFirstName.value = student.first_name;
    studentLastName.value = student.last_name;
    studentFormTitle.textContent = "Editar estudiante";
    studentSaveButton.textContent = "Actualizar";
    studentSaveButton.classList.replace("btn-primary", "btn-success");
    studentCancelButton.classList.remove("d-none");
    studentFirstName.focus();
}

function resetStudentForm() {
    studentForm.reset();
    studentId.value = "";
    studentFormTitle.textContent = "Agregar estudiante";
    studentSaveButton.textContent = "Guardar";
    studentSaveButton.classList.replace("btn-success", "btn-primary");
    studentCancelButton.classList.add("d-none");
}

studentForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = studentId.value;
    const data = { first_name: studentFirstName.value.trim(), last_name: studentLastName.value.trim() };
    if (!data.first_name || !data.last_name) return showStudentMessage("Debes completar nombre y apellido.", "warning");
    try {
        const response = await fetch(id ? `${STUDENTS_API}${id}/` : STUDENTS_API, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("No fue posible guardar el estudiante.");
        showStudentMessage(id ? "Estudiante actualizado correctamente." : "Estudiante creado correctamente.");
        resetStudentForm();
        loadStudents();
    } catch (error) { showStudentMessage(error.message, "danger"); }
});

async function deleteStudent(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;
    try {
        const response = await fetch(`${STUDENTS_API}${id}/`, { method: "DELETE" });
        if (!response.ok) throw new Error("No fue posible eliminar el estudiante.");
        showStudentMessage("Estudiante eliminado correctamente.");
        resetStudentForm();
        loadStudents();
    } catch (error) { showStudentMessage(error.message, "danger"); }
}

studentCancelButton.addEventListener("click", resetStudentForm);
document.addEventListener("DOMContentLoaded", loadStudents);
