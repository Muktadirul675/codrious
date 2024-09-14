from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from .models import Profile
from dj_rest_auth.registration.serializers import SocialLoginSerializer
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.models import SocialAccount
from rest_framework import serializers

class CustomSocialLoginSerializer(SocialLoginSerializer):
    def save(self, request):
        view = self.context.get('view')
        adapter_class = view.adapter_class
        app = adapter_class(request)

        # Complete the social login process
        social_login = complete_social_login(request, app)
        
        # Get the social login account
        if social_login.is_valid():
            user = social_login.user
            social_account = SocialAccount.objects.get(user=user, provider='google')
            google_data = social_account.extra_data
            picture_url = google_data.get('picture')

            if picture_url:
                Profile.objects.update_or_create(user=user, defaults={'cover': picture_url})

            return super().save(request)
        else:
            raise serializers.ValidationError("Social login failed")

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        exclude = ['user']

class UserInfoSerializer(ModelSerializer):
    profile = ProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['username','first_name','last_name','profile']


class ProfileCoverUpdateSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ['cover']