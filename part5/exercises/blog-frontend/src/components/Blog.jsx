const Blog = ({ blog }) => (
  <li key={blog.id}>
    {blog.title} {blog.author}
  </li>  
)

export default Blog
