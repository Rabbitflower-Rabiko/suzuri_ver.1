//==================================
// 起動前チェック
//==================================

function checkConfig_() {

  const required = [

    "SUZURI_ACCESS_TOKEN",
    "SUZURI_USER_NAME",

    "GEMINI_API_KEY",
    "GEMINI_MODEL",

    "CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",

    "BUFFER_TOKEN"

  ];

  const errors = [];

  required.forEach(function(key){

    if (
      CONFIG[key] === undefined ||
      CONFIG[key] === null ||
      CONFIG[key] === ""
    ) {

      errors.push(key);

    }

  });

  if (!CONFIG.BUFFER_PROFILE_IDS ||
      CONFIG.BUFFER_PROFILE_IDS.length === 0) {

    errors.push("BUFFER_PROFILE_IDS");

  }

  if (errors.length > 0) {

    throw new Error(

      "未設定のCONFIGがあります:\n\n" +

      errors.join("\n")

    );

  }

  Logger.log("CONFIGチェック OK");

}
