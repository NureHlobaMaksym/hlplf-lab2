const { EntitySchema } = require('typeorm');
const { ALLOW_MESSAGES_FROM } = require('../../constants/social');

const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    firstName: {
      type: String,
      length: 80
    },
    lastName: {
      type: String,
      length: 80
    },
    email: {
      type: String,
      length: 180,
      unique: true
    },
    passwordHash: {
      type: String,
      length: 255
    },
    allowMessagesFrom: {
      type: String,
      length: 20,
      default: ALLOW_MESSAGES_FROM.FRIENDS
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    posts: {
      target: 'Post',
      type: 'one-to-many',
      inverseSide: 'author'
    },
    comments: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'author'
    }
  }
});

module.exports = { UserEntity };
