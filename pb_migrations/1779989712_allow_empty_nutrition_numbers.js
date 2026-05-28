/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("nutritions");

  for (const fieldName of ["calories", "protein", "carbs", "fats"]) {
    const field = collection.fields.getByName(fieldName);
    field.required = false;
  }

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("nutritions");

  for (const fieldName of ["calories", "protein", "carbs", "fats"]) {
    const field = collection.fields.getByName(fieldName);
    field.required = true;
  }

  return app.save(collection);
});
