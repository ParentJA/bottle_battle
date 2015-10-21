__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf import settings
from django.db import models

AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL')


class Event(models.Model):
    name = models.CharField(max_length=255)
    schedule = models.DateTimeField()
    hosts = models.ManyToManyField(
        AUTH_USER_MODEL,
        through='EventHost',
        through_fields=('event', 'user'),
        related_name='hosted_events'
    )
    attendees = models.ManyToManyField(
        AUTH_USER_MODEL,
        through='EventAttendee',
        through_fields=('event', 'user'),
        related_name='attended_events'
    )
    bottles = models.ManyToManyField('events.Bottle', through='EventBottle', through_fields=('event', 'bottle'))

    def __unicode__(self):
        return self.name


class EventHost(models.Model):
    event = models.ForeignKey('events.Event')
    user = models.ForeignKey(AUTH_USER_MODEL)


class EventAttendee(models.Model):
    event = models.ForeignKey('events.Event')
    user = models.ForeignKey(AUTH_USER_MODEL)


class Bottle(models.Model):
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name


class EventBottle(models.Model):
    event = models.ForeignKey('events.Event')
    bottle = models.ForeignKey('events.Bottle')
