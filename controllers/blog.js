// Models
import Blog from "../model/blog.model.js";

// Plugins

// Utils
import {
  defaultConfig,
  deleteMedia,
  deleteMultipleMedia,
  storeMediaToDB,
} from "../utils/index.js";

// AUDITION
// ===================== POST ===================
// POST GET localhost:8080/api/blog

// export async function createBlog(req, res) {

//   try {
//     const response = req.body;
//     await Blog.create(response);
//     return res.status(200).json({ response });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Message not delivered" });
//   }
// }

export async function createBlog(req, res) {
  const data = req.body;

  const { title } = req.body;

  let media = {};

  try {
    const existingBlog = await Blog.findOne({ title });

    if (existingBlog) {
      return res.status(409).json({ error: "Blog already exists" });
    }

    if (req.files) {
      if (req.files.thumbnail) {
        await Promise.all([
          storeMediaToDB(req.files.thumbnail, "Image", title),
        ]).then((values) => {
          media.thumbnail = values[0]._id;
        });
      } else if (req.files.thumbnail) {
        const result = await storeMediaToDB(
          req.files.thumbnail,
          "Image",
          title
        );
        media.thumbnail = result._id;
      }
    }

    await Blog.create({ ...data, ...media });

    return res.status(200).json({ ...data, ...media });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}

// ===================== GET ===================
// GET localhost:8080/api/blog

export async function getBlog(req, res) {
  try {
    const blog = await Blog.find().populate("thumbnail");
    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to retrieve audition" });
  }
}

// ===================== PUT ===================
export async function updateBlog(req, res) {
  try {
    const { title } = req.params;
    const data = req.body;
    const blogs = await Blog.findOne({ title });
    if (!blogs) {
      return res.status(404).json({
        error: "genres not found!, Please provide correct characterName",
      });
    }

    await Blog.updateOne({ title }, data);

    return res.status(200).json({ msg: `Record updated for ${title}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}

// ===================== DELETE ===================

export async function deleteBlog(req, res) {
  try {
    const { title } = req.params;

    const blog = await Blog.findOne({ title });

    if (!blog) {
      return res.status(404).json({ error: "audition not found!" });
    }

    await Blog.findOne({ title }).deleteOne();

    return res.status(200).json({ msg: `Entry for ${title} is removed` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}
