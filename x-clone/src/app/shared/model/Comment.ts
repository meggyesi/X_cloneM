export interface IComment {
  _id?: string;
  userId?: string;
  username?: string;
  text: string;
  createdAt?: Date;
  likeCount?: string
  commentCount?: string
}


export class Comment implements IComment {
  _id?: string;
  userId?: string;
  username?: string;
  text: string;
  createdAt?: Date;
  likeCount?: string;
  commentCount?: string;

  constructor(
    text: string,
    userId?: string,
    username?: string,
    _id?: string,
    createdAt?: Date,
    likeCount?: string,
    commentCount?: string
  ) {
    this.text = text;
    this.userId = userId;
    this.username = username;
    this._id = _id;
    this.createdAt = createdAt;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
  }
}
