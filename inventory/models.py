from django.db import models

# Create your models here.
 
class Product(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.name
