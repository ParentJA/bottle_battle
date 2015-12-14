__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf import settings
from django.db import models

AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL')


class Event(models.Model):
    """A happening that occurs in a specific place at a certain time."""

    name = models.CharField(max_length=255)
    description = models.TextField()

    # One or more users hosting the event...
    hosts = models.ManyToManyField(
        AUTH_USER_MODEL,
        through='EventHost',
        through_fields=('event', 'user'),
        related_name='events_hosted'
    )

    # One or more users attending the event...
    guests = models.ManyToManyField(
        AUTH_USER_MODEL,
        through='EventGuest',
        through_fields=('event', 'user'),
        related_name='events_attended'
    )

    class Meta:
        default_related_name = 'events'
        ordering = 'name',

    def __unicode__(self):
        return self.name


class EventHost(models.Model):
    """A user who starts an event."""

    event = models.ForeignKey('events.Event')
    user = models.ForeignKey(AUTH_USER_MODEL)

    class Meta:
        default_related_name = 'event_hosts'

    def __unicode__(self):
        return '{} is hosting {}'.format(self.user, self.event)


class EventGuest(models.Model):
    """A user who joins an event."""

    event = models.ForeignKey('events.Event')
    user = models.ForeignKey(AUTH_USER_MODEL)

    class Meta:
        default_related_name = 'event_guests'

    def __unicode__(self):
        return '{} is attending {}'.format(self.user, self.event)
