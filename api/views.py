from django.shortcuts import render
from django.http import Http404
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST ,
    HTTP_201_CREATED ,
    HTTP_200_OK ,

)
from rest_auth.views import LoginView
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    GenericAPIView ,

)

from rest_framework.permissions import (
    AllowAny ,
    IsAuthenticated ,
    IsAdminUser
)
from rest_auth.views import (
    LoginView ,
    PasswordResetView ,
    PasswordResetConfirmView ,

)
from django.views.generic import View
from django.views.decorators.debug import sensitive_post_parameters
from rest_auth.registration.views import RegisterView
from rest_framework.authentication import TokenAuthentication
#for getting the token of the user that is logging in
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
#for sending email
from django.core.mail import send_mail
from django.conf import settings
import os
from django.http import HttpResponse
from django.utils.decorators import method_decorator


from .models import (
    Comment ,
    Article ,
    Email ,
    Upvote ,

)
from .serializers import (
    ArticleSerializer ,
    EmailSerializer ,
    CommentSerializer ,
    CreateCommentSerializer ,
    CreateUpvoteSerializer ,
    PasswordResetSerializer ,
    PasswordChangeSerializer ,

)


# Create your views here.

# sensitive_post_parameters_m = method_decorator(
#     sensitive_post_parameters(
#         'password', 'old_password', 'new_password1', 'new_password2'
#     )
# )


# from -> https://medium.com/@zackliutju/building-react-and-django-web-application-and-deploy-it-on-google-cloud-545f06eb5521
class FrontendAppView(View):
    # print('frontendapp view !!!')
    def get(self, request):
            # print (os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
            try:
                # print("frontendappview inside TRY ")
                with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                    return HttpResponse(f.read())
            except FileNotFoundError:
                logging.exception('Production build of app not found')
                return HttpResponse(
                    """
                    This URL is only used when you have built the production
                    version of the app. Visit http://localhost:3000/ instead, or
                    run `yarn run build` to test the production version.
                    """,
                    status=501,
                )




class ArticleListView(ListAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ArticleSerializer

    #[::-1] reverses the list. the email popover kept glitching out the order of the articles so i just reversed the list on the backend
    #.order_by('-created_date') reverses the order by the date that they were created
    queryset = Article.objects.all().order_by('-created_date')


class ArticlePageView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ArticleSerializer
    def get_queryset(self):
        id = self.kwargs['pk']
        qs = Article.objects.all()
        if id is None :
            return Http404("Article not found")
        return qs.filter(id=id)




class CreateArticleView(CreateAPIView):
    #only allows an article to be created by an admin user
    permission_classes = (IsAdminUser, )

    authentication_classes = (TokenAuthentication,)
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()


class CreateEmailView(CreateAPIView):
    #with no post def, this works
    serializer_class = EmailSerializer
    queryset = Email.objects.all()

    def post(self, request):
        email_address = request.data.get('email' , None )
        email_exists = Email.objects.all().filter(email = email_address).count()

        if email_exists < 1:
            # found this at https://www.django-rest-framework.org/tutorial/2-requests-and-responses/#pulling-it-all-together
            serializer = EmailSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                subject = 'Thank you for registering with Apollo!'
                message = '''We appreciate it and will send you emails to keep you updated with the progress of our site!
                Sincerely, The Team at Apollo'''
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [email_address,]
                send_mail(subject, message, email_from, recipient_list)

                return Response(serializer.data, status=HTTP_201_CREATED)
        else :
            return Response("This email is already registered" , status=HTTP_400_BAD_REQUEST)

class CreateCommentView(CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = CreateCommentSerializer
    queryset = Comment.objects.all()


class CreateUpvoteView(CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = CreateUpvoteSerializer
    queryset = Upvote.objects.all()





class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        subject = 'Thank you for creating an account with Apollo!'
        message = '''We appreciate it and will keep you updated with the progress of our site! blah blah blah
        Sincerely, The Team at Apollo'''
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email_address,]
        send_mail(subject, message, email_from, recipient_list)

        response = super().create(request, *args, **kwargs)
        return response


class CustomLoginView(LoginView):
    def get_response(self):
        original_response = super().get_response()
        key = original_response.data['key']
        user = Token.objects.filter(key=key).values('user_id').distinct()
        user_id = user[0]['user_id']
        # user_is_staff = User.objects.filter(pk=user_id).values('is_staff')
        # user_is_staff = user_is_staff[0]['is_staff']

        mydata = {"user_id": user_id}
        original_response.data.update(mydata)
        return original_response



#got from -> https://github.com/Tivix/django-rest-auth/blob/master/rest_auth/views.py
class CustomPasswordResetView(PasswordResetView):
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Create a serializer with request.data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # Return the success message with OK HTTP status
        return Response(
            {"message": ("Check your inbox for a link to reset your password.")},
            status=HTTP_200_OK
        )





#not using this
class PasswordChangeView(GenericAPIView):
    print("inside password change view")
    """
    Calls Django Auth SetPasswordForm save method.
    Accepts the following POST parameters: new_password1, new_password2
    Returns the success/fail message.
    """
    serializer_class = PasswordChangeSerializer
    permission_classes = (IsAuthenticated,)

    # @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(PasswordChangeView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        print("inside post")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": _("New password has been saved.")})









# class UserDetailsView(RetrieveUpdateAPIView):
#     """
#     Reads and updates UserModel fields
#     Accepts GET, PUT, PATCH methods.
#     Default accepted fields: username, first_name, last_name
#     Default display fields: pk, username, email, first_name, last_name
#     Read-only fields: pk, email
#     Returns UserModel fields.
#     """
#     serializer_class = UserDetailsSerializer
#     permission_classes = (AllowAny,)
#
#     def get_object(self):
#         return self.request.user
#
#     def get_queryset(self):
#         """
#         Adding this method since it is sometimes called when using
#         django-rest-swagger
#         https://github.com/Tivix/django-rest-auth/issues/275
#         """
#         return get_user_model().objects.none()





#
# class CustomPasswordResetConfirmView(PasswordResetConfirmView):
#     """
#     Password reset e-mail link is confirmed, therefore
#     this resets the user's password.
#     Accepts the following POST parameters: token, uid,
#         new_password1, new_password2
#     Returns the success/fail message.
#     """
#     serializer_class = CustomPasswordResetConfirmSerializer
#     permission_classes = (AllowAny,)
#
#     @sensitive_post_parameters_m
#     def dispatch(self, *args, **kwargs):
#         return super(PasswordResetConfirmView, self).dispatch(*args, **kwargs)
#
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(
#             {"detail": _("Password has been reset with the new password.")}
#         )
