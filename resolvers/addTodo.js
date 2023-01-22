import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const item = {
    ...ctx.args.todo,
    createdAt: util.time.nowISO8601(),
    updatedAt: util.time.nowISO8601(),
  };

  return {
    operation: "PutItem",
    key: {
      todoId: util.dynamodb.toDynamoDB(util.autoId()),
    },
    attributeValues: util.dynamodb.toMapValues(item),
    // condition: {
    //   expression: "attribute_not_exists(todoID)",
    // },
  };
}

export function response(ctx) {
  return ctx.result;
}
