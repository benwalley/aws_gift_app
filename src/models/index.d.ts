import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MoneyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentsMetaData = {
  readOnlyFields: 'updatedAt';
}

type WishlistItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WishlistMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Users {
  readonly id: string;
  readonly displayName?: string;
  readonly isAdmin: boolean;
  readonly groupId?: string;
  readonly userUsername?: string;
  readonly isSubUser?: boolean;
  readonly parentUserId?: string;
  readonly emailAddress: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}

export declare class Groups {
  readonly id: string;
  readonly memberIds?: (string | null)[];
  readonly adminUserId: string;
  readonly groupName?: string;
  readonly invitedIds?: (string | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Groups, GroupsMetaData>);
  static copyOf(source: Groups, mutator: (draft: MutableModel<Groups, GroupsMetaData>) => MutableModel<Groups, GroupsMetaData> | void): Groups;
}

export declare class Money {
  readonly id: string;
  readonly amount?: number;
  readonly paid?: boolean;
  readonly comment?: string;
  readonly creatorId: string;
  readonly moneyFromId?: string;
  readonly moneyToId?: string;
  readonly moneyFromName?: string;
  readonly moneyToName?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Money, MoneyMetaData>);
  static copyOf(source: Money, mutator: (draft: MutableModel<Money, MoneyMetaData>) => MutableModel<Money, MoneyMetaData> | void): Money;
}

export declare class Comments {
  readonly id: string;
  readonly content: string;
  readonly visibleToOwner: boolean;
  readonly authorId: string;
  readonly parentCommentId?: string;
  readonly wishlistItemId?: string;
  readonly wishlistId?: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Comments, CommentsMetaData>);
  static copyOf(source: Comments, mutator: (draft: MutableModel<Comments, CommentsMetaData>) => MutableModel<Comments, CommentsMetaData> | void): Comments;
}

export declare class WishlistItems {
  readonly id: string;
  readonly imageUrls?: (string | null)[];
  readonly images?: (string | null)[];
  readonly name: string;
  readonly link?: string;
  readonly note?: string;
  readonly gottenBy?: (string | null)[];
  readonly wantsToGet?: (string | null)[];
  readonly price?: number;
  readonly wishlistId: string;
  readonly ownerId: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<WishlistItems, WishlistItemsMetaData>);
  static copyOf(source: WishlistItems, mutator: (draft: MutableModel<WishlistItems, WishlistItemsMetaData>) => MutableModel<WishlistItems, WishlistItemsMetaData> | void): WishlistItems;
}

export declare class Wishlist {
  readonly id: string;
  readonly amazonWishlistUrl?: string;
  readonly ownerId: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Wishlist, WishlistMetaData>);
  static copyOf(source: Wishlist, mutator: (draft: MutableModel<Wishlist, WishlistMetaData>) => MutableModel<Wishlist, WishlistMetaData> | void): Wishlist;
}