from django.db import models

# Create your models here.

class board(models.Model):
    # name = models.IntegerField(default=1)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class term(models.Model):
    board = models.ForeignKey(board, on_delete=models.CASCADE, default=1)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class course(models.Model):
    term = models.ForeignKey(term, on_delete=models.CASCADE)
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name
