import { util } from "@aws-appsync/utils";

export function request(ctx) {
  console.log("the arguments are ===", ctx.args);
  const { todoId } = ctx.args;
  console.log(`deleting todo with ID === ${todoId}`);
  return {
    operation: "DeleteItem",
    key: {
      todoId: util.dynamodb.toDynamoDB(todoId),
    },
  };
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    util.appendError(error.message, error.type);
  }
  return result;
}
