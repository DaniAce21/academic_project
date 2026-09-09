/**
 * CRUD de profesores utilizando la API REST de Django REST Framework.
 *
 * GET    /api/teachers/      -> listar profesores
 * POST   /api/teachers/      -> crear profesor
 * PUT    /api/teachers/{id}/ -> actualizar profesor
 * DELETE /api/teachers/{id}/ -> eliminar profesor
 */

const API_URL = "/api/teachers/";

const form = document.getElementById("teacher-form");
const teacherId = document.getElementById("teacher-id");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const tableBody = document.getElementById("teachers-table-body");
const formTitle = document.getElementById("form-title");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const message = document.getElementById("teacher-message");


/**
 * Muestra un mensaje temporal al usuario.
 */
function showMessage(text, type = "success") {
    message.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${text}
        </div>
    `;

    setTimeout(() => {
        message.innerHTML = "";
    }, 3000);
}


/**
 * Escapa texto para evitar insertar HTML proveniente de la API.
 */
function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/**
 * Obtiene y muestra todos los profesores.
 */
async function loadTeachers() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No fue posible obtener los profesores.");
        }

        const teachers = await response.json();

        tableBody.innerHTML = "";

        if (teachers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No existen profesores registrados.
                    </td>
                </tr>
            `;
            return;
        }

        teachers.forEach(teacher => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${escapeHtml(teacher.first_name)}</td>
                <td>${escapeHtml(teacher.last_name)}</td>
                <td>
                    <button
                        type="button"
                        class="btn btn-sm btn-warning me-1 edit-teacher"
                        data-id="${teacher.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger delete-teacher"
                        data-id="${teacher.id}"
                    >
                        Eliminar
                    </button>
                </td>
            `;

            row.querySelector(".edit-teacher").addEventListener(
                "click",
                () => editTeacher(
                    teacher.id,
                    teacher.first_name,
                    teacher.last_name
                )
            );

            row.querySelector(".delete-teacher").addEventListener(
                "click",
                () => deleteTeacher(teacher.id)
            );

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    Error al cargar los profesores.
                </td>
            </tr>
        `;
    }
}


/**
 * Prepara el formulario para editar un profesor.
 */
function editTeacher(id, name, surname) {
    teacherId.value = id;
    firstName.value = name;
    lastName.value = surname;

    formTitle.textContent = "Editar profesor";
    saveButton.textContent = "Actualizar";
    saveButton.classList.remove("btn-primary");
    saveButton.classList.add("btn-success");
    cancelButton.classList.remove("d-none");

    firstName.focus();
}


/**
 * Limpia el formulario y vuelve al modo creación.
 */
function resetForm() {
    form.reset();
    teacherId.value = "";

    formTitle.textContent = "Agregar profesor";
    saveButton.textContent = "Guardar";
    saveButton.classList.remove("btn-success");
    saveButton.classList.add("btn-primary");
    cancelButton.classList.add("d-none");
}


/**
 * Crea o actualiza un profesor.
 */
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = teacherId.value;

    const data = {
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim()
    };

    if (!data.first_name || !data.last_name) {
        showMessage("Debes completar nombre y apellido.", "warning");
        return;
    }

    try {
        const response = await fetch(
            id ? `${API_URL}${id}/` : API_URL,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Respuesta de la API:", errorData);
            throw new Error("No fue posible guardar el profesor.");
        }

        showMessage(
            id
                ? "Profesor actualizado correctamente."
                : "Profesor creado correctamente."
        );

        resetForm();
        await loadTeachers();

    } catch (error) {
        console.error("Error:", error);
        showMessage(error.message, "danger");
    }
});


/**
 * Elimina un profesor.
 *
 * Django REST Framework devuelve error si existen cursos relacionados,
 * porque el modelo utiliza on_delete=models.CASCADE. En ese caso se
 * informa al usuario y no se oculta el error.
 */
async function deleteTeacher(id) {
    const confirmed = confirm(
        "¿Estás seguro de que deseas eliminar este profesor?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}${id}/`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Respuesta de la API:", errorData);
            throw new Error(
                "No fue posible eliminar el profesor. " +
                "Puede tener cursos asociados."
            );
        }

        showMessage("Profesor eliminado correctamente.");
        resetForm();
        await loadTeachers();

    } catch (error) {
        console.error("Error:", error);
        showMessage(error.message, "danger");
    }
}


/**
 * Cancela el modo edición.
 */
cancelButton.addEventListener("click", resetForm);


/**
 * Carga inicial de profesores.
 */
document.addEventListener("DOMContentLoaded", loadTeachers);
