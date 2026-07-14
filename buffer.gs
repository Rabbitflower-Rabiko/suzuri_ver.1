//==================================
// Buffer v3 投稿
//==================================

function postToBuffer_(product, content, imageUrl) {

  requireConfigValue_("BUFFER_TOKEN");

  const postText =
    content.postText +
    "\n\n" +
    product.url +
    "\n\n" +
    content.hashtags;

  for (const channelId of CONFIG.BUFFER_PROFILE_IDS) {

    postToSingleChannel_(

      channelId,
      postText,
      imageUrl

    );

  }

}



//==================================
// 1チャンネル投稿
//==================================

function postToSingleChannel_(

  channelId,
  text,
  imageUrl

) {

  const query = `
mutation CreatePost(
  $text:String!,
  $channelId:ChannelId!,
  $imageUrl:String!
){

  createPost(

    input:{

      text:$text
      channelId:$channelId
      schedulingType:automatic
      mode:addToQueue

      assets:[
        {
          image:{
            url:$imageUrl
          }
        }
      ]

    }

  ){

    ... on PostActionSuccess{

      post{

        id

      }

    }

    ... on MutationError{

      message

    }

  }

}
`;

  const variables = {

    text: text,

    channelId: channelId,

    imageUrl: imageUrl

  };

  const result =
    callBufferGraphQL_(query, variables);

  logJson_(result);

  if (result.errors) {

    throw new Error(
      JSON.stringify(result.errors)
    );

  }

  if (
    result.data &&
    result.data.createPost &&
    result.data.createPost.message
  ) {

    throw new Error(
      result.data.createPost.message
    );

  }

  return result;

}

//==================================
// GraphQL
//==================================

function callBufferGraphQL_(query, variables) {

  const response = retry_(function () {

    return UrlFetchApp.fetch(

      "https://api.buffer.com/graphql",

      {

        method: "post",

        contentType: "application/json",

        headers: {

          Authorization:
            "Bearer " +
            CONFIG.BUFFER_TOKEN

        },

        payload: JSON.stringify({

          query: query,

          variables: variables

        }),

        muteHttpExceptions: true

      }

    );

  });

  const json =
    JSON.parse(
      response.getContentText()
    );

  logJson_(json);

  return json;

}



