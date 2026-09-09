/**
 * Carga los estudiantes desde la API REST
 * y los muestra dinámicamente en la tabla.
 */
async function loadStudents() {

    // Elemento HTML donde se mostrarán los estudiantes.
    const tableBody = document.getElementById("students-table-body");

    try {

        // Realizamos una petición GET al endpoint de estudiantes.
        const response = await fetch("/api/students/");

        // Verificamos que la petición haya sido exitosa.
        if (!response.ok) {
            throw new Error("No fue posible obtener los estudiantes.");
        }

        // Convertimos la respuesta JSON en un objeto JavaScript.
        const students = await response.json();

        // Eliminamos el mensaje de carga.
        tableBody.innerHTML = "";

        // Si no existen estudiantes.
        if (students.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        No existen estudiantes registrados.
                    </td>
                </tr>
            `;

            return;
        }

        // Recorremos los estudiantes recibidos.
        students.forEach(student => {

            // Creamos una nueva fila.
            const row = document.createElement("tr");

            // Agregamos los datos del estudiante.
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
            `;

            // Agregamos la fila a la tabla.
            tableBody.appendChild(row);
        });

    } catch (error) {

        // Registramos el error en la consola.
        console.error("Error:", error);

        // Mostramos un mensaje al usuario.
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    Error al cargar los estudiantes.
                </td>
            </tr>
        `;
    }
}


/**
 * Ejecutamos la función cuando el documento
 * termina de cargar.
 */
document.addEventListener("DOMContentLoaded", loadStudents);