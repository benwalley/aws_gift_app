import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type MoneyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WishlistItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WishlistMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Money {
  readonly id: string;
  readonly creatorName?: string;
  readonly moneyFromName?: string;
  readonly moneyToName?: string;
  readonly amount?: number;
  readonly paid?: boolean;
  readonly comment?: string;
  readonly creatorId?: string;
  readonly moneyFromId?: string;
  readonly moneyToId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Money, MoneyMetaData>);
  static copyOf(source: Money, mutator: (draft: MutableModel<Money, MoneyMetaData>) => MutableModel<Money, MoneyMetaData> | void): Money;
}

export declare class Comments {
  readonly id: string;
  readonly authorName?: string;
  readonly content?: string;
  readonly wishlistID?: string;
  readonly wishlistitemsID?: string;
  readonly visibleToOwner?: boolean;
  readonly authorId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Comments, CommentsMetaData>);
  static copyOf(source: Comments, mutator: (draft: MutableModel<Comments, CommentsMetaData>) => MutableModel<Comments, CommentsMetaData> | void): Comments;
}

export declare class WishlistItems {
  readonly id: string;
  readonly imageUrls?: (string | null)[];
  readonly images?: (string | null)[];
  readonly name?: string;
  readonly link?: string;
  readonly note?: string;
  readonly gottenBy?: (string | null)[];
  readonly wantsToGet?: (string | null)[];
  readonly price?: number;
  readonly wishlistID?: string;
  readonly wishlistItemComments?: (Comments | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<WishlistItems, WishlistItemsMetaData>);
  static copyOf(source: WishlistItems, mutator: (draft: MutableModel<WishlistItems, WishlistItemsMetaData>) => MutableModel<WishlistItems, WishlistItemsMetaData> | void): WishlistItems;
}

export declare class Wishlist {
  readonly id: string;
  readonly ownerName?: string;
  readonly numberOfItems?: number;
  readonly amazonWishlistUrl?: string;
  readonly Items?: (WishlistItems | null)[];
  readonly wishlistComments?: (Comments | null)[];
  readonly ownerId?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Wishlist, WishlistMetaData>);
  static copyOf(source: Wishlist, mutator: (draft: MutableModel<Wishlist, WishlistMetaData>) => MutableModel<Wishlist, WishlistMetaData> | void): Wishlist;
}