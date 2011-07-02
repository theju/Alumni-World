from django import forms
from datetime import date
from django.utils.datastructures import SortedDict

BATCH_CHOICES = [(ii, ii) for ii in xrange(1979, date.today().year)]
CLASS_CHOICES = [(ii, ii) for ii in xrange(1, 13)]
EXCLUDE_LIST = ['id', '_id', '_rev', 'csrfmiddlewaretoken', 'doc_type', 
                'registered_on', 'last_edited']

class PersonForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super(PersonForm, self).__init__(*args, **kwargs)
        for (name, value) in self.data.items():
            if not name in EXCLUDE_LIST and not name in self.base_fields:
                self.fields[name.decode('utf8')] = forms.CharField()

    user_id   = forms.CharField(widget=forms.HiddenInput, required=False)
    full_name = forms.CharField(widget=forms.HiddenInput, required=False)

    batch  = forms.CharField(widget=forms.Select(choices=BATCH_CHOICES), help_text="Year passed out / Year expected to pass")
    Class  = forms.CharField(widget=forms.Select(choices=CLASS_CHOICES), help_text="Class passed out")

    bio       = forms.CharField(widget=forms.Textarea, required=False, help_text="To help jog our memories about you!")
    photo     = forms.ImageField(required=False, help_text="How much have you changed since school? ;-)")

    # Location stuff - all location fields are required
    country   = forms.CharField(widget=forms.HiddenInput,  required=False)
    latitude  = forms.FloatField(widget=forms.HiddenInput, required=False)
    longitude = forms.FloatField(widget=forms.HiddenInput, required=False)
    location_description = forms.CharField(widget=forms.HiddenInput, required=False)

    # Contact details
    communication_address = forms.CharField(widget=forms.Textarea, required=False)
    email    = forms.EmailField()
    phone = forms.CharField(max_length=10, required=False)
    blog_url = forms.URLField(label="Blog URL", required=False)

    # Education details
    qualification = forms.CharField(max_length=50)
    institution = forms.CharField(max_length=50, required=False)

    # Job details
    occupation = forms.CharField(max_length=50)
    company = forms.CharField(max_length=50, required=False)

    # Instant messaging
    gtalk = forms.CharField(label="GTalk", required=False)
    yahoo = forms.CharField(label="Y! Messenger", required=False)

    # Other profiles
    linkedin = forms.URLField(label="LinkedIn", required=False)
    facebook = forms.URLField(required=False)
    twitter = forms.URLField(required=False)

    def clean(self):
        for (name, value) in self.cleaned_data.items():
            if not value:
                self.cleaned_data.pop(name)
        return self.cleaned_data

PersonSortedDict = SortedDict(PersonForm().fields.items())
