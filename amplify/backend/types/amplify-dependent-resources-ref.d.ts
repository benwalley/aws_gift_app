export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "awsgiftapp": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "storage": {
        "s3awsgiftappimages": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "awsgiftapp": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    }
}