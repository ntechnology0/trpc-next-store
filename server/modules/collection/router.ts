import { TRPCError, router } from "@trpc/server";
import { Context } from "@server/context";
import {
  createCollectionSchema,
  listCollectionSchema,
} from "@server/common/validation/collection";
import useAccount from "@server/common/hooks/useAccount";
import database from "@db/index";
import slugify from "slugify";

export const collectionRouter = router<Context>()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("create", {
    input: createCollectionSchema,
    resolve: async ({ input, ctx }) => {
      const account = await useAccount(ctx.session?.user?.email!);
      const { description, name, picture } = input;

      const collection = await database?.collection.create({
        data: {
          slug: slugify(name.toLowerCase()),
          description: description,
          name: name,
          picture: picture,
          status: "archived",
          organization: { connect: { id: account?.organizations[0].id } },
        },
      });

      return {
        status: 201,
        message: "COLLECTION_CREATED_SUCCESSFULLY",
        result: collection ? collection : null,
      };
    },
  })
  .query("list", {
    input: listCollectionSchema,
    resolve: async ({ input, ctx }) => {
      const account = await useAccount(ctx.session?.user?.email!);
      const _limit = input.limit ?? 10;
      const { cursor: _cursor, orderBy: _orderBy } = input;

      const collections = await database?.collection.findMany({
        include: {
          organization: true,
        },
        take: _limit + 10,
        skip: 0,
        where: {
          organization: { id: account?.organizations[0].id },
          status: input.status,
        },
        cursor: _cursor ? { id: _cursor } : undefined,
        orderBy: { createdAt: _orderBy },
      });

      let _nextCursor: typeof _cursor | undefined = undefined;
      if (collections && collections?.length > _limit) {
        const _nextItem = collections.pop();
        _nextCursor = _nextItem?.id;
      }

      return {
        collections: collections?.reverse(),
        cursor: _nextCursor,
      };
    },
  });

export type CollectionRouter = typeof collectionRouter;
