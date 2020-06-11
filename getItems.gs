function get_items() {
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  Logger.log("【items.length】" + items.length);
  for (var i = 0; i < items.length; i++) {
    Logger.log("【getTitle()】" + items[i].getTitle());
    Logger.log("【getId()】" + items[i].getId());
    Logger.log("【getHelpText()】" + items[i].getHelpText());
    Logger.log("【getIndex()】" + items[i].getIndex());
    Logger.log("【getType()】" + items[i].getType());
  }
}