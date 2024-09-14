from rest_framework.serializers import ModelSerializer, SerializerMethodField
from authentication.serializers import *
from .models import *

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

    def validate(self, data):
        return data

class PostCoverSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ['image']

class PostSerializer(ModelSerializer):
    tags = TagSerializer(many=True)
    author = UserInfoSerializer(many=False, read_only=True)
    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ['author']

    # def validate_tags(self, tags_data):
    #     """
    #     Custom validation for the tags field.
    #     This method bypasses the default uniqueness validation.
    #     """
    #     # print('validaring')
    #     validated_tags = []
    #     for tag_data in tags_data:
    #         # Normalize the tag name (e.g., stripping whitespace, making lowercase)
    #         tag_name = tag_data['name'].strip().lower()
            
    #         # Check if the tag already exists, but don't raise a validation error
    #         tag, created = Tag.objects.get_or_create(name=tag_name)
    #         validated_tags.append({'name': tag_name})  # Use the normalized name
        
    #     return validated_tags

    def create(self, validated_data):
        tags = validated_data.pop('tags')
        # print('creating')
        post = Post.objects.create(**validated_data)

        for t in tags:
            name = t['name']
            # tag = None
            tag, created = Tag.objects.get_or_create(name=name)
            # if Tag.objects.filter(name=name).exists():
            #     tag = Tag.objects.get(name=name)
            # else:
            #     print('not exiata')
            #     tag = Tag.objects.create(name=name)
            #     tag.save()

            post.tags.add(tag)

        post.save()
        return post

    
    
    def update(self, instance, validated_data):
        tags = validated_data.get('tags',None)
        title = validated_data.get('title',instance.title)
        content = validated_data.get('content', instance.content)
        cover = validated_data.get('cover',None)

        if cover:
            if instance.cover and cover != instance.cover:
                instance.cover.delete(save=False)
            instance.cover = cover
        # print('creating')
        if tags:
            new_tags = []
            for t in tags:
                name = t['name']
                # tag = None
                tag, created = Tag.objects.get_or_create(name=name)
                # if Tag.objects.filter(name=name).exists():
                #     tag = Tag.objects.get(name=name)
                # else:
                #     print('not exiata')
                #     tag = Tag.objects.create(name=name)
                #     tag.save()

                new_tags.append(tag)
            instance.tags.set(new_tags)
        instance.title = title
        instance.content = content
        instance.status = validated_data.get('status',instance.status)
        instance.save()
        return instance

class CommentSerializer(ModelSerializer):
    user = UserInfoSerializer(read_only=True)  # Use UserSerializer for user field
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'comment', 'parent', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return None

    def create(self, validated_data):
        # Set the user to the request user in the context
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

# class SeriesSerializer(ModelSerializer):
#     class Meta:
#         model = Series
#         fields = "__all__"

# class SeriesPostSerializer(ModelSerializer):
#     class Meta:
#         model = SeriesPost
#         fields = "__all__"

# class SeriesPostDetailsSerializer(ModelSerializer):
#     post = PostSerializer(many=False, read_only=True)
#     class Meta:
#         model = SeriesPost
#         fields = "__all__"

# class PostSerializer(ModelSerializer):
#     tags = TagSerializer(many=True)

#     class Meta:
#         model = Post
#         fields = "__all__"
#         read_only_fields = ['author']

#     def validate_tags(self, tags_data):
#         """
#         Custom validation for the tags field.
#         This method bypasses the default uniqueness validation.
#         """
#         validated_tags = []
#         for tag_data in tags_data:
#             # Normalize the tag name (e.g., stripping whitespace, making lowercase)
#             tag_name = tag_data['name'].strip().lower()
            
#             # Check if the tag already exists, but don't raise a validation error
#             tag, created = Tag.objects.get_or_create(name=tag_name)
#             validated_tags.append({'name': tag_name})  # Use the normalized name
        
#         return validated_tags

#     def create(self, validated_data):
#         tags_data = validated_data.pop('tags', [])
#         post = Post.objects.create(**validated_data)

#         for tag_data in tags_data:
#             tag_name = tag_data['name'].strip().lower()
#             tag, created = Tag.objects.get_or_create(name=tag_name)
#             post.tags.add(tag)

#         return post
