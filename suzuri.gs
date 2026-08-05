

const t1 = Date.now();

//==================================
// Main
//==================================
const allProducts = getProductList_();

Logger.log("全商品数=" + allProducts.length);
Logger.log(allProducts[0]);

let products = allProducts.filter(function(product){

  return (
    product["投稿"] != "済" &&
    String(product["公開"]) == "TRUE"
  );

});

Logger.log(
  "商品一覧取得 = " +
  ((Date.now() - t1) / 1000).toFixed(1) +
  " 秒"
);

//==================================
// SUZURI 自動投稿
//==================================

function runSuzuriAutoPromotion() {

const start = Date.now();

  Logger.log("===== SUZURI START =====");

  checkConfig_();

  resetPostedIfFinished_();

  Logger.log(
    "POST MODE : " +
    CONFIG.POST_MODE
  );

  let products =
    getProductList_().filter(function(product){

      const isPublic =
        product["公開"] === true ||
        String(product["公開"]).toLowerCase() == "true";

      return (
        product["投稿"] != "済" &&
        isPublic
      );

    });

  if (!products.length) {

    Logger.log("投稿対象がありません。");

    return;

  }

//----------------------------------
// イベント期間中は対象商品のみに限定
//----------------------------------

if (isEventPeriod_()) {

  products = products.filter(function(product){

    return SALE_ITEMS.includes(

      product["商品種類"]

    );

  });

  products.forEach(function(product){

  Logger.log(
    "SALE候補 : " +
    product["商品種類"] +
    " / " +
    product["商品名"]
  );

});

  Logger.log(

    "イベント対象商品数 = " +

    products.length

  );

}

  shuffleArray_(products);

  products =
    removeRecentDesigns_(products);

 

  const count =
    Math.min(
      CONFIG.POSTS_PER_RUN,
      products.length
    );

for (let i = 0; i < count; i++) {

  const t3 = Date.now();

  processProduct_(

    createProductObject_(

      products[i]

    )

  );

  Logger.log(
    "投稿処理 = " +
    ((Date.now() - t3) / 1000).toFixed(1) +
    " 秒"
  );

}



}

//==================================
// 商品一覧取得
//==================================

function getProductList_() {

  const sheet = getProductSheet_();

  const values =
    sheet.getDataRange().getValues();

  if (values.length <= 1) {

    return [];

  }

  const header =
    values.shift();

  return values.map(function(row){

    const obj = {};

    header.forEach(function(name,index){

      obj[name] = row[index];

    });

    return obj;

  });

}


//==================================
// 商品シート取得
//==================================

function getProductSheet_(){

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  return ss.getSheetByName("商品一覧");

}

//==================================
// 投稿済みにする
//==================================

//==================================
// 投稿済みにする（高速版）
//==================================

function markPosted_(productId){

  const sheet = getProductSheet_();

  const header =
    sheet.getRange(1,1,1,sheet.getLastColumn())
         .getValues()[0];

  const idCol =
    header.indexOf("商品ID") + 1;

  const postCol =
    header.indexOf("投稿") + 1;

  const dateCol =
    header.indexOf("投稿日時") + 1;

  if(idCol <= 0 || postCol <= 0){

    throw new Error(
      "商品ID または 投稿 列がありません。"
    );

  }

  const cell =
    sheet
      .getRange(2,idCol,sheet.getLastRow()-1,1)
      .createTextFinder(String(productId))
      .matchEntireCell(true)
      .findNext();

  if(!cell){

    Logger.log(
      "商品IDが見つかりません : " +
      productId
    );

    return;

  }

  const row =
    cell.getRow();

  sheet
    .getRange(row,postCol)
    .setValue("済");

  if(dateCol > 0){

    sheet
      .getRange(row,dateCol)
      .setValue(new Date());

  }

  Logger.log(
    "投稿済みに更新 : " +
    productId
  );

}

//==================================
// 商品情報変換（シート版）
//==================================

function createProductObject_(row){

  return {

    id:
      row["商品ID"],

    title:
      row["商品名"],

    description:
      row["説明"] || "",

    url:
      row["商品URL"],

    imageUrl:
      row["画像URL"],

    imageUrls:
      [row["画像URL"]],

    pngSampleImageUrl:
      row["画像URL"],

    DesignID:
      row["DesignID"],

    price:
      Number(row["価格"] || 0),

    publishedAt:
      row["公開日"],

    priceWithTax:
      Number(row["税込価格"] || 0),

    discountedPriceWithTax:
      Number(row["セール価格"] || 0),

    item:{

      id:
        row["商品種類ID"],

      name:
        row["商品種類"],

      humanizeName:
        row["商品種類"]

    }

  };

}

//==================================
// SUZURI テスト
//==================================

function testSuzuri() {

  const list =
    getProductList_();

  if (list.length == 0) {

    throw new Error("商品一覧シートが空です");

  }

  const product =
    createProductObject_(
      list[0]
    );

  logJson_(product);

  Logger.log(product.title);
  Logger.log(product.DesignID);
  Logger.log(product.imageUrl);

}

//==================================
// Gemini テスト
//==================================

function testGemini() {

  const list =
    getProductList_();

  if (!list.length) {

    throw new Error("商品一覧シートが空です");

  }

  const product =
    createProductObject_(
      list[0]
    );

  logJson_(

    generateSuzuriContent_(product)

  );

}

//==================================
// Cloudinary テスト
//==================================

