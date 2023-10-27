from rest_framework import serializers
from .models import term, course, board

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = board
        fields = '__all__'

class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = term
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = course
        fields = '__all__'