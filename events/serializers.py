# Third-party imports...
from rest_framework import serializers

# Local imports...
from .models import Event

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class EventSerializer(serializers.ModelSerializer):
    hosts = serializers.SlugRelatedField(slug_field='username', read_only=True, many=True)
    guests = serializers.SlugRelatedField(slug_field='username', read_only=True, many=True)

    def create(self, validated_data):
        return Event.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        return instance

    class Meta:
        model = Event
        fields = ('id', 'name', 'description', 'hosts', 'guests')
