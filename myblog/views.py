from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import BlogPost, Reaction
import json

def index(request):
    posts = BlogPost.objects.all()
    context = {
        "posts":posts
    }
    return render(request, template_name="myblog/index.html", context=context)



def react(request):
    # get user from request
    user = request.user
    # checking if it is an ajax request that was made
    if request.is_ajax:
        try:
            post_id = json.loads(request.body)['post_id']
            reaction_type = json.loads(request.body)['reaction_type']
        except KeyError:
            return JsonResponse({"error":"no post id provided in request"})
        

     
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            print("post not found")
            return JsonResponse({f'error':"no post with id {post_id}"})
        
        # has user reacted already
        try:
            reacted = post.reactions.get(user=user)
        except Reaction.DoesNotExist:
            reacted = None
        
        if reacted:
            # if user has already liked delete the reaction
            if reacted.reaction_type == reaction_type:
                reacted.delete()
                return JsonResponse({"status":"success", "action":"decrease", "post_id":post.id})
            else:
                reacted.reaction_type = reaction_type
                reacted.save()
                return JsonResponse({"status":"success", "action":"none", "post_id":post.id})
              
            
        else:
            post.reactions.create(post=post, user=user, reaction_type=reaction_type)
            return JsonResponse({"status":"success" ,"action":"increase","post_id":post.id})
            
        
        return JsonResponse({"status":"success"})
    else:
        return redirect(to="home")
