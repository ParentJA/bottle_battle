# Django imports...
from django.contrib import admin

# Local imports...
from .models import Event

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class EventHostAdmin(admin.TabularInline):
    model = Event.hosts.through
    extra = 1


class EventGuestAdmin(admin.TabularInline):
    model = Event.guests.through
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ('name', 'description')
    ordering = ('name',)
    inlines = (EventHostAdmin, EventGuestAdmin)
