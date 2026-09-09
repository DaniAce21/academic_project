import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from academic.models import Course, Student, StudentCourse, Teacher


class Command(BaseCommand):
    """
    Comando para cargar los datos académicos
    desde el archivo academic_data.json.
    """

    help = "Carga los datos académicos desde un archivo JSON"

    def handle(self, *args, **options):

        # Ubicación del archivo JSON dentro del proyecto.
        json_path = Path(settings.BASE_DIR) / "data" / "academic_data.json"

        # Abrimos el archivo JSON para leer sus datos.
        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Usamos una transacción para asegurar que
        # los datos se guarden correctamente.
        with transaction.atomic():

            # --------------------------------------------------
            # CARGAR DOCENTES
            # --------------------------------------------------

            for teacher_data in data["teachers"]:

                Teacher.objects.update_or_create(
                    id=teacher_data["id"],
                    defaults={
                        "first_name": teacher_data["first_name"],
                        "last_name": teacher_data["last_name"],
                    },
                )

            # --------------------------------------------------
            # CARGAR CURSOS
            # --------------------------------------------------

            for course_data in data["courses"]:

                Course.objects.update_or_create(
                    id=course_data["id"],
                    defaults={
                        "name": course_data["name"],
                        "teacher_id": course_data["teacher_id"],
                    },
                )

            # --------------------------------------------------
            # CARGAR ESTUDIANTES
            # --------------------------------------------------

            for student_data in data["students"]:

                Student.objects.update_or_create(
                    id=student_data["id"],
                    defaults={
                        "first_name": student_data["first_name"],
                        "last_name": student_data["last_name"],
                    },
                )

            # --------------------------------------------------
            # CARGAR RELACIONES ESTUDIANTE-CURSO
            # --------------------------------------------------

            for enrollment_data in data["student_courses"]:

                StudentCourse.objects.update_or_create(
                    student_id=enrollment_data["student_id"],
                    course_id=enrollment_data["course_id"],
                )

        # Mensaje mostrado cuando la carga termina correctamente.
        self.stdout.write(
            self.style.SUCCESS(
                "Los datos académicos se cargaron correctamente."
            )
        )