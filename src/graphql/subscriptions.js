/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMoney = /* GraphQL */ `
  subscription OnCreateMoney {
    onCreateMoney {
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
export const onUpdateMoney = /* GraphQL */ `
  subscription OnUpdateMoney {
    onUpdateMoney {
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
export const onDeleteMoney = /* GraphQL */ `
  subscription OnDeleteMoney {
    onDeleteMoney {
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
export const onCreateComments = /* GraphQL */ `
  subscription OnCreateComments {
    onCreateComments {
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
export const onUpdateComments = /* GraphQL */ `
  subscription OnUpdateComments {
    onUpdateComments {
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
export const onDeleteComments = /* GraphQL */ `
  subscription OnDeleteComments {
    onDeleteComments {
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
export const onCreateWishlistItems = /* GraphQL */ `
  subscription OnCreateWishlistItems {
    onCreateWishlistItems {
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
export const onUpdateWishlistItems = /* GraphQL */ `
  subscription OnUpdateWishlistItems {
    onUpdateWishlistItems {
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
export const onDeleteWishlistItems = /* GraphQL */ `
  subscription OnDeleteWishlistItems {
    onDeleteWishlistItems {
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
export const onCreateWishlist = /* GraphQL */ `
  subscription OnCreateWishlist {
    onCreateWishlist {
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
export const onUpdateWishlist = /* GraphQL */ `
  subscription OnUpdateWishlist {
    onUpdateWishlist {
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
export const onDeleteWishlist = /* GraphQL */ `
  subscription OnDeleteWishlist {
    onDeleteWishlist {
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
