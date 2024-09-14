from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register('posts', PostViewSet, basename='post')
router.register('tags', TagViewSet, basename='tags')
router.register('drafts', DraftViewSet, basename='drafts')
router.register('comments', CommentViewSet, basename='comments')

urlpatterns = [
    
] + router.urls
