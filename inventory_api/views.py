from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import HttpResponse

class ProductViewSet(viewsets.ViewSet):
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
        # Dummy implementation, replace with your logic
        return Response({"message": "Product created"}, status=201)

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
