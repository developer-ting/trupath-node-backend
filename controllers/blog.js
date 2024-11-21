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

// ===================== GET all Blogs ===================
// GET localhost:8080/api/blogs

export async function getBlogs(req, res) {
  try {
    if (!process.env.TOKEN)
      return res.status(500).send({ error: "Please provide correct token" });

    const blog = await Blog.find().populate("thumbnail");
    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to retrieve audition" });
  }
}

// ===================== GET One Blog ===================
// GET localhost:8080/api/blog/title

export async function getBlog(req, res) {
  try {
    const { title } = req.params;
    const blog = await Blog.findOne({ title }).populate("thumbnail");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to retrieve blog" });
  }
}

// ===================== GET ID Blog ===================
// GET localhost:8080/api/blog/title

export async function getBlogById(req, res) {
  try {
    const { _id } = req.params;
    const blog = await Blog.findOne({ _id }).populate("thumbnail");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to retrieve blog" });
  }
}

// export async function getBlog(req, res) {
//   try {
//     const { title } = req.params;

//     const talent = await TalentModel.findOne({ name }).populate(
//       "introVideo thumbnail"
//     );

//     if (!talent) {
//       return res.status(404).json({ error: "Talent not found!" });
//     }

//     return res.status(200).json({ talent });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Failed to retrieve talents" });
//   }
// }

// ===================== PUT ===================
// PUT: http://localhost:8080/api/blogs/title

export async function updateOneBlog(req, res) {
  try {
    const { title } = req.params;
    const data = req.body;

    let media = {};

    const blog = await Blog.findOne({ title }).populate("thumbnail");

    if (!blog) {
      return res
        .status(404)
        .json({ error: "Talent not found!, Please provide correct Name" });
    }

    if (req.files) {
      if (req.files.thumbnail) {
        await deleteMedia(blog.thumbnail);
        const result = await storeMediaToDB(
          req.files.thumbnail,
          "Image",
          title
        );
        media.thumbnail = result._id;
      }
    }

    await Blog.updateOne({ title }, { ...data, ...media });

    return res.status(200).json({ msg: `Record updated for ${title}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}

// ===================== PUT One by Id ===================
// PUT: http://localhost:8080/api/blogs/title

export async function updateOneBlogById(req, res) {
  try {
    const { _id } = req.params;
    const data = req.body;

    let media = {};

    const blog = await Blog.findOne({ _id }).populate("thumbnail");

    if (!blog) {
      return res
        .status(404)
        .json({ error: "Talent not found!, Please provide correct Name" });
    }

    if (req.files) {
      if (req.files.thumbnail) {
        await deleteMedia(blog.thumbnail);
        const result = await storeMediaToDB(req.files.thumbnail, "Image", _id);
        media.thumbnail = result._id;
      }
    }

    await Blog.updateOne({ _id }, { ...data, ...media });

    return res.status(200).json({ msg: `Record updated for ${_id}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}

// ===================== DELETE ===================

/** DELETE: http://localhost:8080/api/talents/asd1d
 * @param : {}
 */
export async function deleteBlog(req, res) {
  try {
    const { title } = req.params;

    const blog = await Blog.findOne({ title }).populate("thumbnail");

    if (!blog) {
      return res.status(404).json({ error: "Talent not found!" });
    }

    await Blog.findOne({ title }).deleteOne();

    if (blog.thumbnail) {
      await deleteMultipleMedia([blog.thumbnail]);
    }

    return res.status(200).json({ msg: `Entry for ${title} is removed` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong!", error });
  }
}
