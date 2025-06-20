from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path, include
from .views import ProductViewSet, generate_pdf
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('report/pdf/', generate_pdf, name='generate_pdf'),
    path('admin/',admin.site.urls),
         path('api/', include('inventory_api.urls')), 
    path('products/', ProductViewSet.as_view({'get': 'list'})),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'})),
    path('low-stock/', LowStockProductsView.as_view()),
    path('report/', generate_pdf_report),
]

]