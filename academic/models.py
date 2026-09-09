from django.db import models


# Representa a un docente dentro del sistema académico.
class Teacher(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    class Meta:
        # Ordena los docentes por apellido y luego por nombre.
        ordering = ["last_name", "first_name"]

    def __str__(self):
        # Permite mostrar el nombre completo del docente
        # en el administrador de Django y otros lugares.
        return f"{self.first_name} {self.last_name}"


# Representa una asignatura o curso.
class Course(models.Model):
    name = models.CharField(max_length=150)

    # Relaciona cada curso con un docente.
    # Si el docente se elimina, también se eliminan sus cursos.
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    class Meta:
        # Ordena los cursos alfabéticamente por nombre.
        ordering = ["name"]

    def __str__(self):
        return self.name


# Representa a un estudiante.
class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    class Meta:
        # Ordena los estudiantes por apellido y luego por nombre.
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# Representa la inscripción de un estudiante en un curso.
# Esta tabla permite establecer una relación muchos a muchos
# entre Student y Course.
class StudentCourse(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    class Meta:
        # Evita que un estudiante sea inscrito dos veces
        # en la misma asignatura.
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course"
            )
        ]

    def __str__(self):
        return f"{self.student} - {self.course}"