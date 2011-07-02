from couchdbkit.ext.django.schema import *

class Person(Document):
    user_id = StringProperty()
    bio     = StringProperty()
    photo   = StringProperty()

    # Location stuff - all location fields are required
    country   = StringProperty()
    latitude  = FloatProperty()
    longitude = FloatProperty()
    location_description = StringProperty()

    batch  = StringProperty()

    registered_on = DateTimeProperty(auto_now_add = True)
    last_edited   = DateTimeProperty(auto_now = True)
