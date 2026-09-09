/**
 * Carga los cursos desde la API REST
 * y los muestra dinámicamente en la tabla.
 */
async function loadCourses() {

    // Elemento HTML donde se mostrarán los cursos.
    const tableBody = document.getElementById("courses-table-body");

    try {

        // Realizamos una petición GET al endpoint de cursos.
        const response = await fetch("/api/courses/");

        // Verificamos si la respuesta HTTP fue exitosa.
        if (!response.ok) {
            throw new Error("No fue posible obtener los cursos.");
        }

        // Convertimos la respuesta JSON en un objeto JavaScript.
        const courses = await response.json();

        // Limpiamos el mensaje "Cargando cursos...".
        tableBody.innerHTML = "";

        // Si no existen cursos registrados.
        if (courses.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        No existen cursos registrados.
                    </td>
                </tr>
            `;

            return;
        }

        // Recorremos cada curso recibido desde la API.
        courses.forEach(course => {

            // Creamos una fila para el curso.
            const row = document.createElement("tr");

            // Obtenemos el nombre completo del profesor.
            const teacherName = `${course.teacher.first_name}
                ${course.teacher.last_name}`;

            // Construimos las columnas de la fila.
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${teacherName}</td>
            `;

            // Agregamos la fila a la tabla.
            tableBody.appendChild(row);
        });

    } catch (error) {

        // Mostramos el error en la consola para facilitar
        // la depuración durante el desarrollo.
        console.error("Error:", error);

        // Informamos al usuario que ocurrió un problema.
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    Error al cargar los cursos.
                </td>
            </tr>
        `;
    }
}


/**
 * Ejecutamos la función cuando el documento HTML
 * termina de cargarse.
 */
document.addEventListener("DOMContentLoaded", loadCourses);