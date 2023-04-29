from django.db import models

# Create your models here.

class term(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class course(models.Model):
    term = models.ForeignKey(term, on_delete=models.CASCADE)
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name
