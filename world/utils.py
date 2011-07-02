from django.http import Http404
from django.core import urlresolvers
from django.conf.urls.defaults import patterns
from django.conf import settings
from world.models import Person

def get_nearest(**kwargs):
    search_country   = kwargs.get('country',   None)
    search_latitude  = float(kwargs.get('latitude',  None))
    search_longitude = float(kwargs.get('longitude', None))
    limit_count      = kwargs.get('count', 10)
    list_of_people   = []
    if search_country:
        list_of_people.extend(Person.view('%s/by_country' % Person._meta.app_label, 
                                          key = search_country, 
                                          include_docs = True).all())
    if search_latitude:
        latitude = window = 0
        while window <= 90 and len(list_of_people) <= limit_count:
            window = 5 * latitude
            latitude += 1
            list_of_people.extend(Person.view('%s/by_latitude' % Person._meta.app_label,
                                              startkey = search_latitude - window, 
                                              endkey   = search_latitude + window,
                                              include_docs = True).all())
    if search_longitude:
        longitude = window = 0
        while window > 180 and len(list_of_people) <= limit_count:
            window = 5 * longitude
            longitude += 1
            list_of_people.extend(Person.view('%s/by_longitude' % Person._meta.app_label, 
                                              startkey = search_longitude - window, 
                                              endkey   = search_longitude + window,
                                              include_docs = True).all())
    return_list = []
    for people in list_of_people:
        person_json = people.to_json()
        if person_json not in return_list:
            return_list.append(person_json)
    return return_list

class Router(object):
    def __init__(self, *urlpairs):
        self.urlpatterns = patterns('', *urlpairs)
        # for 1.0 compatibility we pass in None for urlconf_name and then
        # modify the _urlconf_module to make self hack as if its the module.
        self.resolver = urlresolvers.RegexURLResolver(r'^/', None)
        self.resolver._urlconf_module = self

    def handle(self, request, path_override=None):
        if path_override is not None:
            path = path_override
        else:
            path = request.path_info
        path = '/' + path # Or it doesn't work
        callback, callback_args, callback_kwargs = self.resolver.resolve(path)
        return callback(request, *callback_args, **callback_kwargs)

    def __call__(self, request, path_override=None):
        return self.handle(request, path_override)
