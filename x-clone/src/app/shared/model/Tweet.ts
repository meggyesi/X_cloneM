export interface ITweet {
    _id?: string;
    userId?: string;
    username?: string;
    text: string;
    createdAt?: Date;
    likeCount?: string;
    commentCount?: string;
    parentId?: string;
    isComment?: boolean;
}

export class Tweet implements ITweet {
    _id?: string;
    userId?: string;
    username?: string;
    text: string;
    createdAt?: Date;
    parentId?: string;
    isComment?: boolean;
    likeCount?: string;
    commentCount?: string;

    constructor(
        text: string,
        isComment?: boolean,
        parentId?: string,
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
        this.parentId = parentId;
        this.isComment = isComment;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
}