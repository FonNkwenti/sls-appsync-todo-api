import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { todoId } = ctx.args;
  return {
    operation: "GetItem",
    key: {
      todoId: util.dynamodb.toDynamoDB(ctx.args.todoId),
    },
  };
}

export function response(ctx) {
  return ctx.result;
}
