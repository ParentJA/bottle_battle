__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Third-party imports...
from rest_framework import status, views
from rest_framework.response import Response

# Django imports...
from django.contrib.auth import get_user_model

# Local imports...
from .models import Bottle, Event
from .serializers import BottleSerializer, EventSerializer
from accounts.serializers import UserSerializer

User = get_user_model()


class EventAPIView(views.APIView):
    def get(self, request):
        # Events...
        events = Event.objects.all()

        # Users...
        users = User.objects.all()

        # TODO: Find users that are connected to the request user by events...

        # Bottles...
        bottles = Bottle.objects.all()

        return Response(status=status.HTTP_200_OK, data={
            'events': EventSerializer(events, many=True).data,
            'users': UserSerializer(users, many=True).data,
            'bottles': BottleSerializer(bottles, many=True).data,
        })
