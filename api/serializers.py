from rest_framework import serializers , fields

from django.contrib.auth.forms import PasswordResetForm , SetPasswordForm
from django.conf import settings

from rest_framework.authtoken.models import Token

from allauth.account.utils import setup_user_email
from allauth.account import app_settings as allauth_settings
from allauth.utils import (email_address_exists,
                           get_username_max_length)

from django.contrib.auth.models import User #, Group
from .models import (
    Comment ,
    Article ,
    Email ,

    CommentUpvote ,
    CommentDownvote ,

    ArticleUpvote ,
    ArticleDownvote ,

    UserReadArticle ,

    UserEmailPreferences ,

)




# found at https://krakensystems.co/blog/2020/custom-users-using-django-rest-framework
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'email', 'username', 'first_name', 'last_name', 'date_joined', 'last_login')


class CustomTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = (
            'key',
            'user'
        )
    #trying to create a UserEmailPreferences object when the user creates an account.. no luck yet. this is inspired by -> https://stackoverflow.com/questions/41735113/how-to-call-serializers-create-method-from-one-serializer
    def create(self, validated_data):
        print("validated data user : " + validated_data.get('user'))
        email_preferences_serializer = UpdateUserEmailPreferencesSerializer(validated_data.get('user'))
        email_preferences_serializer.save()
        return Token.objects.create(**validated_data)












class CommentUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentUpvote
        fields = (
            'id' ,
            'user' ,
            # 'comment'
        )

class CreateCommentUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentUpvote
        fields = (
            'comment',
            'user' ,
        )
    def create(self, validated_data):
        return CommentUpvote.objects.create(**validated_data)


class CommentDownvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentDownvote
        fields = (
            'id' ,
            'user' ,
            # 'comment'
        )

class CreateCommentDownvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentDownvote
        fields = (
            'comment',
            'user' ,
        )
    def create(self, validated_data):
        return CommentDownvote.objects.create(**validated_data)





class CommentSerializer(serializers.ModelSerializer):
    # gets the username from the parent user object and stores it into the author field. Found at -> https://stackoverflow.com/a/27851778/12921499
    author = serializers.CharField(read_only=True, source="user.username")
    upvotes = CommentUpvoteSerializer(many=True , read_only=True)

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





class ArticleUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleUpvote
        fields = (
            'id' ,
            'user' ,
            # 'comment'
        )

class CreateArticleUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleUpvote
        fields = (
            'article',
            'user' ,
        )
    def create(self, validated_data):
        return ArticleUpvote.objects.create(**validated_data)



class ArticleDownvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleDownvote
        fields = (
            'id' ,
            'user' ,
            # 'comment'
        )

class CreateArticleDownvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleDownvote
        fields = (
            'article',
            'user' ,
        )
    def create(self, validated_data):
        return ArticleDownvote.objects.create(**validated_data)





class UserReadArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReadArticle
        fields = (
            'article',
            'user' ,
        )
    def create(self, validated_data):
        return UserReadArticle.objects.create(**validated_data)








class ArticleSerializer(serializers.ModelSerializer):
    # gets the username from the parent user object and stores it into the author field. Found at -> https://stackoverflow.com/a/27851778/12921499
    author = serializers.CharField(read_only=True, source="user.username")

    class Meta:
        model = Article
        fields = (
            'id' ,
            'title' ,
            'body' ,
            'created_date' ,
            'author' ,
            # 'comments' ,
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
            "user" ,
            "article" ,

        )
    def create(self, validated_data):
        return Comment.objects.create(**validated_data)



#sends the "important" columns to the front end. These are the ones that get displayed in the email preferences section of the profile page
class UserEmailPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEmailPreferences
        fields = (
            "news_and_updates" ,
            "new_blog_posts" ,
        )



class UpdateUserEmailPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEmailPreferences
        fields = (
            "id" ,
            "news_and_updates" ,
            "new_blog_posts" ,
            "user"
        )
    def create(self, validated_data):
        return UserEmailPreferences.objects.create(**validated_data)



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
            'subject_template_name':'reset_password_subject.txt',
            'email_template_name': 'reset_password_email.txt',
            'request': request,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)



### USE THIS LINK FOR HELP ON SENDING CUSTOM COnfirm Accoun Emails => https://stackoverflow.com/questions/27984901/how-to-customize-activate-url-on-django-allauth


#got from -> https://github.com/Tivix/django-rest-auth/blob/624ad01afbc86fa15b4e652406f3bdcd01f36e00/rest_auth/registration/serializers.py#L166
class CustomRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    email = serializers.EmailField(required=True) #allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(_("The two password fields didn't match."))
        return data

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user





class CustomPasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset e-mail.
    """

    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)

    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    set_password_form_class = SetPasswordForm

    def custom_validation(self, attrs):
        pass

    def validate(self, attrs):
        self._errors = {}

        # Decode the uidb64 to uid to get User object
        try:
            uid = force_text(uid_decoder(attrs['uid']))
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({'uid': ['Invalid value']})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({'token': ['Invalid value']})

        return attrs

    def save(self):
        print("inside save in CustomPasswordResetConfirmSerializer")
        self.set_password_form.save()



#not used
class PasswordChangeSerializer(serializers.Serializer):

    old_password = serializers.CharField(max_length=128)
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)

    set_password_form_class = SetPasswordForm

    def __init__(self, *args, **kwargs):
        self.old_password_field_enabled = getattr(
            settings, 'OLD_PASSWORD_FIELD_ENABLED', True
        )
        self.logout_on_password_change = getattr(
            settings, 'LOGOUT_ON_PASSWORD_CHANGE', False
        )
        super(PasswordChangeSerializer, self).__init__(*args, **kwargs)

        if not self.old_password_field_enabled:
            self.fields.pop('old_password')

        self.request = self.context.get('request')
        self.user = getattr(self.request, 'user', None)

    def validate_old_password(self, value):
        print("validate old password")
        invalid_password_conditions = (
            self.old_password_field_enabled,
            self.user,
            not self.user.check_password(value)
        )

        if all(invalid_password_conditions):
            err_msg = _("Your old password was entered incorrectly. Please enter it again.")
            raise serializers.ValidationError(err_msg)
        return value

    def validate(self, attrs):
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )

        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        return attrs

    def save(self):
        self.set_password_form.save()
        if not self.logout_on_password_change:
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(self.request, self.user)







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
