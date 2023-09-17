const Blog = ({ blog }) => (
  <li key={blog.id}>
    <a href={blog.url}>{blog.title}</a> by {blog.author}
  </li>
)

export default Blog
