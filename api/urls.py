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


    CreateCommentUpvoteView ,
    RemoveCommentUpvoteView ,
    CommentUpvoteListView ,

    CommentDownvoteListView ,
    CreateCommentDownvoteView ,
    RemoveCommentDownvoteView ,

    ArticleUpvoteListView ,
    CreateArticleUpvoteView ,
    RemoveArticleUpvoteView ,

    ArticleDownvoteListView ,
    CreateArticleDownvoteView ,
    RemoveArticleDownvoteView ,

    CustomPasswordResetView ,
    # CustomPasswordResetConfirmView ,
    FrontendAppView ,
    PasswordChangeView ,

)

urlpatterns = [
    path('all-articles/', ArticleListView.as_view() , name="all-articles") ,
    path('article/<pk>/', ArticlePageView.as_view() , name="article") ,
    path('create-article/' , CreateArticleView.as_view() , name="create-article") ,
    path('login/' , CustomLoginView.as_view() , name="login") ,
    path('create-email/' , CreateEmailView.as_view() , name="create-email") ,
    path('create-comment/' , CreateCommentView.as_view() , name="create-comment") ,
    path('signup/' , CustomRegisterView.as_view() , name='register') ,

    path('comment-upvote/<comment_id>/' , CommentUpvoteListView.as_view() , name='comment-upvote-list-view') ,
    path('create-comment-upvote/' , CreateCommentUpvoteView.as_view(), name='create-comment-upvote') ,
    path('remove-comment-upvote/<pk>' , RemoveCommentUpvoteView.as_view() , name='remove-comment-upvote') ,

    path('comment-downvote/<comment_id>/' , CommentDownvoteListView.as_view() , name='comment-downvote-list-view') ,
    path('create-comment-downvote/' , CreateCommentDownvoteView.as_view(), name='create-comment-downvote') ,
    path('remove-comment-downvote/<pk>' , RemoveCommentDownvoteView.as_view() , name='remove-comment-downvote') ,

    path('article-upvote/<article_id>/' , ArticleUpvoteListView.as_view() , name='article-upvote-list-view') ,
    path('create-article-upvote/' , CreateArticleUpvoteView.as_view(), name='create-article-upvote') ,
    path('remove-article-upvote/<pk>' , RemoveArticleUpvoteView.as_view() , name='remove-article-upvote') ,

    path('article-downvote/<article_id>/' , ArticleDownvoteListView.as_view() , name='article-downvote-list-view') ,
    path('create-article-downvote/' , CreateArticleDownvoteView.as_view(), name='create-article-downvote') ,
    path('remove-article-downvote/<pk>' , RemoveArticleDownvoteView.as_view() , name='remove-article-downvote') ,


    path('password-reset/' , CustomPasswordResetView.as_view() , name='password-reset') ,
    # path('password-reset-confirm/' , CustomPasswordResetConfirmView.as_view() , name='password-reset-confirm')
    path('password-change/' , PasswordChangeView.as_view() , name='password-change') ,
    # path( '', FrontendAppView.as_view() )
]
