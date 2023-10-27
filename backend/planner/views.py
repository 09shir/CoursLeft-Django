from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CourseSerializer, TermSerializer, BoardSerializer
from .models import course, term, board

# Create your views here.

class BoardView(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = board.objects.all()

class TermView(viewsets.ModelViewSet):
    serializer_class = TermSerializer
    queryset = term.objects.all()
    # queryset = term.objects.filter(board=1)

class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = course.objects.all()