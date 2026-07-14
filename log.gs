//==================================
// Log Sheet
//==================================

function getLogSheet_() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  let sheet =
    ss.getSheetByName("Log");

  if (!sheet) {

    sheet =
      ss.insertSheet("Log");

    sheet.appendRow([

      "日時",

      "商品ID",

      "商品名",

      "投稿モード",

      "価格",

      "セール価格",

      "画像URL",

      "結果"

    ]);

  }

  return sheet;

}



//==================================
// 投稿ログ
//==================================

function saveLog_(

  product,

  imageUrl,

  result

) {

  Logger.log("saveLog_ start");

  getLogSheet_().appendRow([

    new Date(),

    product.id,

    product.title,

    CONFIG.POST_MODE,

    product.priceWithTax ||

    product.price ||

    "",

    product.discountedPriceWithTax ||

    "",

    imageUrl,

    result

  ]);

}
