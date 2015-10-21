__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Third-party imports...
from rest_framework import serializers

# Local imports...
from .models import Bottle, Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name', 'hosts', 'attendees', 'bottles')


class BottleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bottle
        fields = ('id', 'name')
