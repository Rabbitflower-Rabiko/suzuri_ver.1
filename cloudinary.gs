//==================================
// 背景判定
//==================================

function getBackgroundPublicId_(product) {

  //---------------------------------
  // SALE
  //---------------------------------

  if (

    product &&

    product.discountedPriceWithTax &&

    product.priceWithTax &&

    product.discountedPriceWithTax <

    product.priceWithTax

  ) {

    Logger.log(

      "SALE Background"

    );

    return CONFIG.BACKGROUND_EVENT;

  }

  //---------------------------------
  // EVENT
  //---------------------------------

  if (isEventPeriod_()) {

    Logger.log(

      "EVENT Background"

    );

    return CONFIG.BACKGROUND_EVENT;

  }

  //---------------------------------
  // NORMAL
  //---------------------------------

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

//==================================
// イベント期間判定
//==================================

function isEventPeriod_() {

  if (!CONFIG.EVENT_START) {

    return false;

  }

  const today = new Date();

  today.setHours(0,0,0,0);

  const start =
    new Date(CONFIG.EVENT_START);

  const end =
    new Date(CONFIG.EVENT_END);

  start.setHours(0,0,0,0);

  end.setHours(23,59,59,999);

  start.setDate(

    start.getDate()

    -

    CONFIG.EVENT_EARLY_DAYS

  );

  return today >= start &&

         today <= end;

}
