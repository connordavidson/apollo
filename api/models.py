from django.db import models
from django.contrib.auth.models import User
# Create your models here.


# class UserProfile(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     one_click_purchasing = models.BooleanField(default=False)
#     email = models.CharField(max_length=30, null=True)
#     def __str__(self):
#         return self.user.username



class Upvote(models.Model):
    comment = models.ForeignKey('Comment' , related_name='upvotes' , on_delete=models.CASCADE , null=True , blank=True)
    user = models.ForeignKey(User , related_name='updates' , on_delete=models.CASCADE , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)
    def __str__(self):
        return self.comment.author

class Comment(models.Model):
    body = models.TextField()
    #automatically fills the value when it gets inserted
    created_date = models.DateTimeField(auto_now_add=True , null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    author = models.CharField(max_length=20 , default=None)

    article = models.ForeignKey('Article' , related_name='comments' , on_delete=models.CASCADE , null=True , blank=True)

    def __str__(self):
        return self.author

class Article(models.Model):
    title = models.CharField(max_length=140)
    body = models.TextField()
    #automatically fills the value when it gets inserted
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    author = models.CharField(max_length=20 , default=None)
    pinned = models.BooleanField(default=False)
    def __str__(self):
        return self.title



#stores the emails that the users enter to recieve updates
class Email(models.Model):
    email = models.EmailField(null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.email



#stores a user's email preferences
class EmailPreferences(models.Model):
    user = models.ForeignKey(User , related_name='email_preferences' , on_delete=models.CASCADE ,  null =True , blank=True)
    
    def _str_(self):
        return self.user
