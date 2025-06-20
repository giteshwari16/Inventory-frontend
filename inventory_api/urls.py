from django.urls import path
from inventory.views import ProductViewSet, LowStockProductsView, generate_pdf_report, export_products_csv
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('products/', ProductViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('low-stock/', LowStockProductsView.as_view()),
    path('report/pdf/', generate_pdf_report),
    path('export/csv/', export_products_csv),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

def home(request):
    return HttpResponse("Welcome to the Inventory API!")