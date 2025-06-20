from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import HttpResponse
import csv

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Product.objects.all()
        name = request.GET.get('name')
        min_qty = request.GET.get('min_qty')
        if name:
            queryset = queryset.filter(name__icontains=name)
        if min_qty:
            queryset = queryset.filter(quantity__gte=min_qty)
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        user = request.user
        if not user.is_authenticated or not user.groups.filter(name='admin').exists():
            return Response({'error': 'Only admin can delete.'}, status=403)
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LowStockProductsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        threshold = int(request.GET.get('threshold', 5))
        low_stock = Product.objects.filter(quantity__lte=threshold)
        serializer = ProductSerializer(low_stock, many=True)
        return Response(serializer.data)

def generate_pdf_report(request):
    products = Product.objects.all()
    template_path = 'inventory/report_template.html'
    context = {'products': products}
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="inventory_report.pdf"'
    template = get_template(template_path)
    html = template.render(context)
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('Error generating PDF', status=500)
    return response

def export_products_csv(request):
    if not request.user.is_authenticated:
        return HttpResponse('Unauthorized', status=401)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="products.csv"'
    writer = csv.writer(response)
    writer.writerow(['Name', 'Quantity', 'Price', 'Description', 'Last Updated'])
    for product in Product.objects.all():
        writer.writerow([product.name, product.quantity, product.price, product.description, product.last_updated])
    return response