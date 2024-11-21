import mongoose from "mongoose";

export const BlogsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: { type: String, ref: "Media" },
  content: {
    type: String,
  },
  slug: {
    type: String,
  },
  date: {
    type: String,
  },
  readTime: {
    type: String,
  },
});

export default mongoose.model.Blogs || mongoose.model("Blog", BlogsSchema);
