const COURSES_API = "/api/courses/";
const TEACHERS_API = "/api/teachers/";
const courseForm = document.getElementById("course-form");
const courseId = document.getElementById("course-id");
const courseName = document.getElementById("course-name");
const courseTeacher = document.getElementById("course-teacher");
const coursesTableBody = document.getElementById("courses-table-body");
const courseFormTitle = document.getElementById("course-form-title");
const courseSaveButton = document.getElementById("course-save-button");
const courseCancelButton = document.getElementById("course-cancel-button");
const courseMessage = document.getElementById("course-message");

function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function showCourseMessage(text, type = "success") {
    courseMessage.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
    setTimeout(() => courseMessage.innerHTML = "", 3000);
}

async function loadTeachersForSelect(selectedId = "") {
    const response = await fetch(TEACHERS_API);
    if (!response.ok) throw new Error("No fue posible obtener los profesores.");
    const teachers = await response.json();
    courseTeacher.innerHTML = `<option value="">Selecciona un profesor</option>`;
    teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher.id;
        option.textContent = `${teacher.first_name} ${teacher.last_name}`;
        if (String(teacher.id) === String(selectedId)) option.selected = true;
        courseTeacher.appendChild(option);
    });
}

async function loadCourses() {
    try {
        const response = await fetch(COURSES_API);
        if (!response.ok) throw new Error("No fue posible obtener los cursos.");
        const courses = await response.json();
        coursesTableBody.innerHTML = "";
        if (!courses.length) {
            coursesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No existen cursos registrados.</td></tr>`;
            return;
        }
        courses.forEach(course => {
            const row = document.createElement("tr");
            const teacherName = course.teacher ? `${course.teacher.first_name} ${course.teacher.last_name}` : "Sin profesor";
            row.innerHTML = `<td>${course.id}</td><td>${escapeHtml(course.name)}</td><td>${escapeHtml(teacherName)}</td><td>
                <button type="button" class="btn btn-sm btn-warning me-1">Editar</button>
                <button type="button" class="btn btn-sm btn-danger">Eliminar</button>
            </td>`;
            row.children[3].children[0].addEventListener("click", () => editCourse(course));
            row.children[3].children[1].addEventListener("click", () => deleteCourse(course.id));
            coursesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        coursesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los cursos.</td></tr>`;
    }
}

async function editCourse(course) {
    try {
        courseId.value = course.id;
        courseName.value = course.name;
        await loadTeachersForSelect(course.teacher ? course.teacher.id : "");
        courseFormTitle.textContent = "Editar curso";
        courseSaveButton.textContent = "Actualizar";
        courseSaveButton.classList.replace("btn-primary", "btn-success");
        courseCancelButton.classList.remove("d-none");
        courseName.focus();
    } catch (error) { showCourseMessage(error.message, "danger"); }
}

function resetCourseForm() {
    courseForm.reset();
    courseId.value = "";
    courseFormTitle.textContent = "Agregar curso";
    courseSaveButton.textContent = "Guardar";
    courseSaveButton.classList.replace("btn-success", "btn-primary");
    courseCancelButton.classList.add("d-none");
}

courseForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = courseId.value;
    const data = { name: courseName.value.trim(), teacher_id: courseTeacher.value };
    if (!data.name || !data.teacher_id) return showCourseMessage("Debes completar asignatura y profesor.", "warning");
    try {
        const response = await fetch(id ? `${COURSES_API}${id}/` : COURSES_API, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("No fue posible guardar el curso.");
        showCourseMessage(id ? "Curso actualizado correctamente." : "Curso creado correctamente.");
        resetCourseForm();
        await loadCourses();
    } catch (error) { showCourseMessage(error.message, "danger"); }
});

async function deleteCourse(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) return;
    try {
        const response = await fetch(`${COURSES_API}${id}/`, { method: "DELETE" });
        if (!response.ok) throw new Error("No fue posible eliminar el curso.");
        showCourseMessage("Curso eliminado correctamente.");
        resetCourseForm();
        loadCourses();
    } catch (error) { showCourseMessage(error.message, "danger"); }
}

courseCancelButton.addEventListener("click", resetCourseForm);
document.addEventListener("DOMContentLoaded", async () => {
    try { await loadTeachersForSelect(); await loadCourses(); }
    catch (error) { showCourseMessage(error.message, "danger"); }
});
