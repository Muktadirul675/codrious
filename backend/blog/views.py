from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

# Create your views here.

class IsAuthorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.groups.filter(name='Author').exists()
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user

class PostViewSet(ModelViewSet):
    permission_classes = [IsAuthorOrReadOnly, IsAuthenticatedOrReadOnly]
    queryset = Post.objects.filter(status="Public").order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'cover':
            return PostCoverSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # def perform_update(self, serializer):
    #     serializer.(author=self.request.user)

    @action(detail=True, methods=['put','patch','get'])
    def cover(self, request, pk):
        post = self.get_object()
        cover = request.FILES.get('cover')
        post.cover = cover
        post.save()

        return Response(PostSerializer(post,many=False).data)
    
    @action(detail=False, methods=['get'])
    def own_posts(self, request):
        author = request.user
        posts = self.get_queryset().filter(author=author)
        data = self.get_serializer(posts, many=True).data

        return Response(data)

class DraftViewSet(ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly, IsAuthenticatedOrReadOnly]
    queryset = Post.objects.filter(status="Draft").order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'cover':
            return PostCoverSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['put','patch','get'])
    def cover(self, request, pk):
        post = self.get_object()
        cover = request.FILES.get('cover')
        post.cover = cover
        post.save()

        return Response(PostSerializer(post,many=False).data)
    
    @action(detail=False, methods=['get'])
    def own_drafts(self, request):
        author = request.user
        posts = self.get_queryset().filter(author=author)
        data = self.get_serializer(posts, many=True).data

        return Response(data)

class TagViewSet(ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthorOrReadOnly, IsAuthenticatedOrReadOnly]
    queryset = Tag.objects.all()

class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Get the post ID from the query parameters
        if self.action in ['update','destroy','partial_update']:
            return Comment.objects.all()
        post_id = self.request.query_params.get('post')
        
        if post_id:
            # Filter comments by the specified post ID
            queryset = Comment.objects.filter(post_id=post_id, parent__isnull=True)  # Only top-level comments
        else:
            raise NotFound("Post ID not provided.")
        
        return queryset

    def perform_create(self, serializer):
        # Automatically associate the comment with the logged-in user
        serializer.save(user=self.request.user)
