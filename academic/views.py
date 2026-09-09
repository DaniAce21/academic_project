from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Course, Student, Teacher
from .serializers import (
    CourseSerializer,
    StudentSerializer,
    TeacherSerializer
)


# ============================================================
# VISTAS HTML
# ============================================================

def home(request):
    """
    Vista principal del sistema.

    Redirige al usuario a la página de cursos para evitar
    que la ruta raíz "/" genere un error 404.
    """
    return render(request, "academic/courses.html")


def courses_page(request):
    """
    Renderiza la página HTML de cursos.

    Los datos de los cursos no se cargan directamente desde
    esta vista. El JavaScript posteriormente los obtiene
    mediante fetch() desde la API REST.
    """
    return render(request, "academic/courses.html")


def students_page(request):
    """
    Renderiza la página HTML de estudiantes.

    Los estudiantes serán cargados posteriormente mediante
    una petición asíncrona a la API.
    """
    return render(request, "academic/students.html")


# ============================================================
# ENDPOINTS REST API
# ============================================================

@api_view(["GET"])
def teacher_list(request):
    """
    Retorna todos los docentes registrados en formato JSON.
    """

    teachers = Teacher.objects.all()
    serializer = TeacherSerializer(teachers, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def course_list(request):
    """
    Retorna todos los cursos registrados en formato JSON.
    """

    courses = Course.objects.select_related("teacher").all()
    serializer = CourseSerializer(courses, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def student_list(request):
    """
    Retorna todos los estudiantes registrados en formato JSON.
    """

    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)

    return Response(serializer.data)