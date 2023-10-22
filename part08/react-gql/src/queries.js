import { gql } from '@apollo/client'

export const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    name
    id
    phone
    address {
      street
      city
    }
  }
`

export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`
export const FIND_PERSON = gql`
  query findPersonByName($name: String!) {
    findPerson(name: $name) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`

export const ADD_PERSON = gql`
  mutation addPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    addPerson(
      name: $name
      street: $street
      city: $city
      phone: $phone
    ) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`

export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(
      name: $name
      phone: $phone
    ) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`

export const LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
