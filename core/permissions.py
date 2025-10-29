from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsMedecin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'medecin'


class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'


class IsMedecinOrReadOnly(permissions.BasePermission):
    """
    Lecture autorisée à tous les rôles authentifiés.
    Écriture autorisée uniquement aux médecins.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'medecin'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Un patient peut accéder à ses propres données uniquement.
    Un admin peut accéder à tout.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (
            request.user.role == 'admin' or
            obj.user == request.user
        )


class IsRelatedAppointmentUser(permissions.BasePermission):
    """
    Un rendez-vous est visible uniquement par le médecin ou le patient concernés.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (
            request.user.role == 'admin' or
            obj.patient.user == request.user or
            obj.medecin.user == request.user
        )
