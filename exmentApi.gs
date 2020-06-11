function callAPI(e) {
  // Exmentに送信する値を作成
  let value = getExmentValue(e);
  Logger.log(value);

  // アクセストークン取得
  let access_token = getAccessToken();
  Logger.log(access_token);

  // API実行
  let exment_value = postExmentValue(access_token, value);
  Logger.log(exment_value);
}

/**
* Exmentに送信する値を取得する
*/
function getExmentValue(e){
  // Exmentに送信する値を作成
  let value = {};
  
  // プロパティより、Exmentのcolumnとid一覧を取得
  let columns = JSON.parse(PropertiesService.getScriptProperties().getProperty('COLUMN_IDS'));
  
  // フォームの定義取得
  const form = FormApp.getActiveForm();
  const items = form.getItems();

  const itemResponses = e.response.getItemResponses();
  for (let i = 0; i < itemResponses.length; i++) {
    let itemResponse = itemResponses[i];
    
    // IDと回答を取得
    let id = items[i].getId();
    let answer = itemResponse.getResponse();
    
    //Logger.log('id = ' + id);
    //Logger.log('answer = ' + answer);
    
    // 列定義とループ
    for(let column_name in columns){
      let targetId = columns[column_name];
      //Logger.log('targetId = ' + targetId);
        
      // 定義していたidと合致していた場合
      if(targetId == id){
        // valueにanswerを設定
        value[column_name] = answer;
      }
    }
  }
  
  return value;
}


/**
* アクセストークン取得
*/
function getAccessToken(){
  // プロパティから諸々取得
  const client_id = PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
  const client_secret = PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');
  const api_uri = PropertiesService.getScriptProperties().getProperty('API_URI');
  const api_key = PropertiesService.getScriptProperties().getProperty('API_KEY');
  
  let data = {
    'grant_type': 'api_key',
    'client_id': client_id,
    'client_secret': client_secret,
    'api_key': api_key,
    'scope': 'value_write'
  };
  
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
   
  // API実行
  let response = UrlFetchApp.fetch(api_uri + '/oauth/token', options);

  let responseCode = response.getResponseCode();
  let responseBody = response.getContentText();
  
  if (responseCode === 200 || responseCode === 201) {
    let responseJson = JSON.parse(responseBody);
    return responseJson.access_token;
  } else {
    Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody));
    return null;
  }
}


/**
* API実行
*/
function postExmentValue(access_token, value){
  const api_uri = PropertiesService.getScriptProperties().getProperty('API_URI');
  const table_name = PropertiesService.getScriptProperties().getProperty('TABLE_NAME');
  
  let data = {
    'value': value
  };
  
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + String(access_token)
    },
    'payload': JSON.stringify(data),
    'muteHttpExceptions': true
  };
  
  Logger.log(JSON.stringify(data));
  
  // API実行
  let response = UrlFetchApp.fetch(api_uri + '/api/data/' + table_name, options);

  let responseCode = response.getResponseCode();
  let responseBody = response.getContentText();
  
  if (responseCode === 200 || responseCode === 201) {
    let responseJson = JSON.parse(responseBody);
    Logger.log('success!!!');
    
    return responseJson;
  } else {
    Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody));
    return null;
  }

}