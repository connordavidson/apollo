from django.contrib import admin
from .models import (
        Article,
        Comment ,
        Email ,
        Upvote ,
        
    )
# Register your models here.





admin.site.register(Article)
admin.site.register(Comment)
admin.site.register(Email)
admin.site.register(Upvote)
