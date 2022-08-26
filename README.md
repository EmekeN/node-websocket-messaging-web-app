# Node Server and React Messaging App

Realtime messaging between web clients using websockets and node to broadcast updates

Here is the data schema for a Comment:

- id: INTEGER
- name: TEXT
- created: DATETIME
- message: TEXT

Here are the API endpoints:

- Create a comment: /createComment (POST)
- Retrieve all comments: /getComments (GET)
- Retrieve a comment: /getComment (GET)
- Delete all comments: /deleteComments (DELETE)
  - This is useful for purging data

## Usage

### Run in Development

```
$ npm install
$ npm run dev
```

You can visit [http://localhost:3001] on multiple
