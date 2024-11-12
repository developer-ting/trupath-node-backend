import mongoose from "mongoose";

export const BlogsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: { type: String, required: true, ref: "Media" },
});

export default mongoose.model.Blogs || mongoose.model("Blog", BlogsSchema);
