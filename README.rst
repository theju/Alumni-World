OVERVIEW
---------

This is the source code of the website powering the alumni association of
my school. I have removed all branding references and kept it as generic as 
possible. This site is inspired from `Django People`_

The site is powered by:
* Python_
* Django_
* CouchDB_

The dependencies of the site are listed in the ``requirements.txt``

INSTALLING
-----------

* Create a virtualenv_ and activate it::

    $ virtualenv alumni_env
    $ cd alumni_env
    $ source bin/activate

* Fetch the source code of this project from github::

    $ mkdir src
    $ cd src
    $ git clone https://github.com/theju/Alumni-World.git
    $ cd Alumni-World

* Install the dependencies::

    $ pip install -r requirements.txt

* Create a file ``local_settings.py`` and add the following attributes::

    SECRET_KEY = '<some_lengthy_value>'

    EMAIL_HOST = "example.com"
    EMAIL_HOST_USER = "testuser"
    EMAIL_HOST_PASSWORD = "password"

    COUCHDB_HOST = "localhost:5984"
    COUCHDB_USERNAME = "couchdb_user"
    COUCHDB_PASSWORD = "couchdb_password"
    COUCHDB_DB_PREFIX = ""

    COUCHDB_URL = "http://%s:%s@%s" % (COUCHDB_USERNAME, COUCHDB_PASSWORD, COUCHDB_HOST)
    COUCHDB_DATABASES = (
        ("django_couchdb_utils_auth",     "%s/%sauth"     % (COUCHDB_URL, COUCHDB_DB_PREFIX)),
	("django_couchdb_utils_sessions", "%s/%ssessions" % (COUCHDB_URL, COUCHDB_DB_PREFIX)),
	("django_couchdb_utils_cache",    "%s/%scache"    % (COUCHDB_URL, COUCHDB_DB_PREFIX)),
	("django_couchdb_utils_openid_consumer",    "%s/%sopenid"    % (COUCHDB_URL, COUCHDB_DB_PREFIX)),
	("world", "%s/%sperson" % (COUCHDB_URL, COUCHDB_DB_PREFIX)),
    )

* Create the couchdb documents and views::

    $ python manage.py sync_couchdb

* Run the in-built development server::

    $ python manage.py runserver


.. _`Django People`: http://djangopeople.net/
.. _Python: http://www.python.org/
.. _Django: http://www.djangoproject.com/
.. _CouchDB: http://couchdb.apache.org/
.. _virtualenv: http://pypi.python.org/pypi/virtualenv
