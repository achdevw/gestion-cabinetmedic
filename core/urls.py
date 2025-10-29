from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, PatientProfileViewSet, MedecinProfileViewSet,
    AppointmentViewSet, MedicalRecordViewSet, NotificationViewSet,PatientMeView
)
from .views import CustomTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'patients', PatientProfileViewSet)
router.register(r'medecins', MedecinProfileViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'medical-records', MedicalRecordViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('patients/me/', PatientMeView.as_view(), name='patient-me'),
  
]
