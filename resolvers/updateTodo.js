import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { todoId, ...values } = ctx.arguments;
  console.log("ctx.arguments ===", ctx.args);
  const item = {
    ...values,
    updatedAt: util.time.nowISO8601(),
  };
  console.log(`logging the todoId === ${todoId}`);
  console.log(`logging the values to update === ${values}`);
  console.log("passing item to DynamoDB ===", item);

  const updateExpression = [];
  const expressionNames = {};
  const expressionValues = {};

  for (const [key, value] of Object.entries(item)) {
    updateExpression.push(`#${key} = :${key}`);
    expressionNames[`#${key}`] = key;
    expressionValues[`:${key}`] = util.dynamodb.toDynamoDB(value);
  }
  console.log("updateExpression ===", updateExpression);
  console.log("updateExpression Joined ===", updateExpression.join(", "));
  console.log("expressionNames ===", expressionNames);
  console.log("expressionValues ===", expressionValues);

  return {
    operation: "UpdateItem",
    key: {
      todoId: util.dynamodb.toDynamoDB(todoId),
    },
    update: {
      expression: `SET ${updateExpression.join(", ")}`,
      expressionNames,
      expressionValues,
    },
    condition: {
      expression: "attribute_exists(#todoId)",
      expressionNames: {
        "#todoId": "todoId",
      },
    },
  };
}

export function response(ctx) {
  ctx.stash.event = {
    DetailType: "todoUpdated",
    Detail: JSON.stringify(ctx.result),
  };
  return ctx.result;
}
