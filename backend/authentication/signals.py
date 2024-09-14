from allauth.socialaccount.signals import social_account_updated, social_account_added, pre_social_login
from django.dispatch import receiver
from .models import Profile
from django.contrib.auth.models import User
from django.db.models.signals import post_save

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        print('creating')
        user = instance
        Profile.objects.create(user=user)

# @receiver([social_account_added, social_account_updated])
# def save_google_profile_picture(sender, request, sociallogin, **kwargs):
#     user = sociallogin.user
#     print('spcial')
#     # Extract the Google profile image URL
#     if sociallogin.account.provider == 'google':
#         print('google')
#         google_data = sociallogin.account.extra_data
#         print(google_data)
#         picture_url = google_data.get('picture', None)
        
#         if picture_url:
#             # Update or create the profile with the Google profile picture URL
#             Profile.objects.update_or_create(user=user, defaults={'cover': picture_url})