const { EntitySchema } = require('typeorm');
const { FRIEND_REQUEST_STATUS } = require('../../constants/social');

const FriendshipEntity = new EntitySchema({
  name: 'Friendship',
  tableName: 'friendships',
  uniques: [
    {
      columns: ['user', 'friend']
    }
  ],
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true
    },
    status: {
      type: String,
      length: 20,
      default: FRIEND_REQUEST_STATUS.PENDING
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    respondedAt: {
      type: 'timestamp',
      nullable: true
    }
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'userId' },
      nullable: false,
      onDelete: 'CASCADE'
    },
    friend: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'friendId' },
      nullable: false,
      onDelete: 'CASCADE'
    }
  }
});

module.exports = { FriendshipEntity };
