const ContactForm = ({ name, number, handleName, handleNumber, addContact }) =>{
    return (
      <form onSubmit={addContact}>
        <div>
          name: <input value={name} onChange={handleName} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default ContactForm
