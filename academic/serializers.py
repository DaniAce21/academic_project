from rest_framework import serializers

from .models import Course, Student, Teacher


# ============================================================
# SERIALIZADOR DE DOCENTES
# ============================================================

class TeacherSerializer(serializers.ModelSerializer):
    """
    Convierte los objetos Teacher a formato JSON
    y permite que DRF pueda trabajar con ellos.
    """

    class Meta:
        model = Teacher

        # Campos que serán enviados en la respuesta JSON.
        fields = [
            "id",
            "first_name",
            "last_name"
        ]


# ============================================================
# SERIALIZADOR DE CURSOS
# ============================================================

class CourseSerializer(serializers.ModelSerializer):
    """
    Convierte los objetos Course a formato JSON.

    El docente se incluye como un objeto anidado para
    mostrar fácilmente su información en el frontend.
    """

    # Serializa la información del docente relacionado.
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = Course

        # Campos que serán enviados en la respuesta JSON.
        fields = [
            "id",
            "name",
            "teacher"
        ]


# ============================================================
# SERIALIZADOR DE ESTUDIANTES
# ============================================================

class StudentSerializer(serializers.ModelSerializer):
    """
    Convierte los objetos Student a formato JSON.
    """

    class Meta:
        model = Student

        # Campos que serán enviados en la respuesta JSON.
        fields = [
            "id",
            "first_name",
            "last_name"
        ]