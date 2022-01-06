// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Money, Comments, WishlistItems, Wishlist } = initSchema(schema);

export {
  Money,
  Comments,
  WishlistItems,
  Wishlist
};