from django.shortcuts import render
from rest_framework import viewsets

from .models import Course, Student, StudentCourse, Teacher
from .serializers import (
    CourseSerializer,
    StudentCourseSerializer,
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


def teachers_page(request):
    """
    Renderiza la página HTML de profesores.

    Los profesores serán cargados posteriormente mediante
    una petición asíncrona a la API.
    """
    return render(request, "academic/teachers.html")


# ============================================================
# ENDPOINTS REST API (CRUD COMPLETO)
# ============================================================
#
# ModelViewSet entrega automáticamente las 5 operaciones REST:
#   GET    /api/teachers/         -> list
#   POST   /api/teachers/         -> create
#   GET    /api/teachers/{id}/    -> retrieve
#   PUT    /api/teachers/{id}/    -> update
#   PATCH  /api/teachers/{id}/    -> partial_update
#   DELETE /api/teachers/{id}/    -> destroy
#
# Lo mismo aplica para courses, students y student-courses.
# ============================================================

class TeacherViewSet(viewsets.ModelViewSet):
    """CRUD completo para Teacher."""
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class CourseViewSet(viewsets.ModelViewSet):
    """CRUD completo para Course."""
    queryset = Course.objects.select_related("teacher").all()
    serializer_class = CourseSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """CRUD completo para Student."""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentCourseViewSet(viewsets.ModelViewSet):
    """CRUD completo para StudentCourse (inscripciones)."""
    queryset = StudentCourse.objects.select_related(
        "student", "course"
    ).all()
    serializer_class = StudentCourseSerializer
