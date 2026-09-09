from rest_framework import serializers

from .models import Course, Student, StudentCourse, Teacher


# ============================================================
# SERIALIZADOR DE DOCENTES
# ============================================================

class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer CRUD completo para Teacher.
    Soporta listar, ver, crear, actualizar y eliminar.
    """

    class Meta:
        model = Teacher
        fields = ["id", "first_name", "last_name"]


# ============================================================
# SERIALIZADOR DE CURSOS
# ============================================================

class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer CRUD completo para Course.

    - Al LEER (GET): muestra el objeto teacher completo anidado.
    - Al ESCRIBIR (POST/PUT/PATCH): se envía teacher_id (solo el id).
    """

    # Campo de solo lectura: muestra el profesor completo.
    teacher = TeacherSerializer(read_only=True)

    # Campo de solo escritura: recibe el id del profesor al crear/editar.
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(),
        source="teacher",
        write_only=True
    )

    class Meta:
        model = Course
        fields = ["id", "name", "teacher", "teacher_id"]


# ============================================================
# SERIALIZADOR DE ESTUDIANTES
# ============================================================

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer CRUD completo para Student.
    """

    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name"]


# ============================================================
# SERIALIZADOR DE INSCRIPCIONES (StudentCourse)
# ============================================================

class StudentCourseSerializer(serializers.ModelSerializer):
    """
    Serializer CRUD completo para StudentCourse (tabla de inscripción).

    - Al LEER: muestra student y course completos anidados.
    - Al ESCRIBIR: recibe student_id y course_id.
    """

    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source="student",
        write_only=True
    )
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True
    )

    class Meta:
        model = StudentCourse
        fields = ["id", "student", "course", "student_id", "course_id"]
