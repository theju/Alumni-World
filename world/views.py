import urlparse, os, json
from world.utils import get_nearest, Router
from django_couchdb_utils.auth.models import User
from django.conf import settings
from world.models import Person
from django.core.paginator import Paginator
from world.forms import PersonForm, EXCLUDE_LIST, PersonSortedDict
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.template import RequestContext
from django.utils.translation import ugettext
from django.utils.datastructures import SortedDict
from django.forms import Field

login_required_m = method_decorator(login_required)

class WorldViews(object):
    urlname_pattern = 'person_%s' 
    num_per_page = getattr(settings, "NUM_PER_PAGE", 50)        

    def __call__(self, request, rest_of_url=None):
        if not request.path.endswith('/'):
            return HttpResponseRedirect(request.path + '/')
        router = Router(*self.get_urlpatterns())
        return router(request, path_override = rest_of_url)

    def get_urlpatterns(self):
        # Default behaviour is to introspect self for do_* methods
        from django.conf.urls.defaults import url
        urlpatterns = []
        for method in dir(self):
            if method.startswith('do_'):
                callback = getattr(self, method)
                name = method.replace('do_', '')
                urlname = self.urlname_pattern % name
                urlregex = getattr(callback, 'urlregex', '^%s/$' % name)
                urlpatterns.append(
                    url(urlregex, callback, name=urlname)
                )
        return urlpatterns

    def get_urls(self):
        # In Django 1.1 and later you can hook this in to your urlconf
        from django.conf.urls.defaults import patterns
        return patterns('', *self.get_urlpatterns())

    def urls(self):
        return self.get_urls()
    urls = property(urls)

    def do_index(self, request):
        if request.user.is_anonymous():
            return render(request, 'person/index.html', {
                    'countries'    : Person.view('world/by_country_summary', 
                                                 group=True).iterator(),
                    'batches'      : Person.view('world/by_batch_summary',
                                                 group=True).iterator(),
                    'total_people' : Person.view('world/by_user_id').count(),
                    'by_batch'     : Person.view('world/by_batch_summary', 
                                                 group=True).iterator(),
                    'recent_regs'  : Person.view('world/by_registration_date', 
                                                 limit=100,
                                                 include_docs=True, 
                                                 descending=True).iterator(),
                    })
        # Show people nearest to the user.
        user_data = Person.view('world/by_user_id', key=request.user.id, include_docs=True).first()
        if not user_data:
            return HttpResponseRedirect('/profile/')
        return render(request, 'person/nearest.html', {
                'latitude': user_data.latitude,
                'longitude': user_data.longitude,
                'total_people': Person.view('world/by_user_id').count()
                })
    do_index.urlregex = r'^$'

    def do_getNearest(self, request, user):
        user_data = Person.view('world/by_user_id', key=user).first()
        nearest_people = []
        if user_data:
            nearest_people = get_nearest(latitude  = user_data.latitude, 
                                         longitude = user_data.longitude)
        return HttpResponse(json.dumps(nearest_people), mimetype='application/json')
    do_getNearest.urlregex = r'^getNearest/user/(?P<user>\w+)/$'
    do_getNearest = login_required_m(do_getNearest)

    def do_user(self, request, user):
        ctx_dict = {}
        user_data = Person.view('world/by_user_id', key=user, include_docs=True).first()
        if user_data:
            ctx_dict = {}
            data = PersonSortedDict
            for ii, jj in user_data.to_json().items():
                if ii not in EXCLUDE_LIST:
                    data.update({ii: jj})
            for (key, val) in data.items():
                if not val or isinstance(val, Field):
                    data.pop(key, None)
            ctx_dict.update({"user_data": data})
        return render(request, 'person/user_profile.html', ctx_dict)
    do_user.urlregex = r'^user/(?P<user>\w+)/$'
    do_user = login_required_m(do_user)

    def _do_clean_data(self, view_name, view_key, cols_list):
        data = Person.view(view_name, key=view_key, include_docs=True).all()
        cleaned_data = []
        for row_dict in data:
            short_dict = SortedDict(zip(cols_list, 
                                        map(lambda x: None, cols_list)))
            row_json = row_dict.to_json()
            for key in row_json:
                if key in cols_list:
                    short_dict.update({key: row_json[key]})
            if short_dict not in cleaned_data:
                cleaned_data.append(short_dict)
        return cleaned_data

    def do_batch(self, request, batch):
        cols_list = ['user_id', 'full_name', 'country', 'location_description',
                     'latitude', 'longitude',]
        args = ('world/by_batch', batch, cols_list)
        cleaned_batch_data = Paginator(self._do_clean_data(*args), self.num_per_page)
        page_num = request.GET.get('page', 1)
        ctx_dict = {'searchkey': 'Batch', 'searchval': batch, 'user_data': cleaned_batch_data.page(page_num)}
        return render(request, 'person/do_list.html', ctx_dict)
    do_batch.urlregex = r'^batch/(?P<batch>\d{4})/$'
    do_batch = login_required_m(do_batch)

    def do_country(self, request, country):
        cols_list = ['user_id', 'full_name', 'batch', 'location_description',
                     'latitude', 'longitude']
        args = ('world/by_country', country, cols_list)
        cleaned_country_data = Paginator(self._do_clean_data(*args), self.num_per_page)
        page_num = request.GET.get('page', 1)
        ctx_dict = {'searchkey': 'Country', 'searchval': country, 'user_data': cleaned_country_data.page(page_num) }
        return render(request, 'person/do_list.html', ctx_dict)
    do_country.urlregex = r'^country/(?P<country>\w+)/$'
    do_country = login_required_m(do_country)

    def do_search(self, request):
        return render(request, 'person/search.html', {})

    def do_register(self, request):
        return HttpResponseRedirect('/openid/register/')

    def do_login(self, request):
        return HttpResponseRedirect('/openid/')

    def do_logout(self, request):
        return HttpResponseRedirect('/openid/logout/')

    @login_required_m
    def do_profile(self, request):
        if request.method == "GET":
            user_data = Person.view('world/by_user_id', key=request.user.id, include_docs=True).first()
            if user_data:
                form = PersonForm(data=user_data.to_json())
                ctx_dict = {'form': form}
                if form.data.get('photo', None):
                    photo = urlparse.urljoin(settings.MEDIA_URL, "site_media/%s" %form.data['photo'])
                    ctx_dict.update({'photo': photo})
            else:
                ctx_dict = {'form': PersonForm(initial={"email": request.user.email})}
            return render(request, 'person/edit_profile.html', ctx_dict)
        user_data = request.POST.copy()
        # Stuff the user id and full name
        # The full name is stored now to prevent HTTP requests later
        user_data['user_id'] = request.user.id
        user_data['email'] = request.user.email
        user = User.view('%s/users_by_username' % User._meta.app_label, 
                         key=request.user.username, include_docs=True).first()
        user_data['full_name'] = user.get_full_name()
        vf = PersonForm(user_data, request.FILES)
        if vf.is_valid():
            # Let's handle the image first.
            if vf.cleaned_data.get('photo'):
                photo_name = request.FILES['photo'].name
                base_upload_path = os.path.basename(os.path.abspath(settings.PROFILE_PIC_UPLOAD_PATH))
                upload_path = os.path.join(settings.PROFILE_PIC_UPLOAD_PATH, request.user.id)
                if not os.path.exists(upload_path):
                    os.mkdir(upload_path)
                img_file = open(os.path.join(upload_path, photo_name),'w')
                img_file.write(request.FILES['photo'].read())
                relative_dir = os.path.join(base_upload_path, os.path.basename(upload_path))
                vf.cleaned_data.update({'photo': os.path.join(relative_dir, os.path.basename(img_file.name))})
                img_file.close()
            data = Person.view('world/by_user_id', key=request.user.id, include_docs=True).first()
            if not data:
                data = Person()
            for (field, val) in vf.cleaned_data.items():
                setattr(data, field, val)
            data.save()
            return render(request, 'person/edit_profile.html', {'form': PersonForm(vf.cleaned_data), 
                                                                'photo': vf.cleaned_data.get('photo'),
                                                                'message': ugettext("Successfully saved the data.")})
        return render(request, 'person/edit_profile.html', {'form': vf, 
                                                            'message': ugettext("Please correct the errors on the page")})
