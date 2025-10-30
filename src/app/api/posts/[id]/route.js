import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import cloudinary from "@/lib/cloudinary";

// 🗑️ DELETE Post
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = context.params;

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete Cloudinary image if it exists
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      } catch (err) {
        console.warn("Cloudinary image delete failed:", err.message);
      }
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

// ✏️ UPDATE Post
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const formData = await req.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const content = formData.get("content");
    const imageFile = formData.get("image");

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let imageUrl = post.image; // keep old image if no new one

    // ✅ Handle new image upload
    if (imageFile && typeof imageFile === "object") {
      // Delete old image first
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`posts/${publicId}`);
        } catch (err) {
          console.warn("Old image delete failed:", err.message);
        }
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "posts" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    // ✅ Update post in MongoDB
    post.title = title;
    post.category = category;
    post.content = content;
    post.image = imageUrl;

    await post.save();

    return NextResponse.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}



// ✅ Get a single post by ID
export async function GET(req, context) {
  const params = await context.params; // 👈 Await the params
  await connectDB();

  try {
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}