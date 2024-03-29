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
    DestroyAPIView ,
    RetrieveUpdateAPIView ,
    UpdateAPIView ,

)
#to pull in the email templates
from django.template import loader

from rest_framework.permissions import (
    AllowAny ,
    IsAuthenticated ,
    IsAdminUser ,
    IsAuthenticatedOrReadOnly ,
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
    PromotionalEmail ,
    EmailAddress ,
    CommentUpvote ,
    CommentDownvote ,
    ArticleUpvote ,
    ArticleDownvote ,
    UserReadArticle ,
    UserEmailPreferences ,

)

from .serializers import (
    ArticleSerializer ,
    EmailAddressSerializer ,
    PromotionalEmailSerializer ,

    CommentSerializer ,
    CreateCommentSerializer ,

    PasswordResetSerializer ,
    PasswordChangeSerializer ,

    CommentUpvoteSerializer ,
    CreateCommentUpvoteSerializer ,
    CommentDownvoteSerializer ,
    CreateCommentDownvoteSerializer ,

    ArticleUpvoteSerializer ,
    CreateArticleUpvoteSerializer ,

    ArticleDownvoteSerializer ,
    CreateArticleDownvoteSerializer ,

    UserSerializer ,
    UserReadArticleSerializer ,

    CustomPasswordResetConfirmSerializer ,

    UserEmailPreferencesSerializer ,
    UpdateUserEmailPreferencesSerializer ,
    CreateUserEmailPreferencesSerializer ,

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
    # queryset = Article.objects.all().order_by('-created_date')
    queryset = Article.objects.filter(deleted=False).order_by('-created_date')



class ArticlePageView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ArticleSerializer
    def get_queryset(self):
        #grab the id from the parameters
        id = self.kwargs['pk']
        #gets all the articles that are not marked as "deleted"
        qs = Article.objects.all().filter(deleted=False)
        #checks if the id param or the article for the given id is null. if so, return 404.
        if id is None or qs.filter(id=id) is None :
            return Http404("Article not found")
        #return the article with the given id.
        return qs.filter(id=id)



class UserEmailPreferencesListView(ListAPIView):

    authentication_classes = (TokenAuthentication, )
    serializer_class = UserEmailPreferencesSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = UserEmailPreferences.objects
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)








#probably need to filter by user_id in the QS
class UserEmailPreferencesUpdateView(UpdateAPIView):
    authentication_classes = (TokenAuthentication, )

    # queryset = UserEmailPreferences.objects.all()
    # serializer_class = UpdateUserEmailPreferencesSerializer
    queryset = UserEmailPreferences.objects.all()
    serializer_class = UpdateUserEmailPreferencesSerializer
    permission_classes = (AllowAny, )
    #this is how it knows which one to update (user_id comes from the url urls.py)
    lookup_field = "user_id"

    #got from -> https://stackoverflow.com/a/31175629/12921499
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.news_and_updates = request.data.get("news_and_updates")
        instance.new_blog_posts = request.data.get("new_blog_posts")
        instance.save()

        # serializer = self.get_serializer(instance)
        # serializer.is_valid(raise_exception=True )
        # self.perform_update(serializer)

        return Response(
            {"message": ("Email preferences updated.")},
            status=HTTP_200_OK
        )


class UserEmailPreferencesCreateView(CreateAPIView):
    # authentication_classes = (TokenAuthentication, )

    # queryset = UserEmailPreferences.objects.all()
    # serializer_class = UpdateUserEmailPreferencesSerializer
    queryset = UserEmailPreferences.objects.all()
    serializer_class = CreateUserEmailPreferencesSerializer
    permission_classes = (AllowAny, )
    #this is how it knows which one to update (user_id comes from the url urls.py)
    # lookup_field = "user_id"

    #got from -> https://stackoverflow.com/a/31175629/12921499
    # def create(self, validated_data):
    #     data = validated_data.pop('data')
    #     coin = models.Coin.objects.create(**validated_data)
    #     models.Data.objects.create(coin=coin, **data[0])
    #
    #     return Response(
    #         {"message": ("Email preferences created.")},
    #         status=HTTP_200_OK
    #     )