function testCloudinary() {

  const list =
    getProductList_();

  if (!list.length) {

    throw new Error("商品一覧シートが空です");

  }

  const product =
    createProductObject_(
      list[0]
    );

  Logger.log(product);

  const imageUrl =
    buildSuzuriImageUrl_(product);

  Logger.log("完成画像URL");

  Logger.log(imageUrl);

}



//==================================
// Buffer テスト
//==================================

function testBuffer() {

  const list =
    getProductList_();

  if (!list.length) {

    throw new Error("商品一覧シートが空です");

  }

  const product =
    createProductObject_(
      list[0]
    );

  Logger.log(product);

  const content =
    generateSuzuriContent_(product);

  const imageUrl =
    buildSuzuriImageUrl_(product);

  postToBuffer_(

    product,

    content,

    imageUrl

  );

}

//==================================
// SUZURI商品 全件取得
//==================================

function getSuzuriProducts_() {

  requireConfigValue_("SUZURI_ACCESS_TOKEN");
  requireConfigValue_("SUZURI_USER_NAME");

  const allProducts = [];

  let offset = 0;

  while (true) {

    const url =
      "https://suzuri.jp/api/v1/products" +
      "?userName=" +
      encodeURIComponent(CONFIG.SUZURI_USER_NAME) +
      "&limit=50" +
      "&offset=" + offset;

    const response = retry_(function(){

      return UrlFetchApp.fetch(url,{

        method:"get",

        headers:{
          Authorization:
            "Bearer " +
            CONFIG.SUZURI_ACCESS_TOKEN
        },

        muteHttpExceptions:true

      });

    });

    if(response.getResponseCode()!=200){

      throw new Error(response.getContentText());

    }

    const json =
      JSON.parse(response.getContentText());

    const products =
      json.products || [];

    if(products.length==0){

      break;

    }

    allProducts.push.apply(
      allProducts,
      products
    );

    Logger.log(
      "取得：" +
      allProducts.length +
      "件"
    );

    if(products.length<50){

      break;

    }

    offset += 50;

  }

  Logger.log(
    "総取得数：" +
    allProducts.length
  );

  return allProducts;

}

//==================================
// 商品一覧更新
//==================================

function updateProductSheet_() {

  const products = getSuzuriProducts_();

  const sheet = getProductSheet_();

  const values = sheet.getDataRange().getValues();

  const header = values[0];

  const map = {};

  for (let i = 1; i < values.length; i++) {

    map[String(values[i][0])] = i + 1;

  }

  products.forEach(function(product){

    const row = [

      product.id,

      product.title,

      product.sampleUrl,

      product.sampleImageUrl,

      product.priceWithTax,

      product.discountedPriceWithTax,

      product.published,

      ""

    ];

    if (map[String(product.id)]) {

      const postStatus =
        sheet.getRange(
          map[String(product.id)],
          8
        ).getValue();

      row[7] = postStatus;

      sheet.getRange(
        map[String(product.id)],
        1,
        1,
        row.length
      ).setValues([row]);

    } else {

      sheet.appendRow(row);

    }

  });

  Logger.log(
    "商品一覧更新完了：" +
    products.length +
    "件"
  );

}

//==================================
// DesignID更新
//==================================

function updateDesignIds_(){

  const sheet = getProductSheet_();

  const values =
    sheet.getDataRange().getValues();

  if(values.length<=1){
    return;
  }

  const header = values[0];

  const urlCol =
    header.indexOf("商品URL");

  const designCol =
    header.indexOf("DesignID");

  if(urlCol==-1){
    throw new Error("商品URL列がありません");
  }

  if(designCol==-1){
    throw new Error("DesignID列を追加してください");
  }

  for(let i=1;i<values.length;i++){

    const url =
      String(values[i][urlCol] || "");

    const m =
      url.match(/\/(\d+)\//);

    if(m){

      sheet.getRange(
        i+1,
        designCol+1
      ).setValue(m[1]);

    }

  }

}
//==================================
// 最近使ったDesignID取得
//==================================

function getRecentDesignIds_(){

  const sheet = getProductSheet_();

  const values =
    sheet.getDataRange().getValues();

  if(values.length<=1){
    return [];
  }

  const header = values[0];

  const designCol =
    header.indexOf("DesignID");

  const postCol =
    header.indexOf("投稿");

  const result = [];

  for(let i=values.length-1;i>=1;i--){

    if(values[i][postCol]!="済"){
      continue;
    }

    const id =
      String(values[i][designCol]);

    if(id){

      result.push(id);

    }

    if(result.length>=CONFIG.RECENT_DESIGN_LIMIT){
      break;
    }

  }

  return result;

}

const t2 = Date.now();
//==================================
// Design重複除外
//==================================

function removeRecentDesigns_(products){

  const recent =
    getRecentDesignIds_();

  return products.filter(function(product){

    return recent.indexOf(
      String(product["DesignID"])
    )==-1;

  });

}

Logger.log(
  "Design判定 = " +
  ((Date.now() - t2) / 1000).toFixed(1) +
  " 秒"
);
//==================================
// 投稿対象取得
//==================================

function getTargetProducts_() {

  const products =
    getProductList_().filter(function(product){

      return (
        product["投稿"] != "済" &&
        (
          product["公開"] === true ||
          product["公開"] === "TRUE" ||
          product["公開"] === "公開中"
        )
      );

    });

  return products;

}


