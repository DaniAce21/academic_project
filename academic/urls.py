from django.urls import path

from . import views


# Rutas de la aplicación académica.
urlpatterns = [
    # Página principal.
    path("", views.home, name="home"),

    # Páginas HTML.
    path("courses/", views.courses_page, name="courses"),
    path("students/", views.students_page, name="students"),

    # Endpoints de la API REST.
    path("api/teachers/", views.teacher_list, name="teacher-list"),
    path("api/courses/", views.course_list, name="course-list"),
    path("api/students/", views.student_list, name="student-list"),
]