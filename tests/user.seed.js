const userSeed = [
  {
    "username": "kolafas15",
    "password": "password1",
    "email": "user1@example.com",
    "role": "admin",
    "firstName": "Alastair",
    "lastName": "McDonald"
  },
  {
    "username": "kolafas2",
    "password": "password2",
    "email": "user2@example.com",
    "role": "regular",
    "firstName": "Pablo",
    "lastName": "Escobar"
  },
  {
    // without role
    "username": "tbundy",
    "password": "password3",
    "email": "user3@example.com",
    "firstName": "Ted",
    "lastName": "Bundy"
  },
  {
    // without first and last name
    "username": "tbundy",
    "password": "password3",
    "email": "user3@example.com",
  },
  {
    // login data
    "username": "kolafas15",
    "password": "password1",
  },
  {
    // wrong password
    "username": "kolafas15",
    "password": "password5",
  },
  {
    //wrong username
    "username": "skdfjdl",
    "password": "password",
  },
  {
    "username": "pescobar",
    "password": "password2",
    "email": "user2@example.com",
    "role": "regular",
    "firstName": "Pablo",
    "lastName": "Escobar"
  },
];

export default userSeed;