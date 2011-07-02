from django.conf import settings
from django.conf.urls.defaults import *
from world.views import WorldViews
from django_couchdb_utils.openid_consumer.registration import RegistrationConsumer

urlpatterns = patterns('',
)

dev = getattr(settings, 'PROD', None)
if not dev:
    import os
    dirp = os.path.dirname(__file__)
    urlpatterns += patterns('',
        (r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root':  os.path.join(dirp,'site_media')}),
)

urlpatterns += patterns('',
    (r'^openid/(.*)', RegistrationConsumer()),
    (r'^(.*)', WorldViews()),
)
