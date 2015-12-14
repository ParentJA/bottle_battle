__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Standard library imports...

# Third-party imports...

# Django imports...

# Local imports...
from .models import Event


def get_events_hosted_by_user(user):
    return Event.objects.prefetch_related().filter(hosts__in=[user])
