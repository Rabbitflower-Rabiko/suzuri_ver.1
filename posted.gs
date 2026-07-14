
//==================================
// 投稿済み管理
//==================================

function getPostedSheet_() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  let sheet =
    ss.getSheetByName("Posted");

  if (!sheet) {

    sheet =
      ss.insertSheet("Posted");

    sheet.appendRow([

      "ProductID",
      "DesignID",
      "Title",
      "PostedAt",

    ]);

  }

  return sheet;

}



//==================================
// 投稿済み判定
//==================================

function isPosted_(productId) {

  const sheet =
    getPostedSheet_();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {

    return false;

  }

  const values =
    sheet
      .getRange(

        2,

        1,

        lastRow - 1,

        1

      )
      .getValues();

  const id =
    String(productId);

  return values.some(function(row){

    return String(row[0]) == id;

  });

}



//==================================
// 投稿済み登録
//==================================

//==================================
// 投稿済み登録
//==================================

function markPosted_(product) {

  const sheet =
    getPostedSheet_();

  sheet.appendRow([

    product.id,

    product.designKey,

    product.title,

    new Date()

  ]);

}



//==================================
// 投稿履歴削除
//==================================

function clearPostedProducts() {

  const sheet =
    getPostedSheet_();

  if (

    sheet.getLastRow() >

    1

  ) {

    sheet.deleteRows(

      2,

      sheet.getLastRow() - 1

    );

  }

}



//==================================
// 投稿数
//==================================

function getPostedCount() {

  const sheet =
    getPostedSheet_();

  Logger.log(

    "Posted : " +

    Math.max(

      sheet.getLastRow() - 1,

      0

    )

  );

}

//==================================
// 最後に投稿した商品ID
//==================================

function getLastPostedProduct_() {

  return PropertiesService
    .getScriptProperties()
    .getProperty("LAST_POSTED_PRODUCT");

}

function setLastPostedProduct_(productId) {

  PropertiesService
    .getScriptProperties()
    .setProperty(

      "LAST_POSTED_PRODUCT",

      String(productId)

    );

}

//==================================
// 最近使ったデザイン判定
//==================================

function isRecentDesign_(designKey) {

  const sheet =
    getPostedSheet_();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {

    return false;

  }

  const values =
    sheet.getRange(

      2,

      2,

      lastRow - 1,

      1

    ).getValues();

  const recent =
    values
      .flat()
      .slice(-7);

  return recent.includes(designKey);

}
//==================================
// 最近使ったデザイン判定
//==================================

function isRecentDesign_(designKey) {

  const sheet =
    getPostedSheet_();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {

    return false;

  }

  const values =
    sheet.getRange(

      2,
      2,
      lastRow - 1,
      1

    ).getValues();

  const recent =
    values
      .flat()
      .slice(-7);

  return recent.includes(designKey);

}
