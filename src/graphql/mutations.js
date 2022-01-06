/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMoney = /* GraphQL */ `
  mutation CreateMoney(
    $input: CreateMoneyInput!
    $condition: ModelMoneyConditionInput
  ) {
    createMoney(input: $input, condition: $condition) {
      id
      creatorName
      moneyFromName
      moneyToName
      amount
      paid
      comment
      creatorId
      moneyFromId
      moneyToId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateMoney = /* GraphQL */ `
  mutation UpdateMoney(
    $input: UpdateMoneyInput!
    $condition: ModelMoneyConditionInput
  ) {
    updateMoney(input: $input, condition: $condition) {
      id
      creatorName
      moneyFromName
      moneyToName
      amount
      paid
      comment
      creatorId
      moneyFromId
      moneyToId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteMoney = /* GraphQL */ `
  mutation DeleteMoney(
    $input: DeleteMoneyInput!
    $condition: ModelMoneyConditionInput
  ) {
    deleteMoney(input: $input, condition: $condition) {
      id
      creatorName
      moneyFromName
      moneyToName
      amount
      paid
      comment
      creatorId
      moneyFromId
      moneyToId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createComments = /* GraphQL */ `
  mutation CreateComments(
    $input: CreateCommentsInput!
    $condition: ModelCommentsConditionInput
  ) {
    createComments(input: $input, condition: $condition) {
      id
      authorName
      content
      wishlistID
      wishlistitemsID
      visibleToOwner
      authorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateComments = /* GraphQL */ `
  mutation UpdateComments(
    $input: UpdateCommentsInput!
    $condition: ModelCommentsConditionInput
  ) {
    updateComments(input: $input, condition: $condition) {
      id
      authorName
      content
      wishlistID
      wishlistitemsID
      visibleToOwner
      authorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteComments = /* GraphQL */ `
  mutation DeleteComments(
    $input: DeleteCommentsInput!
    $condition: ModelCommentsConditionInput
  ) {
    deleteComments(input: $input, condition: $condition) {
      id
      authorName
      content
      wishlistID
      wishlistitemsID
      visibleToOwner
      authorId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createWishlistItems = /* GraphQL */ `
  mutation CreateWishlistItems(
    $input: CreateWishlistItemsInput!
    $condition: ModelWishlistItemsConditionInput
  ) {
    createWishlistItems(input: $input, condition: $condition) {
      id
      imageUrls
      images
      name
      link
      note
      gottenBy
      wantsToGet
      price
      wishlistID
      wishlistItemComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateWishlistItems = /* GraphQL */ `
  mutation UpdateWishlistItems(
    $input: UpdateWishlistItemsInput!
    $condition: ModelWishlistItemsConditionInput
  ) {
    updateWishlistItems(input: $input, condition: $condition) {
      id
      imageUrls
      images
      name
      link
      note
      gottenBy
      wantsToGet
      price
      wishlistID
      wishlistItemComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteWishlistItems = /* GraphQL */ `
  mutation DeleteWishlistItems(
    $input: DeleteWishlistItemsInput!
    $condition: ModelWishlistItemsConditionInput
  ) {
    deleteWishlistItems(input: $input, condition: $condition) {
      id
      imageUrls
      images
      name
      link
      note
      gottenBy
      wantsToGet
      price
      wishlistID
      wishlistItemComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createWishlist = /* GraphQL */ `
  mutation CreateWishlist(
    $input: CreateWishlistInput!
    $condition: ModelWishlistConditionInput
  ) {
    createWishlist(input: $input, condition: $condition) {
      id
      ownerName
      numberOfItems
      amazonWishlistUrl
      Items {
        items {
          id
          imageUrls
          images
          name
          link
          note
          gottenBy
          wantsToGet
          price
          wishlistID
          wishlistItemComments {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      wishlistComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      ownerId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateWishlist = /* GraphQL */ `
  mutation UpdateWishlist(
    $input: UpdateWishlistInput!
    $condition: ModelWishlistConditionInput
  ) {
    updateWishlist(input: $input, condition: $condition) {
      id
      ownerName
      numberOfItems
      amazonWishlistUrl
      Items {
        items {
          id
          imageUrls
          images
          name
          link
          note
          gottenBy
          wantsToGet
          price
          wishlistID
          wishlistItemComments {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      wishlistComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      ownerId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteWishlist = /* GraphQL */ `
  mutation DeleteWishlist(
    $input: DeleteWishlistInput!
    $condition: ModelWishlistConditionInput
  ) {
    deleteWishlist(input: $input, condition: $condition) {
      id
      ownerName
      numberOfItems
      amazonWishlistUrl
      Items {
        items {
          id
          imageUrls
          images
          name
          link
          note
          gottenBy
          wantsToGet
          price
          wishlistID
          wishlistItemComments {
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      wishlistComments {
        items {
          id
          authorName
          content
          wishlistID
          wishlistitemsID
          visibleToOwner
          authorId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      ownerId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
