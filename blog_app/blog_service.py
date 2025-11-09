
from fastapi import APIRouter
from models import Blog
from beanie import PydanticObjectId
from fastapi import HTTPException
from typing import List


async def get_all_blogs():
    return await Blog.find_all().to_list()

async def get_blog_by_id(blog_id: PydanticObjectId):
    blog = await Blog.get(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog fetched successfully", "data": blog}

async def create_blog(blogs: List[dict]):
    blog_data = [Blog(**b) for b in blogs]
    saved_blogs = await Blog.insert_many(blog_data)
    return {
        "message": f"{len(saved_blogs.inserted_ids)} blog(s) created successfully"
    }

async def update_blog(blog: dict):
    try:
        blog_id = blog.get("_id")
        if not blog_id:
            raise HTTPException(status_code=400, detail="Missing _id in request body")

        existing_blog = await Blog.get(PydanticObjectId(blog_id))
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog not found")

        if "_id" in blog:
            blog.pop("_id")
        await existing_blog.set(blog)

        return {
            "message": "Blog updated successfully",
            "data": existing_blog
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def delete_blog(blog_id: PydanticObjectId):
    blog = await Blog.get(blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    await blog.delete()

    return {"message": "Blog deleted successfully", "id": str(blog_id)}

async def find_blog_by_name(name:str):
    blog_data = await Blog.find_one(Blog.topic == name)
    if not blog_data:
        raise HTTPException(status_code=404 , detail = "Blog not found")
    return {"message" : "Blog fethced successfully" , "data" :blog_data }

async def update_like(blog_id: PydanticObjectId , liked: bool):
    blog = await Blog.get( blog_id)
    if not blog:
        return {"error" : "Blog not found"}
    
    blog.likes = max((blog.likes or 0) + (1 if liked else -1), 0)
    await blog.save()
    return {"message": "Like updated", "likes": blog.likes}