
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

    markPosted_(product.id);

    addPostedHistory_(product);

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
// 商品一覧更新 → 投稿開始
//==================================

function updateAndRunSuzuri(){

  Logger.log("商品一覧更新開始");

  getAllSuzuriProducts();

  Logger.log("投稿開始");

  runSuzuriAutoPromotion();

}

//==================================
// 配列シャッフル
//==================================

function shuffleArray_(array){

  for(let i=array.length-1;i>0;i--){

    const j =
      Math.floor(
        Math.random()*(i+1)
      );

    const tmp = array[i];

    array[i] = array[j];

    array[j] = tmp;

  }

  return array;

}

//==================================
// 全商品投稿済みならリセット
//==================================

function resetPostedIfFinished_(){

  const sheet =
    getProductSheet_();

  const values =
    sheet.getDataRange().getValues();

  const header =
    values[0];

  const postCol =
    header.indexOf("投稿");

  const dateCol =
    header.indexOf("投稿日時");

  let remain = 0;

  for(let i=1;i<values.length;i++){

    if(values[i][postCol] != "済"){

      remain++;

    }

  }

  if(remain > 0){

    return;

  }

  Logger.log("全商品投稿済み → リセット開始");

  for(let i=1;i<values.length;i++){

    sheet.getRange(i+1,postCol+1)
         .setValue("");

    if(dateCol >= 0){

      sheet.getRange(i+1,dateCol+1)
           .setValue("");

    }

  }

  Logger.log("投稿管理をリセットしました");

}

