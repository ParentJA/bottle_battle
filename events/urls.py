# Django imports...
from django.conf.urls import url

# Local imports...
from .views import EventAPIView

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

urlpatterns = [
    url(r'^event/(?P<pk>\d+)/$', EventAPIView.as_view({'get': 'retrieve'})),
    url(r'^event/$', EventAPIView.as_view({'get': 'list'})),
]
