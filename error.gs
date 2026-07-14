//==================================
// Error Sheet
//==================================

function getErrorSheet_() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  let sheet =
    ss.getSheetByName("Error");

  if (!sheet) {

    sheet =
      ss.insertSheet("Error");

    sheet.appendRow([

      "日時",

      "商品ID",

      "商品名",

      "エラー"

    ]);

  }

  return sheet;

}



//==================================
// エラー保存
//==================================

function saveError_(

  product,

  error

) {

  getErrorSheet_().appendRow([

    new Date(),

    product.id,

    product.title,

    error

  ]);

}