class CreateArticleView(CreateAPIView):
    #only allows an article to be created by an admin user
    # permission_classes = (IsAdminUser, )
    authentication_classes = (TokenAuthentication,)

    # authentication_classes = (TokenAuthentication,)
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()


class CommentListView(ListAPIView):
    permission_classes = (AllowAny , )
    serializer_class = CommentSerializer
    def get_queryset(self):
        article_id = self.kwargs['article_id']
        qs = Comment.objects.all()
        if article_id is None :
            return Http404("article id not found")
        return qs.filter(article=article_id , deleted=False)







class ArticleUpvoteListView(ListAPIView):
    permission_classes = (AllowAny , )
    serializer_class = ArticleUpvoteSerializer
    def get_queryset(self):
        article_id = self.kwargs['article_id']
        qs = ArticleUpvote.objects.all()
        if article_id is None :
            return Http404("article id not found")
        return qs.filter(article=article_id)

class CreateArticleUpvoteView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateArticleUpvoteSerializer
    queryset = ArticleUpvote.objects.all()

class RemoveArticleUpvoteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = ArticleUpvote.objects.all()



class ArticleDownvoteListView(ListAPIView):
    permission_classes = (AllowAny , )
    serializer_class = ArticleDownvoteSerializer
    def get_queryset(self):
        article_id = self.kwargs['article_id']
        qs = ArticleDownvote.objects.all()
        if article_id is None :
            return Http404("article id not found")

        return qs.filter(article=article_id)

class CreateArticleDownvoteView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateArticleDownvoteSerializer
    queryset = ArticleDownvote.objects.all()

class RemoveArticleDownvoteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = ArticleDownvote.objects.all()



###MAY HAVE TO  CONSOLIDATE THESE ENDPOINTS INTO 1 ENDPOINT ####
#gets all of the articles that a user has upvoted
class UserArticleUpvoteListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ArticleUpvoteSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = ArticleUpvote.objects.all()
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)

#gets all of the articles that a user has downvoted
class UserArticleDownvoteListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ArticleDownvoteSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = ArticleDownvote.objects.all()
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)

#gets all of the comments that a user has upvoted
class UserCommentUpvoteListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CommentUpvoteSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = CommentUpvote.objects.all()
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)

#gets all of the comments that a user has downvoted
class UserCommentDownvoteListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CommentDownvoteSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = CommentDownvote.objects.all()
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)



