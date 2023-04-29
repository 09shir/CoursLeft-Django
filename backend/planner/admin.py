from django.contrib import admin
from .models import term, course

# Register your models here.
class TermAdmin(admin.ModelAdmin):
    list = ('name')

class CourseAdmin(admin.ModelAdmin):
    list2 = ('term', 'name')

admin.site.register(term, TermAdmin)
admin.site.register(course, CourseAdmin)