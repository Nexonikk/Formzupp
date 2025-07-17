export function removeAdditionalProperties(schema: any): any {
  if (typeof schema !== "object" || schema === null) {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => removeAdditionalProperties(item));
  }

  if ("additionalProperties" in schema) {
    delete schema.additionalProperties;
  }

  for (const key in schema) {
    schema[key] = removeAdditionalProperties(schema[key]);
  }

  return schema;
}
