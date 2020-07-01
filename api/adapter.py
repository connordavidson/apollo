from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.template.loader import render_to_string
from django.template import TemplateDoesNotExist
from django.core.mail import EmailMessage, EmailMultiAlternatives
from allauth.account import app_settings
from django.utils.encoding import force_str
from .models import UserEmailPreferences

#####THIS FILE IS MADE FROM THIS ANSWER -> https://stackoverflow.com/a/34249336/12921499
class DefaultAccountAdapterCustom(DefaultAccountAdapter):
    #https://github.com/pennersr/django-allauth/blob/ee630612f13f4930b7caf64bfc46d6712885621b/allauth/account/adapter.py#L83
    def format_email_subject(self, subject):
        # prefix = app_settings.EMAIL_SUBJECT_PREFIX
        # if prefix is None:
        #     site = get_current_site(self.request)
        prefix = ""#[{name}] ".format(name=site.name)
        # print(subject)
        return prefix + force_str(subject)


    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = settings.URL_FRONT + \
            'verify-email/' + context['key']
        # print(template_prefix)
        msg = self.render_mail("email_confirmation", email, context)
        # print(msg)
        # print(email)
        # print(context)
        msg.send()

    def render_mail(self, template_prefix, email, context):
            """
            Renders an e-mail to `email`.  `template_prefix` identifies the
            e-mail that is to be sent, e.g. "account/email/email_confirmation"
            """
            subject = render_to_string('{0}_subject.txt'.format(template_prefix),
                                       context)
            # remove superfluous line breaks
            subject = " ".join(subject.splitlines()).strip()
            subject = self.format_email_subject(subject)

            from_email = self.get_from_email()

            bodies = {}
            for ext in ['html', 'txt']:
                try:
                    template_name = '{0}_message.{1}'.format(template_prefix, ext)
                    bodies[ext] = render_to_string(template_name,
                                                   context).strip()
                except TemplateDoesNotExist:
                    if ext == 'txt' and not bodies:
                        # We need at least one body
                        raise
            if 'txt' in bodies:
                msg = EmailMultiAlternatives(subject,
                                             bodies['txt'],
                                             from_email,
                                             [email])
                if 'html' in bodies:
                    msg.attach_alternative(bodies['html'], 'text/html')
            else:
                msg = EmailMessage(subject,
                                   bodies['html'],
                                   from_email,
                                   [email])
                msg.content_subtype = 'html'  # Main content is now text/html
            return msg


    # #Got from -> https://github.com/pennersr/django-allauth/blob/master/allauth/account/adapter.py#L217
    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        from allauth.account.utils import user_username, user_email, user_field

        data = form.cleaned_data
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        username = data.get('username')
        user_email(user, email)
        user_username(user, username)
        if first_name:
            user_field(user, 'first_name', first_name)
        if last_name:
            user_field(user, 'last_name', last_name)
        if 'password1' in data:
            user.set_password(data["password1"])
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding

            user.save()

        # #This is what creates the UserEmailPreferences object with the newly created user
        UserEmailPreferences.objects.create(user=user )

        return user
