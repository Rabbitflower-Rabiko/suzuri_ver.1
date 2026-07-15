
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
      "ItemName",
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
// Posted登録
//==================================

function markPosted_(product) {

  const sheet =
    getPostedSheet_();

  sheet.appendRow([

    product.id,

    product.designKey,

    product.item.name,

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
// Designが最近投稿されたか
//==================================

function isRecentDesign_(designKey) {

  const sheet =
    getPostedSheet_();

  const values =
    sheet.getDataRange().getValues();

  const now =
    new Date();

  for (let i = 1; i < values.length; i++) {

    if (values[i][1] != designKey) {

      continue;

    }

    const posted =
      new Date(values[i][4]);

    const diff =

      (now - posted)

      /

      86400000;

    if (

      diff < CONFIG.DESIGN_DAYS

    ) {

      return true;

    }

  }

  return false;

}


//==================================
// Item 7日以内
//==================================

//==================================
// Itemが最近投稿されたか
//==================================

function isRecentItem_(itemName) {

  const sheet =
    getPostedSheet_();

  const values =
    sheet.getDataRange().getValues();

  const now =
    new Date();

  for (let i = 1; i < values.length; i++) {

    if (values[i][2] != itemName) {

      continue;

    }

    const posted =
      new Date(values[i][4]);

    const diff =

      (now - posted)

      /

      86400000;

    if (

      diff < CONFIG.ITEM_DAYS

    ) {

      return true;

    }

  }

  return false;

}
//==================================
// Design除外
//==================================

function removeRecentDesigns_(products){

  return products.filter(function(product){

    const obj =
      createProductObject_(product);

    return !isRecentDesign_(obj.designKey);

  });

}
//==================================
// Item除外
//==================================

function removeRecentItems_(products){

  return products.filter(function(product){

    return !isRecentItem_(

      product.item.name

    );

  });

}
