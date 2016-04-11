# Third-party imports...
from rest_framework import serializers

# Local imports...
from .models import Event

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class EventSerializer(serializers.ModelSerializer):
    hosts = serializers.SlugRelatedField(slug_field='username', read_only=True, many=True)
    guests = serializers.SlugRelatedField(slug_field='username', read_only=True, many=True)

    class Meta:
        model = Event
        fields = ('id', 'name', 'description', 'hosts', 'guests')
