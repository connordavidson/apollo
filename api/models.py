from django.db import models
from django.contrib.auth.models import User , AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.



#getting changes to user profile and the following methods from https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html
# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE , related_name="profile")
#     email_updates = models.BooleanField(default=True)
#     # email = models.CharField(max_length=30, null=True)
#     def __str__(self):
#         return self.user.username
#
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
#
# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()



class CommentUpvote(models.Model):
    comment = models.ForeignKey('Comment' , related_name='comment_upvote_comment' , on_delete=models.SET_NULL , null=True , blank=True)
    user = models.ForeignKey(User , related_name='comment_upvote_user' , on_delete=models.SET_NULL , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)


class CommentDownvote(models.Model):
    comment = models.ForeignKey('Comment' , related_name='comment_downvote_comment' , on_delete=models.SET_NULL , null=True , blank=True)
    user = models.ForeignKey(User , related_name='comment_downvote_user' , on_delete=models.SET_NULL , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)

class Comment(models.Model):
    body = models.TextField()
    #automatically fills the value when it gets inserted
    created_date = models.DateTimeField(auto_now_add=True , null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(User , related_name='comment_author' , on_delete=models.SET_NULL , null =True , blank=True)
    article = models.ForeignKey('Article' , related_name='comment_article' , on_delete=models.SET_NULL , null=True , blank=True)

    def __str__(self):
        return self.user





class ArticleUpvote(models.Model):
    article = models.ForeignKey('Article' , related_name='article_upvote_comment' , on_delete=models.SET_NULL , null=True , blank=True)
    user = models.ForeignKey(User , related_name='article_upvote_user' , on_delete=models.SET_NULL , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)

class ArticleDownvote(models.Model):
    article = models.ForeignKey('Article' , related_name='article_downvote_comment' , on_delete=models.SET_NULL , null=True , blank=True)
    user = models.ForeignKey(User , related_name='article_downvote_user' , on_delete=models.SET_NULL , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)


#used to track when a user reads an article.
class UserReadArticle(models.Model):
    article = models.ForeignKey('Article' , related_name='user_read_article_article' ,  on_delete=models.SET_NULL , default=None , null=True , blank=True)
    user = models.ForeignKey(User , related_name='user_read_article_user' , on_delete=models.SET_NULL , null=True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)




class Article(models.Model):
    title = models.CharField(max_length=140)
    body = models.TextField()
    #automatically fills the value when it gets inserted
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    user = models.ForeignKey(User , related_name='article_author' , on_delete=models.SET_NULL , null =True , blank=True)
    pinned = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    def __str__(self):
        return self.title




#stores the emails that the users enter to recieve updates (for the "sign up for email updates" feature)
class Email(models.Model):
    email = models.EmailField(null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.email



#stores a user's email preferences
class UserEmailPreferences(models.Model):
    user = models.ForeignKey(User , related_name='email_preferences' , on_delete=models.SET_NULL ,  null =True , blank=True)
    news_and_updates = models.BooleanField(default=True)
    new_blog_posts = models.BooleanField(default=True)

    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    def _str_(self):
        return self.user
