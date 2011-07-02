import urlparse, os
from django import template
from django.conf import settings

register = template.Library()

@register.tag
def get_service_img(parser, token):
    args = token.split_contents()
    if len(args) != 2:
        raise template.TemplateSyntaxError("%s tag tags exactly 2 arguments." % args[0])
    return ServiceImageNode(args)

class ServiceImageNode(template.Node):
    def __init__(self, args):
        self.context_var = args[1]

    def render(self, context):
        service_name = context.get(self.context_var, '')
        base_path = "images/profile_services"
        images_path = os.path.join(settings.MEDIA_ROOT, base_path)
        avail_services = os.listdir(images_path)
        if "%s.png" %service_name in avail_services:
            img_path = urlparse.urljoin(settings.MEDIA_URL, "%s/%s.png" %(base_path, service_name))
            return "<img class=\"serviceProv\" src=\"%s\" />" %(img_path)
        return ""

@register.filter
def labelize(value):
    return " ".join(value.split("_"))
