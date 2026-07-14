//==================================
// Main
//==================================

function runSuzuriAutoPromotion() {

  Logger.log("===== SUZURI START =====");

  checkConfig_();

  Logger.log(

    "POST MODE : " +

    CONFIG.POST_MODE

  );

  const products =
    getTargetProducts_();

  if (!products.length) {

    Logger.log("投稿対象がありません。");

    return;

  }

  // 以下はそのまま…

  const count =
    Math.min(
      CONFIG.POSTS_PER_RUN,
      products.length
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    processProduct_(

      createProductObject_(

        products[i]

      )

    );

  }

  Logger.log("===== SUZURI END =====");

}



//==================================
// 商品処理
//==================================

function processProduct_(product) {

  try {

    Logger.log(
      "Processing : " +
      product.title
    );

    //-----------------------
    // Gemini
    //-----------------------

    const content =
      generateSuzuriContent_(product);

    //-----------------------
    // Cloudinary
    //-----------------------

    const imageUrl =
      buildSuzuriImageUrl_(product);

    //-----------------------
    // Buffer
    //-----------------------

    postToBuffer_(

      product,

      content,

      imageUrl

    );

    //-----------------------
    // 投稿済み
    //-----------------------

    markPosted_(product);

    //-----------------------
    // Log
    //-----------------------

    saveLog_(

      product,

      imageUrl,

      "SUCCESS"

    );

    Logger.log(

      "Image : " +

      imageUrl

    );

    Logger.log(

      "Completed : " +

      product.title

    );

  }

  catch (e) {

    saveLog_(

      product,

      "",

      "ERROR"

    );

    saveError_(

      product,

      e.message

    );

    Logger.log(

      "ERROR : " +

      product.title +

      "\n" +

      e.stack

    );

  }

}


//==================================
// テスト
//==================================

function testSuzuri() {

  const product =

    createProductObject_(

      getSuzuriProducts_()[0]

    );

  logJson_(product);
 Logger.log(product.designKey);

}



function testGemini() {

  const product =

    createProductObject_(

      getSuzuriProducts_()[0]

    );

  logJson_(

    generateSuzuriContent_(

      product

    )

  );

}



//==================================
// Cloudinary テスト
//==================================

function testCloudinary() {

  const products =
    getSuzuriProducts_();

  if (products.length == 0) {

    throw new Error(
      "商品がありません。"
    );

  }

  const product =
    createProductObject_(
      products[0]
    );

  Logger.log(product);

  const publicId =
    uploadSuzuriImageToCloudinary_(
      product
    );

  Logger.log(
    "Public ID : " +
    publicId
  );

  const imageUrl =
    buildSuzuriImageUrl_(
      product
    );

  Logger.log(
    "完成画像URL"
  );

  Logger.log(
    imageUrl
  );

}



//==================================
// Buffer テスト
//==================================

function testBuffer() {

  const product =

    createProductObject_(

      getSuzuriProducts_()[0]

    );

  const content =

    generateSuzuriContent_(

      product

    );

  const imageUrl =

    buildSuzuriImageUrl_(

      product

    );

  postToBuffer_(

    product,

    content,

    imageUrl

  );

}
