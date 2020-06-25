from django import template
from ..models import BlogPost

register = template.Library()

@register.simple_tag
def check_if_user_reacted(post_id, user):
    post = BlogPost.objects.get(id=post_id)
    reacted = post.reactions.filter(user=user)

    if reacted:
        return "liked like-btn"
    else:
        return "like-btn"