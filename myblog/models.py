from django.db import models
from django.contrib.auth.models import User

reaction_choices = (("like", "like"),("heart", "heart"),("sad", "sad"), ("haha", "haha"), ("angry", "angry"))


class Reaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(to="BlogPost", on_delete=models.CASCADE)
    reaction_type = models.CharField(choices=reaction_choices, max_length=10)


    class Meta:
        unique_together = ("user", "post")
    

    def __str__(self):
        return self.reaction_type




class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    uploaded = models.DateField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    reactions = models.ManyToManyField(to=Reaction, related_name="reactions", blank=True)
   

    def total_reactions(self):
        return self.reactions.count()
    

    def __str__(self):
        return self.title



