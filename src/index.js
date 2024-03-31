const mongoose = require("mongoose");

//* Connect to MongoDB database

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.error("database not connected", err);
  });

//* Create Schema

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  category: {
    type: String,
    required: true,
    enum: ["Programming", "Design", "Data Structure"],
  },
  isPublished: Boolean,
  rating: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
  tags: {
    type: [String],
    validate: {
      validator: function (tags) {
        return tags.length > 1;
      },
    },
  },
});

//* Create Model

const Course = mongoose.model("Course", courseSchema);

const createCourse = async () => {
  const course = new Course({
    name: "Javascript beginner",
    creator: "Random",
    isPublished: true,
    rating: 4.2,
    category: "Programming",
    tags: ["web"],
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (error) {
    console.error(error);
    for (const key in error.errors) {
      console.log(error.errors[key]);
    }
  }
};

const findCourses = async () => {
  const courses = await Course.find({ rating: { $gte: 2 } })
    .select({
      name: 1,
      rating: 1,
    })
    .and([{ rating: 4 }, { creator: "Choudhary" }]);
  console.log(courses);
};

const updateCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course) return;

  course.name = "C++ for beginners";
  course.creator = "Random";

  const result = await course.save();
  console.log(result);
};

const deleteCourse = async (id) => {
  const result = await Course.findByIdAndDelete(id);
  console.log(result);
};

createCourse();
// findCourses();
// updateCourse("65f883976c5574caf73b2cac")
// deleteCourse("65f883976c5574caf73b2cac")
