/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMoney = /* GraphQL */ `
  query GetMoney($id: ID!) {
    getMoney(id: $id) {
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
export const listMonies = /* GraphQL */ `
  query ListMonies(
    $filter: ModelMoneyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMonies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncMonies = /* GraphQL */ `
  query SyncMonies(
    $filter: ModelMoneyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMonies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getComments = /* GraphQL */ `
  query GetComments($id: ID!) {
    getComments(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const syncComments = /* GraphQL */ `
  query SyncComments(
    $filter: ModelCommentsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
  }
`;
export const getWishlistItems = /* GraphQL */ `
  query GetWishlistItems($id: ID!) {
    getWishlistItems(id: $id) {
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
export const listWishlistItems = /* GraphQL */ `
  query ListWishlistItems(
    $filter: ModelWishlistItemsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWishlistItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      startedAt
    }
  }
`;
export const syncWishlistItems = /* GraphQL */ `
  query SyncWishlistItems(
    $filter: ModelWishlistItemsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWishlistItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
      nextToken
      startedAt
    }
  }
`;
export const getWishlist = /* GraphQL */ `
  query GetWishlist($id: ID!) {
    getWishlist(id: $id) {
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
export const listWishlists = /* GraphQL */ `
  query ListWishlists(
    $filter: ModelWishlistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWishlists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncWishlists = /* GraphQL */ `
  query SyncWishlists(
    $filter: ModelWishlistFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWishlists(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
