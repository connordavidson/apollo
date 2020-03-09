from rest_framework import serializers , fields

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings

# from django.contrib.auth.models import User, Group
from .models import (
    Comment ,
    Article ,
    Email ,
    Upvote ,

)






class UpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = (
            'comment',
            'user' ,
        )

class CommentSerializer(serializers.ModelSerializer):
    upvotes = UpvoteSerializer(many=True , read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id" ,
            "body" ,
            "created_date" ,
            "updated_date" ,
            "author" ,
            "upvotes" ,
            "article"
        )

class ArticleSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True , read_only=True)

    class Meta:
        model = Article
        fields = (
            'id' ,
            'title' ,
            'body' ,
            'created_date' ,
            'author' ,
            'comments' ,
            'pinned' ,
        )

class EmailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Email
        fields = (
            "email" ,
        )




#used when a comment is created
class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            "body" ,
            "author" ,
            "article" ,

        )
    def create(self, validated_data):
        return Comment.objects.create(**validated_data)


class CreateUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = (
            'comment',
            'user' ,
        )
    def create(self, validated_data):
        return Upvote.objects.create(**validated_data)





#got from -> https://github.com/Tivix/django-rest-auth/blob/master/rest_auth/serializers.py
class PasswordResetSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def get_email_options(self):
        """Override this method to change default e-mail options"""
        return {}

    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value

    def save(self):
        request = self.context.get('request')
        #got email_template_name from -> https://stackoverflow.com/questions/34897834/how-to-customize-django-rest-auth-password-reset-email-content-template
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'email_template_name': 'reset_password_email.txt',
            'request': request,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)



#
# class CustomPasswordResetConfirmSerializer(serializers.Serializer):
#     """
#     Serializer for requesting a password reset e-mail.
#     """
#     new_password1 = serializers.CharField(max_length=128)
#     new_password2 = serializers.CharField(max_length=128)
#     uid = serializers.CharField()
#     token = serializers.CharField()
#
#     set_password_form_class = SetPasswordForm
#
#     def custom_validation(self, attrs):
#         pass
#
#     def validate(self, attrs):
#         self._errors = {}
#
#         # Decode the uidb64 to uid to get User object
#         try:
#             uid = force_text(uid_decoder(attrs['uid']))
#             self.user = UserModel._default_manager.get(pk=uid)
#         except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
#             raise ValidationError({'uid': ['Invalid value']})
#
#         self.custom_validation(attrs)
#         # Construct SetPasswordForm instance
#         self.set_password_form = self.set_password_form_class(
#             user=self.user, data=attrs
#         )
#         if not self.set_password_form.is_valid():
#             raise serializers.ValidationError(self.set_password_form.errors)
#         if not default_token_generator.check_token(self.user, attrs['token']):
#             raise ValidationError({'token': ['Invalid value']})
#
#         return attrs
#
#     def save(self):
#         return self.set_password_form.save()