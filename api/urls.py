from django.urls import path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .views import (
    ArticleListView ,
    ArticlePageView ,
    CreateArticleView ,
    CustomLoginView ,
    CreateEmailView ,
    CreateCommentView ,
    CustomRegisterView ,
    CreateUpvoteView ,
    CustomPasswordResetView ,
    # CustomPasswordResetConfirmView ,
    FrontendAppView ,
)

urlpatterns = [
    path('all-articles/', ArticleListView.as_view() , name="all-articles") ,
    path('article/<pk>/', ArticlePageView.as_view() , name="article") ,
    path('create-article/' , CreateArticleView.as_view() , name="create-article") ,
    path('login/' , CustomLoginView.as_view() , name="login") ,
    path('create-email/' , CreateEmailView.as_view() , name="create-email") ,
    path('create-comment/' , CreateCommentView.as_view() , name="create-comment") ,
    path('signup/' , CustomRegisterView.as_view() , name='register') ,
    path('create-upvote/' , CreateUpvoteView.as_view(), name='create-upvote') ,
    path('password-reset/' , CustomPasswordResetView.as_view() , name='password-reset') ,
    # path('password-reset-confirm/' , CustomPasswordResetConfirmView.as_view() , name='password-reset-confirm')


    # path( '', FrontendAppView.as_view() )
]
