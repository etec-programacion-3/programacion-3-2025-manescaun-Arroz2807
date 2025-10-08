# services/calendar_service.py

from datetime import datetime


class CalendarService:
    """
    Servicio simulado para la gestión de eventos de calendario.
    En futuras versiones, se podrá integrar con una API real (por ejemplo, Google Calendar).
    """

    @staticmethod
    def create_event(task_title, due_date):
        """
        Simula la creación de un evento en el calendario asociado a una tarea.

        Parámetros:
        - task_title (str): título de la tarea.
        - due_date (date): fecha límite de la tarea.
        """
        print(f"[CalendarService] Evento creado para la tarea '{task_title}' en la fecha {due_date}")

    @staticmethod
    def update_event(task_title, due_date):
        """
        Simula la actualización de un evento existente en el calendario.

        Parámetros:
        - task_title (str): título de la tarea.
        - due_date (date): nueva fecha límite.
        """
        print(f"[CalendarService] Evento actualizado: '{task_title}' -> nueva fecha {due_date}")

    @staticmethod
    def delete_event(task_title):
        """
        Simula la eliminación de un evento asociado a una tarea.

        Parámetros:
        - task_title (str): título de la tarea.
        """
        print(f"[CalendarService] Evento eliminado para la tarea '{task_title}'")