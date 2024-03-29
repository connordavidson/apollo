"""apollo_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from api.views import FrontendAppView


urlpatterns = [
    path('admin/', admin.site.urls) ,
    path('api/', include('api.urls')) ,
    path('rest-auth/', include('rest_auth.urls')) ,
    path('rest-auth/registration/', include('rest_auth.registration.urls')) ,

    url(r'^', FrontendAppView.as_view()) ,
    #had to include this because rest-auth/reset-password was breaking -> https://stackoverflow.com/questions/28418233/noreversematch-at-rest-auth-password-reset/29505964#29505964
    path('', include('django.contrib.auth.urls')),

    url(r'^accounts/', include('allauth.urls')),
]
