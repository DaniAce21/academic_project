from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# ============================================================
# ROUTER DE DRF
# ============================================================
# El router genera automáticamente las rutas CRUD para cada
# ViewSet registrado (list, create, retrieve, update, delete).
router = DefaultRouter()
router.register(r"teachers", views.TeacherViewSet, basename="teacher")
router.register(r"courses", views.CourseViewSet, basename="course")
router.register(r"students", views.StudentViewSet, basename="student")
router.register(
    r"student-courses",
    views.StudentCourseViewSet,
    basename="studentcourse"
)


# Rutas de la aplicación académica.
urlpatterns = [
    # Página principal.
    path("", views.home, name="home"),

    # Páginas HTML.
    path("courses/", views.courses_page, name="courses"),
    path("students/", views.students_page, name="students"),
    path("teachers/", views.teachers_page, name="teachers"),

    # Endpoints CRUD de la API REST (generados por el router).
    path("api/", include(router.urls)),
]
