/**
 * Carga los profesores desde la API REST
 * y los muestra dinámicamente en la tabla.
 */
async function loadTeachers() {

    // Elemento HTML donde se mostrarán los profesores.
    const tableBody = document.getElementById("teachers-table-body");

    try {

        // Realizamos una petición GET al endpoint de profesores.
        const response = await fetch("/api/teachers/");

        // Verificamos que la petición haya sido exitosa.
        if (!response.ok) {
            throw new Error("No fue posible obtener los profesores.");
        }

        // Convertimos la respuesta JSON en un objeto JavaScript.
        const teachers = await response.json();

        // Eliminamos el mensaje de carga.
        tableBody.innerHTML = "";

        // Si no existen profesores registrados.
        if (teachers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        No existen profesores registrados.
                    </td>
                </tr>
            `;

            return;
        }

        // Recorremos los profesores recibidos.
        teachers.forEach(teacher => {

            // Creamos una nueva fila.
            const row = document.createElement("tr");

            // Agregamos los datos del profesor.
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.first_name}</td>
                <td>${teacher.last_name}</td>
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
                    Error al cargar los profesores.
                </td>
            </tr>
        `;
    }
}


/**
 * Ejecutamos la función cuando el documento
 * termina de cargar.
 */
document.addEventListener("DOMContentLoaded", loadTeachers);
