const { EntitySchema } = require('typeorm');
const { POST_VISIBILITY } = require('../../constants/social');

const PostEntity = new EntitySchema({
  name: 'Post',
  tableName: 'posts',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    title: {
      type: String,
      length: 160
    },
    content: {
      type: String
    },
    visibility: {
      type: String,
      length: 20,
      default: POST_VISIBILITY.PUBLIC
    },
    tags: {
      type: 'simple-array',
      nullable: true
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
    author: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'authorId' },
      nullable: false,
      onDelete: 'CASCADE'
    },
    comments: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'post'
    }
  }
});

module.exports = { PostEntity };
