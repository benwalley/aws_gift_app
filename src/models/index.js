// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Users, Money, Comments, WishlistItems, Wishlist } = initSchema(schema);

export {
  Users,
  Money,
  Comments,
  WishlistItems,
  Wishlist
};