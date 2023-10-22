const Contacts = ({ contacts, handleRemove }) => {
  return (
    <ul>
      {contacts.map(contact => <Contact contact={contact} handleRemove={handleRemove} key={contact.id} />)}
    </ul>
  )
}

const Contact = ({ contact, handleRemove }) => (
  <li>
    {contact.name} {contact.number}
    <button onClick={() => handleRemove(contact.id)}>remove</button>
  </li>
)

export default Contacts
