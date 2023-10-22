import { useState, useEffect } from "react";
import service from "./services/numbers";
import ContactForm from "./components/form";
import Contacts from "./components/contacts";
import Notification from "./components/notification";

const Filter = ({ handleFilter }) => (
  <div>
    filter shown with <input onChange={handleFilter} />
  </div>
);

const App = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    service.getAll().then((contacts) => setContacts(contacts));
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [newNotification, setNewNotification] = useState(null);

  const handleName = (event) => setNewName(event.target.value);
  const handleNumber = (event) => setNewNumber(event.target.value);
  const handleFilter = (event) => setNewFilter(event.target.value);

  const addContact = (event) => {
    event.preventDefault();

    const newContact = { name: newName, number: newNumber };
    console.log(contacts.find((contact) => contact.name === newName));

    const duplicateContact = contacts.find((contact) => contact.name === newName);

    if (duplicateContact) {
      if (
        confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`,
        )
      ) {
        service
          .update(newContact, duplicateContact.id)
          .then((response) => {
            setContacts(
              contacts.map((contact) =>
                contact.id === duplicateContact.id ? response : contact,
              ),
            );

            setNewNotification({
              message: `${newName} successfully updated`,
              color: "green",
            });

            setTimeout(() => setNewNotification(null), 5000);
          })
          .catch((err) => {
            setNewNotification({
              message: err.response.data.error,
              color: "red",
            });

            setTimeout(() => setNewNotification(null), 5000);
          });
      }
    } else {
      service
        .create(newContact)
        .then((contact) => {
          setContacts([...contacts, contact])

          setNewNotification({
            message: `${newName} successfully added`,
            color: "green",
          });

          setTimeout(() => setNewNotification(null), 5000);
        })
        .catch(e => {
          setNewNotification({
            message: e.response.data.error,
            color: "red",
          });

          setTimeout(() => setNewNotification(null), 5000);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  const removeContact = (id) => {
    // note: 'dangerous' since find returns undefined instead of false on failure
    const oldContact = contacts.find((contact) => contact.id === id);

    if (oldContact) {
      if (confirm(`Delete ${oldContact.name}?`)) {
        service
          .remove(id)
          .then(() =>
            setContacts(contacts.filter((contact) => contact.id !== oldContact.id)),
          );
      }
    } else {
      setNewNotification({
        message: `contact with ID ${id} is already deleted`,
        color: "red",
      });

      setTimeout(() => setNewNotification(null), 5000);
    }
  };

  const filtered = newFilter
    ? contacts.filter((contact) =>
        contact.name.toLowerCase().startsWith(newFilter.toLowerCase()),
      )
    : contacts;

  return (
    <div>
      <Notification notification={newNotification} />
      <br />

      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />

      <h2>Add new contact</h2>
      <ContactForm
        name={newName}
        number={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
        addContact={addContact}
      />

      <h2>Contacts</h2>
      <Contacts contacts={filtered} handleRemove={removeContact} />
    </div>
  );
};

export default App;
