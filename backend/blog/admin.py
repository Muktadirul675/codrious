from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register((
    Post, 
    Tag,
    # Series,
    # SeriesPost,
    Comment
))
