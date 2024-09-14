from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.TextField()
    cover = models.ImageField(upload_to='images/posts/covers/',null=True,blank=True)
    author = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    tags = models.ManyToManyField(Tag)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20,choices=[
        ('Public','Public'),
        ('Draft','Draft'),
    ], blank=True)

    def __str__(self):
        return self.status + ' ' + self.title[:50]

class Comment(models.Model):
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    comment = models.TextField()
    parent = models.ForeignKey('self', related_name='replies', null=True, blank=True, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} -> {self.comment[:50]}"

# class Series(models.Model):
#     title = models.TextField()
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.title}"

# class SeriesPost(models.Model):
#     series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='posts')
#     post = models.OneToOneField(Post, on_delete=models.CASCADE)
#     index = models.IntegerField()

#     def __str__(self):
#         return f"{self.post.title[:50]}"



