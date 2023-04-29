from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CourseSerializer, TermSerializer
from .models import course, term

# Create your views here.

class TermView(viewsets.ModelViewSet):
    serializer_class = TermSerializer
    queryset = term.objects.all()

class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = course.objects.all()