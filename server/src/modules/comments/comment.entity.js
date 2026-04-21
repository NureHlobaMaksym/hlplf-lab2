const { EntitySchema } = require('typeorm');

const CommentEntity = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    content: {
      type: String
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    }
  },
  relations: {
    post: {
      target: 'Post',
      type: 'many-to-one',
      joinColumn: { name: 'postId' },
      nullable: false,
      onDelete: 'CASCADE'
    },
    author: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'authorId' },
      nullable: false,
      onDelete: 'CASCADE'
    }
  }
});

module.exports = { CommentEntity };
