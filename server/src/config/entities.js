const { UserEntity } = require('../modules/users/user.entity');
const { PostEntity } = require('../modules/posts/post.entity');
const { CommentEntity } = require('../modules/comments/comment.entity');
const { FriendshipEntity } = require('../modules/friendships/friendship.entity');
const { MessageEntity } = require('../modules/messages/message.entity');

const entities = [UserEntity, PostEntity, CommentEntity, FriendshipEntity, MessageEntity];

module.exports = { entities };
