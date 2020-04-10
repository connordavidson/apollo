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
    comment = models.ForeignKey('Comment' , related_name='upvotes' , on_delete=models.CASCADE , null=True , blank=True)
    user = models.ForeignKey(User , related_name='comment_upvotes' , on_delete=models.CASCADE , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)


class CommentDownvote(models.Model):
    comment = models.ForeignKey('Comment' , related_name='downvotes' , on_delete=models.CASCADE , null=True , blank=True)
    user = models.ForeignKey(User , related_name='comment_downvotes' , on_delete=models.CASCADE , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)

class Comment(models.Model):
    body = models.TextField()
    #automatically fills the value when it gets inserted
    created_date = models.DateTimeField(auto_now_add=True , null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    author = models.CharField(max_length=20 , default=None)

    article = models.ForeignKey('Article' , related_name='comments' , on_delete=models.CASCADE , null=True , blank=True)

    def __str__(self):
        return self.author





class ArticleUpvote(models.Model):
    article = models.ForeignKey('Article' , related_name='upvotes' , on_delete=models.CASCADE , null=True , blank=True)
    user = models.ForeignKey(User , related_name='article_upvotes' , on_delete=models.CASCADE , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)

class ArticleDownvote(models.Model):
    article = models.ForeignKey('Article' , related_name='downvotes' , on_delete=models.CASCADE , null=True , blank=True)
    user = models.ForeignKey(User , related_name='article_downvotes' , on_delete=models.CASCADE , null =True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)


#used to track when a user reads an article.
class UserReadArticle(models.Model):
    article = models.ForeignKey('Article' , related_name='user_articles' ,  on_delete=models.CASCADE , default=None , null=True , blank=True)
    user = models.ForeignKey(User , related_name='user_articles' , on_delete=models.CASCADE , null=True , blank=True)
    created_date = models.DateTimeField(auto_now_add=True , null=True)




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
