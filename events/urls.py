__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf.urls import url

# Local imports...
from .views import EventAPIView

urlpatterns = [
    url(r'^events/$', EventAPIView.as_view()),
]
