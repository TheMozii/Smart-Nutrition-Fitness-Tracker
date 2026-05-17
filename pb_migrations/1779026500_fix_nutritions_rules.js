/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("nutritions");

  collection.listRule = "@request.auth.id != ''";
  collection.viewRule = "@request.auth.id != ''";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "@request.auth.id != '' && user = @request.auth.id";
  collection.deleteRule = "@request.auth.id != '' && user = @request.auth.id";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nutritions");

  collection.listRule = "user = @request.auth.id";
  collection.viewRule = "user = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "user = @request.auth.id";
  collection.deleteRule = "user = @request.auth.id";

  return app.save(collection);
});
