# Third-party imports...
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

# Django imports...
from django.db.models import Q

# Local imports...
from users.models import UserProfile
from users.serializers import UserProfileSerializer
from .models import Event, EventHost
from .serializers import EventSerializer

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


def get_events(user):
    return Event.objects.prefetch_related('hosts', 'guests').filter(Q(hosts__in=[user]) | Q(guests__in=[user]))


def get_user_profile(user):
    return UserProfile.objects.get(user=user)


class EventAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        events = get_events(request.user)
        hosts = []
        guests = []

        # Get host and guest users...
        for event in events:
            hosts.extend(event.hosts.all())
            guests.extend(event.guests.all())

        hosts = UserProfile.objects.filter(user__in=hosts)
        guests = UserProfile.objects.filter(user__in=guests)

        return Response(status=HTTP_200_OK, data={
            'event': EventSerializer(events, many=True).data,
            'host': UserProfileSerializer(set(hosts), many=True).data,
            'guest': UserProfileSerializer(set(guests), many=True).data
        })

    def create(self, request):
        event_serializer = EventSerializer()
        event = event_serializer.create(request.data)

        # Create an event host.
        event_host = EventHost.objects.create(event=event, user=request.user)

        # Get the user profile.
        user_profile = get_user_profile(request.user)

        return Response(status=HTTP_200_OK, data={
            'event': EventSerializer(event).data,
            'host': UserProfileSerializer(user_profile).data,
            'guest': {}
        })


class EventBottleAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        return Response(status=HTTP_200_OK, data={})


class EventGuestAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        return Response(status=HTTP_200_OK, data={})
