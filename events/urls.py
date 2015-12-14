__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf.urls import url

# Local imports...
from .views import EventAPIView

urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EventAPIView.as_view({'get': 'retrieve'})),
    url(r'^$', EventAPIView.as_view({
        'get': 'list',
        'post': 'create'
    })),
]
