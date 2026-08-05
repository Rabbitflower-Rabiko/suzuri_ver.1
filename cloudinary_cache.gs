

//==================================
// Cloudinary列番号
//==================================

function getCloudinaryColumn_(){

  return getColumnIndex_("Cloudinary");

}

//==================================
// Cloudinary済？
//==================================

function isCloudinaryUploaded_(productId){

  const sheet =
    getProductSheet_();

  const values =
    sheet.getDataRange().getValues();



const header =
  values[0];

const idCol =
  header.indexOf("商品ID");

const cloudCol =
  header.indexOf("Cloudinary");

  for(let i=1;i<values.length;i++){

    if(String(values[i][idCol]) == String(productId)){

      return (
        String(values[i][cloudCol]).toUpperCase()
        == "TRUE"
      );

    }

  }

  return false;

}

//==================================
// Cloudinary済みにする
//==================================

function markCloudinaryUploaded_(productId){

  const sheet =
    getProductSheet_();

  const values =
    sheet.getDataRange().getValues();

  const idCol =
  header.indexOf("商品ID");

const cloudCol =
  header.indexOf("Cloudinary");

  for(let i=1;i<values.length;i++){

    if(String(values[i][idCol]) == String(productId)){

      sheet
        .getRange(i+1,cloudCol+1)
        .setValue("TRUE");

      Logger.log(
        "Cloudinary済 : " +
        productId
      );

      return;

    }

  }

}
