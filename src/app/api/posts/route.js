import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    // Parse FormData instead of JSON
    const formData = await req.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const content = formData.get("content");
    const author = formData.get("author");
    const image = formData.get("image"); // File object

    let imageUrl = "";

    if (image && typeof image === "object") {
      // Convert file to buffer
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload image buffer to Cloudinary
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    // Save post to MongoDB
    const post = await Post.create({
      title,
      category,
      content,
      author,
      image: imageUrl,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// ✅ GET handler to fetch posts (optionally by category)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // e.g., "Tech"

    const query = category ? { category } : {};
    const posts = await Post.find(query).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// 🗑️ Delete a post by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If post has an image, delete it from Cloudinary (optional)
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0]; // extract from URL
      try {
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      } catch (cloudErr) {
        console.warn("Failed to delete Cloudinary image:", cloudErr.message);
      }
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}




