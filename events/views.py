__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Third-party imports...
from rest_framework import status, viewsets
from rest_framework.response import Response

# Django imports...
from django.contrib.auth import get_user_model

# Local imports...
from .models import Event, EventHost
from .serializers import EventSerializer
from .services import get_events_hosted_by_user
from accounts.serializers import UserSerializer

User = get_user_model()


class EventAPIView(viewsets.ViewSet):
    def create(self, request):
        name = request.data.get('name')
        description = request.data.get('description')

        event = Event(name=name, description=description)
        event.save()

        EventHost.objects.create(event=event, user=request.user)

        return Response(status=status.HTTP_201_CREATED, data={
            'events': EventSerializer([event], many=True).data,
            'users': []
        })

    def list(self, request):
        events = get_events_hosted_by_user(request.user)

        # Get host and guests users...
        users = set()

        for event in events:
            for host in event.hosts.all():
                users.add(host)

            for guest in event.guests.all():
                users.add(guest)

        return Response(status=status.HTTP_200_OK, data={
            'events': EventSerializer(events, many=True).data,
            'users': UserSerializer(users, many=True).data
        })
