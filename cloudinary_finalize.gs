//==================================
// Cloudinary 完成画像保存
//==================================

function finalizeCloudinaryImage_(imageUrl, productId) {

  requireConfigValue_("CLOUD_NAME");
  requireConfigValue_("CLOUDINARY_API_KEY");
  requireConfigValue_("CLOUDINARY_API_SECRET");

  const publicId =
    "final/" + productId;

  const timestamp =
    String(Math.floor(Date.now() / 1000));

  const params =
    "public_id=" +
    publicId +
    "&timestamp=" +
    timestamp +
    CONFIG.CLOUDINARY_API_SECRET;

  const signature =
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_1,
      params
    )
    .map(function(b){

      const v =
        (b < 0 ? b + 256 : b)
          .toString(16);

      return ("0"+v).slice(-2);

    })
    .join("");

  const response =
    UrlFetchApp.fetch(

      "https://api.cloudinary.com/v1_1/" +
      CONFIG.CLOUD_NAME +
      "/image/upload",

      {

        method:"post",

        payload:{

          file:imageUrl,

          public_id:publicId,

          overwrite:true,

          api_key:CONFIG.CLOUDINARY_API_KEY,

          timestamp:timestamp,

          signature:signature

        },

        muteHttpExceptions:true

      }

    );

  const json =
    JSON.parse(response.getContentText());

  logJson_(json);

  if(json.error){

    throw new Error(json.error.message);

  }

  return json.secure_url;

}
