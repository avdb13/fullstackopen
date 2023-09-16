const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs.map((blog) => blog.likes).reduce((acc, next) => (acc += next));

const favoriteBlogs = (blogs) => Math.max(...blogs.map((blog) => blog.likes));

const mostBlogs = (blogs) => {
  const authors = [...new Set(blogs.map((blog) => blog.author))];

  const totalBlogs = authors.map((author) => [
    author,
    blogs.filter((blog) => blog.author == author).length,
  ]);

  const max = Math.max(...totalBlogs.map(([author, blogs]) => blogs));
  const author = totalBlogs.find(([author, blogs]) => blogs === max)[0];

  return { author, blogs: max };
};

const mostLikes = (blogs) => {
  const authors = [...new Set(blogs.map((blog) => blog.author))];

  const totalLikes = authors.map((author) => [
    author,
    blogs
      .filter((blog) => blog.author == author)
      .reduce((acc, next) => (acc += next.likes), 0),
  ]);

  const max = Math.max(...totalLikes.map(([author, likes]) => likes));
  const author = totalLikes.find(([author, likes]) => likes === max)[0];

  return { author, likes: max };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes,
};
