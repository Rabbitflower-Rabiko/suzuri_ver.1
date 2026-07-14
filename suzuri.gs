//==============================
// SUZURI API
//==============================

function getSuzuriProducts_() {

  requireConfigValue_("SUZURI_ACCESS_TOKEN");
  requireConfigValue_("SUZURI_USER_NAME");

  const url =
    "https://suzuri.jp/api/v1/products?userName=" +
    encodeURIComponent(CONFIG.SUZURI_USER_NAME);

  const response = retry_(function () {

    return UrlFetchApp.fetch(url, {

      method: "get",

      headers: {

        Authorization:
          "Bearer " +
          CONFIG.SUZURI_ACCESS_TOKEN

      },

      muteHttpExceptions: true

    });

  });

  if (response.getResponseCode() != 200) {

    throw new Error(response.getContentText());

  }

  const json =
    JSON.parse(response.getContentText());

  if (!json.products) {

    throw new Error("商品が取得できませんでした。");

  }

 return json.products.filter(function(product) {

  return (
    product.published === true &&
    product.secret === false
  );

});

}


//==============================
// 投稿対象取得
//==============================

function getTargetProducts_() {

  let products = getSuzuriProducts_();

  //---------------------------------
  // 未投稿のみ
  //---------------------------------

  products = products.filter(function(product){

    return !isPosted_(product.id);

  });

  //---------------------------------
  // AUTO
  //---------------------------------

  if (CONFIG.POST_MODE == "AUTO") {

    //---------------------------------
    // SALE
    //---------------------------------

    const saleProducts = products.filter(function(product){

      return (

        product.discountedPriceWithTax &&

        product.priceWithTax &&

        product.discountedPriceWithTax <

        product.priceWithTax

      );

    });

    if (saleProducts.length > 0) {

      Logger.log("AUTO → SALE");

      return saleProducts.slice(

        0,

        CONFIG.POSTS_PER_RUN

      );

    }

    //---------------------------------
    // NEW
    //---------------------------------

    const newProducts = getNewProducts_(products);

    if (newProducts.length > 0) {

      Logger.log("AUTO → NEW");

      return newProducts;

    }

    //---------------------------------
    // RANDOM
    //---------------------------------

    Logger.log("AUTO → RANDOM");

    return getRandomProducts_(products);

  }

  //---------------------------------
  // SALE
  //---------------------------------

  if (CONFIG.POST_MODE == "SALE") {

    const saleProducts = products.filter(function(product){

      return (

        product.discountedPriceWithTax &&

        product.priceWithTax &&

        product.discountedPriceWithTax <

        product.priceWithTax

      );

    });

    return saleProducts;

  }

  //---------------------------------
  // NEW
  //---------------------------------

  if (CONFIG.POST_MODE == "NEW") {

    return getNewProducts_(products);

  }

  //---------------------------------
  // RANDOM
  //---------------------------------

  if (CONFIG.POST_MODE == "RANDOM") {

    return getRandomProducts_(products);

  }

  //---------------------------------
  // UNPOSTED
  //---------------------------------

  return products;

}




//==============================
// ランダム投稿
//==============================

//==============================
// 未投稿商品からランダム取得
//==============================

function getRandomProducts_(products) {

  if (!products.length) {

    return [];

  }

  //---------------------------------
  // 前回投稿商品を除外
  //---------------------------------

  const lastProductId =
    getLastPostedProduct_();

  let candidates =
    products.filter(function(product){

      return String(product.id) != String(lastProductId);

    });

  //---------------------------------
  // 全部除外された場合
  //---------------------------------

  if (candidates.length == 0) {

    candidates = products.slice();

  }

  //---------------------------------
  // シャッフル
  //---------------------------------

  for (

    let i = candidates.length - 1;

    i > 0;

    i--

  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    const tmp =
      candidates[i];

    candidates[i] =
      candidates[j];

    candidates[j] =
      tmp;

  }

  //---------------------------------
  // 投稿数分返す
  //---------------------------------

  return candidates.slice(

    0,

    CONFIG.POSTS_PER_RUN

  );

}

//==============================
// 新しい順
//==============================

//==============================
// 新しい順
//==============================

function getNewProducts_(products) {

  const copy =
    products.slice();

  copy.sort(function(a, b) {

    return (

      new Date(b.publishedAt) -

      new Date(a.publishedAt)

    );

  });

  return copy.slice(

    0,

    CONFIG.POSTS_PER_RUN

  );

}



//==============================
// 商品情報変換
//==============================

function createProductObject_(product) {

  return {

    id:
      product.id,

    title:
      product.title,

    description:
      product.description || "",

    url:
      product.sampleUrl,

    imageUrls:
  product.sampleImageUrls || [],

imageUrl:
  getRandomSampleImage_(product),

  

    pngSampleImageUrl:
      product.pngSampleImageUrl,

    price:
      product.price,


    publishedAt:
      product.publishedAt,


priceWithTax:
  product.priceWithTax,

discountedPriceWithTax:
  product.discountedPriceWithTax,

item: {

  name:
    product.item.name,

  humanizeName:
    product.item.humanizeName

}
    

  };

}

//==================================
// ランダム画像取得
//==================================

function getRandomSampleImage_(product) {

  const images =
    product.sampleImageUrls || [];

  if (!images.length) {

    return product.sampleImageUrl;

  }

  const index =
    Math.floor(
      Math.random() * images.length
    );

  return images[index];

}

//==============================
// セール商品取得
//==============================

function getSaleProducts_() {

  requireConfigValue_("SUZURI_ACCESS_TOKEN");

  const response =
    retry_(function () {

      return UrlFetchApp.fetch(

        "https://suzuri.jp/api/v1/products/on_sale",

        {

          method: "get",

          headers: {

            Authorization:
              "Bearer " +
              CONFIG.SUZURI_ACCESS_TOKEN

          },

          muteHttpExceptions: true

        }

      );

    });

  if (response.getResponseCode() != 200) {

    throw new Error(

      response.getContentText()

    );

  }

  return JSON.parse(

    response.getContentText()

  ).products || [];

}

//==================================
// セール商品テスト
//==================================

function testSaleProducts() {

  const products =
    getSaleProducts_();

  Logger.log(

    "セール商品数 : " +

    products.length

  );

  if (products.length == 0) {

    Logger.log("セール商品なし");

    return;

  }

  logJson_(products[0]);

}
