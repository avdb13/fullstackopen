const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs.map((blog) => blog.likes).reduce((acc, next) => (acc += next));

const favoriteBlogs = (blogs) => Math.max(...blogs.map((blog) => blog.likes));

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
};
