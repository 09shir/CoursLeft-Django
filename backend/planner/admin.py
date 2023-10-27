from django.contrib import admin
from .models import term, course, board

# Register your models here.

class BoardAdmin(admin.ModelAdmin):
    list = ('name')

class TermAdmin(admin.ModelAdmin):
    list2 = ('name', 'boardName')

class CourseAdmin(admin.ModelAdmin):
    list3 = ('term', 'name')

admin.site.register(board, BoardAdmin)
admin.site.register(term, TermAdmin)
admin.site.register(course, CourseAdmin)