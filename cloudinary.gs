//==================================
// 背景取得
//==================================

function getBackgroundPublicId_() {

  const today = new Date();

  for (const event of CONFIG.EVENT_BACKGROUNDS) {

    const start =
      new Date(event.start);

    const end =
      new Date(event.end);

    const displayStart =
      new Date(start);

    displayStart.setDate(

      displayStart.getDate() -

      (event.earlyDays || 0)

    );

    if (

      today >= displayStart &&

      today <= end

    ) {

      Logger.log(

        "EVENT Background : " +

        event.background

      );

      return event.background;

    }

  }

  Logger.log(

    "NORMAL Background"

  );

  return CONFIG.BACKGROUND_BASE;

}


//==================================
// Cloudinary 合成画像URL
//==================================

function buildSuzuriImageUrl_(product) {

  requireConfigValue_("CLOUD_NAME");

  const publicId =
    uploadSuzuriImageToCloudinary_(product);

  const overlay =
    publicId.replace(/\//g, ":");

  const background =
  getBackgroundPublicId_();

  return (

    "https://res.cloudinary.com/" +

    CONFIG.CLOUD_NAME +

    "/image/upload/" +

    // 背景
    "l_" +
    background +

    "/" +

    // 商品画像
    "l_" +
    overlay +
    ",c_fit,w_" +
    CONFIG.PRODUCT_IMAGE_WIDTH +
    ",h_" +
    CONFIG.PRODUCT_IMAGE_HEIGHT +
    ",g_center/" +

    "fl_layer_apply/" +

    background

  );

}