#adds to the UserReadArticle table. this tracks whenever a user reads an article
class CreateUserReadArticleView(CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserReadArticleSerializer
    queryset = UserReadArticle.objects.all()

#gets all of the article that a user has read
class UserReadArticleListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserReadArticleSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        qs = UserReadArticle.objects.distinct('article') #all()
        if user_id is None :
            return Http404("user id not found")
        return qs.filter(user=user_id)



class CreateEmailAddressView(CreateAPIView):
    #with no post def, this works
    serializer_class = EmailAddressSerializer
    queryset = EmailAddress.objects.all()

    def post(self, request):
        email_address = request.data.get('email' , None )
        email_exists = EmailAddress.objects.all().filter(email = email_address).count()

        if email_exists < 1:
            # found this at https://www.django-rest-framework.org/tutorial/2-requests-and-responses/#pulling-it-all-together
            serializer = EmailAddressSerializer(data=request.data)
            if serializer.is_valid():
                subject = 'Thank you for registering your email at Apollo!'
                message = '''We appreciate it and will send you emails to keep you updated with the progress of our site!
                Sincerely, The Team at Apollo'''
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [email_address,]
                # got from this answer -> https://stackoverflow.com/a/29467274/12921499
                html_message = loader.render_to_string(
                            'create_email_address_html.html',
                            {
                                'email_address': email_address,

                            }
                        )

                send_mail(subject, message, email_from, recipient_list, html_message=html_message )
                #save the email address after sending the email (shouldn't be an error bc  serializer.is_valid() == true )
                serializer.save()

                return Response(serializer.data, status=HTTP_201_CREATED)
        else :
            return Response("This email is already registered" , status=HTTP_400_BAD_REQUEST)





class CreatePromotionalEmailView(CreateAPIView):
    #with no post def, this works
    serializer_class = PromotionalEmailSerializer
    queryset = PromotionalEmail.objects.all()

    def post(self, request):
        subject     =       request.data.get('subject' , None )
        body        =       request.data.get('body' , None )
        recipient   =       request.data.get('recipients' , None )
        user        =       request.data.get('user' , None )

        # got the data for filtering based on a variable from here -> https://stackoverflow.com/a/4720109/12921499
        recipient_user_ids = UserEmailPreferences.objects.filter( **{ recipient: True }  ).values('user').distinct()
        #get the recipient user emails based on the id's from the UserEmailPreferences table
        recipient_user_emails = User.objects.filter( pk__in=recipient_user_ids ).values('email').distinct()

        # #loops through the list of qs results and appends the values to the email_recipient_list list
        email_recipient_list = []
        for qs in recipient_user_emails :
            email_recipient_list.append(qs["email"])


        print( request.data )
            # found this at https://www.django-rest-framework.org/tutorial/2-requests-and-responses/#pulling-it-all-together
        serializer = PromotionalEmailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            #loop through all the recipients and send an email to every email in the list.
            #This is necessary because using email_recipient_list will show every other recipient in the "To: " field
            for email in email_recipient_list :
                email_from = settings.EMAIL_HOST_USER
                # #sends email with html email (passed in from frontend.) and passes the html message as the "default" message
                send_mail(subject, body, email_from, [email,] , html_message=body)

            return Response(serializer.data, status=HTTP_201_CREATED)
        else :
            return Response("Error with serializer " , status=HTTP_400_BAD_REQUEST)






class CreateCommentView(CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = CreateCommentSerializer
    queryset = Comment.objects.all()


class CommentUpvoteListView(ListAPIView):
    permission_classes = (AllowAny , )
    serializer_class = CommentUpvoteSerializer
    def get_queryset(self):
        comment_id = self.kwargs['comment_id']
        qs = CommentUpvote.objects.all()
        if comment_id is None :
            return Http404("comment id not found")
        return qs.filter(comment=comment_id)

class CreateCommentUpvoteView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateCommentUpvoteSerializer
    queryset = CommentUpvote.objects.all()

class RemoveCommentUpvoteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = CommentUpvote.objects.all()



class CommentDownvoteListView(ListAPIView):
    permission_classes = (AllowAny , )
    serializer_class = CommentUpvoteSerializer
    def get_queryset(self):
        comment_id = self.kwargs['comment_id']
        qs = CommentDownvote.objects.all()
        if comment_id is None :
            return Http404("comment id not found")
        return qs.filter(comment=comment_id)

class CreateCommentDownvoteView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CreateCommentDownvoteSerializer
    queryset = CommentDownvote.objects.all()

class RemoveCommentDownvoteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = CommentDownvote.objects.all()





class CustomRegisterView(RegisterView):

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                        status=HTTP_201_CREATED,
                        headers=headers)



class CustomLoginView(LoginView):
    def get_response(self):
        original_response = super().get_response()
        key = original_response.data['key']
        user = Token.objects.filter(key=key).values('user_id').distinct()
        user_id = user[0]['user_id']
        # last_login = User.objects.filter(pk=user_id).values('last_login').distinct()
        # user_last_login = last_login[0]['last_login']
        # user_is_staff = user_is_staff[0]['is_staff']

        mydata = { "user_id": user_id }

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

class CustomPasswordResetConfirmView(GenericAPIView):

    """
    Password reset e-mail link is confirmed, therefore this resets the user's password.
    Accepts the following POST parameters: new_password1, new_password2
    Accepts the following Django URL arguments: token, uid
    Returns the success/fail message.
    """

    serializer_class = CustomPasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        print("inside CustomPasswordResetConfirmView ")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": "Password has been reset with the new password."})






#not using this
class PasswordChangeView(GenericAPIView):

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
        return Response({"detail": _("New password has been saved.")}, status=HTTP_200_OK)




class UserDetailsView(RetrieveUpdateAPIView):
    """
    Reads and updates UserModel fields
    Accepts GET, PUT, PATCH methods.
    Default accepted fields: username, first_name, last_name
    Default display fields: pk, username, email, first_name, last_name
    Read-only fields: pk, email
    Returns UserModel fields.
    """
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        """
        Adding this method since it is sometimes called when using
        django-rest-swagger
        https://github.com/Tivix/django-rest-auth/issues/275
        """
        return get_user_model().objects.none()




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
