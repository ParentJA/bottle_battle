__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.contrib import admin
from django.contrib.auth import get_user_model

# Local imports...
from .models import Bottle, Event

User = get_user_model()


class EventHostAdmin(admin.TabularInline):
    model = Event.hosts.through
    extra = 1


class EventAttendeeAdmin(admin.TabularInline):
    model = Event.attendees.through
    extra = 1


class EventBottleAdmin(admin.TabularInline):
    model = Event.bottles.through
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ('name',)
    ordering = ('name',)
    inlines = (EventHostAdmin, EventAttendeeAdmin, EventBottleAdmin)


@admin.register(Bottle)
class BottleAdmin(admin.ModelAdmin):
    fields = ('name',)
    ordering = ('name',)
