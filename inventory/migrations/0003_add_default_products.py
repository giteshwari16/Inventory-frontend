from django.db import migrations

def add_default_products(apps, schema_editor):
    Product = apps.get_model('inventory', 'Product')
    Product.objects.bulk_create([
        Product(name='Television', quantity=10, price=30000.00, description='40-inch Smart LED TV'),
        Product(name='Laptop', quantity=15, price=55000.00, description='15.6-inch, 8GB RAM, 512GB SSD'),
        Product(name='Smartphone', quantity=25, price=20000.00, description='6.5-inch display, 128GB storage'),
        Product(name='Washing Machine', quantity=8, price=18000.00, description='7kg, fully automatic'),
        Product(name='Refrigerator', quantity=5, price=25000.00, description='Double door, 300L'),
        Product(name='Microwave Oven', quantity=12, price=9000.00, description='20L, convection'),
        Product(name='Air Conditioner', quantity=7, price=32000.00, description='1.5 Ton, Inverter'),
        Product(name='Bluetooth Speaker', quantity=30, price=2500.00, description='Portable, 10W output'),
        Product(name='Headphones', quantity=20, price=1500.00, description='Over-ear, noise cancelling'),
        Product(name='Tablet', quantity=10, price=18000.00, description='10-inch, 64GB storage'),
    ])

def remove_default_products(apps, schema_editor):
    Product = apps.get_model('inventory', 'Product')
    Product.objects.filter(name__in=[
        'Television', 'Laptop', 'Smartphone', 'Washing Machine', 'Refrigerator',
        'Microwave Oven', 'Air Conditioner', 'Bluetooth Speaker', 'Headphones', 'Tablet',
    ]).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('inventory', '0002_product_description'),
    ]
    operations = [
        migrations.RunPython(add_default_products, remove_default_products),
    ] 