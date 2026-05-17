/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "nutritions",
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: "@request.auth.id != ''",
    updateRule: "user = @request.auth.id",
    deleteRule: "user = @request.auth.id",
    fields: [
      {
        type: "relation",
        name: "user",
        required: true,
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        type: "text",
        name: "name",
        required: true,
      },
      {
        type: "select",
        name: "source",
        required: true,
        maxSelect: 1,
        values: ["open_food_facts", "ai_text", "manual"],
      },
      {
        type: "text",
        name: "barcode",
      },
      {
        type: "number",
        name: "calories",
        required: true,
      },
      {
        type: "number",
        name: "protein",
        required: true,
      },
      {
        type: "number",
        name: "carbs",
        required: true,
      },
      {
        type: "number",
        name: "fats",
        required: true,
      },
      {
        type: "date",
        name: "loggedDate",
        required: true,
      },
    ],
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nutritions");

  return app.delete(collection);
});
