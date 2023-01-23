import util from "@aws-appsync/utils";

export function request(ctx) {
  const { todoId, ...values } = ctx.arguments;
  const item = {
    values,
    updatedAt: util.time.nowISO8601(),
  };
  console.log(`logging the todoId === ${todoId}`);
  console.log(`logging the values to update === ${values}`);

  const updateExpression = [];
  const expressionNames = {};
  const expressionValues = {};

  for (const [key, value] of Object.entries(item)) {
    updateExpression.push(`#${key} = :${key}`);
    expressionNames[`#${key}`] = key;
    expressionValues[`:${key}`] = util.dynamodb.todynamoDB(value);
  }

  return {
    operation: "UpdateItem",
    key: {
      todoId: util.dynamodb.todynamoDB(todoId),
    },
    update: {
      expression: `set ${updateExpression.join(" ,")}`,
      expressionNames,
      expressionValues,
    },
    condition: {
      expression: "attribute_exist(#todoId)",
      expressionNames: {
        "#todoId": "todoId",
      },
    },
  };
}

export function response(ctx) {
  ctx.stash.event = {
    DetailType: "postUpdated",
    Detail: JSON.stringify(ctx.result),
  };
  return ctx.result;
}
