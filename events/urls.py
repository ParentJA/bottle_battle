# Django imports...
from django.conf.urls import url

# Local imports...
from .views import EventAPIView, EventBottleAPIView, EventGuestAPIView

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

urlpatterns = [
    url(r'^event/(?P<pk>\d+)/$', EventAPIView.as_view({'get': 'retrieve'})),
    url(r'^event/$', EventAPIView.as_view({
        'get': 'list',
        'post': 'create'
    })),
    url(r'^bottle/$', EventBottleAPIView.as_view({'post': 'create'})),
    url(r'^guest/$', EventGuestAPIView.as_view({'post': 'create'})),
]
