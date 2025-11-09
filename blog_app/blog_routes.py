from fastapi import APIRouter
from blog_service import get_all_blogs as fetch_all_blogs

from blog_service import create_blog as add_blog , update_blog as modify_blog , delete_blog as remove_blog , find_blog_by_name ,  update_like
from typing import Union, List
from logger import logger

router = APIRouter(prefix="/blogs", tags=["Blogs"])


@router.get("/get_all_blogs")
async def get_all_blogs_route():
    logger.info("Fetching all blogs")
    return await fetch_all_blogs()

@router.post("/create")
async def create_blog(blogs: List[dict]):
    logger.info(f"Creating {len(blogs)} new blog(s)")
    return await add_blog(blogs)

@router.put("/update")
async def update_blog(blog:dict):
    logger.info(f"Updating blog: {blog.get('title', 'Unknown')}")
    return await modify_blog(blog)

@router.delete("/delete/{blog_id}")
async def delete_blog(blog_id : str):
    logger.warning(f"Deleting blog ID: {blog_id}")
    return await remove_blog(blog_id)

@router.get("/by_name")
async def get_by_name(topic:str):
    logger.info(f"Fetching blog by topic: {topic}")
    return await find_blog_by_name(topic)

@router.post("/{blog_id}/like")
async def like_blog(blog_id: str, data: dict):
    liked = data.get("liked")
    logger.info(f"Updating like status for blog {blog_id}: {liked}")
    return await update_like(blog_id, liked)
