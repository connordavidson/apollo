from django.contrib import admin
from .models import (
        Article,
        Comment ,
        # Email ,
        EmailAddress ,
        CommentUpvote ,
        CommentDownvote ,
        ArticleUpvote ,
        ArticleDownvote ,

    )
# Register your models here.



admin.site.register(Article)
admin.site.register(Comment)
# admin.site.register(Email)
admin.site.register(EmailAddress)


admin.site.register(CommentUpvote)
admin.site.register(CommentDownvote)
admin.site.register(ArticleUpvote)
admin.site.register(ArticleDownvote)
