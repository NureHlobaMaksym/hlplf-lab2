const { EntitySchema } = require('typeorm');

const MessageEntity = new EntitySchema({
  name: 'Message',
  tableName: 'messages',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    content: {
      type: String
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    }
  },
  relations: {
    sender: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'senderId' },
      nullable: false,
      onDelete: 'CASCADE'
    },
    receiver: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'receiverId' },
      nullable: false,
      onDelete: 'CASCADE'
    }
  }
});

module.exports = { MessageEntity };
