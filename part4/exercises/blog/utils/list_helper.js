const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs.map((blog) => blog.likes).reduce((acc, next) => (acc += next));

module.exports = { dummy, totalLikes };
