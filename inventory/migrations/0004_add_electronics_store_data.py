from django.db import migrations

def add_electronics_store_data(apps, schema_editor):
    Product = apps.get_model('inventory', 'Product')
    Product.objects.bulk_create([
        Product(name='Apple iPhone 14 Pro', quantity=12, price=119999.00, description='256GB, Deep Purple, 6.1-inch Super Retina XDR display'),
        Product(name='Samsung Galaxy S23 Ultra', quantity=8, price=104999.00, description='12GB RAM, 256GB, Phantom Black, 6.8-inch QHD+'),
        Product(name='Sony WH-1000XM5 Headphones', quantity=20, price=29990.00, description='Wireless Noise Cancelling, Black'),
        Product(name='Dell XPS 13 Laptop', quantity=5, price=139999.00, description='13.4-inch FHD+, 16GB RAM, 1TB SSD, Windows 11'),
        Product(name='Apple MacBook Air M2', quantity=7, price=124900.00, description='13.6-inch, 8GB RAM, 512GB SSD, Space Grey'),
        Product(name='Canon EOS 1500D DSLR', quantity=4, price=42999.00, description='24.1MP, 18-55mm Lens, WiFi, Black'),
        Product(name='Samsung 55" 4K QLED TV', quantity=3, price=84999.00, description='Smart TV, Ultra HD, Voice Assistant'),
        Product(name='HP DeskJet 2331 Printer', quantity=15, price=3999.00, description='All-in-One, Color, USB, Compact'),
        Product(name='Apple iPad 10th Gen', quantity=10, price=44900.00, description='10.9-inch, WiFi, 64GB, Silver'),
        Product(name='JBL Flip 6 Bluetooth Speaker', quantity=25, price=9999.00, description='Waterproof, 12h Playtime, Blue'),
        Product(name='Mi Smart Band 7', quantity=30, price=3499.00, description='1.62" AMOLED, 120+ fitness modes, Black'),
        Product(name='Logitech MX Master 3S Mouse', quantity=18, price=8995.00, description='Wireless, Ergonomic, Graphite'),
        Product(name='Google Nest Mini (2nd Gen)', quantity=14, price=4499.00, description='Smart Speaker, Voice Assistant, Chalk'),
        Product(name='Amazon Echo Show 8', quantity=6, price=10999.00, description='8" HD Display, Alexa, Charcoal'),
        Product(name='WD 2TB External HDD', quantity=22, price=5999.00, description='USB 3.0, Portable, Black'),
        Product(name='TP-Link Archer C6 Router', quantity=16, price=2999.00, description='1200 Mbps, Dual Band, MU-MIMO'),
        Product(name='Philips Hue Smart Bulb', quantity=40, price=1999.00, description='White & Color Ambiance, Bluetooth'),
        Product(name='Samsung Galaxy Tab S8', quantity=9, price=58999.00, description='11-inch, 8GB RAM, 128GB, WiFi'),
        Product(name='OnePlus Buds Pro 2', quantity=17, price=11999.00, description='ANC, Wireless, Black'),
        Product(name='Asus ROG Strix Gaming Laptop', quantity=2, price=179999.00, description='15.6-inch, RTX 3070, 32GB RAM, 1TB SSD'),
    ])

def remove_electronics_store_data(apps, schema_editor):
    Product = apps.get_model('inventory', 'Product')
    Product.objects.filter(name__in=[
        'Apple iPhone 14 Pro', 'Samsung Galaxy S23 Ultra', 'Sony WH-1000XM5 Headphones', 'Dell XPS 13 Laptop',
        'Apple MacBook Air M2', 'Canon EOS 1500D DSLR', 'Samsung 55" 4K QLED TV', 'HP DeskJet 2331 Printer',
        'Apple iPad 10th Gen', 'JBL Flip 6 Bluetooth Speaker', 'Mi Smart Band 7', 'Logitech MX Master 3S Mouse',
        'Google Nest Mini (2nd Gen)', 'Amazon Echo Show 8', 'WD 2TB External HDD', 'TP-Link Archer C6 Router',
        'Philips Hue Smart Bulb', 'Samsung Galaxy Tab S8', 'OnePlus Buds Pro 2', 'Asus ROG Strix Gaming Laptop',
    ]).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('inventory', '0003_add_default_products'),
    ]
    operations = [
        migrations.RunPython(add_electronics_store_data, remove_electronics_store_data),
    ] 