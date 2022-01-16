// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Users, Groups, Money, Comments, WishlistItems, Wishlist } = initSchema(schema);

export {
  Users,
  Groups,
  Money,
  Comments,
  WishlistItems,
  Wishlist
};