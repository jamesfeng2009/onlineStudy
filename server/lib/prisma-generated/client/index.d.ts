
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Language
 * 
 */
export type Language = $Result.DefaultSelection<Prisma.$LanguagePayload>
/**
 * Model Course
 * 
 */
export type Course = $Result.DefaultSelection<Prisma.$CoursePayload>
/**
 * Model WordBank
 * 
 */
export type WordBank = $Result.DefaultSelection<Prisma.$WordBankPayload>
/**
 * Model Quiz
 * 
 */
export type Quiz = $Result.DefaultSelection<Prisma.$QuizPayload>
/**
 * Model Listening
 * 
 */
export type Listening = $Result.DefaultSelection<Prisma.$ListeningPayload>
/**
 * Model Speaking
 * 
 */
export type Speaking = $Result.DefaultSelection<Prisma.$SpeakingPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserProgressDay
 * 
 */
export type UserProgressDay = $Result.DefaultSelection<Prisma.$UserProgressDayPayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model LikePost
 * 
 */
export type LikePost = $Result.DefaultSelection<Prisma.$LikePostPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model StripeEvent
 * 
 */
export type StripeEvent = $Result.DefaultSelection<Prisma.$StripeEventPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Languages
 * const languages = await prisma.language.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Languages
   * const languages = await prisma.language.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.language`: Exposes CRUD operations for the **Language** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Languages
    * const languages = await prisma.language.findMany()
    * ```
    */
  get language(): Prisma.LanguageDelegate<ExtArgs>;

  /**
   * `prisma.course`: Exposes CRUD operations for the **Course** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courses
    * const courses = await prisma.course.findMany()
    * ```
    */
  get course(): Prisma.CourseDelegate<ExtArgs>;

  /**
   * `prisma.wordBank`: Exposes CRUD operations for the **WordBank** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WordBanks
    * const wordBanks = await prisma.wordBank.findMany()
    * ```
    */
  get wordBank(): Prisma.WordBankDelegate<ExtArgs>;

  /**
   * `prisma.quiz`: Exposes CRUD operations for the **Quiz** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quizzes
    * const quizzes = await prisma.quiz.findMany()
    * ```
    */
  get quiz(): Prisma.QuizDelegate<ExtArgs>;

  /**
   * `prisma.listening`: Exposes CRUD operations for the **Listening** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Listenings
    * const listenings = await prisma.listening.findMany()
    * ```
    */
  get listening(): Prisma.ListeningDelegate<ExtArgs>;

  /**
   * `prisma.speaking`: Exposes CRUD operations for the **Speaking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Speakings
    * const speakings = await prisma.speaking.findMany()
    * ```
    */
  get speaking(): Prisma.SpeakingDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.userProgressDay`: Exposes CRUD operations for the **UserProgressDay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProgressDays
    * const userProgressDays = await prisma.userProgressDay.findMany()
    * ```
    */
  get userProgressDay(): Prisma.UserProgressDayDelegate<ExtArgs>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs>;

  /**
   * `prisma.likePost`: Exposes CRUD operations for the **LikePost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LikePosts
    * const likePosts = await prisma.likePost.findMany()
    * ```
    */
  get likePost(): Prisma.LikePostDelegate<ExtArgs>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.stripeEvent`: Exposes CRUD operations for the **StripeEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StripeEvents
    * const stripeEvents = await prisma.stripeEvent.findMany()
    * ```
    */
  get stripeEvent(): Prisma.StripeEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Language: 'Language',
    Course: 'Course',
    WordBank: 'WordBank',
    Quiz: 'Quiz',
    Listening: 'Listening',
    Speaking: 'Speaking',
    User: 'User',
    UserProgressDay: 'UserProgressDay',
    Post: 'Post',
    LikePost: 'LikePost',
    Comment: 'Comment',
    Subscription: 'Subscription',
    StripeEvent: 'StripeEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "language" | "course" | "wordBank" | "quiz" | "listening" | "speaking" | "user" | "userProgressDay" | "post" | "likePost" | "comment" | "subscription" | "stripeEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Language: {
        payload: Prisma.$LanguagePayload<ExtArgs>
        fields: Prisma.LanguageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LanguageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LanguageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findFirst: {
            args: Prisma.LanguageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LanguageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findMany: {
            args: Prisma.LanguageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          create: {
            args: Prisma.LanguageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          createMany: {
            args: Prisma.LanguageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LanguageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          delete: {
            args: Prisma.LanguageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          update: {
            args: Prisma.LanguageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          deleteMany: {
            args: Prisma.LanguageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LanguageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LanguageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          aggregate: {
            args: Prisma.LanguageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLanguage>
          }
          groupBy: {
            args: Prisma.LanguageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LanguageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LanguageCountArgs<ExtArgs>
            result: $Utils.Optional<LanguageCountAggregateOutputType> | number
          }
        }
      }
      Course: {
        payload: Prisma.$CoursePayload<ExtArgs>
        fields: Prisma.CourseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findFirst: {
            args: Prisma.CourseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findMany: {
            args: Prisma.CourseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          create: {
            args: Prisma.CourseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          createMany: {
            args: Prisma.CourseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          delete: {
            args: Prisma.CourseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          update: {
            args: Prisma.CourseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          deleteMany: {
            args: Prisma.CourseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CourseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          aggregate: {
            args: Prisma.CourseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourse>
          }
          groupBy: {
            args: Prisma.CourseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseCountArgs<ExtArgs>
            result: $Utils.Optional<CourseCountAggregateOutputType> | number
          }
        }
      }
      WordBank: {
        payload: Prisma.$WordBankPayload<ExtArgs>
        fields: Prisma.WordBankFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WordBankFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WordBankFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          findFirst: {
            args: Prisma.WordBankFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WordBankFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          findMany: {
            args: Prisma.WordBankFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>[]
          }
          create: {
            args: Prisma.WordBankCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          createMany: {
            args: Prisma.WordBankCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WordBankCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>[]
          }
          delete: {
            args: Prisma.WordBankDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          update: {
            args: Prisma.WordBankUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          deleteMany: {
            args: Prisma.WordBankDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WordBankUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WordBankUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WordBankPayload>
          }
          aggregate: {
            args: Prisma.WordBankAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWordBank>
          }
          groupBy: {
            args: Prisma.WordBankGroupByArgs<ExtArgs>
            result: $Utils.Optional<WordBankGroupByOutputType>[]
          }
          count: {
            args: Prisma.WordBankCountArgs<ExtArgs>
            result: $Utils.Optional<WordBankCountAggregateOutputType> | number
          }
        }
      }
      Quiz: {
        payload: Prisma.$QuizPayload<ExtArgs>
        fields: Prisma.QuizFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findFirst: {
            args: Prisma.QuizFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findMany: {
            args: Prisma.QuizFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          create: {
            args: Prisma.QuizCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          createMany: {
            args: Prisma.QuizCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          delete: {
            args: Prisma.QuizDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          update: {
            args: Prisma.QuizUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          deleteMany: {
            args: Prisma.QuizDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuizUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          aggregate: {
            args: Prisma.QuizAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuiz>
          }
          groupBy: {
            args: Prisma.QuizGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizCountArgs<ExtArgs>
            result: $Utils.Optional<QuizCountAggregateOutputType> | number
          }
        }
      }
      Listening: {
        payload: Prisma.$ListeningPayload<ExtArgs>
        fields: Prisma.ListeningFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListeningFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListeningFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          findFirst: {
            args: Prisma.ListeningFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListeningFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          findMany: {
            args: Prisma.ListeningFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>[]
          }
          create: {
            args: Prisma.ListeningCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          createMany: {
            args: Prisma.ListeningCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListeningCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>[]
          }
          delete: {
            args: Prisma.ListeningDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          update: {
            args: Prisma.ListeningUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          deleteMany: {
            args: Prisma.ListeningDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListeningUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ListeningUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListeningPayload>
          }
          aggregate: {
            args: Prisma.ListeningAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListening>
          }
          groupBy: {
            args: Prisma.ListeningGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListeningGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListeningCountArgs<ExtArgs>
            result: $Utils.Optional<ListeningCountAggregateOutputType> | number
          }
        }
      }
      Speaking: {
        payload: Prisma.$SpeakingPayload<ExtArgs>
        fields: Prisma.SpeakingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpeakingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpeakingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          findFirst: {
            args: Prisma.SpeakingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpeakingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          findMany: {
            args: Prisma.SpeakingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>[]
          }
          create: {
            args: Prisma.SpeakingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          createMany: {
            args: Prisma.SpeakingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpeakingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>[]
          }
          delete: {
            args: Prisma.SpeakingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          update: {
            args: Prisma.SpeakingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          deleteMany: {
            args: Prisma.SpeakingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpeakingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SpeakingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingPayload>
          }
          aggregate: {
            args: Prisma.SpeakingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpeaking>
          }
          groupBy: {
            args: Prisma.SpeakingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpeakingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpeakingCountArgs<ExtArgs>
            result: $Utils.Optional<SpeakingCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserProgressDay: {
        payload: Prisma.$UserProgressDayPayload<ExtArgs>
        fields: Prisma.UserProgressDayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProgressDayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProgressDayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          findFirst: {
            args: Prisma.UserProgressDayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProgressDayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          findMany: {
            args: Prisma.UserProgressDayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>[]
          }
          create: {
            args: Prisma.UserProgressDayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          createMany: {
            args: Prisma.UserProgressDayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProgressDayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>[]
          }
          delete: {
            args: Prisma.UserProgressDayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          update: {
            args: Prisma.UserProgressDayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          deleteMany: {
            args: Prisma.UserProgressDayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProgressDayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserProgressDayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressDayPayload>
          }
          aggregate: {
            args: Prisma.UserProgressDayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProgressDay>
          }
          groupBy: {
            args: Prisma.UserProgressDayGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProgressDayGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProgressDayCountArgs<ExtArgs>
            result: $Utils.Optional<UserProgressDayCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      LikePost: {
        payload: Prisma.$LikePostPayload<ExtArgs>
        fields: Prisma.LikePostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LikePostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LikePostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          findFirst: {
            args: Prisma.LikePostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LikePostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          findMany: {
            args: Prisma.LikePostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>[]
          }
          create: {
            args: Prisma.LikePostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          createMany: {
            args: Prisma.LikePostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LikePostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>[]
          }
          delete: {
            args: Prisma.LikePostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          update: {
            args: Prisma.LikePostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          deleteMany: {
            args: Prisma.LikePostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LikePostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LikePostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePostPayload>
          }
          aggregate: {
            args: Prisma.LikePostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLikePost>
          }
          groupBy: {
            args: Prisma.LikePostGroupByArgs<ExtArgs>
            result: $Utils.Optional<LikePostGroupByOutputType>[]
          }
          count: {
            args: Prisma.LikePostCountArgs<ExtArgs>
            result: $Utils.Optional<LikePostCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      StripeEvent: {
        payload: Prisma.$StripeEventPayload<ExtArgs>
        fields: Prisma.StripeEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StripeEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StripeEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          findFirst: {
            args: Prisma.StripeEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StripeEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          findMany: {
            args: Prisma.StripeEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>[]
          }
          create: {
            args: Prisma.StripeEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          createMany: {
            args: Prisma.StripeEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StripeEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>[]
          }
          delete: {
            args: Prisma.StripeEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          update: {
            args: Prisma.StripeEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          deleteMany: {
            args: Prisma.StripeEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StripeEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StripeEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          aggregate: {
            args: Prisma.StripeEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStripeEvent>
          }
          groupBy: {
            args: Prisma.StripeEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<StripeEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.StripeEventCountArgs<ExtArgs>
            result: $Utils.Optional<StripeEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LanguageCountOutputType
   */

  export type LanguageCountOutputType = {
    courses: number
    wordBank: number
    quizzes: number
    listening: number
    speaking: number
    users: number
  }

  export type LanguageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | LanguageCountOutputTypeCountCoursesArgs
    wordBank?: boolean | LanguageCountOutputTypeCountWordBankArgs
    quizzes?: boolean | LanguageCountOutputTypeCountQuizzesArgs
    listening?: boolean | LanguageCountOutputTypeCountListeningArgs
    speaking?: boolean | LanguageCountOutputTypeCountSpeakingArgs
    users?: boolean | LanguageCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LanguageCountOutputType
     */
    select?: LanguageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountCoursesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountWordBankArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WordBankWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountQuizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountListeningArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListeningWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountSpeakingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakingWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    progressDays: number
    posts: number
    likedPosts: number
    comments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progressDays?: boolean | UserCountOutputTypeCountProgressDaysArgs
    posts?: boolean | UserCountOutputTypeCountPostsArgs
    likedPosts?: boolean | UserCountOutputTypeCountLikedPostsArgs
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProgressDaysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressDayWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLikedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikePostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    likes: number
    comments: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | PostCountOutputTypeCountLikesArgs
    comments?: boolean | PostCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikePostWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Language
   */

  export type AggregateLanguage = {
    _count: LanguageCountAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  export type LanguageMinAggregateOutputType = {
    code: string | null
    name: string | null
    native: string | null
    flag: string | null
    tagline: string | null
    status: string | null
  }

  export type LanguageMaxAggregateOutputType = {
    code: string | null
    name: string | null
    native: string | null
    flag: string | null
    tagline: string | null
    status: string | null
  }

  export type LanguageCountAggregateOutputType = {
    code: number
    name: number
    native: number
    flag: number
    tagline: number
    levels: number
    status: number
    _all: number
  }


  export type LanguageMinAggregateInputType = {
    code?: true
    name?: true
    native?: true
    flag?: true
    tagline?: true
    status?: true
  }

  export type LanguageMaxAggregateInputType = {
    code?: true
    name?: true
    native?: true
    flag?: true
    tagline?: true
    status?: true
  }

  export type LanguageCountAggregateInputType = {
    code?: true
    name?: true
    native?: true
    flag?: true
    tagline?: true
    levels?: true
    status?: true
    _all?: true
  }

  export type LanguageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Language to aggregate.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Languages
    **/
    _count?: true | LanguageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LanguageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LanguageMaxAggregateInputType
  }

  export type GetLanguageAggregateType<T extends LanguageAggregateArgs> = {
        [P in keyof T & keyof AggregateLanguage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLanguage[P]>
      : GetScalarType<T[P], AggregateLanguage[P]>
  }




  export type LanguageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LanguageWhereInput
    orderBy?: LanguageOrderByWithAggregationInput | LanguageOrderByWithAggregationInput[]
    by: LanguageScalarFieldEnum[] | LanguageScalarFieldEnum
    having?: LanguageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LanguageCountAggregateInputType | true
    _min?: LanguageMinAggregateInputType
    _max?: LanguageMaxAggregateInputType
  }

  export type LanguageGroupByOutputType = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonValue
    status: string
    _count: LanguageCountAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  type GetLanguageGroupByPayload<T extends LanguageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LanguageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LanguageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LanguageGroupByOutputType[P]>
            : GetScalarType<T[P], LanguageGroupByOutputType[P]>
        }
      >
    >


  export type LanguageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    native?: boolean
    flag?: boolean
    tagline?: boolean
    levels?: boolean
    status?: boolean
    courses?: boolean | Language$coursesArgs<ExtArgs>
    wordBank?: boolean | Language$wordBankArgs<ExtArgs>
    quizzes?: boolean | Language$quizzesArgs<ExtArgs>
    listening?: boolean | Language$listeningArgs<ExtArgs>
    speaking?: boolean | Language$speakingArgs<ExtArgs>
    users?: boolean | Language$usersArgs<ExtArgs>
    _count?: boolean | LanguageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    native?: boolean
    flag?: boolean
    tagline?: boolean
    levels?: boolean
    status?: boolean
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectScalar = {
    code?: boolean
    name?: boolean
    native?: boolean
    flag?: boolean
    tagline?: boolean
    levels?: boolean
    status?: boolean
  }

  export type LanguageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | Language$coursesArgs<ExtArgs>
    wordBank?: boolean | Language$wordBankArgs<ExtArgs>
    quizzes?: boolean | Language$quizzesArgs<ExtArgs>
    listening?: boolean | Language$listeningArgs<ExtArgs>
    speaking?: boolean | Language$speakingArgs<ExtArgs>
    users?: boolean | Language$usersArgs<ExtArgs>
    _count?: boolean | LanguageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LanguageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LanguagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Language"
    objects: {
      courses: Prisma.$CoursePayload<ExtArgs>[]
      wordBank: Prisma.$WordBankPayload<ExtArgs>[]
      quizzes: Prisma.$QuizPayload<ExtArgs>[]
      listening: Prisma.$ListeningPayload<ExtArgs>[]
      speaking: Prisma.$SpeakingPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      code: string
      name: string
      native: string
      flag: string
      tagline: string
      levels: Prisma.JsonValue
      status: string
    }, ExtArgs["result"]["language"]>
    composites: {}
  }

  type LanguageGetPayload<S extends boolean | null | undefined | LanguageDefaultArgs> = $Result.GetResult<Prisma.$LanguagePayload, S>

  type LanguageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LanguageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LanguageCountAggregateInputType | true
    }

  export interface LanguageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Language'], meta: { name: 'Language' } }
    /**
     * Find zero or one Language that matches the filter.
     * @param {LanguageFindUniqueArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LanguageFindUniqueArgs>(args: SelectSubset<T, LanguageFindUniqueArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Language that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LanguageFindUniqueOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LanguageFindUniqueOrThrowArgs>(args: SelectSubset<T, LanguageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Language that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LanguageFindFirstArgs>(args?: SelectSubset<T, LanguageFindFirstArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Language that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LanguageFindFirstOrThrowArgs>(args?: SelectSubset<T, LanguageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Languages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Languages
     * const languages = await prisma.language.findMany()
     * 
     * // Get first 10 Languages
     * const languages = await prisma.language.findMany({ take: 10 })
     * 
     * // Only select the `code`
     * const languageWithCodeOnly = await prisma.language.findMany({ select: { code: true } })
     * 
     */
    findMany<T extends LanguageFindManyArgs>(args?: SelectSubset<T, LanguageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Language.
     * @param {LanguageCreateArgs} args - Arguments to create a Language.
     * @example
     * // Create one Language
     * const Language = await prisma.language.create({
     *   data: {
     *     // ... data to create a Language
     *   }
     * })
     * 
     */
    create<T extends LanguageCreateArgs>(args: SelectSubset<T, LanguageCreateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Languages.
     * @param {LanguageCreateManyArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LanguageCreateManyArgs>(args?: SelectSubset<T, LanguageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Languages and returns the data saved in the database.
     * @param {LanguageCreateManyAndReturnArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Languages and only return the `code`
     * const languageWithCodeOnly = await prisma.language.createManyAndReturn({ 
     *   select: { code: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LanguageCreateManyAndReturnArgs>(args?: SelectSubset<T, LanguageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Language.
     * @param {LanguageDeleteArgs} args - Arguments to delete one Language.
     * @example
     * // Delete one Language
     * const Language = await prisma.language.delete({
     *   where: {
     *     // ... filter to delete one Language
     *   }
     * })
     * 
     */
    delete<T extends LanguageDeleteArgs>(args: SelectSubset<T, LanguageDeleteArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Language.
     * @param {LanguageUpdateArgs} args - Arguments to update one Language.
     * @example
     * // Update one Language
     * const language = await prisma.language.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LanguageUpdateArgs>(args: SelectSubset<T, LanguageUpdateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Languages.
     * @param {LanguageDeleteManyArgs} args - Arguments to filter Languages to delete.
     * @example
     * // Delete a few Languages
     * const { count } = await prisma.language.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LanguageDeleteManyArgs>(args?: SelectSubset<T, LanguageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Languages
     * const language = await prisma.language.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LanguageUpdateManyArgs>(args: SelectSubset<T, LanguageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Language.
     * @param {LanguageUpsertArgs} args - Arguments to update or create a Language.
     * @example
     * // Update or create a Language
     * const language = await prisma.language.upsert({
     *   create: {
     *     // ... data to create a Language
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Language we want to update
     *   }
     * })
     */
    upsert<T extends LanguageUpsertArgs>(args: SelectSubset<T, LanguageUpsertArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageCountArgs} args - Arguments to filter Languages to count.
     * @example
     * // Count the number of Languages
     * const count = await prisma.language.count({
     *   where: {
     *     // ... the filter for the Languages we want to count
     *   }
     * })
    **/
    count<T extends LanguageCountArgs>(
      args?: Subset<T, LanguageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LanguageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LanguageAggregateArgs>(args: Subset<T, LanguageAggregateArgs>): Prisma.PrismaPromise<GetLanguageAggregateType<T>>

    /**
     * Group by Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LanguageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LanguageGroupByArgs['orderBy'] }
        : { orderBy?: LanguageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LanguageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLanguageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Language model
   */
  readonly fields: LanguageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Language.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LanguageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courses<T extends Language$coursesArgs<ExtArgs> = {}>(args?: Subset<T, Language$coursesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany"> | Null>
    wordBank<T extends Language$wordBankArgs<ExtArgs> = {}>(args?: Subset<T, Language$wordBankArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findMany"> | Null>
    quizzes<T extends Language$quizzesArgs<ExtArgs> = {}>(args?: Subset<T, Language$quizzesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany"> | Null>
    listening<T extends Language$listeningArgs<ExtArgs> = {}>(args?: Subset<T, Language$listeningArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findMany"> | Null>
    speaking<T extends Language$speakingArgs<ExtArgs> = {}>(args?: Subset<T, Language$speakingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findMany"> | Null>
    users<T extends Language$usersArgs<ExtArgs> = {}>(args?: Subset<T, Language$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Language model
   */ 
  interface LanguageFieldRefs {
    readonly code: FieldRef<"Language", 'String'>
    readonly name: FieldRef<"Language", 'String'>
    readonly native: FieldRef<"Language", 'String'>
    readonly flag: FieldRef<"Language", 'String'>
    readonly tagline: FieldRef<"Language", 'String'>
    readonly levels: FieldRef<"Language", 'Json'>
    readonly status: FieldRef<"Language", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Language findUnique
   */
  export type LanguageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findUniqueOrThrow
   */
  export type LanguageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findFirst
   */
  export type LanguageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findFirstOrThrow
   */
  export type LanguageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findMany
   */
  export type LanguageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Languages to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language create
   */
  export type LanguageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to create a Language.
     */
    data: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
  }

  /**
   * Language createMany
   */
  export type LanguageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Language createManyAndReturn
   */
  export type LanguageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Language update
   */
  export type LanguageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to update a Language.
     */
    data: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
    /**
     * Choose, which Language to update.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language updateMany
   */
  export type LanguageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Languages.
     */
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyInput>
    /**
     * Filter which Languages to update
     */
    where?: LanguageWhereInput
  }

  /**
   * Language upsert
   */
  export type LanguageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The filter to search for the Language to update in case it exists.
     */
    where: LanguageWhereUniqueInput
    /**
     * In case the Language found by the `where` argument doesn't exist, create a new Language with this data.
     */
    create: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
    /**
     * In case the Language was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
  }

  /**
   * Language delete
   */
  export type LanguageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter which Language to delete.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language deleteMany
   */
  export type LanguageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Languages to delete
     */
    where?: LanguageWhereInput
  }

  /**
   * Language.courses
   */
  export type Language$coursesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    where?: CourseWhereInput
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    cursor?: CourseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Language.wordBank
   */
  export type Language$wordBankArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    where?: WordBankWhereInput
    orderBy?: WordBankOrderByWithRelationInput | WordBankOrderByWithRelationInput[]
    cursor?: WordBankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WordBankScalarFieldEnum | WordBankScalarFieldEnum[]
  }

  /**
   * Language.quizzes
   */
  export type Language$quizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    cursor?: QuizWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Language.listening
   */
  export type Language$listeningArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    where?: ListeningWhereInput
    orderBy?: ListeningOrderByWithRelationInput | ListeningOrderByWithRelationInput[]
    cursor?: ListeningWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ListeningScalarFieldEnum | ListeningScalarFieldEnum[]
  }

  /**
   * Language.speaking
   */
  export type Language$speakingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    where?: SpeakingWhereInput
    orderBy?: SpeakingOrderByWithRelationInput | SpeakingOrderByWithRelationInput[]
    cursor?: SpeakingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpeakingScalarFieldEnum | SpeakingScalarFieldEnum[]
  }

  /**
   * Language.users
   */
  export type Language$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Language without action
   */
  export type LanguageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
  }


  /**
   * Model Course
   */

  export type AggregateCourse = {
    _count: CourseCountAggregateOutputType | null
    _avg: CourseAvgAggregateOutputType | null
    _sum: CourseSumAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  export type CourseAvgAggregateOutputType = {
    lessons: number | null
    minutes: number | null
    courseOrder: number | null
  }

  export type CourseSumAggregateOutputType = {
    lessons: number | null
    minutes: number | null
    courseOrder: number | null
  }

  export type CourseMinAggregateOutputType = {
    id: string | null
    languageCode: string | null
    title: string | null
    level: string | null
    levelGroup: string | null
    description: string | null
    lessons: number | null
    minutes: number | null
    cover: string | null
    vipOnly: boolean | null
    courseOrder: number | null
  }

  export type CourseMaxAggregateOutputType = {
    id: string | null
    languageCode: string | null
    title: string | null
    level: string | null
    levelGroup: string | null
    description: string | null
    lessons: number | null
    minutes: number | null
    cover: string | null
    vipOnly: boolean | null
    courseOrder: number | null
  }

  export type CourseCountAggregateOutputType = {
    id: number
    languageCode: number
    title: number
    level: number
    levelGroup: number
    description: number
    lessons: number
    minutes: number
    cover: number
    tags: number
    vipOnly: number
    courseOrder: number
    _all: number
  }


  export type CourseAvgAggregateInputType = {
    lessons?: true
    minutes?: true
    courseOrder?: true
  }

  export type CourseSumAggregateInputType = {
    lessons?: true
    minutes?: true
    courseOrder?: true
  }

  export type CourseMinAggregateInputType = {
    id?: true
    languageCode?: true
    title?: true
    level?: true
    levelGroup?: true
    description?: true
    lessons?: true
    minutes?: true
    cover?: true
    vipOnly?: true
    courseOrder?: true
  }

  export type CourseMaxAggregateInputType = {
    id?: true
    languageCode?: true
    title?: true
    level?: true
    levelGroup?: true
    description?: true
    lessons?: true
    minutes?: true
    cover?: true
    vipOnly?: true
    courseOrder?: true
  }

  export type CourseCountAggregateInputType = {
    id?: true
    languageCode?: true
    title?: true
    level?: true
    levelGroup?: true
    description?: true
    lessons?: true
    minutes?: true
    cover?: true
    tags?: true
    vipOnly?: true
    courseOrder?: true
    _all?: true
  }

  export type CourseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Course to aggregate.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Courses
    **/
    _count?: true | CourseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CourseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CourseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseMaxAggregateInputType
  }

  export type GetCourseAggregateType<T extends CourseAggregateArgs> = {
        [P in keyof T & keyof AggregateCourse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourse[P]>
      : GetScalarType<T[P], AggregateCourse[P]>
  }




  export type CourseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseWhereInput
    orderBy?: CourseOrderByWithAggregationInput | CourseOrderByWithAggregationInput[]
    by: CourseScalarFieldEnum[] | CourseScalarFieldEnum
    having?: CourseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseCountAggregateInputType | true
    _avg?: CourseAvgAggregateInputType
    _sum?: CourseSumAggregateInputType
    _min?: CourseMinAggregateInputType
    _max?: CourseMaxAggregateInputType
  }

  export type CourseGroupByOutputType = {
    id: string
    languageCode: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonValue
    vipOnly: boolean
    courseOrder: number
    _count: CourseCountAggregateOutputType | null
    _avg: CourseAvgAggregateOutputType | null
    _sum: CourseSumAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  type GetCourseGroupByPayload<T extends CourseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseGroupByOutputType[P]>
            : GetScalarType<T[P], CourseGroupByOutputType[P]>
        }
      >
    >


  export type CourseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    title?: boolean
    level?: boolean
    levelGroup?: boolean
    description?: boolean
    lessons?: boolean
    minutes?: boolean
    cover?: boolean
    tags?: boolean
    vipOnly?: boolean
    courseOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["course"]>

  export type CourseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    title?: boolean
    level?: boolean
    levelGroup?: boolean
    description?: boolean
    lessons?: boolean
    minutes?: boolean
    cover?: boolean
    tags?: boolean
    vipOnly?: boolean
    courseOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["course"]>

  export type CourseSelectScalar = {
    id?: boolean
    languageCode?: boolean
    title?: boolean
    level?: boolean
    levelGroup?: boolean
    description?: boolean
    lessons?: boolean
    minutes?: boolean
    cover?: boolean
    tags?: boolean
    vipOnly?: boolean
    courseOrder?: boolean
  }

  export type CourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type CourseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $CoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Course"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      languageCode: string
      title: string
      level: string
      levelGroup: string
      description: string
      lessons: number
      minutes: number
      cover: string
      tags: Prisma.JsonValue
      vipOnly: boolean
      courseOrder: number
    }, ExtArgs["result"]["course"]>
    composites: {}
  }

  type CourseGetPayload<S extends boolean | null | undefined | CourseDefaultArgs> = $Result.GetResult<Prisma.$CoursePayload, S>

  type CourseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CourseFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CourseCountAggregateInputType | true
    }

  export interface CourseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Course'], meta: { name: 'Course' } }
    /**
     * Find zero or one Course that matches the filter.
     * @param {CourseFindUniqueArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseFindUniqueArgs>(args: SelectSubset<T, CourseFindUniqueArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Course that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CourseFindUniqueOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Course that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseFindFirstArgs>(args?: SelectSubset<T, CourseFindFirstArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Course that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courses
     * const courses = await prisma.course.findMany()
     * 
     * // Get first 10 Courses
     * const courses = await prisma.course.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseWithIdOnly = await prisma.course.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseFindManyArgs>(args?: SelectSubset<T, CourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Course.
     * @param {CourseCreateArgs} args - Arguments to create a Course.
     * @example
     * // Create one Course
     * const Course = await prisma.course.create({
     *   data: {
     *     // ... data to create a Course
     *   }
     * })
     * 
     */
    create<T extends CourseCreateArgs>(args: SelectSubset<T, CourseCreateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Courses.
     * @param {CourseCreateManyArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseCreateManyArgs>(args?: SelectSubset<T, CourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courses and returns the data saved in the database.
     * @param {CourseCreateManyAndReturnArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Course.
     * @param {CourseDeleteArgs} args - Arguments to delete one Course.
     * @example
     * // Delete one Course
     * const Course = await prisma.course.delete({
     *   where: {
     *     // ... filter to delete one Course
     *   }
     * })
     * 
     */
    delete<T extends CourseDeleteArgs>(args: SelectSubset<T, CourseDeleteArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Course.
     * @param {CourseUpdateArgs} args - Arguments to update one Course.
     * @example
     * // Update one Course
     * const course = await prisma.course.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseUpdateArgs>(args: SelectSubset<T, CourseUpdateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Courses.
     * @param {CourseDeleteManyArgs} args - Arguments to filter Courses to delete.
     * @example
     * // Delete a few Courses
     * const { count } = await prisma.course.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseDeleteManyArgs>(args?: SelectSubset<T, CourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseUpdateManyArgs>(args: SelectSubset<T, CourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Course.
     * @param {CourseUpsertArgs} args - Arguments to update or create a Course.
     * @example
     * // Update or create a Course
     * const course = await prisma.course.upsert({
     *   create: {
     *     // ... data to create a Course
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Course we want to update
     *   }
     * })
     */
    upsert<T extends CourseUpsertArgs>(args: SelectSubset<T, CourseUpsertArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseCountArgs} args - Arguments to filter Courses to count.
     * @example
     * // Count the number of Courses
     * const count = await prisma.course.count({
     *   where: {
     *     // ... the filter for the Courses we want to count
     *   }
     * })
    **/
    count<T extends CourseCountArgs>(
      args?: Subset<T, CourseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CourseAggregateArgs>(args: Subset<T, CourseAggregateArgs>): Prisma.PrismaPromise<GetCourseAggregateType<T>>

    /**
     * Group by Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CourseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseGroupByArgs['orderBy'] }
        : { orderBy?: CourseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Course model
   */
  readonly fields: CourseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Course.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Course model
   */ 
  interface CourseFieldRefs {
    readonly id: FieldRef<"Course", 'String'>
    readonly languageCode: FieldRef<"Course", 'String'>
    readonly title: FieldRef<"Course", 'String'>
    readonly level: FieldRef<"Course", 'String'>
    readonly levelGroup: FieldRef<"Course", 'String'>
    readonly description: FieldRef<"Course", 'String'>
    readonly lessons: FieldRef<"Course", 'Int'>
    readonly minutes: FieldRef<"Course", 'Int'>
    readonly cover: FieldRef<"Course", 'String'>
    readonly tags: FieldRef<"Course", 'Json'>
    readonly vipOnly: FieldRef<"Course", 'Boolean'>
    readonly courseOrder: FieldRef<"Course", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Course findUnique
   */
  export type CourseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findUniqueOrThrow
   */
  export type CourseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findFirst
   */
  export type CourseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findFirstOrThrow
   */
  export type CourseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findMany
   */
  export type CourseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Courses to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course create
   */
  export type CourseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to create a Course.
     */
    data: XOR<CourseCreateInput, CourseUncheckedCreateInput>
  }

  /**
   * Course createMany
   */
  export type CourseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Course createManyAndReturn
   */
  export type CourseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Course update
   */
  export type CourseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to update a Course.
     */
    data: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
    /**
     * Choose, which Course to update.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course updateMany
   */
  export type CourseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
  }

  /**
   * Course upsert
   */
  export type CourseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The filter to search for the Course to update in case it exists.
     */
    where: CourseWhereUniqueInput
    /**
     * In case the Course found by the `where` argument doesn't exist, create a new Course with this data.
     */
    create: XOR<CourseCreateInput, CourseUncheckedCreateInput>
    /**
     * In case the Course was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
  }

  /**
   * Course delete
   */
  export type CourseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter which Course to delete.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course deleteMany
   */
  export type CourseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Courses to delete
     */
    where?: CourseWhereInput
  }

  /**
   * Course without action
   */
  export type CourseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
  }


  /**
   * Model WordBank
   */

  export type AggregateWordBank = {
    _count: WordBankCountAggregateOutputType | null
    _avg: WordBankAvgAggregateOutputType | null
    _sum: WordBankSumAggregateOutputType | null
    _min: WordBankMinAggregateOutputType | null
    _max: WordBankMaxAggregateOutputType | null
  }

  export type WordBankAvgAggregateOutputType = {
    vocabOrder: number | null
  }

  export type WordBankSumAggregateOutputType = {
    vocabOrder: number | null
  }

  export type WordBankMinAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    word: string | null
    translation: string | null
    phonetic: string | null
    exampleSentence: string | null
    vocabOrder: number | null
  }

  export type WordBankMaxAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    word: string | null
    translation: string | null
    phonetic: string | null
    exampleSentence: string | null
    vocabOrder: number | null
  }

  export type WordBankCountAggregateOutputType = {
    id: number
    languageCode: number
    level: number
    word: number
    translation: number
    phonetic: number
    exampleSentence: number
    vocabOrder: number
    _all: number
  }


  export type WordBankAvgAggregateInputType = {
    vocabOrder?: true
  }

  export type WordBankSumAggregateInputType = {
    vocabOrder?: true
  }

  export type WordBankMinAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    word?: true
    translation?: true
    phonetic?: true
    exampleSentence?: true
    vocabOrder?: true
  }

  export type WordBankMaxAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    word?: true
    translation?: true
    phonetic?: true
    exampleSentence?: true
    vocabOrder?: true
  }

  export type WordBankCountAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    word?: true
    translation?: true
    phonetic?: true
    exampleSentence?: true
    vocabOrder?: true
    _all?: true
  }

  export type WordBankAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WordBank to aggregate.
     */
    where?: WordBankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WordBanks to fetch.
     */
    orderBy?: WordBankOrderByWithRelationInput | WordBankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WordBankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WordBanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WordBanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WordBanks
    **/
    _count?: true | WordBankCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WordBankAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WordBankSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WordBankMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WordBankMaxAggregateInputType
  }

  export type GetWordBankAggregateType<T extends WordBankAggregateArgs> = {
        [P in keyof T & keyof AggregateWordBank]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWordBank[P]>
      : GetScalarType<T[P], AggregateWordBank[P]>
  }




  export type WordBankGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WordBankWhereInput
    orderBy?: WordBankOrderByWithAggregationInput | WordBankOrderByWithAggregationInput[]
    by: WordBankScalarFieldEnum[] | WordBankScalarFieldEnum
    having?: WordBankScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WordBankCountAggregateInputType | true
    _avg?: WordBankAvgAggregateInputType
    _sum?: WordBankSumAggregateInputType
    _min?: WordBankMinAggregateInputType
    _max?: WordBankMaxAggregateInputType
  }

  export type WordBankGroupByOutputType = {
    id: string
    languageCode: string
    level: string
    word: string
    translation: string
    phonetic: string | null
    exampleSentence: string
    vocabOrder: number
    _count: WordBankCountAggregateOutputType | null
    _avg: WordBankAvgAggregateOutputType | null
    _sum: WordBankSumAggregateOutputType | null
    _min: WordBankMinAggregateOutputType | null
    _max: WordBankMaxAggregateOutputType | null
  }

  type GetWordBankGroupByPayload<T extends WordBankGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WordBankGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WordBankGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WordBankGroupByOutputType[P]>
            : GetScalarType<T[P], WordBankGroupByOutputType[P]>
        }
      >
    >


  export type WordBankSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    word?: boolean
    translation?: boolean
    phonetic?: boolean
    exampleSentence?: boolean
    vocabOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wordBank"]>

  export type WordBankSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    word?: boolean
    translation?: boolean
    phonetic?: boolean
    exampleSentence?: boolean
    vocabOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wordBank"]>

  export type WordBankSelectScalar = {
    id?: boolean
    languageCode?: boolean
    level?: boolean
    word?: boolean
    translation?: boolean
    phonetic?: boolean
    exampleSentence?: boolean
    vocabOrder?: boolean
  }

  export type WordBankInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type WordBankIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $WordBankPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WordBank"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      languageCode: string
      level: string
      word: string
      translation: string
      phonetic: string | null
      exampleSentence: string
      vocabOrder: number
    }, ExtArgs["result"]["wordBank"]>
    composites: {}
  }

  type WordBankGetPayload<S extends boolean | null | undefined | WordBankDefaultArgs> = $Result.GetResult<Prisma.$WordBankPayload, S>

  type WordBankCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WordBankFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WordBankCountAggregateInputType | true
    }

  export interface WordBankDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WordBank'], meta: { name: 'WordBank' } }
    /**
     * Find zero or one WordBank that matches the filter.
     * @param {WordBankFindUniqueArgs} args - Arguments to find a WordBank
     * @example
     * // Get one WordBank
     * const wordBank = await prisma.wordBank.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WordBankFindUniqueArgs>(args: SelectSubset<T, WordBankFindUniqueArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WordBank that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WordBankFindUniqueOrThrowArgs} args - Arguments to find a WordBank
     * @example
     * // Get one WordBank
     * const wordBank = await prisma.wordBank.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WordBankFindUniqueOrThrowArgs>(args: SelectSubset<T, WordBankFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WordBank that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankFindFirstArgs} args - Arguments to find a WordBank
     * @example
     * // Get one WordBank
     * const wordBank = await prisma.wordBank.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WordBankFindFirstArgs>(args?: SelectSubset<T, WordBankFindFirstArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WordBank that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankFindFirstOrThrowArgs} args - Arguments to find a WordBank
     * @example
     * // Get one WordBank
     * const wordBank = await prisma.wordBank.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WordBankFindFirstOrThrowArgs>(args?: SelectSubset<T, WordBankFindFirstOrThrowArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WordBanks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WordBanks
     * const wordBanks = await prisma.wordBank.findMany()
     * 
     * // Get first 10 WordBanks
     * const wordBanks = await prisma.wordBank.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wordBankWithIdOnly = await prisma.wordBank.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WordBankFindManyArgs>(args?: SelectSubset<T, WordBankFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WordBank.
     * @param {WordBankCreateArgs} args - Arguments to create a WordBank.
     * @example
     * // Create one WordBank
     * const WordBank = await prisma.wordBank.create({
     *   data: {
     *     // ... data to create a WordBank
     *   }
     * })
     * 
     */
    create<T extends WordBankCreateArgs>(args: SelectSubset<T, WordBankCreateArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WordBanks.
     * @param {WordBankCreateManyArgs} args - Arguments to create many WordBanks.
     * @example
     * // Create many WordBanks
     * const wordBank = await prisma.wordBank.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WordBankCreateManyArgs>(args?: SelectSubset<T, WordBankCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WordBanks and returns the data saved in the database.
     * @param {WordBankCreateManyAndReturnArgs} args - Arguments to create many WordBanks.
     * @example
     * // Create many WordBanks
     * const wordBank = await prisma.wordBank.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WordBanks and only return the `id`
     * const wordBankWithIdOnly = await prisma.wordBank.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WordBankCreateManyAndReturnArgs>(args?: SelectSubset<T, WordBankCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WordBank.
     * @param {WordBankDeleteArgs} args - Arguments to delete one WordBank.
     * @example
     * // Delete one WordBank
     * const WordBank = await prisma.wordBank.delete({
     *   where: {
     *     // ... filter to delete one WordBank
     *   }
     * })
     * 
     */
    delete<T extends WordBankDeleteArgs>(args: SelectSubset<T, WordBankDeleteArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WordBank.
     * @param {WordBankUpdateArgs} args - Arguments to update one WordBank.
     * @example
     * // Update one WordBank
     * const wordBank = await prisma.wordBank.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WordBankUpdateArgs>(args: SelectSubset<T, WordBankUpdateArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WordBanks.
     * @param {WordBankDeleteManyArgs} args - Arguments to filter WordBanks to delete.
     * @example
     * // Delete a few WordBanks
     * const { count } = await prisma.wordBank.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WordBankDeleteManyArgs>(args?: SelectSubset<T, WordBankDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WordBanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WordBanks
     * const wordBank = await prisma.wordBank.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WordBankUpdateManyArgs>(args: SelectSubset<T, WordBankUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WordBank.
     * @param {WordBankUpsertArgs} args - Arguments to update or create a WordBank.
     * @example
     * // Update or create a WordBank
     * const wordBank = await prisma.wordBank.upsert({
     *   create: {
     *     // ... data to create a WordBank
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WordBank we want to update
     *   }
     * })
     */
    upsert<T extends WordBankUpsertArgs>(args: SelectSubset<T, WordBankUpsertArgs<ExtArgs>>): Prisma__WordBankClient<$Result.GetResult<Prisma.$WordBankPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WordBanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankCountArgs} args - Arguments to filter WordBanks to count.
     * @example
     * // Count the number of WordBanks
     * const count = await prisma.wordBank.count({
     *   where: {
     *     // ... the filter for the WordBanks we want to count
     *   }
     * })
    **/
    count<T extends WordBankCountArgs>(
      args?: Subset<T, WordBankCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WordBankCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WordBank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WordBankAggregateArgs>(args: Subset<T, WordBankAggregateArgs>): Prisma.PrismaPromise<GetWordBankAggregateType<T>>

    /**
     * Group by WordBank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WordBankGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WordBankGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WordBankGroupByArgs['orderBy'] }
        : { orderBy?: WordBankGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WordBankGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWordBankGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WordBank model
   */
  readonly fields: WordBankFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WordBank.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WordBankClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WordBank model
   */ 
  interface WordBankFieldRefs {
    readonly id: FieldRef<"WordBank", 'String'>
    readonly languageCode: FieldRef<"WordBank", 'String'>
    readonly level: FieldRef<"WordBank", 'String'>
    readonly word: FieldRef<"WordBank", 'String'>
    readonly translation: FieldRef<"WordBank", 'String'>
    readonly phonetic: FieldRef<"WordBank", 'String'>
    readonly exampleSentence: FieldRef<"WordBank", 'String'>
    readonly vocabOrder: FieldRef<"WordBank", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * WordBank findUnique
   */
  export type WordBankFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter, which WordBank to fetch.
     */
    where: WordBankWhereUniqueInput
  }

  /**
   * WordBank findUniqueOrThrow
   */
  export type WordBankFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter, which WordBank to fetch.
     */
    where: WordBankWhereUniqueInput
  }

  /**
   * WordBank findFirst
   */
  export type WordBankFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter, which WordBank to fetch.
     */
    where?: WordBankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WordBanks to fetch.
     */
    orderBy?: WordBankOrderByWithRelationInput | WordBankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WordBanks.
     */
    cursor?: WordBankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WordBanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WordBanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WordBanks.
     */
    distinct?: WordBankScalarFieldEnum | WordBankScalarFieldEnum[]
  }

  /**
   * WordBank findFirstOrThrow
   */
  export type WordBankFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter, which WordBank to fetch.
     */
    where?: WordBankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WordBanks to fetch.
     */
    orderBy?: WordBankOrderByWithRelationInput | WordBankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WordBanks.
     */
    cursor?: WordBankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WordBanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WordBanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WordBanks.
     */
    distinct?: WordBankScalarFieldEnum | WordBankScalarFieldEnum[]
  }

  /**
   * WordBank findMany
   */
  export type WordBankFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter, which WordBanks to fetch.
     */
    where?: WordBankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WordBanks to fetch.
     */
    orderBy?: WordBankOrderByWithRelationInput | WordBankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WordBanks.
     */
    cursor?: WordBankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WordBanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WordBanks.
     */
    skip?: number
    distinct?: WordBankScalarFieldEnum | WordBankScalarFieldEnum[]
  }

  /**
   * WordBank create
   */
  export type WordBankCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * The data needed to create a WordBank.
     */
    data: XOR<WordBankCreateInput, WordBankUncheckedCreateInput>
  }

  /**
   * WordBank createMany
   */
  export type WordBankCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WordBanks.
     */
    data: WordBankCreateManyInput | WordBankCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WordBank createManyAndReturn
   */
  export type WordBankCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WordBanks.
     */
    data: WordBankCreateManyInput | WordBankCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WordBank update
   */
  export type WordBankUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * The data needed to update a WordBank.
     */
    data: XOR<WordBankUpdateInput, WordBankUncheckedUpdateInput>
    /**
     * Choose, which WordBank to update.
     */
    where: WordBankWhereUniqueInput
  }

  /**
   * WordBank updateMany
   */
  export type WordBankUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WordBanks.
     */
    data: XOR<WordBankUpdateManyMutationInput, WordBankUncheckedUpdateManyInput>
    /**
     * Filter which WordBanks to update
     */
    where?: WordBankWhereInput
  }

  /**
   * WordBank upsert
   */
  export type WordBankUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * The filter to search for the WordBank to update in case it exists.
     */
    where: WordBankWhereUniqueInput
    /**
     * In case the WordBank found by the `where` argument doesn't exist, create a new WordBank with this data.
     */
    create: XOR<WordBankCreateInput, WordBankUncheckedCreateInput>
    /**
     * In case the WordBank was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WordBankUpdateInput, WordBankUncheckedUpdateInput>
  }

  /**
   * WordBank delete
   */
  export type WordBankDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
    /**
     * Filter which WordBank to delete.
     */
    where: WordBankWhereUniqueInput
  }

  /**
   * WordBank deleteMany
   */
  export type WordBankDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WordBanks to delete
     */
    where?: WordBankWhereInput
  }

  /**
   * WordBank without action
   */
  export type WordBankDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WordBank
     */
    select?: WordBankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WordBankInclude<ExtArgs> | null
  }


  /**
   * Model Quiz
   */

  export type AggregateQuiz = {
    _count: QuizCountAggregateOutputType | null
    _avg: QuizAvgAggregateOutputType | null
    _sum: QuizSumAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  export type QuizAvgAggregateOutputType = {
    answer: number | null
    quizOrder: number | null
  }

  export type QuizSumAggregateOutputType = {
    answer: number | null
    quizOrder: number | null
  }

  export type QuizMinAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    question: string | null
    answer: number | null
    explain: string | null
    quizOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuizMaxAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    question: string | null
    answer: number | null
    explain: string | null
    quizOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuizCountAggregateOutputType = {
    id: number
    languageCode: number
    level: number
    question: number
    options: number
    answer: number
    explain: number
    quizOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuizAvgAggregateInputType = {
    answer?: true
    quizOrder?: true
  }

  export type QuizSumAggregateInputType = {
    answer?: true
    quizOrder?: true
  }

  export type QuizMinAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    question?: true
    answer?: true
    explain?: true
    quizOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuizMaxAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    question?: true
    answer?: true
    explain?: true
    quizOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuizCountAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    question?: true
    options?: true
    answer?: true
    explain?: true
    quizOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuizAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quiz to aggregate.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quizzes
    **/
    _count?: true | QuizCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizMaxAggregateInputType
  }

  export type GetQuizAggregateType<T extends QuizAggregateArgs> = {
        [P in keyof T & keyof AggregateQuiz]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuiz[P]>
      : GetScalarType<T[P], AggregateQuiz[P]>
  }




  export type QuizGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithAggregationInput | QuizOrderByWithAggregationInput[]
    by: QuizScalarFieldEnum[] | QuizScalarFieldEnum
    having?: QuizScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizCountAggregateInputType | true
    _avg?: QuizAvgAggregateInputType
    _sum?: QuizSumAggregateInputType
    _min?: QuizMinAggregateInputType
    _max?: QuizMaxAggregateInputType
  }

  export type QuizGroupByOutputType = {
    id: string
    languageCode: string
    level: string
    question: string
    options: JsonValue
    answer: number
    explain: string
    quizOrder: number
    createdAt: Date
    updatedAt: Date
    _count: QuizCountAggregateOutputType | null
    _avg: QuizAvgAggregateOutputType | null
    _sum: QuizSumAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  type GetQuizGroupByPayload<T extends QuizGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizGroupByOutputType[P]>
            : GetScalarType<T[P], QuizGroupByOutputType[P]>
        }
      >
    >


  export type QuizSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    question?: boolean
    options?: boolean
    answer?: boolean
    explain?: boolean
    quizOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    question?: boolean
    options?: boolean
    answer?: boolean
    explain?: boolean
    quizOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectScalar = {
    id?: boolean
    languageCode?: boolean
    level?: boolean
    question?: boolean
    options?: boolean
    answer?: boolean
    explain?: boolean
    quizOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuizInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type QuizIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $QuizPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quiz"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      languageCode: string
      level: string
      question: string
      options: Prisma.JsonValue
      answer: number
      explain: string
      quizOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quiz"]>
    composites: {}
  }

  type QuizGetPayload<S extends boolean | null | undefined | QuizDefaultArgs> = $Result.GetResult<Prisma.$QuizPayload, S>

  type QuizCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuizFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuizCountAggregateInputType | true
    }

  export interface QuizDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quiz'], meta: { name: 'Quiz' } }
    /**
     * Find zero or one Quiz that matches the filter.
     * @param {QuizFindUniqueArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizFindUniqueArgs>(args: SelectSubset<T, QuizFindUniqueArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Quiz that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuizFindUniqueOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Quiz that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizFindFirstArgs>(args?: SelectSubset<T, QuizFindFirstArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Quiz that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Quizzes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quizzes
     * const quizzes = await prisma.quiz.findMany()
     * 
     * // Get first 10 Quizzes
     * const quizzes = await prisma.quiz.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizWithIdOnly = await prisma.quiz.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizFindManyArgs>(args?: SelectSubset<T, QuizFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Quiz.
     * @param {QuizCreateArgs} args - Arguments to create a Quiz.
     * @example
     * // Create one Quiz
     * const Quiz = await prisma.quiz.create({
     *   data: {
     *     // ... data to create a Quiz
     *   }
     * })
     * 
     */
    create<T extends QuizCreateArgs>(args: SelectSubset<T, QuizCreateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Quizzes.
     * @param {QuizCreateManyArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizCreateManyArgs>(args?: SelectSubset<T, QuizCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quizzes and returns the data saved in the database.
     * @param {QuizCreateManyAndReturnArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quizzes and only return the `id`
     * const quizWithIdOnly = await prisma.quiz.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Quiz.
     * @param {QuizDeleteArgs} args - Arguments to delete one Quiz.
     * @example
     * // Delete one Quiz
     * const Quiz = await prisma.quiz.delete({
     *   where: {
     *     // ... filter to delete one Quiz
     *   }
     * })
     * 
     */
    delete<T extends QuizDeleteArgs>(args: SelectSubset<T, QuizDeleteArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Quiz.
     * @param {QuizUpdateArgs} args - Arguments to update one Quiz.
     * @example
     * // Update one Quiz
     * const quiz = await prisma.quiz.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizUpdateArgs>(args: SelectSubset<T, QuizUpdateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Quizzes.
     * @param {QuizDeleteManyArgs} args - Arguments to filter Quizzes to delete.
     * @example
     * // Delete a few Quizzes
     * const { count } = await prisma.quiz.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizDeleteManyArgs>(args?: SelectSubset<T, QuizDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quizzes
     * const quiz = await prisma.quiz.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizUpdateManyArgs>(args: SelectSubset<T, QuizUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Quiz.
     * @param {QuizUpsertArgs} args - Arguments to update or create a Quiz.
     * @example
     * // Update or create a Quiz
     * const quiz = await prisma.quiz.upsert({
     *   create: {
     *     // ... data to create a Quiz
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quiz we want to update
     *   }
     * })
     */
    upsert<T extends QuizUpsertArgs>(args: SelectSubset<T, QuizUpsertArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizCountArgs} args - Arguments to filter Quizzes to count.
     * @example
     * // Count the number of Quizzes
     * const count = await prisma.quiz.count({
     *   where: {
     *     // ... the filter for the Quizzes we want to count
     *   }
     * })
    **/
    count<T extends QuizCountArgs>(
      args?: Subset<T, QuizCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuizAggregateArgs>(args: Subset<T, QuizAggregateArgs>): Prisma.PrismaPromise<GetQuizAggregateType<T>>

    /**
     * Group by Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuizGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizGroupByArgs['orderBy'] }
        : { orderBy?: QuizGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuizGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quiz model
   */
  readonly fields: QuizFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quiz.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quiz model
   */ 
  interface QuizFieldRefs {
    readonly id: FieldRef<"Quiz", 'String'>
    readonly languageCode: FieldRef<"Quiz", 'String'>
    readonly level: FieldRef<"Quiz", 'String'>
    readonly question: FieldRef<"Quiz", 'String'>
    readonly options: FieldRef<"Quiz", 'Json'>
    readonly answer: FieldRef<"Quiz", 'Int'>
    readonly explain: FieldRef<"Quiz", 'String'>
    readonly quizOrder: FieldRef<"Quiz", 'Int'>
    readonly createdAt: FieldRef<"Quiz", 'DateTime'>
    readonly updatedAt: FieldRef<"Quiz", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Quiz findUnique
   */
  export type QuizFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findUniqueOrThrow
   */
  export type QuizFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findFirst
   */
  export type QuizFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findFirstOrThrow
   */
  export type QuizFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findMany
   */
  export type QuizFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quizzes to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz create
   */
  export type QuizCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to create a Quiz.
     */
    data: XOR<QuizCreateInput, QuizUncheckedCreateInput>
  }

  /**
   * Quiz createMany
   */
  export type QuizCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quiz createManyAndReturn
   */
  export type QuizCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quiz update
   */
  export type QuizUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to update a Quiz.
     */
    data: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
    /**
     * Choose, which Quiz to update.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz updateMany
   */
  export type QuizUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quizzes.
     */
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyInput>
    /**
     * Filter which Quizzes to update
     */
    where?: QuizWhereInput
  }

  /**
   * Quiz upsert
   */
  export type QuizUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The filter to search for the Quiz to update in case it exists.
     */
    where: QuizWhereUniqueInput
    /**
     * In case the Quiz found by the `where` argument doesn't exist, create a new Quiz with this data.
     */
    create: XOR<QuizCreateInput, QuizUncheckedCreateInput>
    /**
     * In case the Quiz was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
  }

  /**
   * Quiz delete
   */
  export type QuizDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter which Quiz to delete.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz deleteMany
   */
  export type QuizDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quizzes to delete
     */
    where?: QuizWhereInput
  }

  /**
   * Quiz without action
   */
  export type QuizDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
  }


  /**
   * Model Listening
   */

  export type AggregateListening = {
    _count: ListeningCountAggregateOutputType | null
    _avg: ListeningAvgAggregateOutputType | null
    _sum: ListeningSumAggregateOutputType | null
    _min: ListeningMinAggregateOutputType | null
    _max: ListeningMaxAggregateOutputType | null
  }

  export type ListeningAvgAggregateOutputType = {
    listenOrder: number | null
  }

  export type ListeningSumAggregateOutputType = {
    listenOrder: number | null
  }

  export type ListeningMinAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    title: string | null
    script: string | null
    listenOrder: number | null
  }

  export type ListeningMaxAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    title: string | null
    script: string | null
    listenOrder: number | null
  }

  export type ListeningCountAggregateOutputType = {
    id: number
    languageCode: number
    level: number
    title: number
    script: number
    blanks: number
    listenOrder: number
    _all: number
  }


  export type ListeningAvgAggregateInputType = {
    listenOrder?: true
  }

  export type ListeningSumAggregateInputType = {
    listenOrder?: true
  }

  export type ListeningMinAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    title?: true
    script?: true
    listenOrder?: true
  }

  export type ListeningMaxAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    title?: true
    script?: true
    listenOrder?: true
  }

  export type ListeningCountAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    title?: true
    script?: true
    blanks?: true
    listenOrder?: true
    _all?: true
  }

  export type ListeningAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listening to aggregate.
     */
    where?: ListeningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listenings to fetch.
     */
    orderBy?: ListeningOrderByWithRelationInput | ListeningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListeningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listenings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listenings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Listenings
    **/
    _count?: true | ListeningCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListeningAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListeningSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListeningMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListeningMaxAggregateInputType
  }

  export type GetListeningAggregateType<T extends ListeningAggregateArgs> = {
        [P in keyof T & keyof AggregateListening]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListening[P]>
      : GetScalarType<T[P], AggregateListening[P]>
  }




  export type ListeningGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListeningWhereInput
    orderBy?: ListeningOrderByWithAggregationInput | ListeningOrderByWithAggregationInput[]
    by: ListeningScalarFieldEnum[] | ListeningScalarFieldEnum
    having?: ListeningScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListeningCountAggregateInputType | true
    _avg?: ListeningAvgAggregateInputType
    _sum?: ListeningSumAggregateInputType
    _min?: ListeningMinAggregateInputType
    _max?: ListeningMaxAggregateInputType
  }

  export type ListeningGroupByOutputType = {
    id: string
    languageCode: string
    level: string
    title: string
    script: string
    blanks: JsonValue
    listenOrder: number
    _count: ListeningCountAggregateOutputType | null
    _avg: ListeningAvgAggregateOutputType | null
    _sum: ListeningSumAggregateOutputType | null
    _min: ListeningMinAggregateOutputType | null
    _max: ListeningMaxAggregateOutputType | null
  }

  type GetListeningGroupByPayload<T extends ListeningGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListeningGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListeningGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListeningGroupByOutputType[P]>
            : GetScalarType<T[P], ListeningGroupByOutputType[P]>
        }
      >
    >


  export type ListeningSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    title?: boolean
    script?: boolean
    blanks?: boolean
    listenOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listening"]>

  export type ListeningSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    title?: boolean
    script?: boolean
    blanks?: boolean
    listenOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listening"]>

  export type ListeningSelectScalar = {
    id?: boolean
    languageCode?: boolean
    level?: boolean
    title?: boolean
    script?: boolean
    blanks?: boolean
    listenOrder?: boolean
  }

  export type ListeningInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type ListeningIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $ListeningPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Listening"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      languageCode: string
      level: string
      title: string
      script: string
      blanks: Prisma.JsonValue
      listenOrder: number
    }, ExtArgs["result"]["listening"]>
    composites: {}
  }

  type ListeningGetPayload<S extends boolean | null | undefined | ListeningDefaultArgs> = $Result.GetResult<Prisma.$ListeningPayload, S>

  type ListeningCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ListeningFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ListeningCountAggregateInputType | true
    }

  export interface ListeningDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Listening'], meta: { name: 'Listening' } }
    /**
     * Find zero or one Listening that matches the filter.
     * @param {ListeningFindUniqueArgs} args - Arguments to find a Listening
     * @example
     * // Get one Listening
     * const listening = await prisma.listening.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListeningFindUniqueArgs>(args: SelectSubset<T, ListeningFindUniqueArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Listening that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ListeningFindUniqueOrThrowArgs} args - Arguments to find a Listening
     * @example
     * // Get one Listening
     * const listening = await prisma.listening.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListeningFindUniqueOrThrowArgs>(args: SelectSubset<T, ListeningFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Listening that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningFindFirstArgs} args - Arguments to find a Listening
     * @example
     * // Get one Listening
     * const listening = await prisma.listening.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListeningFindFirstArgs>(args?: SelectSubset<T, ListeningFindFirstArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Listening that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningFindFirstOrThrowArgs} args - Arguments to find a Listening
     * @example
     * // Get one Listening
     * const listening = await prisma.listening.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListeningFindFirstOrThrowArgs>(args?: SelectSubset<T, ListeningFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Listenings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listenings
     * const listenings = await prisma.listening.findMany()
     * 
     * // Get first 10 Listenings
     * const listenings = await prisma.listening.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listeningWithIdOnly = await prisma.listening.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListeningFindManyArgs>(args?: SelectSubset<T, ListeningFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Listening.
     * @param {ListeningCreateArgs} args - Arguments to create a Listening.
     * @example
     * // Create one Listening
     * const Listening = await prisma.listening.create({
     *   data: {
     *     // ... data to create a Listening
     *   }
     * })
     * 
     */
    create<T extends ListeningCreateArgs>(args: SelectSubset<T, ListeningCreateArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Listenings.
     * @param {ListeningCreateManyArgs} args - Arguments to create many Listenings.
     * @example
     * // Create many Listenings
     * const listening = await prisma.listening.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListeningCreateManyArgs>(args?: SelectSubset<T, ListeningCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Listenings and returns the data saved in the database.
     * @param {ListeningCreateManyAndReturnArgs} args - Arguments to create many Listenings.
     * @example
     * // Create many Listenings
     * const listening = await prisma.listening.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Listenings and only return the `id`
     * const listeningWithIdOnly = await prisma.listening.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListeningCreateManyAndReturnArgs>(args?: SelectSubset<T, ListeningCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Listening.
     * @param {ListeningDeleteArgs} args - Arguments to delete one Listening.
     * @example
     * // Delete one Listening
     * const Listening = await prisma.listening.delete({
     *   where: {
     *     // ... filter to delete one Listening
     *   }
     * })
     * 
     */
    delete<T extends ListeningDeleteArgs>(args: SelectSubset<T, ListeningDeleteArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Listening.
     * @param {ListeningUpdateArgs} args - Arguments to update one Listening.
     * @example
     * // Update one Listening
     * const listening = await prisma.listening.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListeningUpdateArgs>(args: SelectSubset<T, ListeningUpdateArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Listenings.
     * @param {ListeningDeleteManyArgs} args - Arguments to filter Listenings to delete.
     * @example
     * // Delete a few Listenings
     * const { count } = await prisma.listening.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListeningDeleteManyArgs>(args?: SelectSubset<T, ListeningDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listenings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listenings
     * const listening = await prisma.listening.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListeningUpdateManyArgs>(args: SelectSubset<T, ListeningUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Listening.
     * @param {ListeningUpsertArgs} args - Arguments to update or create a Listening.
     * @example
     * // Update or create a Listening
     * const listening = await prisma.listening.upsert({
     *   create: {
     *     // ... data to create a Listening
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listening we want to update
     *   }
     * })
     */
    upsert<T extends ListeningUpsertArgs>(args: SelectSubset<T, ListeningUpsertArgs<ExtArgs>>): Prisma__ListeningClient<$Result.GetResult<Prisma.$ListeningPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Listenings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningCountArgs} args - Arguments to filter Listenings to count.
     * @example
     * // Count the number of Listenings
     * const count = await prisma.listening.count({
     *   where: {
     *     // ... the filter for the Listenings we want to count
     *   }
     * })
    **/
    count<T extends ListeningCountArgs>(
      args?: Subset<T, ListeningCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListeningCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Listening.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListeningAggregateArgs>(args: Subset<T, ListeningAggregateArgs>): Prisma.PrismaPromise<GetListeningAggregateType<T>>

    /**
     * Group by Listening.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListeningGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListeningGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListeningGroupByArgs['orderBy'] }
        : { orderBy?: ListeningGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListeningGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListeningGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Listening model
   */
  readonly fields: ListeningFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listening.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListeningClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Listening model
   */ 
  interface ListeningFieldRefs {
    readonly id: FieldRef<"Listening", 'String'>
    readonly languageCode: FieldRef<"Listening", 'String'>
    readonly level: FieldRef<"Listening", 'String'>
    readonly title: FieldRef<"Listening", 'String'>
    readonly script: FieldRef<"Listening", 'String'>
    readonly blanks: FieldRef<"Listening", 'Json'>
    readonly listenOrder: FieldRef<"Listening", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Listening findUnique
   */
  export type ListeningFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter, which Listening to fetch.
     */
    where: ListeningWhereUniqueInput
  }

  /**
   * Listening findUniqueOrThrow
   */
  export type ListeningFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter, which Listening to fetch.
     */
    where: ListeningWhereUniqueInput
  }

  /**
   * Listening findFirst
   */
  export type ListeningFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter, which Listening to fetch.
     */
    where?: ListeningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listenings to fetch.
     */
    orderBy?: ListeningOrderByWithRelationInput | ListeningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listenings.
     */
    cursor?: ListeningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listenings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listenings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listenings.
     */
    distinct?: ListeningScalarFieldEnum | ListeningScalarFieldEnum[]
  }

  /**
   * Listening findFirstOrThrow
   */
  export type ListeningFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter, which Listening to fetch.
     */
    where?: ListeningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listenings to fetch.
     */
    orderBy?: ListeningOrderByWithRelationInput | ListeningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listenings.
     */
    cursor?: ListeningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listenings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listenings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listenings.
     */
    distinct?: ListeningScalarFieldEnum | ListeningScalarFieldEnum[]
  }

  /**
   * Listening findMany
   */
  export type ListeningFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter, which Listenings to fetch.
     */
    where?: ListeningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listenings to fetch.
     */
    orderBy?: ListeningOrderByWithRelationInput | ListeningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Listenings.
     */
    cursor?: ListeningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listenings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listenings.
     */
    skip?: number
    distinct?: ListeningScalarFieldEnum | ListeningScalarFieldEnum[]
  }

  /**
   * Listening create
   */
  export type ListeningCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * The data needed to create a Listening.
     */
    data: XOR<ListeningCreateInput, ListeningUncheckedCreateInput>
  }

  /**
   * Listening createMany
   */
  export type ListeningCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Listenings.
     */
    data: ListeningCreateManyInput | ListeningCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Listening createManyAndReturn
   */
  export type ListeningCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Listenings.
     */
    data: ListeningCreateManyInput | ListeningCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Listening update
   */
  export type ListeningUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * The data needed to update a Listening.
     */
    data: XOR<ListeningUpdateInput, ListeningUncheckedUpdateInput>
    /**
     * Choose, which Listening to update.
     */
    where: ListeningWhereUniqueInput
  }

  /**
   * Listening updateMany
   */
  export type ListeningUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Listenings.
     */
    data: XOR<ListeningUpdateManyMutationInput, ListeningUncheckedUpdateManyInput>
    /**
     * Filter which Listenings to update
     */
    where?: ListeningWhereInput
  }

  /**
   * Listening upsert
   */
  export type ListeningUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * The filter to search for the Listening to update in case it exists.
     */
    where: ListeningWhereUniqueInput
    /**
     * In case the Listening found by the `where` argument doesn't exist, create a new Listening with this data.
     */
    create: XOR<ListeningCreateInput, ListeningUncheckedCreateInput>
    /**
     * In case the Listening was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListeningUpdateInput, ListeningUncheckedUpdateInput>
  }

  /**
   * Listening delete
   */
  export type ListeningDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
    /**
     * Filter which Listening to delete.
     */
    where: ListeningWhereUniqueInput
  }

  /**
   * Listening deleteMany
   */
  export type ListeningDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listenings to delete
     */
    where?: ListeningWhereInput
  }

  /**
   * Listening without action
   */
  export type ListeningDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listening
     */
    select?: ListeningSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListeningInclude<ExtArgs> | null
  }


  /**
   * Model Speaking
   */

  export type AggregateSpeaking = {
    _count: SpeakingCountAggregateOutputType | null
    _avg: SpeakingAvgAggregateOutputType | null
    _sum: SpeakingSumAggregateOutputType | null
    _min: SpeakingMinAggregateOutputType | null
    _max: SpeakingMaxAggregateOutputType | null
  }

  export type SpeakingAvgAggregateOutputType = {
    speakOrder: number | null
  }

  export type SpeakingSumAggregateOutputType = {
    speakOrder: number | null
  }

  export type SpeakingMinAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    phrase: string | null
    translation: string | null
    phonetic: string | null
    speakOrder: number | null
  }

  export type SpeakingMaxAggregateOutputType = {
    id: string | null
    languageCode: string | null
    level: string | null
    phrase: string | null
    translation: string | null
    phonetic: string | null
    speakOrder: number | null
  }

  export type SpeakingCountAggregateOutputType = {
    id: number
    languageCode: number
    level: number
    phrase: number
    translation: number
    phonetic: number
    speakOrder: number
    _all: number
  }


  export type SpeakingAvgAggregateInputType = {
    speakOrder?: true
  }

  export type SpeakingSumAggregateInputType = {
    speakOrder?: true
  }

  export type SpeakingMinAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    phrase?: true
    translation?: true
    phonetic?: true
    speakOrder?: true
  }

  export type SpeakingMaxAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    phrase?: true
    translation?: true
    phonetic?: true
    speakOrder?: true
  }

  export type SpeakingCountAggregateInputType = {
    id?: true
    languageCode?: true
    level?: true
    phrase?: true
    translation?: true
    phonetic?: true
    speakOrder?: true
    _all?: true
  }

  export type SpeakingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Speaking to aggregate.
     */
    where?: SpeakingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Speakings to fetch.
     */
    orderBy?: SpeakingOrderByWithRelationInput | SpeakingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpeakingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Speakings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Speakings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Speakings
    **/
    _count?: true | SpeakingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpeakingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpeakingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpeakingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpeakingMaxAggregateInputType
  }

  export type GetSpeakingAggregateType<T extends SpeakingAggregateArgs> = {
        [P in keyof T & keyof AggregateSpeaking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpeaking[P]>
      : GetScalarType<T[P], AggregateSpeaking[P]>
  }




  export type SpeakingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakingWhereInput
    orderBy?: SpeakingOrderByWithAggregationInput | SpeakingOrderByWithAggregationInput[]
    by: SpeakingScalarFieldEnum[] | SpeakingScalarFieldEnum
    having?: SpeakingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpeakingCountAggregateInputType | true
    _avg?: SpeakingAvgAggregateInputType
    _sum?: SpeakingSumAggregateInputType
    _min?: SpeakingMinAggregateInputType
    _max?: SpeakingMaxAggregateInputType
  }

  export type SpeakingGroupByOutputType = {
    id: string
    languageCode: string
    level: string
    phrase: string
    translation: string
    phonetic: string | null
    speakOrder: number
    _count: SpeakingCountAggregateOutputType | null
    _avg: SpeakingAvgAggregateOutputType | null
    _sum: SpeakingSumAggregateOutputType | null
    _min: SpeakingMinAggregateOutputType | null
    _max: SpeakingMaxAggregateOutputType | null
  }

  type GetSpeakingGroupByPayload<T extends SpeakingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpeakingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpeakingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpeakingGroupByOutputType[P]>
            : GetScalarType<T[P], SpeakingGroupByOutputType[P]>
        }
      >
    >


  export type SpeakingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    phrase?: boolean
    translation?: boolean
    phonetic?: boolean
    speakOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speaking"]>

  export type SpeakingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    languageCode?: boolean
    level?: boolean
    phrase?: boolean
    translation?: boolean
    phonetic?: boolean
    speakOrder?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["speaking"]>

  export type SpeakingSelectScalar = {
    id?: boolean
    languageCode?: boolean
    level?: boolean
    phrase?: boolean
    translation?: boolean
    phonetic?: boolean
    speakOrder?: boolean
  }

  export type SpeakingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type SpeakingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $SpeakingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Speaking"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      languageCode: string
      level: string
      phrase: string
      translation: string
      phonetic: string | null
      speakOrder: number
    }, ExtArgs["result"]["speaking"]>
    composites: {}
  }

  type SpeakingGetPayload<S extends boolean | null | undefined | SpeakingDefaultArgs> = $Result.GetResult<Prisma.$SpeakingPayload, S>

  type SpeakingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SpeakingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SpeakingCountAggregateInputType | true
    }

  export interface SpeakingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Speaking'], meta: { name: 'Speaking' } }
    /**
     * Find zero or one Speaking that matches the filter.
     * @param {SpeakingFindUniqueArgs} args - Arguments to find a Speaking
     * @example
     * // Get one Speaking
     * const speaking = await prisma.speaking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpeakingFindUniqueArgs>(args: SelectSubset<T, SpeakingFindUniqueArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Speaking that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SpeakingFindUniqueOrThrowArgs} args - Arguments to find a Speaking
     * @example
     * // Get one Speaking
     * const speaking = await prisma.speaking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpeakingFindUniqueOrThrowArgs>(args: SelectSubset<T, SpeakingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Speaking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingFindFirstArgs} args - Arguments to find a Speaking
     * @example
     * // Get one Speaking
     * const speaking = await prisma.speaking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpeakingFindFirstArgs>(args?: SelectSubset<T, SpeakingFindFirstArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Speaking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingFindFirstOrThrowArgs} args - Arguments to find a Speaking
     * @example
     * // Get one Speaking
     * const speaking = await prisma.speaking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpeakingFindFirstOrThrowArgs>(args?: SelectSubset<T, SpeakingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Speakings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Speakings
     * const speakings = await prisma.speaking.findMany()
     * 
     * // Get first 10 Speakings
     * const speakings = await prisma.speaking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const speakingWithIdOnly = await prisma.speaking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpeakingFindManyArgs>(args?: SelectSubset<T, SpeakingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Speaking.
     * @param {SpeakingCreateArgs} args - Arguments to create a Speaking.
     * @example
     * // Create one Speaking
     * const Speaking = await prisma.speaking.create({
     *   data: {
     *     // ... data to create a Speaking
     *   }
     * })
     * 
     */
    create<T extends SpeakingCreateArgs>(args: SelectSubset<T, SpeakingCreateArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Speakings.
     * @param {SpeakingCreateManyArgs} args - Arguments to create many Speakings.
     * @example
     * // Create many Speakings
     * const speaking = await prisma.speaking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpeakingCreateManyArgs>(args?: SelectSubset<T, SpeakingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Speakings and returns the data saved in the database.
     * @param {SpeakingCreateManyAndReturnArgs} args - Arguments to create many Speakings.
     * @example
     * // Create many Speakings
     * const speaking = await prisma.speaking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Speakings and only return the `id`
     * const speakingWithIdOnly = await prisma.speaking.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpeakingCreateManyAndReturnArgs>(args?: SelectSubset<T, SpeakingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Speaking.
     * @param {SpeakingDeleteArgs} args - Arguments to delete one Speaking.
     * @example
     * // Delete one Speaking
     * const Speaking = await prisma.speaking.delete({
     *   where: {
     *     // ... filter to delete one Speaking
     *   }
     * })
     * 
     */
    delete<T extends SpeakingDeleteArgs>(args: SelectSubset<T, SpeakingDeleteArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Speaking.
     * @param {SpeakingUpdateArgs} args - Arguments to update one Speaking.
     * @example
     * // Update one Speaking
     * const speaking = await prisma.speaking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpeakingUpdateArgs>(args: SelectSubset<T, SpeakingUpdateArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Speakings.
     * @param {SpeakingDeleteManyArgs} args - Arguments to filter Speakings to delete.
     * @example
     * // Delete a few Speakings
     * const { count } = await prisma.speaking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpeakingDeleteManyArgs>(args?: SelectSubset<T, SpeakingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Speakings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Speakings
     * const speaking = await prisma.speaking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpeakingUpdateManyArgs>(args: SelectSubset<T, SpeakingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Speaking.
     * @param {SpeakingUpsertArgs} args - Arguments to update or create a Speaking.
     * @example
     * // Update or create a Speaking
     * const speaking = await prisma.speaking.upsert({
     *   create: {
     *     // ... data to create a Speaking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Speaking we want to update
     *   }
     * })
     */
    upsert<T extends SpeakingUpsertArgs>(args: SelectSubset<T, SpeakingUpsertArgs<ExtArgs>>): Prisma__SpeakingClient<$Result.GetResult<Prisma.$SpeakingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Speakings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingCountArgs} args - Arguments to filter Speakings to count.
     * @example
     * // Count the number of Speakings
     * const count = await prisma.speaking.count({
     *   where: {
     *     // ... the filter for the Speakings we want to count
     *   }
     * })
    **/
    count<T extends SpeakingCountArgs>(
      args?: Subset<T, SpeakingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpeakingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Speaking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpeakingAggregateArgs>(args: Subset<T, SpeakingAggregateArgs>): Prisma.PrismaPromise<GetSpeakingAggregateType<T>>

    /**
     * Group by Speaking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpeakingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpeakingGroupByArgs['orderBy'] }
        : { orderBy?: SpeakingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpeakingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpeakingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Speaking model
   */
  readonly fields: SpeakingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Speaking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpeakingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Speaking model
   */ 
  interface SpeakingFieldRefs {
    readonly id: FieldRef<"Speaking", 'String'>
    readonly languageCode: FieldRef<"Speaking", 'String'>
    readonly level: FieldRef<"Speaking", 'String'>
    readonly phrase: FieldRef<"Speaking", 'String'>
    readonly translation: FieldRef<"Speaking", 'String'>
    readonly phonetic: FieldRef<"Speaking", 'String'>
    readonly speakOrder: FieldRef<"Speaking", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Speaking findUnique
   */
  export type SpeakingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter, which Speaking to fetch.
     */
    where: SpeakingWhereUniqueInput
  }

  /**
   * Speaking findUniqueOrThrow
   */
  export type SpeakingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter, which Speaking to fetch.
     */
    where: SpeakingWhereUniqueInput
  }

  /**
   * Speaking findFirst
   */
  export type SpeakingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter, which Speaking to fetch.
     */
    where?: SpeakingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Speakings to fetch.
     */
    orderBy?: SpeakingOrderByWithRelationInput | SpeakingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Speakings.
     */
    cursor?: SpeakingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Speakings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Speakings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Speakings.
     */
    distinct?: SpeakingScalarFieldEnum | SpeakingScalarFieldEnum[]
  }

  /**
   * Speaking findFirstOrThrow
   */
  export type SpeakingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter, which Speaking to fetch.
     */
    where?: SpeakingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Speakings to fetch.
     */
    orderBy?: SpeakingOrderByWithRelationInput | SpeakingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Speakings.
     */
    cursor?: SpeakingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Speakings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Speakings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Speakings.
     */
    distinct?: SpeakingScalarFieldEnum | SpeakingScalarFieldEnum[]
  }

  /**
   * Speaking findMany
   */
  export type SpeakingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter, which Speakings to fetch.
     */
    where?: SpeakingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Speakings to fetch.
     */
    orderBy?: SpeakingOrderByWithRelationInput | SpeakingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Speakings.
     */
    cursor?: SpeakingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Speakings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Speakings.
     */
    skip?: number
    distinct?: SpeakingScalarFieldEnum | SpeakingScalarFieldEnum[]
  }

  /**
   * Speaking create
   */
  export type SpeakingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * The data needed to create a Speaking.
     */
    data: XOR<SpeakingCreateInput, SpeakingUncheckedCreateInput>
  }

  /**
   * Speaking createMany
   */
  export type SpeakingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Speakings.
     */
    data: SpeakingCreateManyInput | SpeakingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Speaking createManyAndReturn
   */
  export type SpeakingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Speakings.
     */
    data: SpeakingCreateManyInput | SpeakingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Speaking update
   */
  export type SpeakingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * The data needed to update a Speaking.
     */
    data: XOR<SpeakingUpdateInput, SpeakingUncheckedUpdateInput>
    /**
     * Choose, which Speaking to update.
     */
    where: SpeakingWhereUniqueInput
  }

  /**
   * Speaking updateMany
   */
  export type SpeakingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Speakings.
     */
    data: XOR<SpeakingUpdateManyMutationInput, SpeakingUncheckedUpdateManyInput>
    /**
     * Filter which Speakings to update
     */
    where?: SpeakingWhereInput
  }

  /**
   * Speaking upsert
   */
  export type SpeakingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * The filter to search for the Speaking to update in case it exists.
     */
    where: SpeakingWhereUniqueInput
    /**
     * In case the Speaking found by the `where` argument doesn't exist, create a new Speaking with this data.
     */
    create: XOR<SpeakingCreateInput, SpeakingUncheckedCreateInput>
    /**
     * In case the Speaking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpeakingUpdateInput, SpeakingUncheckedUpdateInput>
  }

  /**
   * Speaking delete
   */
  export type SpeakingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
    /**
     * Filter which Speaking to delete.
     */
    where: SpeakingWhereUniqueInput
  }

  /**
   * Speaking deleteMany
   */
  export type SpeakingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Speakings to delete
     */
    where?: SpeakingWhereInput
  }

  /**
   * Speaking without action
   */
  export type SpeakingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Speaking
     */
    select?: SpeakingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpeakingInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    level: number | null
    exp: number | null
    streak: number | null
    goalMinutesPerDay: number | null
    jwtVersion: number | null
  }

  export type UserSumAggregateOutputType = {
    level: number | null
    exp: number | null
    streak: number | null
    goalMinutesPerDay: number | null
    jwtVersion: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    avatar: string | null
    level: number | null
    exp: number | null
    streak: number | null
    lastActive: Date | null
    targetLanguage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    role: string | null
    goalMinutesPerDay: number | null
    jwtVersion: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    avatar: string | null
    level: number | null
    exp: number | null
    streak: number | null
    lastActive: Date | null
    targetLanguage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    role: string | null
    goalMinutesPerDay: number | null
    jwtVersion: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    avatar: number
    level: number
    exp: number
    streak: number
    lastActive: number
    targetLanguage: number
    createdAt: number
    updatedAt: number
    role: number
    goalMinutesPerDay: number
    jwtVersion: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    level?: true
    exp?: true
    streak?: true
    goalMinutesPerDay?: true
    jwtVersion?: true
  }

  export type UserSumAggregateInputType = {
    level?: true
    exp?: true
    streak?: true
    goalMinutesPerDay?: true
    jwtVersion?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    avatar?: true
    level?: true
    exp?: true
    streak?: true
    lastActive?: true
    targetLanguage?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    goalMinutesPerDay?: true
    jwtVersion?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    avatar?: true
    level?: true
    exp?: true
    streak?: true
    lastActive?: true
    targetLanguage?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    goalMinutesPerDay?: true
    jwtVersion?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    avatar?: true
    level?: true
    exp?: true
    streak?: true
    lastActive?: true
    targetLanguage?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    goalMinutesPerDay?: true
    jwtVersion?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string
    avatar: string | null
    level: number
    exp: number
    streak: number
    lastActive: Date
    targetLanguage: string
    createdAt: Date
    updatedAt: Date
    role: string
    goalMinutesPerDay: number
    jwtVersion: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    avatar?: boolean
    level?: boolean
    exp?: boolean
    streak?: boolean
    lastActive?: boolean
    targetLanguage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    goalMinutesPerDay?: boolean
    jwtVersion?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
    progressDays?: boolean | User$progressDaysArgs<ExtArgs>
    posts?: boolean | User$postsArgs<ExtArgs>
    likedPosts?: boolean | User$likedPostsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    avatar?: boolean
    level?: boolean
    exp?: boolean
    streak?: boolean
    lastActive?: boolean
    targetLanguage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    goalMinutesPerDay?: boolean
    jwtVersion?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    avatar?: boolean
    level?: boolean
    exp?: boolean
    streak?: boolean
    lastActive?: boolean
    targetLanguage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    goalMinutesPerDay?: boolean
    jwtVersion?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
    progressDays?: boolean | User$progressDaysArgs<ExtArgs>
    posts?: boolean | User$postsArgs<ExtArgs>
    likedPosts?: boolean | User$likedPostsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
      progressDays: Prisma.$UserProgressDayPayload<ExtArgs>[]
      posts: Prisma.$PostPayload<ExtArgs>[]
      likedPosts: Prisma.$LikePostPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string
      avatar: string | null
      level: number
      exp: number
      streak: number
      lastActive: Date
      targetLanguage: string
      createdAt: Date
      updatedAt: Date
      role: string
      goalMinutesPerDay: number
      jwtVersion: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    progressDays<T extends User$progressDaysArgs<ExtArgs> = {}>(args?: Subset<T, User$progressDaysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findMany"> | Null>
    posts<T extends User$postsArgs<ExtArgs> = {}>(args?: Subset<T, User$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    likedPosts<T extends User$likedPostsArgs<ExtArgs> = {}>(args?: Subset<T, User$likedPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findMany"> | Null>
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany"> | Null>
    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'Int'>
    readonly exp: FieldRef<"User", 'Int'>
    readonly streak: FieldRef<"User", 'Int'>
    readonly lastActive: FieldRef<"User", 'DateTime'>
    readonly targetLanguage: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly role: FieldRef<"User", 'String'>
    readonly goalMinutesPerDay: FieldRef<"User", 'Int'>
    readonly jwtVersion: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.progressDays
   */
  export type User$progressDaysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    where?: UserProgressDayWhereInput
    orderBy?: UserProgressDayOrderByWithRelationInput | UserProgressDayOrderByWithRelationInput[]
    cursor?: UserProgressDayWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgressDayScalarFieldEnum | UserProgressDayScalarFieldEnum[]
  }

  /**
   * User.posts
   */
  export type User$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.likedPosts
   */
  export type User$likedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    where?: LikePostWhereInput
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    cursor?: LikePostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikePostScalarFieldEnum | LikePostScalarFieldEnum[]
  }

  /**
   * User.comments
   */
  export type User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserProgressDay
   */

  export type AggregateUserProgressDay = {
    _count: UserProgressDayCountAggregateOutputType | null
    _avg: UserProgressDayAvgAggregateOutputType | null
    _sum: UserProgressDaySumAggregateOutputType | null
    _min: UserProgressDayMinAggregateOutputType | null
    _max: UserProgressDayMaxAggregateOutputType | null
  }

  export type UserProgressDayAvgAggregateOutputType = {
    minutes: number | null
    wordsLearned: number | null
    wordCorrect: number | null
    wordTotal: number | null
    quizzesDone: number | null
    quizCorrect: number | null
    quizTotal: number | null
    speakingMinutes: number | null
    listeningMinutes: number | null
  }

  export type UserProgressDaySumAggregateOutputType = {
    minutes: number | null
    wordsLearned: number | null
    wordCorrect: number | null
    wordTotal: number | null
    quizzesDone: number | null
    quizCorrect: number | null
    quizTotal: number | null
    speakingMinutes: number | null
    listeningMinutes: number | null
  }

  export type UserProgressDayMinAggregateOutputType = {
    id: string | null
    userId: string | null
    studyDate: Date | null
    minutes: number | null
    wordsLearned: number | null
    wordCorrect: number | null
    wordTotal: number | null
    quizzesDone: number | null
    quizCorrect: number | null
    quizTotal: number | null
    speakingMinutes: number | null
    listeningMinutes: number | null
  }

  export type UserProgressDayMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    studyDate: Date | null
    minutes: number | null
    wordsLearned: number | null
    wordCorrect: number | null
    wordTotal: number | null
    quizzesDone: number | null
    quizCorrect: number | null
    quizTotal: number | null
    speakingMinutes: number | null
    listeningMinutes: number | null
  }

  export type UserProgressDayCountAggregateOutputType = {
    id: number
    userId: number
    studyDate: number
    minutes: number
    wordsLearned: number
    wordCorrect: number
    wordTotal: number
    quizzesDone: number
    quizCorrect: number
    quizTotal: number
    speakingMinutes: number
    listeningMinutes: number
    moduleScores: number
    _all: number
  }


  export type UserProgressDayAvgAggregateInputType = {
    minutes?: true
    wordsLearned?: true
    wordCorrect?: true
    wordTotal?: true
    quizzesDone?: true
    quizCorrect?: true
    quizTotal?: true
    speakingMinutes?: true
    listeningMinutes?: true
  }

  export type UserProgressDaySumAggregateInputType = {
    minutes?: true
    wordsLearned?: true
    wordCorrect?: true
    wordTotal?: true
    quizzesDone?: true
    quizCorrect?: true
    quizTotal?: true
    speakingMinutes?: true
    listeningMinutes?: true
  }

  export type UserProgressDayMinAggregateInputType = {
    id?: true
    userId?: true
    studyDate?: true
    minutes?: true
    wordsLearned?: true
    wordCorrect?: true
    wordTotal?: true
    quizzesDone?: true
    quizCorrect?: true
    quizTotal?: true
    speakingMinutes?: true
    listeningMinutes?: true
  }

  export type UserProgressDayMaxAggregateInputType = {
    id?: true
    userId?: true
    studyDate?: true
    minutes?: true
    wordsLearned?: true
    wordCorrect?: true
    wordTotal?: true
    quizzesDone?: true
    quizCorrect?: true
    quizTotal?: true
    speakingMinutes?: true
    listeningMinutes?: true
  }

  export type UserProgressDayCountAggregateInputType = {
    id?: true
    userId?: true
    studyDate?: true
    minutes?: true
    wordsLearned?: true
    wordCorrect?: true
    wordTotal?: true
    quizzesDone?: true
    quizCorrect?: true
    quizTotal?: true
    speakingMinutes?: true
    listeningMinutes?: true
    moduleScores?: true
    _all?: true
  }

  export type UserProgressDayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgressDay to aggregate.
     */
    where?: UserProgressDayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgressDays to fetch.
     */
    orderBy?: UserProgressDayOrderByWithRelationInput | UserProgressDayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProgressDayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgressDays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgressDays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProgressDays
    **/
    _count?: true | UserProgressDayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProgressDayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProgressDaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProgressDayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProgressDayMaxAggregateInputType
  }

  export type GetUserProgressDayAggregateType<T extends UserProgressDayAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProgressDay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProgressDay[P]>
      : GetScalarType<T[P], AggregateUserProgressDay[P]>
  }




  export type UserProgressDayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressDayWhereInput
    orderBy?: UserProgressDayOrderByWithAggregationInput | UserProgressDayOrderByWithAggregationInput[]
    by: UserProgressDayScalarFieldEnum[] | UserProgressDayScalarFieldEnum
    having?: UserProgressDayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProgressDayCountAggregateInputType | true
    _avg?: UserProgressDayAvgAggregateInputType
    _sum?: UserProgressDaySumAggregateInputType
    _min?: UserProgressDayMinAggregateInputType
    _max?: UserProgressDayMaxAggregateInputType
  }

  export type UserProgressDayGroupByOutputType = {
    id: string
    userId: string
    studyDate: Date
    minutes: number
    wordsLearned: number
    wordCorrect: number
    wordTotal: number
    quizzesDone: number
    quizCorrect: number
    quizTotal: number
    speakingMinutes: number
    listeningMinutes: number
    moduleScores: JsonValue
    _count: UserProgressDayCountAggregateOutputType | null
    _avg: UserProgressDayAvgAggregateOutputType | null
    _sum: UserProgressDaySumAggregateOutputType | null
    _min: UserProgressDayMinAggregateOutputType | null
    _max: UserProgressDayMaxAggregateOutputType | null
  }

  type GetUserProgressDayGroupByPayload<T extends UserProgressDayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProgressDayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProgressDayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProgressDayGroupByOutputType[P]>
            : GetScalarType<T[P], UserProgressDayGroupByOutputType[P]>
        }
      >
    >


  export type UserProgressDaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    studyDate?: boolean
    minutes?: boolean
    wordsLearned?: boolean
    wordCorrect?: boolean
    wordTotal?: boolean
    quizzesDone?: boolean
    quizCorrect?: boolean
    quizTotal?: boolean
    speakingMinutes?: boolean
    listeningMinutes?: boolean
    moduleScores?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgressDay"]>

  export type UserProgressDaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    studyDate?: boolean
    minutes?: boolean
    wordsLearned?: boolean
    wordCorrect?: boolean
    wordTotal?: boolean
    quizzesDone?: boolean
    quizCorrect?: boolean
    quizTotal?: boolean
    speakingMinutes?: boolean
    listeningMinutes?: boolean
    moduleScores?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgressDay"]>

  export type UserProgressDaySelectScalar = {
    id?: boolean
    userId?: boolean
    studyDate?: boolean
    minutes?: boolean
    wordsLearned?: boolean
    wordCorrect?: boolean
    wordTotal?: boolean
    quizzesDone?: boolean
    quizCorrect?: boolean
    quizTotal?: boolean
    speakingMinutes?: boolean
    listeningMinutes?: boolean
    moduleScores?: boolean
  }

  export type UserProgressDayInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProgressDayIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserProgressDayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProgressDay"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      studyDate: Date
      minutes: number
      wordsLearned: number
      wordCorrect: number
      wordTotal: number
      quizzesDone: number
      quizCorrect: number
      quizTotal: number
      speakingMinutes: number
      listeningMinutes: number
      moduleScores: Prisma.JsonValue
    }, ExtArgs["result"]["userProgressDay"]>
    composites: {}
  }

  type UserProgressDayGetPayload<S extends boolean | null | undefined | UserProgressDayDefaultArgs> = $Result.GetResult<Prisma.$UserProgressDayPayload, S>

  type UserProgressDayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserProgressDayFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserProgressDayCountAggregateInputType | true
    }

  export interface UserProgressDayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProgressDay'], meta: { name: 'UserProgressDay' } }
    /**
     * Find zero or one UserProgressDay that matches the filter.
     * @param {UserProgressDayFindUniqueArgs} args - Arguments to find a UserProgressDay
     * @example
     * // Get one UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProgressDayFindUniqueArgs>(args: SelectSubset<T, UserProgressDayFindUniqueArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserProgressDay that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserProgressDayFindUniqueOrThrowArgs} args - Arguments to find a UserProgressDay
     * @example
     * // Get one UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProgressDayFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProgressDayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserProgressDay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayFindFirstArgs} args - Arguments to find a UserProgressDay
     * @example
     * // Get one UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProgressDayFindFirstArgs>(args?: SelectSubset<T, UserProgressDayFindFirstArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserProgressDay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayFindFirstOrThrowArgs} args - Arguments to find a UserProgressDay
     * @example
     * // Get one UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProgressDayFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProgressDayFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserProgressDays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProgressDays
     * const userProgressDays = await prisma.userProgressDay.findMany()
     * 
     * // Get first 10 UserProgressDays
     * const userProgressDays = await prisma.userProgressDay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProgressDayWithIdOnly = await prisma.userProgressDay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProgressDayFindManyArgs>(args?: SelectSubset<T, UserProgressDayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserProgressDay.
     * @param {UserProgressDayCreateArgs} args - Arguments to create a UserProgressDay.
     * @example
     * // Create one UserProgressDay
     * const UserProgressDay = await prisma.userProgressDay.create({
     *   data: {
     *     // ... data to create a UserProgressDay
     *   }
     * })
     * 
     */
    create<T extends UserProgressDayCreateArgs>(args: SelectSubset<T, UserProgressDayCreateArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserProgressDays.
     * @param {UserProgressDayCreateManyArgs} args - Arguments to create many UserProgressDays.
     * @example
     * // Create many UserProgressDays
     * const userProgressDay = await prisma.userProgressDay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProgressDayCreateManyArgs>(args?: SelectSubset<T, UserProgressDayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProgressDays and returns the data saved in the database.
     * @param {UserProgressDayCreateManyAndReturnArgs} args - Arguments to create many UserProgressDays.
     * @example
     * // Create many UserProgressDays
     * const userProgressDay = await prisma.userProgressDay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProgressDays and only return the `id`
     * const userProgressDayWithIdOnly = await prisma.userProgressDay.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProgressDayCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProgressDayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserProgressDay.
     * @param {UserProgressDayDeleteArgs} args - Arguments to delete one UserProgressDay.
     * @example
     * // Delete one UserProgressDay
     * const UserProgressDay = await prisma.userProgressDay.delete({
     *   where: {
     *     // ... filter to delete one UserProgressDay
     *   }
     * })
     * 
     */
    delete<T extends UserProgressDayDeleteArgs>(args: SelectSubset<T, UserProgressDayDeleteArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserProgressDay.
     * @param {UserProgressDayUpdateArgs} args - Arguments to update one UserProgressDay.
     * @example
     * // Update one UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProgressDayUpdateArgs>(args: SelectSubset<T, UserProgressDayUpdateArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserProgressDays.
     * @param {UserProgressDayDeleteManyArgs} args - Arguments to filter UserProgressDays to delete.
     * @example
     * // Delete a few UserProgressDays
     * const { count } = await prisma.userProgressDay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProgressDayDeleteManyArgs>(args?: SelectSubset<T, UserProgressDayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProgressDays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProgressDays
     * const userProgressDay = await prisma.userProgressDay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProgressDayUpdateManyArgs>(args: SelectSubset<T, UserProgressDayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserProgressDay.
     * @param {UserProgressDayUpsertArgs} args - Arguments to update or create a UserProgressDay.
     * @example
     * // Update or create a UserProgressDay
     * const userProgressDay = await prisma.userProgressDay.upsert({
     *   create: {
     *     // ... data to create a UserProgressDay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProgressDay we want to update
     *   }
     * })
     */
    upsert<T extends UserProgressDayUpsertArgs>(args: SelectSubset<T, UserProgressDayUpsertArgs<ExtArgs>>): Prisma__UserProgressDayClient<$Result.GetResult<Prisma.$UserProgressDayPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserProgressDays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayCountArgs} args - Arguments to filter UserProgressDays to count.
     * @example
     * // Count the number of UserProgressDays
     * const count = await prisma.userProgressDay.count({
     *   where: {
     *     // ... the filter for the UserProgressDays we want to count
     *   }
     * })
    **/
    count<T extends UserProgressDayCountArgs>(
      args?: Subset<T, UserProgressDayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProgressDayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProgressDay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProgressDayAggregateArgs>(args: Subset<T, UserProgressDayAggregateArgs>): Prisma.PrismaPromise<GetUserProgressDayAggregateType<T>>

    /**
     * Group by UserProgressDay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressDayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProgressDayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProgressDayGroupByArgs['orderBy'] }
        : { orderBy?: UserProgressDayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProgressDayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProgressDayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProgressDay model
   */
  readonly fields: UserProgressDayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProgressDay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProgressDayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProgressDay model
   */ 
  interface UserProgressDayFieldRefs {
    readonly id: FieldRef<"UserProgressDay", 'String'>
    readonly userId: FieldRef<"UserProgressDay", 'String'>
    readonly studyDate: FieldRef<"UserProgressDay", 'DateTime'>
    readonly minutes: FieldRef<"UserProgressDay", 'Int'>
    readonly wordsLearned: FieldRef<"UserProgressDay", 'Int'>
    readonly wordCorrect: FieldRef<"UserProgressDay", 'Int'>
    readonly wordTotal: FieldRef<"UserProgressDay", 'Int'>
    readonly quizzesDone: FieldRef<"UserProgressDay", 'Int'>
    readonly quizCorrect: FieldRef<"UserProgressDay", 'Int'>
    readonly quizTotal: FieldRef<"UserProgressDay", 'Int'>
    readonly speakingMinutes: FieldRef<"UserProgressDay", 'Int'>
    readonly listeningMinutes: FieldRef<"UserProgressDay", 'Int'>
    readonly moduleScores: FieldRef<"UserProgressDay", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * UserProgressDay findUnique
   */
  export type UserProgressDayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter, which UserProgressDay to fetch.
     */
    where: UserProgressDayWhereUniqueInput
  }

  /**
   * UserProgressDay findUniqueOrThrow
   */
  export type UserProgressDayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter, which UserProgressDay to fetch.
     */
    where: UserProgressDayWhereUniqueInput
  }

  /**
   * UserProgressDay findFirst
   */
  export type UserProgressDayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter, which UserProgressDay to fetch.
     */
    where?: UserProgressDayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgressDays to fetch.
     */
    orderBy?: UserProgressDayOrderByWithRelationInput | UserProgressDayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgressDays.
     */
    cursor?: UserProgressDayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgressDays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgressDays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgressDays.
     */
    distinct?: UserProgressDayScalarFieldEnum | UserProgressDayScalarFieldEnum[]
  }

  /**
   * UserProgressDay findFirstOrThrow
   */
  export type UserProgressDayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter, which UserProgressDay to fetch.
     */
    where?: UserProgressDayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgressDays to fetch.
     */
    orderBy?: UserProgressDayOrderByWithRelationInput | UserProgressDayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgressDays.
     */
    cursor?: UserProgressDayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgressDays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgressDays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgressDays.
     */
    distinct?: UserProgressDayScalarFieldEnum | UserProgressDayScalarFieldEnum[]
  }

  /**
   * UserProgressDay findMany
   */
  export type UserProgressDayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter, which UserProgressDays to fetch.
     */
    where?: UserProgressDayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgressDays to fetch.
     */
    orderBy?: UserProgressDayOrderByWithRelationInput | UserProgressDayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProgressDays.
     */
    cursor?: UserProgressDayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgressDays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgressDays.
     */
    skip?: number
    distinct?: UserProgressDayScalarFieldEnum | UserProgressDayScalarFieldEnum[]
  }

  /**
   * UserProgressDay create
   */
  export type UserProgressDayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProgressDay.
     */
    data: XOR<UserProgressDayCreateInput, UserProgressDayUncheckedCreateInput>
  }

  /**
   * UserProgressDay createMany
   */
  export type UserProgressDayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProgressDays.
     */
    data: UserProgressDayCreateManyInput | UserProgressDayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProgressDay createManyAndReturn
   */
  export type UserProgressDayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserProgressDays.
     */
    data: UserProgressDayCreateManyInput | UserProgressDayCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgressDay update
   */
  export type UserProgressDayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProgressDay.
     */
    data: XOR<UserProgressDayUpdateInput, UserProgressDayUncheckedUpdateInput>
    /**
     * Choose, which UserProgressDay to update.
     */
    where: UserProgressDayWhereUniqueInput
  }

  /**
   * UserProgressDay updateMany
   */
  export type UserProgressDayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProgressDays.
     */
    data: XOR<UserProgressDayUpdateManyMutationInput, UserProgressDayUncheckedUpdateManyInput>
    /**
     * Filter which UserProgressDays to update
     */
    where?: UserProgressDayWhereInput
  }

  /**
   * UserProgressDay upsert
   */
  export type UserProgressDayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProgressDay to update in case it exists.
     */
    where: UserProgressDayWhereUniqueInput
    /**
     * In case the UserProgressDay found by the `where` argument doesn't exist, create a new UserProgressDay with this data.
     */
    create: XOR<UserProgressDayCreateInput, UserProgressDayUncheckedCreateInput>
    /**
     * In case the UserProgressDay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProgressDayUpdateInput, UserProgressDayUncheckedUpdateInput>
  }

  /**
   * UserProgressDay delete
   */
  export type UserProgressDayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
    /**
     * Filter which UserProgressDay to delete.
     */
    where: UserProgressDayWhereUniqueInput
  }

  /**
   * UserProgressDay deleteMany
   */
  export type UserProgressDayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgressDays to delete
     */
    where?: UserProgressDayWhereInput
  }

  /**
   * UserProgressDay without action
   */
  export type UserProgressDayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgressDay
     */
    select?: UserProgressDaySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressDayInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    authorId: string | null
    topic: string | null
    content: string | null
    createdAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    authorId: string | null
    topic: string | null
    content: string | null
    createdAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    authorId: number
    topic: number
    content: number
    createdAt: number
    _all: number
  }


  export type PostMinAggregateInputType = {
    id?: true
    authorId?: true
    topic?: true
    content?: true
    createdAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    authorId?: true
    topic?: true
    content?: true
    createdAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    authorId?: true
    topic?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    authorId: string
    topic: string
    content: string
    createdAt: Date
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    topic?: boolean
    content?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    likes?: boolean | Post$likesArgs<ExtArgs>
    comments?: boolean | Post$commentsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    topic?: boolean
    content?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    authorId?: boolean
    topic?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    likes?: boolean | Post$likesArgs<ExtArgs>
    comments?: boolean | Post$commentsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      likes: Prisma.$LikePostPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authorId: string
      topic: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    likes<T extends Post$likesArgs<ExtArgs> = {}>(args?: Subset<T, Post$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findMany"> | Null>
    comments<T extends Post$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Post$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */ 
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly authorId: FieldRef<"Post", 'String'>
    readonly topic: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
  }

  /**
   * Post.likes
   */
  export type Post$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    where?: LikePostWhereInput
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    cursor?: LikePostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikePostScalarFieldEnum | LikePostScalarFieldEnum[]
  }

  /**
   * Post.comments
   */
  export type Post$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model LikePost
   */

  export type AggregateLikePost = {
    _count: LikePostCountAggregateOutputType | null
    _min: LikePostMinAggregateOutputType | null
    _max: LikePostMaxAggregateOutputType | null
  }

  export type LikePostMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
  }

  export type LikePostMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
  }

  export type LikePostCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    _all: number
  }


  export type LikePostMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type LikePostMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type LikePostCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    _all?: true
  }

  export type LikePostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LikePost to aggregate.
     */
    where?: LikePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LikePosts to fetch.
     */
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LikePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LikePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LikePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LikePosts
    **/
    _count?: true | LikePostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LikePostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LikePostMaxAggregateInputType
  }

  export type GetLikePostAggregateType<T extends LikePostAggregateArgs> = {
        [P in keyof T & keyof AggregateLikePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLikePost[P]>
      : GetScalarType<T[P], AggregateLikePost[P]>
  }




  export type LikePostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikePostWhereInput
    orderBy?: LikePostOrderByWithAggregationInput | LikePostOrderByWithAggregationInput[]
    by: LikePostScalarFieldEnum[] | LikePostScalarFieldEnum
    having?: LikePostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LikePostCountAggregateInputType | true
    _min?: LikePostMinAggregateInputType
    _max?: LikePostMaxAggregateInputType
  }

  export type LikePostGroupByOutputType = {
    id: string
    postId: string
    userId: string
    _count: LikePostCountAggregateOutputType | null
    _min: LikePostMinAggregateOutputType | null
    _max: LikePostMaxAggregateOutputType | null
  }

  type GetLikePostGroupByPayload<T extends LikePostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LikePostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LikePostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LikePostGroupByOutputType[P]>
            : GetScalarType<T[P], LikePostGroupByOutputType[P]>
        }
      >
    >


  export type LikePostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["likePost"]>

  export type LikePostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["likePost"]>

  export type LikePostSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
  }

  export type LikePostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LikePostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LikePostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LikePost"
    objects: {
      post: Prisma.$PostPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
    }, ExtArgs["result"]["likePost"]>
    composites: {}
  }

  type LikePostGetPayload<S extends boolean | null | undefined | LikePostDefaultArgs> = $Result.GetResult<Prisma.$LikePostPayload, S>

  type LikePostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LikePostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LikePostCountAggregateInputType | true
    }

  export interface LikePostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LikePost'], meta: { name: 'LikePost' } }
    /**
     * Find zero or one LikePost that matches the filter.
     * @param {LikePostFindUniqueArgs} args - Arguments to find a LikePost
     * @example
     * // Get one LikePost
     * const likePost = await prisma.likePost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LikePostFindUniqueArgs>(args: SelectSubset<T, LikePostFindUniqueArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LikePost that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LikePostFindUniqueOrThrowArgs} args - Arguments to find a LikePost
     * @example
     * // Get one LikePost
     * const likePost = await prisma.likePost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LikePostFindUniqueOrThrowArgs>(args: SelectSubset<T, LikePostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LikePost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostFindFirstArgs} args - Arguments to find a LikePost
     * @example
     * // Get one LikePost
     * const likePost = await prisma.likePost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LikePostFindFirstArgs>(args?: SelectSubset<T, LikePostFindFirstArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LikePost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostFindFirstOrThrowArgs} args - Arguments to find a LikePost
     * @example
     * // Get one LikePost
     * const likePost = await prisma.likePost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LikePostFindFirstOrThrowArgs>(args?: SelectSubset<T, LikePostFindFirstOrThrowArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LikePosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LikePosts
     * const likePosts = await prisma.likePost.findMany()
     * 
     * // Get first 10 LikePosts
     * const likePosts = await prisma.likePost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const likePostWithIdOnly = await prisma.likePost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LikePostFindManyArgs>(args?: SelectSubset<T, LikePostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LikePost.
     * @param {LikePostCreateArgs} args - Arguments to create a LikePost.
     * @example
     * // Create one LikePost
     * const LikePost = await prisma.likePost.create({
     *   data: {
     *     // ... data to create a LikePost
     *   }
     * })
     * 
     */
    create<T extends LikePostCreateArgs>(args: SelectSubset<T, LikePostCreateArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LikePosts.
     * @param {LikePostCreateManyArgs} args - Arguments to create many LikePosts.
     * @example
     * // Create many LikePosts
     * const likePost = await prisma.likePost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LikePostCreateManyArgs>(args?: SelectSubset<T, LikePostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LikePosts and returns the data saved in the database.
     * @param {LikePostCreateManyAndReturnArgs} args - Arguments to create many LikePosts.
     * @example
     * // Create many LikePosts
     * const likePost = await prisma.likePost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LikePosts and only return the `id`
     * const likePostWithIdOnly = await prisma.likePost.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LikePostCreateManyAndReturnArgs>(args?: SelectSubset<T, LikePostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LikePost.
     * @param {LikePostDeleteArgs} args - Arguments to delete one LikePost.
     * @example
     * // Delete one LikePost
     * const LikePost = await prisma.likePost.delete({
     *   where: {
     *     // ... filter to delete one LikePost
     *   }
     * })
     * 
     */
    delete<T extends LikePostDeleteArgs>(args: SelectSubset<T, LikePostDeleteArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LikePost.
     * @param {LikePostUpdateArgs} args - Arguments to update one LikePost.
     * @example
     * // Update one LikePost
     * const likePost = await prisma.likePost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LikePostUpdateArgs>(args: SelectSubset<T, LikePostUpdateArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LikePosts.
     * @param {LikePostDeleteManyArgs} args - Arguments to filter LikePosts to delete.
     * @example
     * // Delete a few LikePosts
     * const { count } = await prisma.likePost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LikePostDeleteManyArgs>(args?: SelectSubset<T, LikePostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LikePosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LikePosts
     * const likePost = await prisma.likePost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LikePostUpdateManyArgs>(args: SelectSubset<T, LikePostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LikePost.
     * @param {LikePostUpsertArgs} args - Arguments to update or create a LikePost.
     * @example
     * // Update or create a LikePost
     * const likePost = await prisma.likePost.upsert({
     *   create: {
     *     // ... data to create a LikePost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LikePost we want to update
     *   }
     * })
     */
    upsert<T extends LikePostUpsertArgs>(args: SelectSubset<T, LikePostUpsertArgs<ExtArgs>>): Prisma__LikePostClient<$Result.GetResult<Prisma.$LikePostPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LikePosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostCountArgs} args - Arguments to filter LikePosts to count.
     * @example
     * // Count the number of LikePosts
     * const count = await prisma.likePost.count({
     *   where: {
     *     // ... the filter for the LikePosts we want to count
     *   }
     * })
    **/
    count<T extends LikePostCountArgs>(
      args?: Subset<T, LikePostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LikePostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LikePost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LikePostAggregateArgs>(args: Subset<T, LikePostAggregateArgs>): Prisma.PrismaPromise<GetLikePostAggregateType<T>>

    /**
     * Group by LikePost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikePostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LikePostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LikePostGroupByArgs['orderBy'] }
        : { orderBy?: LikePostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LikePostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLikePostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LikePost model
   */
  readonly fields: LikePostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LikePost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LikePostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LikePost model
   */ 
  interface LikePostFieldRefs {
    readonly id: FieldRef<"LikePost", 'String'>
    readonly postId: FieldRef<"LikePost", 'String'>
    readonly userId: FieldRef<"LikePost", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LikePost findUnique
   */
  export type LikePostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter, which LikePost to fetch.
     */
    where: LikePostWhereUniqueInput
  }

  /**
   * LikePost findUniqueOrThrow
   */
  export type LikePostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter, which LikePost to fetch.
     */
    where: LikePostWhereUniqueInput
  }

  /**
   * LikePost findFirst
   */
  export type LikePostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter, which LikePost to fetch.
     */
    where?: LikePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LikePosts to fetch.
     */
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LikePosts.
     */
    cursor?: LikePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LikePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LikePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LikePosts.
     */
    distinct?: LikePostScalarFieldEnum | LikePostScalarFieldEnum[]
  }

  /**
   * LikePost findFirstOrThrow
   */
  export type LikePostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter, which LikePost to fetch.
     */
    where?: LikePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LikePosts to fetch.
     */
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LikePosts.
     */
    cursor?: LikePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LikePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LikePosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LikePosts.
     */
    distinct?: LikePostScalarFieldEnum | LikePostScalarFieldEnum[]
  }

  /**
   * LikePost findMany
   */
  export type LikePostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter, which LikePosts to fetch.
     */
    where?: LikePostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LikePosts to fetch.
     */
    orderBy?: LikePostOrderByWithRelationInput | LikePostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LikePosts.
     */
    cursor?: LikePostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LikePosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LikePosts.
     */
    skip?: number
    distinct?: LikePostScalarFieldEnum | LikePostScalarFieldEnum[]
  }

  /**
   * LikePost create
   */
  export type LikePostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * The data needed to create a LikePost.
     */
    data: XOR<LikePostCreateInput, LikePostUncheckedCreateInput>
  }

  /**
   * LikePost createMany
   */
  export type LikePostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LikePosts.
     */
    data: LikePostCreateManyInput | LikePostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LikePost createManyAndReturn
   */
  export type LikePostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LikePosts.
     */
    data: LikePostCreateManyInput | LikePostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LikePost update
   */
  export type LikePostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * The data needed to update a LikePost.
     */
    data: XOR<LikePostUpdateInput, LikePostUncheckedUpdateInput>
    /**
     * Choose, which LikePost to update.
     */
    where: LikePostWhereUniqueInput
  }

  /**
   * LikePost updateMany
   */
  export type LikePostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LikePosts.
     */
    data: XOR<LikePostUpdateManyMutationInput, LikePostUncheckedUpdateManyInput>
    /**
     * Filter which LikePosts to update
     */
    where?: LikePostWhereInput
  }

  /**
   * LikePost upsert
   */
  export type LikePostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * The filter to search for the LikePost to update in case it exists.
     */
    where: LikePostWhereUniqueInput
    /**
     * In case the LikePost found by the `where` argument doesn't exist, create a new LikePost with this data.
     */
    create: XOR<LikePostCreateInput, LikePostUncheckedCreateInput>
    /**
     * In case the LikePost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LikePostUpdateInput, LikePostUncheckedUpdateInput>
  }

  /**
   * LikePost delete
   */
  export type LikePostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
    /**
     * Filter which LikePost to delete.
     */
    where: LikePostWhereUniqueInput
  }

  /**
   * LikePost deleteMany
   */
  export type LikePostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LikePosts to delete
     */
    where?: LikePostWhereInput
  }

  /**
   * LikePost without action
   */
  export type LikePostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LikePost
     */
    select?: LikePostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikePostInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    content: string | null
    createdAt: Date | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    content: string | null
    createdAt: Date | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    content: number
    createdAt: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    createdAt?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    createdAt?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    postId: string
    userId: string
    content: string
    createdAt: Date
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      post: Prisma.$PostPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */ 
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly postId: FieldRef<"Comment", 'String'>
    readonly userId: FieldRef<"Comment", 'String'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionAvgAggregateOutputType = {
    amountTotal: number | null
  }

  export type SubscriptionSumAggregateOutputType = {
    amountTotal: number | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    status: string | null
    tier: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    amountTotal: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    status: string | null
    tier: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    amountTotal: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    stripePriceId: number
    status: number
    tier: number
    currentPeriodStart: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    amountTotal: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionAvgAggregateInputType = {
    amountTotal?: true
  }

  export type SubscriptionSumAggregateInputType = {
    amountTotal?: true
  }

  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    tier?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    amountTotal?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    tier?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    amountTotal?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    status?: true
    tier?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    amountTotal?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _avg?: SubscriptionAvgAggregateInputType
    _sum?: SubscriptionSumAggregateInputType
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    status: string
    tier: string
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    amountTotal: number
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _avg: SubscriptionAvgAggregateOutputType | null
    _sum: SubscriptionSumAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    status?: boolean
    tier?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    amountTotal?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    status?: boolean
    tier?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    amountTotal?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    status?: boolean
    tier?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    amountTotal?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      stripePriceId: string | null
      status: string
      tier: string
      currentPeriodStart: Date | null
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
      amountTotal: number
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */ 
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly stripePriceId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly tier: FieldRef<"Subscription", 'String'>
    readonly currentPeriodStart: FieldRef<"Subscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"Subscription", 'Boolean'>
    readonly amountTotal: FieldRef<"Subscription", 'Int'>
    readonly currency: FieldRef<"Subscription", 'String'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model StripeEvent
   */

  export type AggregateStripeEvent = {
    _count: StripeEventCountAggregateOutputType | null
    _min: StripeEventMinAggregateOutputType | null
    _max: StripeEventMaxAggregateOutputType | null
  }

  export type StripeEventMinAggregateOutputType = {
    id: string | null
    type: string | null
    processedAt: Date | null
    userId: string | null
  }

  export type StripeEventMaxAggregateOutputType = {
    id: string | null
    type: string | null
    processedAt: Date | null
    userId: string | null
  }

  export type StripeEventCountAggregateOutputType = {
    id: number
    type: number
    processedAt: number
    payload: number
    userId: number
    _all: number
  }


  export type StripeEventMinAggregateInputType = {
    id?: true
    type?: true
    processedAt?: true
    userId?: true
  }

  export type StripeEventMaxAggregateInputType = {
    id?: true
    type?: true
    processedAt?: true
    userId?: true
  }

  export type StripeEventCountAggregateInputType = {
    id?: true
    type?: true
    processedAt?: true
    payload?: true
    userId?: true
    _all?: true
  }

  export type StripeEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeEvent to aggregate.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StripeEvents
    **/
    _count?: true | StripeEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StripeEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StripeEventMaxAggregateInputType
  }

  export type GetStripeEventAggregateType<T extends StripeEventAggregateArgs> = {
        [P in keyof T & keyof AggregateStripeEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStripeEvent[P]>
      : GetScalarType<T[P], AggregateStripeEvent[P]>
  }




  export type StripeEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StripeEventWhereInput
    orderBy?: StripeEventOrderByWithAggregationInput | StripeEventOrderByWithAggregationInput[]
    by: StripeEventScalarFieldEnum[] | StripeEventScalarFieldEnum
    having?: StripeEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StripeEventCountAggregateInputType | true
    _min?: StripeEventMinAggregateInputType
    _max?: StripeEventMaxAggregateInputType
  }

  export type StripeEventGroupByOutputType = {
    id: string
    type: string
    processedAt: Date
    payload: JsonValue
    userId: string | null
    _count: StripeEventCountAggregateOutputType | null
    _min: StripeEventMinAggregateOutputType | null
    _max: StripeEventMaxAggregateOutputType | null
  }

  type GetStripeEventGroupByPayload<T extends StripeEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StripeEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StripeEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StripeEventGroupByOutputType[P]>
            : GetScalarType<T[P], StripeEventGroupByOutputType[P]>
        }
      >
    >


  export type StripeEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    processedAt?: boolean
    payload?: boolean
    userId?: boolean
  }, ExtArgs["result"]["stripeEvent"]>

  export type StripeEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    processedAt?: boolean
    payload?: boolean
    userId?: boolean
  }, ExtArgs["result"]["stripeEvent"]>

  export type StripeEventSelectScalar = {
    id?: boolean
    type?: boolean
    processedAt?: boolean
    payload?: boolean
    userId?: boolean
  }


  export type $StripeEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StripeEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      processedAt: Date
      payload: Prisma.JsonValue
      userId: string | null
    }, ExtArgs["result"]["stripeEvent"]>
    composites: {}
  }

  type StripeEventGetPayload<S extends boolean | null | undefined | StripeEventDefaultArgs> = $Result.GetResult<Prisma.$StripeEventPayload, S>

  type StripeEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StripeEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StripeEventCountAggregateInputType | true
    }

  export interface StripeEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StripeEvent'], meta: { name: 'StripeEvent' } }
    /**
     * Find zero or one StripeEvent that matches the filter.
     * @param {StripeEventFindUniqueArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StripeEventFindUniqueArgs>(args: SelectSubset<T, StripeEventFindUniqueArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StripeEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StripeEventFindUniqueOrThrowArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StripeEventFindUniqueOrThrowArgs>(args: SelectSubset<T, StripeEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StripeEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindFirstArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StripeEventFindFirstArgs>(args?: SelectSubset<T, StripeEventFindFirstArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StripeEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindFirstOrThrowArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StripeEventFindFirstOrThrowArgs>(args?: SelectSubset<T, StripeEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StripeEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StripeEvents
     * const stripeEvents = await prisma.stripeEvent.findMany()
     * 
     * // Get first 10 StripeEvents
     * const stripeEvents = await prisma.stripeEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stripeEventWithIdOnly = await prisma.stripeEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StripeEventFindManyArgs>(args?: SelectSubset<T, StripeEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StripeEvent.
     * @param {StripeEventCreateArgs} args - Arguments to create a StripeEvent.
     * @example
     * // Create one StripeEvent
     * const StripeEvent = await prisma.stripeEvent.create({
     *   data: {
     *     // ... data to create a StripeEvent
     *   }
     * })
     * 
     */
    create<T extends StripeEventCreateArgs>(args: SelectSubset<T, StripeEventCreateArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StripeEvents.
     * @param {StripeEventCreateManyArgs} args - Arguments to create many StripeEvents.
     * @example
     * // Create many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StripeEventCreateManyArgs>(args?: SelectSubset<T, StripeEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StripeEvents and returns the data saved in the database.
     * @param {StripeEventCreateManyAndReturnArgs} args - Arguments to create many StripeEvents.
     * @example
     * // Create many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StripeEvents and only return the `id`
     * const stripeEventWithIdOnly = await prisma.stripeEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StripeEventCreateManyAndReturnArgs>(args?: SelectSubset<T, StripeEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StripeEvent.
     * @param {StripeEventDeleteArgs} args - Arguments to delete one StripeEvent.
     * @example
     * // Delete one StripeEvent
     * const StripeEvent = await prisma.stripeEvent.delete({
     *   where: {
     *     // ... filter to delete one StripeEvent
     *   }
     * })
     * 
     */
    delete<T extends StripeEventDeleteArgs>(args: SelectSubset<T, StripeEventDeleteArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StripeEvent.
     * @param {StripeEventUpdateArgs} args - Arguments to update one StripeEvent.
     * @example
     * // Update one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StripeEventUpdateArgs>(args: SelectSubset<T, StripeEventUpdateArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StripeEvents.
     * @param {StripeEventDeleteManyArgs} args - Arguments to filter StripeEvents to delete.
     * @example
     * // Delete a few StripeEvents
     * const { count } = await prisma.stripeEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StripeEventDeleteManyArgs>(args?: SelectSubset<T, StripeEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StripeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StripeEventUpdateManyArgs>(args: SelectSubset<T, StripeEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StripeEvent.
     * @param {StripeEventUpsertArgs} args - Arguments to update or create a StripeEvent.
     * @example
     * // Update or create a StripeEvent
     * const stripeEvent = await prisma.stripeEvent.upsert({
     *   create: {
     *     // ... data to create a StripeEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StripeEvent we want to update
     *   }
     * })
     */
    upsert<T extends StripeEventUpsertArgs>(args: SelectSubset<T, StripeEventUpsertArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StripeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventCountArgs} args - Arguments to filter StripeEvents to count.
     * @example
     * // Count the number of StripeEvents
     * const count = await prisma.stripeEvent.count({
     *   where: {
     *     // ... the filter for the StripeEvents we want to count
     *   }
     * })
    **/
    count<T extends StripeEventCountArgs>(
      args?: Subset<T, StripeEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StripeEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StripeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StripeEventAggregateArgs>(args: Subset<T, StripeEventAggregateArgs>): Prisma.PrismaPromise<GetStripeEventAggregateType<T>>

    /**
     * Group by StripeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StripeEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StripeEventGroupByArgs['orderBy'] }
        : { orderBy?: StripeEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StripeEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStripeEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StripeEvent model
   */
  readonly fields: StripeEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StripeEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StripeEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StripeEvent model
   */ 
  interface StripeEventFieldRefs {
    readonly id: FieldRef<"StripeEvent", 'String'>
    readonly type: FieldRef<"StripeEvent", 'String'>
    readonly processedAt: FieldRef<"StripeEvent", 'DateTime'>
    readonly payload: FieldRef<"StripeEvent", 'Json'>
    readonly userId: FieldRef<"StripeEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StripeEvent findUnique
   */
  export type StripeEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent findUniqueOrThrow
   */
  export type StripeEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent findFirst
   */
  export type StripeEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeEvents.
     */
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent findFirstOrThrow
   */
  export type StripeEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeEvents.
     */
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent findMany
   */
  export type StripeEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvents to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent create
   */
  export type StripeEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The data needed to create a StripeEvent.
     */
    data: XOR<StripeEventCreateInput, StripeEventUncheckedCreateInput>
  }

  /**
   * StripeEvent createMany
   */
  export type StripeEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StripeEvents.
     */
    data: StripeEventCreateManyInput | StripeEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeEvent createManyAndReturn
   */
  export type StripeEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StripeEvents.
     */
    data: StripeEventCreateManyInput | StripeEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeEvent update
   */
  export type StripeEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The data needed to update a StripeEvent.
     */
    data: XOR<StripeEventUpdateInput, StripeEventUncheckedUpdateInput>
    /**
     * Choose, which StripeEvent to update.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent updateMany
   */
  export type StripeEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StripeEvents.
     */
    data: XOR<StripeEventUpdateManyMutationInput, StripeEventUncheckedUpdateManyInput>
    /**
     * Filter which StripeEvents to update
     */
    where?: StripeEventWhereInput
  }

  /**
   * StripeEvent upsert
   */
  export type StripeEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The filter to search for the StripeEvent to update in case it exists.
     */
    where: StripeEventWhereUniqueInput
    /**
     * In case the StripeEvent found by the `where` argument doesn't exist, create a new StripeEvent with this data.
     */
    create: XOR<StripeEventCreateInput, StripeEventUncheckedCreateInput>
    /**
     * In case the StripeEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StripeEventUpdateInput, StripeEventUncheckedUpdateInput>
  }

  /**
   * StripeEvent delete
   */
  export type StripeEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter which StripeEvent to delete.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent deleteMany
   */
  export type StripeEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeEvents to delete
     */
    where?: StripeEventWhereInput
  }

  /**
   * StripeEvent without action
   */
  export type StripeEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LanguageScalarFieldEnum: {
    code: 'code',
    name: 'name',
    native: 'native',
    flag: 'flag',
    tagline: 'tagline',
    levels: 'levels',
    status: 'status'
  };

  export type LanguageScalarFieldEnum = (typeof LanguageScalarFieldEnum)[keyof typeof LanguageScalarFieldEnum]


  export const CourseScalarFieldEnum: {
    id: 'id',
    languageCode: 'languageCode',
    title: 'title',
    level: 'level',
    levelGroup: 'levelGroup',
    description: 'description',
    lessons: 'lessons',
    minutes: 'minutes',
    cover: 'cover',
    tags: 'tags',
    vipOnly: 'vipOnly',
    courseOrder: 'courseOrder'
  };

  export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum]


  export const WordBankScalarFieldEnum: {
    id: 'id',
    languageCode: 'languageCode',
    level: 'level',
    word: 'word',
    translation: 'translation',
    phonetic: 'phonetic',
    exampleSentence: 'exampleSentence',
    vocabOrder: 'vocabOrder'
  };

  export type WordBankScalarFieldEnum = (typeof WordBankScalarFieldEnum)[keyof typeof WordBankScalarFieldEnum]


  export const QuizScalarFieldEnum: {
    id: 'id',
    languageCode: 'languageCode',
    level: 'level',
    question: 'question',
    options: 'options',
    answer: 'answer',
    explain: 'explain',
    quizOrder: 'quizOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuizScalarFieldEnum = (typeof QuizScalarFieldEnum)[keyof typeof QuizScalarFieldEnum]


  export const ListeningScalarFieldEnum: {
    id: 'id',
    languageCode: 'languageCode',
    level: 'level',
    title: 'title',
    script: 'script',
    blanks: 'blanks',
    listenOrder: 'listenOrder'
  };

  export type ListeningScalarFieldEnum = (typeof ListeningScalarFieldEnum)[keyof typeof ListeningScalarFieldEnum]


  export const SpeakingScalarFieldEnum: {
    id: 'id',
    languageCode: 'languageCode',
    level: 'level',
    phrase: 'phrase',
    translation: 'translation',
    phonetic: 'phonetic',
    speakOrder: 'speakOrder'
  };

  export type SpeakingScalarFieldEnum = (typeof SpeakingScalarFieldEnum)[keyof typeof SpeakingScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    avatar: 'avatar',
    level: 'level',
    exp: 'exp',
    streak: 'streak',
    lastActive: 'lastActive',
    targetLanguage: 'targetLanguage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    role: 'role',
    goalMinutesPerDay: 'goalMinutesPerDay',
    jwtVersion: 'jwtVersion'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserProgressDayScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    studyDate: 'studyDate',
    minutes: 'minutes',
    wordsLearned: 'wordsLearned',
    wordCorrect: 'wordCorrect',
    wordTotal: 'wordTotal',
    quizzesDone: 'quizzesDone',
    quizCorrect: 'quizCorrect',
    quizTotal: 'quizTotal',
    speakingMinutes: 'speakingMinutes',
    listeningMinutes: 'listeningMinutes',
    moduleScores: 'moduleScores'
  };

  export type UserProgressDayScalarFieldEnum = (typeof UserProgressDayScalarFieldEnum)[keyof typeof UserProgressDayScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    authorId: 'authorId',
    topic: 'topic',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const LikePostScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId'
  };

  export type LikePostScalarFieldEnum = (typeof LikePostScalarFieldEnum)[keyof typeof LikePostScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    stripePriceId: 'stripePriceId',
    status: 'status',
    tier: 'tier',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    amountTotal: 'amountTotal',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const StripeEventScalarFieldEnum: {
    id: 'id',
    type: 'type',
    processedAt: 'processedAt',
    payload: 'payload',
    userId: 'userId'
  };

  export type StripeEventScalarFieldEnum = (typeof StripeEventScalarFieldEnum)[keyof typeof StripeEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type LanguageWhereInput = {
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    code?: StringFilter<"Language"> | string
    name?: StringFilter<"Language"> | string
    native?: StringFilter<"Language"> | string
    flag?: StringFilter<"Language"> | string
    tagline?: StringFilter<"Language"> | string
    levels?: JsonFilter<"Language">
    status?: StringFilter<"Language"> | string
    courses?: CourseListRelationFilter
    wordBank?: WordBankListRelationFilter
    quizzes?: QuizListRelationFilter
    listening?: ListeningListRelationFilter
    speaking?: SpeakingListRelationFilter
    users?: UserListRelationFilter
  }

  export type LanguageOrderByWithRelationInput = {
    code?: SortOrder
    name?: SortOrder
    native?: SortOrder
    flag?: SortOrder
    tagline?: SortOrder
    levels?: SortOrder
    status?: SortOrder
    courses?: CourseOrderByRelationAggregateInput
    wordBank?: WordBankOrderByRelationAggregateInput
    quizzes?: QuizOrderByRelationAggregateInput
    listening?: ListeningOrderByRelationAggregateInput
    speaking?: SpeakingOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
  }

  export type LanguageWhereUniqueInput = Prisma.AtLeast<{
    code?: string
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    name?: StringFilter<"Language"> | string
    native?: StringFilter<"Language"> | string
    flag?: StringFilter<"Language"> | string
    tagline?: StringFilter<"Language"> | string
    levels?: JsonFilter<"Language">
    status?: StringFilter<"Language"> | string
    courses?: CourseListRelationFilter
    wordBank?: WordBankListRelationFilter
    quizzes?: QuizListRelationFilter
    listening?: ListeningListRelationFilter
    speaking?: SpeakingListRelationFilter
    users?: UserListRelationFilter
  }, "code">

  export type LanguageOrderByWithAggregationInput = {
    code?: SortOrder
    name?: SortOrder
    native?: SortOrder
    flag?: SortOrder
    tagline?: SortOrder
    levels?: SortOrder
    status?: SortOrder
    _count?: LanguageCountOrderByAggregateInput
    _max?: LanguageMaxOrderByAggregateInput
    _min?: LanguageMinOrderByAggregateInput
  }

  export type LanguageScalarWhereWithAggregatesInput = {
    AND?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    OR?: LanguageScalarWhereWithAggregatesInput[]
    NOT?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    code?: StringWithAggregatesFilter<"Language"> | string
    name?: StringWithAggregatesFilter<"Language"> | string
    native?: StringWithAggregatesFilter<"Language"> | string
    flag?: StringWithAggregatesFilter<"Language"> | string
    tagline?: StringWithAggregatesFilter<"Language"> | string
    levels?: JsonWithAggregatesFilter<"Language">
    status?: StringWithAggregatesFilter<"Language"> | string
  }

  export type CourseWhereInput = {
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    id?: StringFilter<"Course"> | string
    languageCode?: StringFilter<"Course"> | string
    title?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    levelGroup?: StringFilter<"Course"> | string
    description?: StringFilter<"Course"> | string
    lessons?: IntFilter<"Course"> | number
    minutes?: IntFilter<"Course"> | number
    cover?: StringFilter<"Course"> | string
    tags?: JsonFilter<"Course">
    vipOnly?: BoolFilter<"Course"> | boolean
    courseOrder?: IntFilter<"Course"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }

  export type CourseOrderByWithRelationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    title?: SortOrder
    level?: SortOrder
    levelGroup?: SortOrder
    description?: SortOrder
    lessons?: SortOrder
    minutes?: SortOrder
    cover?: SortOrder
    tags?: SortOrder
    vipOnly?: SortOrder
    courseOrder?: SortOrder
    language?: LanguageOrderByWithRelationInput
  }

  export type CourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    languageCode?: StringFilter<"Course"> | string
    title?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    levelGroup?: StringFilter<"Course"> | string
    description?: StringFilter<"Course"> | string
    lessons?: IntFilter<"Course"> | number
    minutes?: IntFilter<"Course"> | number
    cover?: StringFilter<"Course"> | string
    tags?: JsonFilter<"Course">
    vipOnly?: BoolFilter<"Course"> | boolean
    courseOrder?: IntFilter<"Course"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }, "id">

  export type CourseOrderByWithAggregationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    title?: SortOrder
    level?: SortOrder
    levelGroup?: SortOrder
    description?: SortOrder
    lessons?: SortOrder
    minutes?: SortOrder
    cover?: SortOrder
    tags?: SortOrder
    vipOnly?: SortOrder
    courseOrder?: SortOrder
    _count?: CourseCountOrderByAggregateInput
    _avg?: CourseAvgOrderByAggregateInput
    _max?: CourseMaxOrderByAggregateInput
    _min?: CourseMinOrderByAggregateInput
    _sum?: CourseSumOrderByAggregateInput
  }

  export type CourseScalarWhereWithAggregatesInput = {
    AND?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    OR?: CourseScalarWhereWithAggregatesInput[]
    NOT?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Course"> | string
    languageCode?: StringWithAggregatesFilter<"Course"> | string
    title?: StringWithAggregatesFilter<"Course"> | string
    level?: StringWithAggregatesFilter<"Course"> | string
    levelGroup?: StringWithAggregatesFilter<"Course"> | string
    description?: StringWithAggregatesFilter<"Course"> | string
    lessons?: IntWithAggregatesFilter<"Course"> | number
    minutes?: IntWithAggregatesFilter<"Course"> | number
    cover?: StringWithAggregatesFilter<"Course"> | string
    tags?: JsonWithAggregatesFilter<"Course">
    vipOnly?: BoolWithAggregatesFilter<"Course"> | boolean
    courseOrder?: IntWithAggregatesFilter<"Course"> | number
  }

  export type WordBankWhereInput = {
    AND?: WordBankWhereInput | WordBankWhereInput[]
    OR?: WordBankWhereInput[]
    NOT?: WordBankWhereInput | WordBankWhereInput[]
    id?: StringFilter<"WordBank"> | string
    languageCode?: StringFilter<"WordBank"> | string
    level?: StringFilter<"WordBank"> | string
    word?: StringFilter<"WordBank"> | string
    translation?: StringFilter<"WordBank"> | string
    phonetic?: StringNullableFilter<"WordBank"> | string | null
    exampleSentence?: StringFilter<"WordBank"> | string
    vocabOrder?: IntFilter<"WordBank"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }

  export type WordBankOrderByWithRelationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrderInput | SortOrder
    exampleSentence?: SortOrder
    vocabOrder?: SortOrder
    language?: LanguageOrderByWithRelationInput
  }

  export type WordBankWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WordBankWhereInput | WordBankWhereInput[]
    OR?: WordBankWhereInput[]
    NOT?: WordBankWhereInput | WordBankWhereInput[]
    languageCode?: StringFilter<"WordBank"> | string
    level?: StringFilter<"WordBank"> | string
    word?: StringFilter<"WordBank"> | string
    translation?: StringFilter<"WordBank"> | string
    phonetic?: StringNullableFilter<"WordBank"> | string | null
    exampleSentence?: StringFilter<"WordBank"> | string
    vocabOrder?: IntFilter<"WordBank"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }, "id">

  export type WordBankOrderByWithAggregationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrderInput | SortOrder
    exampleSentence?: SortOrder
    vocabOrder?: SortOrder
    _count?: WordBankCountOrderByAggregateInput
    _avg?: WordBankAvgOrderByAggregateInput
    _max?: WordBankMaxOrderByAggregateInput
    _min?: WordBankMinOrderByAggregateInput
    _sum?: WordBankSumOrderByAggregateInput
  }

  export type WordBankScalarWhereWithAggregatesInput = {
    AND?: WordBankScalarWhereWithAggregatesInput | WordBankScalarWhereWithAggregatesInput[]
    OR?: WordBankScalarWhereWithAggregatesInput[]
    NOT?: WordBankScalarWhereWithAggregatesInput | WordBankScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WordBank"> | string
    languageCode?: StringWithAggregatesFilter<"WordBank"> | string
    level?: StringWithAggregatesFilter<"WordBank"> | string
    word?: StringWithAggregatesFilter<"WordBank"> | string
    translation?: StringWithAggregatesFilter<"WordBank"> | string
    phonetic?: StringNullableWithAggregatesFilter<"WordBank"> | string | null
    exampleSentence?: StringWithAggregatesFilter<"WordBank"> | string
    vocabOrder?: IntWithAggregatesFilter<"WordBank"> | number
  }

  export type QuizWhereInput = {
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    id?: StringFilter<"Quiz"> | string
    languageCode?: StringFilter<"Quiz"> | string
    level?: StringFilter<"Quiz"> | string
    question?: StringFilter<"Quiz"> | string
    options?: JsonFilter<"Quiz">
    answer?: IntFilter<"Quiz"> | number
    explain?: StringFilter<"Quiz"> | string
    quizOrder?: IntFilter<"Quiz"> | number
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }

  export type QuizOrderByWithRelationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    question?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explain?: SortOrder
    quizOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    language?: LanguageOrderByWithRelationInput
  }

  export type QuizWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    languageCode?: StringFilter<"Quiz"> | string
    level?: StringFilter<"Quiz"> | string
    question?: StringFilter<"Quiz"> | string
    options?: JsonFilter<"Quiz">
    answer?: IntFilter<"Quiz"> | number
    explain?: StringFilter<"Quiz"> | string
    quizOrder?: IntFilter<"Quiz"> | number
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }, "id">

  export type QuizOrderByWithAggregationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    question?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explain?: SortOrder
    quizOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuizCountOrderByAggregateInput
    _avg?: QuizAvgOrderByAggregateInput
    _max?: QuizMaxOrderByAggregateInput
    _min?: QuizMinOrderByAggregateInput
    _sum?: QuizSumOrderByAggregateInput
  }

  export type QuizScalarWhereWithAggregatesInput = {
    AND?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    OR?: QuizScalarWhereWithAggregatesInput[]
    NOT?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quiz"> | string
    languageCode?: StringWithAggregatesFilter<"Quiz"> | string
    level?: StringWithAggregatesFilter<"Quiz"> | string
    question?: StringWithAggregatesFilter<"Quiz"> | string
    options?: JsonWithAggregatesFilter<"Quiz">
    answer?: IntWithAggregatesFilter<"Quiz"> | number
    explain?: StringWithAggregatesFilter<"Quiz"> | string
    quizOrder?: IntWithAggregatesFilter<"Quiz"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
  }

  export type ListeningWhereInput = {
    AND?: ListeningWhereInput | ListeningWhereInput[]
    OR?: ListeningWhereInput[]
    NOT?: ListeningWhereInput | ListeningWhereInput[]
    id?: StringFilter<"Listening"> | string
    languageCode?: StringFilter<"Listening"> | string
    level?: StringFilter<"Listening"> | string
    title?: StringFilter<"Listening"> | string
    script?: StringFilter<"Listening"> | string
    blanks?: JsonFilter<"Listening">
    listenOrder?: IntFilter<"Listening"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }

  export type ListeningOrderByWithRelationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    title?: SortOrder
    script?: SortOrder
    blanks?: SortOrder
    listenOrder?: SortOrder
    language?: LanguageOrderByWithRelationInput
  }

  export type ListeningWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ListeningWhereInput | ListeningWhereInput[]
    OR?: ListeningWhereInput[]
    NOT?: ListeningWhereInput | ListeningWhereInput[]
    languageCode?: StringFilter<"Listening"> | string
    level?: StringFilter<"Listening"> | string
    title?: StringFilter<"Listening"> | string
    script?: StringFilter<"Listening"> | string
    blanks?: JsonFilter<"Listening">
    listenOrder?: IntFilter<"Listening"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }, "id">

  export type ListeningOrderByWithAggregationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    title?: SortOrder
    script?: SortOrder
    blanks?: SortOrder
    listenOrder?: SortOrder
    _count?: ListeningCountOrderByAggregateInput
    _avg?: ListeningAvgOrderByAggregateInput
    _max?: ListeningMaxOrderByAggregateInput
    _min?: ListeningMinOrderByAggregateInput
    _sum?: ListeningSumOrderByAggregateInput
  }

  export type ListeningScalarWhereWithAggregatesInput = {
    AND?: ListeningScalarWhereWithAggregatesInput | ListeningScalarWhereWithAggregatesInput[]
    OR?: ListeningScalarWhereWithAggregatesInput[]
    NOT?: ListeningScalarWhereWithAggregatesInput | ListeningScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Listening"> | string
    languageCode?: StringWithAggregatesFilter<"Listening"> | string
    level?: StringWithAggregatesFilter<"Listening"> | string
    title?: StringWithAggregatesFilter<"Listening"> | string
    script?: StringWithAggregatesFilter<"Listening"> | string
    blanks?: JsonWithAggregatesFilter<"Listening">
    listenOrder?: IntWithAggregatesFilter<"Listening"> | number
  }

  export type SpeakingWhereInput = {
    AND?: SpeakingWhereInput | SpeakingWhereInput[]
    OR?: SpeakingWhereInput[]
    NOT?: SpeakingWhereInput | SpeakingWhereInput[]
    id?: StringFilter<"Speaking"> | string
    languageCode?: StringFilter<"Speaking"> | string
    level?: StringFilter<"Speaking"> | string
    phrase?: StringFilter<"Speaking"> | string
    translation?: StringFilter<"Speaking"> | string
    phonetic?: StringNullableFilter<"Speaking"> | string | null
    speakOrder?: IntFilter<"Speaking"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }

  export type SpeakingOrderByWithRelationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    phrase?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrderInput | SortOrder
    speakOrder?: SortOrder
    language?: LanguageOrderByWithRelationInput
  }

  export type SpeakingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SpeakingWhereInput | SpeakingWhereInput[]
    OR?: SpeakingWhereInput[]
    NOT?: SpeakingWhereInput | SpeakingWhereInput[]
    languageCode?: StringFilter<"Speaking"> | string
    level?: StringFilter<"Speaking"> | string
    phrase?: StringFilter<"Speaking"> | string
    translation?: StringFilter<"Speaking"> | string
    phonetic?: StringNullableFilter<"Speaking"> | string | null
    speakOrder?: IntFilter<"Speaking"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
  }, "id">

  export type SpeakingOrderByWithAggregationInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    phrase?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrderInput | SortOrder
    speakOrder?: SortOrder
    _count?: SpeakingCountOrderByAggregateInput
    _avg?: SpeakingAvgOrderByAggregateInput
    _max?: SpeakingMaxOrderByAggregateInput
    _min?: SpeakingMinOrderByAggregateInput
    _sum?: SpeakingSumOrderByAggregateInput
  }

  export type SpeakingScalarWhereWithAggregatesInput = {
    AND?: SpeakingScalarWhereWithAggregatesInput | SpeakingScalarWhereWithAggregatesInput[]
    OR?: SpeakingScalarWhereWithAggregatesInput[]
    NOT?: SpeakingScalarWhereWithAggregatesInput | SpeakingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Speaking"> | string
    languageCode?: StringWithAggregatesFilter<"Speaking"> | string
    level?: StringWithAggregatesFilter<"Speaking"> | string
    phrase?: StringWithAggregatesFilter<"Speaking"> | string
    translation?: StringWithAggregatesFilter<"Speaking"> | string
    phonetic?: StringNullableWithAggregatesFilter<"Speaking"> | string | null
    speakOrder?: IntWithAggregatesFilter<"Speaking"> | number
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    exp?: IntFilter<"User"> | number
    streak?: IntFilter<"User"> | number
    lastActive?: DateTimeFilter<"User"> | Date | string
    targetLanguage?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    role?: StringFilter<"User"> | string
    goalMinutesPerDay?: IntFilter<"User"> | number
    jwtVersion?: IntFilter<"User"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
    progressDays?: UserProgressDayListRelationFilter
    posts?: PostListRelationFilter
    likedPosts?: LikePostListRelationFilter
    comments?: CommentListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    avatar?: SortOrderInput | SortOrder
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    lastActive?: SortOrder
    targetLanguage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
    language?: LanguageOrderByWithRelationInput
    progressDays?: UserProgressDayOrderByRelationAggregateInput
    posts?: PostOrderByRelationAggregateInput
    likedPosts?: LikePostOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
    subscription?: SubscriptionOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    exp?: IntFilter<"User"> | number
    streak?: IntFilter<"User"> | number
    lastActive?: DateTimeFilter<"User"> | Date | string
    targetLanguage?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    role?: StringFilter<"User"> | string
    goalMinutesPerDay?: IntFilter<"User"> | number
    jwtVersion?: IntFilter<"User"> | number
    language?: XOR<LanguageRelationFilter, LanguageWhereInput>
    progressDays?: UserProgressDayListRelationFilter
    posts?: PostListRelationFilter
    likedPosts?: LikePostListRelationFilter
    comments?: CommentListRelationFilter
    subscription?: XOR<SubscriptionNullableRelationFilter, SubscriptionWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    avatar?: SortOrderInput | SortOrder
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    lastActive?: SortOrder
    targetLanguage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    level?: IntWithAggregatesFilter<"User"> | number
    exp?: IntWithAggregatesFilter<"User"> | number
    streak?: IntWithAggregatesFilter<"User"> | number
    lastActive?: DateTimeWithAggregatesFilter<"User"> | Date | string
    targetLanguage?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    role?: StringWithAggregatesFilter<"User"> | string
    goalMinutesPerDay?: IntWithAggregatesFilter<"User"> | number
    jwtVersion?: IntWithAggregatesFilter<"User"> | number
  }

  export type UserProgressDayWhereInput = {
    AND?: UserProgressDayWhereInput | UserProgressDayWhereInput[]
    OR?: UserProgressDayWhereInput[]
    NOT?: UserProgressDayWhereInput | UserProgressDayWhereInput[]
    id?: StringFilter<"UserProgressDay"> | string
    userId?: StringFilter<"UserProgressDay"> | string
    studyDate?: DateTimeFilter<"UserProgressDay"> | Date | string
    minutes?: IntFilter<"UserProgressDay"> | number
    wordsLearned?: IntFilter<"UserProgressDay"> | number
    wordCorrect?: IntFilter<"UserProgressDay"> | number
    wordTotal?: IntFilter<"UserProgressDay"> | number
    quizzesDone?: IntFilter<"UserProgressDay"> | number
    quizCorrect?: IntFilter<"UserProgressDay"> | number
    quizTotal?: IntFilter<"UserProgressDay"> | number
    speakingMinutes?: IntFilter<"UserProgressDay"> | number
    listeningMinutes?: IntFilter<"UserProgressDay"> | number
    moduleScores?: JsonFilter<"UserProgressDay">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserProgressDayOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    studyDate?: SortOrder
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
    moduleScores?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserProgressDayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_studyDate?: UserProgressDayUserIdStudyDateCompoundUniqueInput
    AND?: UserProgressDayWhereInput | UserProgressDayWhereInput[]
    OR?: UserProgressDayWhereInput[]
    NOT?: UserProgressDayWhereInput | UserProgressDayWhereInput[]
    userId?: StringFilter<"UserProgressDay"> | string
    studyDate?: DateTimeFilter<"UserProgressDay"> | Date | string
    minutes?: IntFilter<"UserProgressDay"> | number
    wordsLearned?: IntFilter<"UserProgressDay"> | number
    wordCorrect?: IntFilter<"UserProgressDay"> | number
    wordTotal?: IntFilter<"UserProgressDay"> | number
    quizzesDone?: IntFilter<"UserProgressDay"> | number
    quizCorrect?: IntFilter<"UserProgressDay"> | number
    quizTotal?: IntFilter<"UserProgressDay"> | number
    speakingMinutes?: IntFilter<"UserProgressDay"> | number
    listeningMinutes?: IntFilter<"UserProgressDay"> | number
    moduleScores?: JsonFilter<"UserProgressDay">
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_studyDate">

  export type UserProgressDayOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    studyDate?: SortOrder
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
    moduleScores?: SortOrder
    _count?: UserProgressDayCountOrderByAggregateInput
    _avg?: UserProgressDayAvgOrderByAggregateInput
    _max?: UserProgressDayMaxOrderByAggregateInput
    _min?: UserProgressDayMinOrderByAggregateInput
    _sum?: UserProgressDaySumOrderByAggregateInput
  }

  export type UserProgressDayScalarWhereWithAggregatesInput = {
    AND?: UserProgressDayScalarWhereWithAggregatesInput | UserProgressDayScalarWhereWithAggregatesInput[]
    OR?: UserProgressDayScalarWhereWithAggregatesInput[]
    NOT?: UserProgressDayScalarWhereWithAggregatesInput | UserProgressDayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProgressDay"> | string
    userId?: StringWithAggregatesFilter<"UserProgressDay"> | string
    studyDate?: DateTimeWithAggregatesFilter<"UserProgressDay"> | Date | string
    minutes?: IntWithAggregatesFilter<"UserProgressDay"> | number
    wordsLearned?: IntWithAggregatesFilter<"UserProgressDay"> | number
    wordCorrect?: IntWithAggregatesFilter<"UserProgressDay"> | number
    wordTotal?: IntWithAggregatesFilter<"UserProgressDay"> | number
    quizzesDone?: IntWithAggregatesFilter<"UserProgressDay"> | number
    quizCorrect?: IntWithAggregatesFilter<"UserProgressDay"> | number
    quizTotal?: IntWithAggregatesFilter<"UserProgressDay"> | number
    speakingMinutes?: IntWithAggregatesFilter<"UserProgressDay"> | number
    listeningMinutes?: IntWithAggregatesFilter<"UserProgressDay"> | number
    moduleScores?: JsonWithAggregatesFilter<"UserProgressDay">
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    topic?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    author?: XOR<UserRelationFilter, UserWhereInput>
    likes?: LikePostListRelationFilter
    comments?: CommentListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    authorId?: SortOrder
    topic?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    author?: UserOrderByWithRelationInput
    likes?: LikePostOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    authorId?: StringFilter<"Post"> | string
    topic?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    author?: XOR<UserRelationFilter, UserWhereInput>
    likes?: LikePostListRelationFilter
    comments?: CommentListRelationFilter
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    authorId?: SortOrder
    topic?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Post"> | string
    authorId?: StringWithAggregatesFilter<"Post"> | string
    topic?: StringWithAggregatesFilter<"Post"> | string
    content?: StringWithAggregatesFilter<"Post"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type LikePostWhereInput = {
    AND?: LikePostWhereInput | LikePostWhereInput[]
    OR?: LikePostWhereInput[]
    NOT?: LikePostWhereInput | LikePostWhereInput[]
    id?: StringFilter<"LikePost"> | string
    postId?: StringFilter<"LikePost"> | string
    userId?: StringFilter<"LikePost"> | string
    post?: XOR<PostRelationFilter, PostWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type LikePostOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    post?: PostOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type LikePostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    postId_userId?: LikePostPostIdUserIdCompoundUniqueInput
    AND?: LikePostWhereInput | LikePostWhereInput[]
    OR?: LikePostWhereInput[]
    NOT?: LikePostWhereInput | LikePostWhereInput[]
    postId?: StringFilter<"LikePost"> | string
    userId?: StringFilter<"LikePost"> | string
    post?: XOR<PostRelationFilter, PostWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "postId_userId">

  export type LikePostOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    _count?: LikePostCountOrderByAggregateInput
    _max?: LikePostMaxOrderByAggregateInput
    _min?: LikePostMinOrderByAggregateInput
  }

  export type LikePostScalarWhereWithAggregatesInput = {
    AND?: LikePostScalarWhereWithAggregatesInput | LikePostScalarWhereWithAggregatesInput[]
    OR?: LikePostScalarWhereWithAggregatesInput[]
    NOT?: LikePostScalarWhereWithAggregatesInput | LikePostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LikePost"> | string
    postId?: StringWithAggregatesFilter<"LikePost"> | string
    userId?: StringWithAggregatesFilter<"LikePost"> | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    postId?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    post?: XOR<PostRelationFilter, PostWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    post?: PostOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    postId?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    post?: XOR<PostRelationFilter, PostWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    postId?: StringWithAggregatesFilter<"Comment"> | string
    userId?: StringWithAggregatesFilter<"Comment"> | string
    content?: StringWithAggregatesFilter<"Comment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    stripePriceId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    tier?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    amountTotal?: IntFilter<"Subscription"> | number
    currency?: StringFilter<"Subscription"> | string
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    stripePriceId?: SortOrderInput | SortOrder
    status?: SortOrder
    tier?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    amountTotal?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    stripePriceId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    tier?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"Subscription"> | boolean
    amountTotal?: IntFilter<"Subscription"> | number
    currency?: StringFilter<"Subscription"> | string
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    stripePriceId?: SortOrderInput | SortOrder
    status?: SortOrder
    tier?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    amountTotal?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _avg?: SubscriptionAvgOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
    _sum?: SubscriptionSumOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    stripePriceId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
    tier?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"Subscription"> | boolean
    amountTotal?: IntWithAggregatesFilter<"Subscription"> | number
    currency?: StringWithAggregatesFilter<"Subscription"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type StripeEventWhereInput = {
    AND?: StripeEventWhereInput | StripeEventWhereInput[]
    OR?: StripeEventWhereInput[]
    NOT?: StripeEventWhereInput | StripeEventWhereInput[]
    id?: StringFilter<"StripeEvent"> | string
    type?: StringFilter<"StripeEvent"> | string
    processedAt?: DateTimeFilter<"StripeEvent"> | Date | string
    payload?: JsonFilter<"StripeEvent">
    userId?: StringNullableFilter<"StripeEvent"> | string | null
  }

  export type StripeEventOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    processedAt?: SortOrder
    payload?: SortOrder
    userId?: SortOrderInput | SortOrder
  }

  export type StripeEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StripeEventWhereInput | StripeEventWhereInput[]
    OR?: StripeEventWhereInput[]
    NOT?: StripeEventWhereInput | StripeEventWhereInput[]
    type?: StringFilter<"StripeEvent"> | string
    processedAt?: DateTimeFilter<"StripeEvent"> | Date | string
    payload?: JsonFilter<"StripeEvent">
    userId?: StringNullableFilter<"StripeEvent"> | string | null
  }, "id">

  export type StripeEventOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    processedAt?: SortOrder
    payload?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: StripeEventCountOrderByAggregateInput
    _max?: StripeEventMaxOrderByAggregateInput
    _min?: StripeEventMinOrderByAggregateInput
  }

  export type StripeEventScalarWhereWithAggregatesInput = {
    AND?: StripeEventScalarWhereWithAggregatesInput | StripeEventScalarWhereWithAggregatesInput[]
    OR?: StripeEventScalarWhereWithAggregatesInput[]
    NOT?: StripeEventScalarWhereWithAggregatesInput | StripeEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StripeEvent"> | string
    type?: StringWithAggregatesFilter<"StripeEvent"> | string
    processedAt?: DateTimeWithAggregatesFilter<"StripeEvent"> | Date | string
    payload?: JsonWithAggregatesFilter<"StripeEvent">
    userId?: StringNullableWithAggregatesFilter<"StripeEvent"> | string | null
  }

  export type LanguageCreateInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateManyInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
  }

  export type LanguageUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
  }

  export type LanguageUncheckedUpdateManyInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CourseCreateInput = {
    id?: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
    language: LanguageCreateNestedOneWithoutCoursesInput
  }

  export type CourseUncheckedCreateInput = {
    id?: string
    languageCode: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
  }

  export type CourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutCoursesNestedInput
  }

  export type CourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CourseCreateManyInput = {
    id?: string
    languageCode: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
  }

  export type CourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankCreateInput = {
    id?: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
    language: LanguageCreateNestedOneWithoutWordBankInput
  }

  export type WordBankUncheckedCreateInput = {
    id?: string
    languageCode: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
  }

  export type WordBankUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutWordBankNestedInput
  }

  export type WordBankUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankCreateManyInput = {
    id?: string
    languageCode: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
  }

  export type WordBankUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type QuizCreateInput = {
    id?: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    language: LanguageCreateNestedOneWithoutQuizzesInput
  }

  export type QuizUncheckedCreateInput = {
    id?: string
    languageCode: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    language?: LanguageUpdateOneRequiredWithoutQuizzesNestedInput
  }

  export type QuizUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizCreateManyInput = {
    id?: string
    languageCode: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListeningCreateInput = {
    id?: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
    language: LanguageCreateNestedOneWithoutListeningInput
  }

  export type ListeningUncheckedCreateInput = {
    id?: string
    languageCode: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
  }

  export type ListeningUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutListeningNestedInput
  }

  export type ListeningUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ListeningCreateManyInput = {
    id?: string
    languageCode: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
  }

  export type ListeningUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ListeningUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingCreateInput = {
    id?: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
    language: LanguageCreateNestedOneWithoutSpeakingInput
  }

  export type SpeakingUncheckedCreateInput = {
    id?: string
    languageCode: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
  }

  export type SpeakingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutSpeakingNestedInput
  }

  export type SpeakingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingCreateManyInput = {
    id?: string
    languageCode: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
  }

  export type SpeakingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    languageCode?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
  }

  export type UserProgressDayCreateInput = {
    id?: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutProgressDaysInput
  }

  export type UserProgressDayUncheckedCreateInput = {
    id?: string
    userId: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutProgressDaysNestedInput
  }

  export type UserProgressDayUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayCreateManyInput = {
    id?: string
    userId: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type PostCreateInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutPostsInput
    likes?: LikePostCreateNestedManyWithoutPostInput
    comments?: CommentCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: string
    authorId: string
    topic: string
    content: string
    createdAt?: Date | string
    likes?: LikePostUncheckedCreateNestedManyWithoutPostInput
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutPostsNestedInput
    likes?: LikePostUpdateManyWithoutPostNestedInput
    comments?: CommentUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikePostUncheckedUpdateManyWithoutPostNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: string
    authorId: string
    topic: string
    content: string
    createdAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikePostCreateInput = {
    id?: string
    post: PostCreateNestedOneWithoutLikesInput
    user: UserCreateNestedOneWithoutLikedPostsInput
  }

  export type LikePostUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
  }

  export type LikePostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
    user?: UserUpdateOneRequiredWithoutLikedPostsNestedInput
  }

  export type LikePostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type LikePostCreateManyInput = {
    id?: string
    postId: string
    userId: string
  }

  export type LikePostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type LikePostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutCommentsInput
    user: UserCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    content: string
    createdAt?: Date | string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateManyInput = {
    id?: string
    postId: string
    userId: string
    content: string
    createdAt?: Date | string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    status?: string
    tier?: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    amountTotal?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    status?: string
    tier?: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    amountTotal?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    status?: string
    tier?: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    amountTotal?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeEventCreateInput = {
    id: string
    type: string
    processedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    userId?: string | null
  }

  export type StripeEventUncheckedCreateInput = {
    id: string
    type: string
    processedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    userId?: string | null
  }

  export type StripeEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StripeEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StripeEventCreateManyInput = {
    id: string
    type: string
    processedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    userId?: string | null
  }

  export type StripeEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StripeEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CourseListRelationFilter = {
    every?: CourseWhereInput
    some?: CourseWhereInput
    none?: CourseWhereInput
  }

  export type WordBankListRelationFilter = {
    every?: WordBankWhereInput
    some?: WordBankWhereInput
    none?: WordBankWhereInput
  }

  export type QuizListRelationFilter = {
    every?: QuizWhereInput
    some?: QuizWhereInput
    none?: QuizWhereInput
  }

  export type ListeningListRelationFilter = {
    every?: ListeningWhereInput
    some?: ListeningWhereInput
    none?: ListeningWhereInput
  }

  export type SpeakingListRelationFilter = {
    every?: SpeakingWhereInput
    some?: SpeakingWhereInput
    none?: SpeakingWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type CourseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WordBankOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ListeningOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SpeakingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LanguageCountOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    native?: SortOrder
    flag?: SortOrder
    tagline?: SortOrder
    levels?: SortOrder
    status?: SortOrder
  }

  export type LanguageMaxOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    native?: SortOrder
    flag?: SortOrder
    tagline?: SortOrder
    status?: SortOrder
  }

  export type LanguageMinOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    native?: SortOrder
    flag?: SortOrder
    tagline?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LanguageRelationFilter = {
    is?: LanguageWhereInput
    isNot?: LanguageWhereInput
  }

  export type CourseCountOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    title?: SortOrder
    level?: SortOrder
    levelGroup?: SortOrder
    description?: SortOrder
    lessons?: SortOrder
    minutes?: SortOrder
    cover?: SortOrder
    tags?: SortOrder
    vipOnly?: SortOrder
    courseOrder?: SortOrder
  }

  export type CourseAvgOrderByAggregateInput = {
    lessons?: SortOrder
    minutes?: SortOrder
    courseOrder?: SortOrder
  }

  export type CourseMaxOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    title?: SortOrder
    level?: SortOrder
    levelGroup?: SortOrder
    description?: SortOrder
    lessons?: SortOrder
    minutes?: SortOrder
    cover?: SortOrder
    vipOnly?: SortOrder
    courseOrder?: SortOrder
  }

  export type CourseMinOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    title?: SortOrder
    level?: SortOrder
    levelGroup?: SortOrder
    description?: SortOrder
    lessons?: SortOrder
    minutes?: SortOrder
    cover?: SortOrder
    vipOnly?: SortOrder
    courseOrder?: SortOrder
  }

  export type CourseSumOrderByAggregateInput = {
    lessons?: SortOrder
    minutes?: SortOrder
    courseOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WordBankCountOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    exampleSentence?: SortOrder
    vocabOrder?: SortOrder
  }

  export type WordBankAvgOrderByAggregateInput = {
    vocabOrder?: SortOrder
  }

  export type WordBankMaxOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    exampleSentence?: SortOrder
    vocabOrder?: SortOrder
  }

  export type WordBankMinOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    word?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    exampleSentence?: SortOrder
    vocabOrder?: SortOrder
  }

  export type WordBankSumOrderByAggregateInput = {
    vocabOrder?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type QuizCountOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    question?: SortOrder
    options?: SortOrder
    answer?: SortOrder
    explain?: SortOrder
    quizOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuizAvgOrderByAggregateInput = {
    answer?: SortOrder
    quizOrder?: SortOrder
  }

  export type QuizMaxOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    explain?: SortOrder
    quizOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuizMinOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    explain?: SortOrder
    quizOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuizSumOrderByAggregateInput = {
    answer?: SortOrder
    quizOrder?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ListeningCountOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    title?: SortOrder
    script?: SortOrder
    blanks?: SortOrder
    listenOrder?: SortOrder
  }

  export type ListeningAvgOrderByAggregateInput = {
    listenOrder?: SortOrder
  }

  export type ListeningMaxOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    title?: SortOrder
    script?: SortOrder
    listenOrder?: SortOrder
  }

  export type ListeningMinOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    title?: SortOrder
    script?: SortOrder
    listenOrder?: SortOrder
  }

  export type ListeningSumOrderByAggregateInput = {
    listenOrder?: SortOrder
  }

  export type SpeakingCountOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    phrase?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    speakOrder?: SortOrder
  }

  export type SpeakingAvgOrderByAggregateInput = {
    speakOrder?: SortOrder
  }

  export type SpeakingMaxOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    phrase?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    speakOrder?: SortOrder
  }

  export type SpeakingMinOrderByAggregateInput = {
    id?: SortOrder
    languageCode?: SortOrder
    level?: SortOrder
    phrase?: SortOrder
    translation?: SortOrder
    phonetic?: SortOrder
    speakOrder?: SortOrder
  }

  export type SpeakingSumOrderByAggregateInput = {
    speakOrder?: SortOrder
  }

  export type UserProgressDayListRelationFilter = {
    every?: UserProgressDayWhereInput
    some?: UserProgressDayWhereInput
    none?: UserProgressDayWhereInput
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type LikePostListRelationFilter = {
    every?: LikePostWhereInput
    some?: LikePostWhereInput
    none?: LikePostWhereInput
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type SubscriptionNullableRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type UserProgressDayOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LikePostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    avatar?: SortOrder
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    lastActive?: SortOrder
    targetLanguage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    avatar?: SortOrder
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    lastActive?: SortOrder
    targetLanguage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    avatar?: SortOrder
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    lastActive?: SortOrder
    targetLanguage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    level?: SortOrder
    exp?: SortOrder
    streak?: SortOrder
    goalMinutesPerDay?: SortOrder
    jwtVersion?: SortOrder
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserProgressDayUserIdStudyDateCompoundUniqueInput = {
    userId: string
    studyDate: Date | string
  }

  export type UserProgressDayCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studyDate?: SortOrder
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
    moduleScores?: SortOrder
  }

  export type UserProgressDayAvgOrderByAggregateInput = {
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
  }

  export type UserProgressDayMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studyDate?: SortOrder
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
  }

  export type UserProgressDayMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studyDate?: SortOrder
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
  }

  export type UserProgressDaySumOrderByAggregateInput = {
    minutes?: SortOrder
    wordsLearned?: SortOrder
    wordCorrect?: SortOrder
    wordTotal?: SortOrder
    quizzesDone?: SortOrder
    quizCorrect?: SortOrder
    quizTotal?: SortOrder
    speakingMinutes?: SortOrder
    listeningMinutes?: SortOrder
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    topic?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    topic?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    topic?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type PostRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type LikePostPostIdUserIdCompoundUniqueInput = {
    postId: string
    userId: string
  }

  export type LikePostCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type LikePostMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type LikePostMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    tier?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    amountTotal?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionAvgOrderByAggregateInput = {
    amountTotal?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    tier?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    amountTotal?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    status?: SortOrder
    tier?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    amountTotal?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionSumOrderByAggregateInput = {
    amountTotal?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StripeEventCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    processedAt?: SortOrder
    payload?: SortOrder
    userId?: SortOrder
  }

  export type StripeEventMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    processedAt?: SortOrder
    userId?: SortOrder
  }

  export type StripeEventMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    processedAt?: SortOrder
    userId?: SortOrder
  }

  export type CourseCreateNestedManyWithoutLanguageInput = {
    create?: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput> | CourseCreateWithoutLanguageInput[] | CourseUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: CourseCreateOrConnectWithoutLanguageInput | CourseCreateOrConnectWithoutLanguageInput[]
    createMany?: CourseCreateManyLanguageInputEnvelope
    connect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
  }

  export type WordBankCreateNestedManyWithoutLanguageInput = {
    create?: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput> | WordBankCreateWithoutLanguageInput[] | WordBankUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: WordBankCreateOrConnectWithoutLanguageInput | WordBankCreateOrConnectWithoutLanguageInput[]
    createMany?: WordBankCreateManyLanguageInputEnvelope
    connect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
  }

  export type QuizCreateNestedManyWithoutLanguageInput = {
    create?: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput> | QuizCreateWithoutLanguageInput[] | QuizUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutLanguageInput | QuizCreateOrConnectWithoutLanguageInput[]
    createMany?: QuizCreateManyLanguageInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type ListeningCreateNestedManyWithoutLanguageInput = {
    create?: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput> | ListeningCreateWithoutLanguageInput[] | ListeningUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: ListeningCreateOrConnectWithoutLanguageInput | ListeningCreateOrConnectWithoutLanguageInput[]
    createMany?: ListeningCreateManyLanguageInputEnvelope
    connect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
  }

  export type SpeakingCreateNestedManyWithoutLanguageInput = {
    create?: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput> | SpeakingCreateWithoutLanguageInput[] | SpeakingUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: SpeakingCreateOrConnectWithoutLanguageInput | SpeakingCreateOrConnectWithoutLanguageInput[]
    createMany?: SpeakingCreateManyLanguageInputEnvelope
    connect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutLanguageInput = {
    create?: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput> | UserCreateWithoutLanguageInput[] | UserUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLanguageInput | UserCreateOrConnectWithoutLanguageInput[]
    createMany?: UserCreateManyLanguageInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type CourseUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput> | CourseCreateWithoutLanguageInput[] | CourseUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: CourseCreateOrConnectWithoutLanguageInput | CourseCreateOrConnectWithoutLanguageInput[]
    createMany?: CourseCreateManyLanguageInputEnvelope
    connect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
  }

  export type WordBankUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput> | WordBankCreateWithoutLanguageInput[] | WordBankUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: WordBankCreateOrConnectWithoutLanguageInput | WordBankCreateOrConnectWithoutLanguageInput[]
    createMany?: WordBankCreateManyLanguageInputEnvelope
    connect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
  }

  export type QuizUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput> | QuizCreateWithoutLanguageInput[] | QuizUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutLanguageInput | QuizCreateOrConnectWithoutLanguageInput[]
    createMany?: QuizCreateManyLanguageInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type ListeningUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput> | ListeningCreateWithoutLanguageInput[] | ListeningUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: ListeningCreateOrConnectWithoutLanguageInput | ListeningCreateOrConnectWithoutLanguageInput[]
    createMany?: ListeningCreateManyLanguageInputEnvelope
    connect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
  }

  export type SpeakingUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput> | SpeakingCreateWithoutLanguageInput[] | SpeakingUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: SpeakingCreateOrConnectWithoutLanguageInput | SpeakingCreateOrConnectWithoutLanguageInput[]
    createMany?: SpeakingCreateManyLanguageInputEnvelope
    connect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput> | UserCreateWithoutLanguageInput[] | UserUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLanguageInput | UserCreateOrConnectWithoutLanguageInput[]
    createMany?: UserCreateManyLanguageInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type CourseUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput> | CourseCreateWithoutLanguageInput[] | CourseUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: CourseCreateOrConnectWithoutLanguageInput | CourseCreateOrConnectWithoutLanguageInput[]
    upsert?: CourseUpsertWithWhereUniqueWithoutLanguageInput | CourseUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: CourseCreateManyLanguageInputEnvelope
    set?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    disconnect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    delete?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    connect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    update?: CourseUpdateWithWhereUniqueWithoutLanguageInput | CourseUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: CourseUpdateManyWithWhereWithoutLanguageInput | CourseUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: CourseScalarWhereInput | CourseScalarWhereInput[]
  }

  export type WordBankUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput> | WordBankCreateWithoutLanguageInput[] | WordBankUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: WordBankCreateOrConnectWithoutLanguageInput | WordBankCreateOrConnectWithoutLanguageInput[]
    upsert?: WordBankUpsertWithWhereUniqueWithoutLanguageInput | WordBankUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: WordBankCreateManyLanguageInputEnvelope
    set?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    disconnect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    delete?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    connect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    update?: WordBankUpdateWithWhereUniqueWithoutLanguageInput | WordBankUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: WordBankUpdateManyWithWhereWithoutLanguageInput | WordBankUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: WordBankScalarWhereInput | WordBankScalarWhereInput[]
  }

  export type QuizUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput> | QuizCreateWithoutLanguageInput[] | QuizUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutLanguageInput | QuizCreateOrConnectWithoutLanguageInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutLanguageInput | QuizUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: QuizCreateManyLanguageInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutLanguageInput | QuizUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutLanguageInput | QuizUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type ListeningUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput> | ListeningCreateWithoutLanguageInput[] | ListeningUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: ListeningCreateOrConnectWithoutLanguageInput | ListeningCreateOrConnectWithoutLanguageInput[]
    upsert?: ListeningUpsertWithWhereUniqueWithoutLanguageInput | ListeningUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: ListeningCreateManyLanguageInputEnvelope
    set?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    disconnect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    delete?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    connect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    update?: ListeningUpdateWithWhereUniqueWithoutLanguageInput | ListeningUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: ListeningUpdateManyWithWhereWithoutLanguageInput | ListeningUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: ListeningScalarWhereInput | ListeningScalarWhereInput[]
  }

  export type SpeakingUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput> | SpeakingCreateWithoutLanguageInput[] | SpeakingUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: SpeakingCreateOrConnectWithoutLanguageInput | SpeakingCreateOrConnectWithoutLanguageInput[]
    upsert?: SpeakingUpsertWithWhereUniqueWithoutLanguageInput | SpeakingUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: SpeakingCreateManyLanguageInputEnvelope
    set?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    disconnect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    delete?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    connect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    update?: SpeakingUpdateWithWhereUniqueWithoutLanguageInput | SpeakingUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: SpeakingUpdateManyWithWhereWithoutLanguageInput | SpeakingUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: SpeakingScalarWhereInput | SpeakingScalarWhereInput[]
  }

  export type UserUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput> | UserCreateWithoutLanguageInput[] | UserUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLanguageInput | UserCreateOrConnectWithoutLanguageInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutLanguageInput | UserUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: UserCreateManyLanguageInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutLanguageInput | UserUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: UserUpdateManyWithWhereWithoutLanguageInput | UserUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type CourseUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput> | CourseCreateWithoutLanguageInput[] | CourseUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: CourseCreateOrConnectWithoutLanguageInput | CourseCreateOrConnectWithoutLanguageInput[]
    upsert?: CourseUpsertWithWhereUniqueWithoutLanguageInput | CourseUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: CourseCreateManyLanguageInputEnvelope
    set?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    disconnect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    delete?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    connect?: CourseWhereUniqueInput | CourseWhereUniqueInput[]
    update?: CourseUpdateWithWhereUniqueWithoutLanguageInput | CourseUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: CourseUpdateManyWithWhereWithoutLanguageInput | CourseUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: CourseScalarWhereInput | CourseScalarWhereInput[]
  }

  export type WordBankUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput> | WordBankCreateWithoutLanguageInput[] | WordBankUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: WordBankCreateOrConnectWithoutLanguageInput | WordBankCreateOrConnectWithoutLanguageInput[]
    upsert?: WordBankUpsertWithWhereUniqueWithoutLanguageInput | WordBankUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: WordBankCreateManyLanguageInputEnvelope
    set?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    disconnect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    delete?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    connect?: WordBankWhereUniqueInput | WordBankWhereUniqueInput[]
    update?: WordBankUpdateWithWhereUniqueWithoutLanguageInput | WordBankUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: WordBankUpdateManyWithWhereWithoutLanguageInput | WordBankUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: WordBankScalarWhereInput | WordBankScalarWhereInput[]
  }

  export type QuizUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput> | QuizCreateWithoutLanguageInput[] | QuizUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutLanguageInput | QuizCreateOrConnectWithoutLanguageInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutLanguageInput | QuizUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: QuizCreateManyLanguageInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutLanguageInput | QuizUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutLanguageInput | QuizUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type ListeningUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput> | ListeningCreateWithoutLanguageInput[] | ListeningUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: ListeningCreateOrConnectWithoutLanguageInput | ListeningCreateOrConnectWithoutLanguageInput[]
    upsert?: ListeningUpsertWithWhereUniqueWithoutLanguageInput | ListeningUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: ListeningCreateManyLanguageInputEnvelope
    set?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    disconnect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    delete?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    connect?: ListeningWhereUniqueInput | ListeningWhereUniqueInput[]
    update?: ListeningUpdateWithWhereUniqueWithoutLanguageInput | ListeningUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: ListeningUpdateManyWithWhereWithoutLanguageInput | ListeningUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: ListeningScalarWhereInput | ListeningScalarWhereInput[]
  }

  export type SpeakingUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput> | SpeakingCreateWithoutLanguageInput[] | SpeakingUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: SpeakingCreateOrConnectWithoutLanguageInput | SpeakingCreateOrConnectWithoutLanguageInput[]
    upsert?: SpeakingUpsertWithWhereUniqueWithoutLanguageInput | SpeakingUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: SpeakingCreateManyLanguageInputEnvelope
    set?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    disconnect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    delete?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    connect?: SpeakingWhereUniqueInput | SpeakingWhereUniqueInput[]
    update?: SpeakingUpdateWithWhereUniqueWithoutLanguageInput | SpeakingUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: SpeakingUpdateManyWithWhereWithoutLanguageInput | SpeakingUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: SpeakingScalarWhereInput | SpeakingScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput> | UserCreateWithoutLanguageInput[] | UserUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutLanguageInput | UserCreateOrConnectWithoutLanguageInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutLanguageInput | UserUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: UserCreateManyLanguageInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutLanguageInput | UserUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: UserUpdateManyWithWhereWithoutLanguageInput | UserUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type LanguageCreateNestedOneWithoutCoursesInput = {
    create?: XOR<LanguageCreateWithoutCoursesInput, LanguageUncheckedCreateWithoutCoursesInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutCoursesInput
    connect?: LanguageWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LanguageUpdateOneRequiredWithoutCoursesNestedInput = {
    create?: XOR<LanguageCreateWithoutCoursesInput, LanguageUncheckedCreateWithoutCoursesInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutCoursesInput
    upsert?: LanguageUpsertWithoutCoursesInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutCoursesInput, LanguageUpdateWithoutCoursesInput>, LanguageUncheckedUpdateWithoutCoursesInput>
  }

  export type LanguageCreateNestedOneWithoutWordBankInput = {
    create?: XOR<LanguageCreateWithoutWordBankInput, LanguageUncheckedCreateWithoutWordBankInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutWordBankInput
    connect?: LanguageWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type LanguageUpdateOneRequiredWithoutWordBankNestedInput = {
    create?: XOR<LanguageCreateWithoutWordBankInput, LanguageUncheckedCreateWithoutWordBankInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutWordBankInput
    upsert?: LanguageUpsertWithoutWordBankInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutWordBankInput, LanguageUpdateWithoutWordBankInput>, LanguageUncheckedUpdateWithoutWordBankInput>
  }

  export type LanguageCreateNestedOneWithoutQuizzesInput = {
    create?: XOR<LanguageCreateWithoutQuizzesInput, LanguageUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutQuizzesInput
    connect?: LanguageWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LanguageUpdateOneRequiredWithoutQuizzesNestedInput = {
    create?: XOR<LanguageCreateWithoutQuizzesInput, LanguageUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutQuizzesInput
    upsert?: LanguageUpsertWithoutQuizzesInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutQuizzesInput, LanguageUpdateWithoutQuizzesInput>, LanguageUncheckedUpdateWithoutQuizzesInput>
  }

  export type LanguageCreateNestedOneWithoutListeningInput = {
    create?: XOR<LanguageCreateWithoutListeningInput, LanguageUncheckedCreateWithoutListeningInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutListeningInput
    connect?: LanguageWhereUniqueInput
  }

  export type LanguageUpdateOneRequiredWithoutListeningNestedInput = {
    create?: XOR<LanguageCreateWithoutListeningInput, LanguageUncheckedCreateWithoutListeningInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutListeningInput
    upsert?: LanguageUpsertWithoutListeningInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutListeningInput, LanguageUpdateWithoutListeningInput>, LanguageUncheckedUpdateWithoutListeningInput>
  }

  export type LanguageCreateNestedOneWithoutSpeakingInput = {
    create?: XOR<LanguageCreateWithoutSpeakingInput, LanguageUncheckedCreateWithoutSpeakingInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutSpeakingInput
    connect?: LanguageWhereUniqueInput
  }

  export type LanguageUpdateOneRequiredWithoutSpeakingNestedInput = {
    create?: XOR<LanguageCreateWithoutSpeakingInput, LanguageUncheckedCreateWithoutSpeakingInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutSpeakingInput
    upsert?: LanguageUpsertWithoutSpeakingInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutSpeakingInput, LanguageUpdateWithoutSpeakingInput>, LanguageUncheckedUpdateWithoutSpeakingInput>
  }

  export type LanguageCreateNestedOneWithoutUsersInput = {
    create?: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutUsersInput
    connect?: LanguageWhereUniqueInput
  }

  export type UserProgressDayCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput> | UserProgressDayCreateWithoutUserInput[] | UserProgressDayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressDayCreateOrConnectWithoutUserInput | UserProgressDayCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressDayCreateManyUserInputEnvelope
    connect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type LikePostCreateNestedManyWithoutUserInput = {
    create?: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput> | LikePostCreateWithoutUserInput[] | LikePostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutUserInput | LikePostCreateOrConnectWithoutUserInput[]
    createMany?: LikePostCreateManyUserInputEnvelope
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type UserProgressDayUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput> | UserProgressDayCreateWithoutUserInput[] | UserProgressDayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressDayCreateOrConnectWithoutUserInput | UserProgressDayCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressDayCreateManyUserInputEnvelope
    connect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type LikePostUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput> | LikePostCreateWithoutUserInput[] | LikePostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutUserInput | LikePostCreateOrConnectWithoutUserInput[]
    createMany?: LikePostCreateManyUserInputEnvelope
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type LanguageUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutUsersInput
    upsert?: LanguageUpsertWithoutUsersInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutUsersInput, LanguageUpdateWithoutUsersInput>, LanguageUncheckedUpdateWithoutUsersInput>
  }

  export type UserProgressDayUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput> | UserProgressDayCreateWithoutUserInput[] | UserProgressDayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressDayCreateOrConnectWithoutUserInput | UserProgressDayCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressDayUpsertWithWhereUniqueWithoutUserInput | UserProgressDayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressDayCreateManyUserInputEnvelope
    set?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    disconnect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    delete?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    connect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    update?: UserProgressDayUpdateWithWhereUniqueWithoutUserInput | UserProgressDayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressDayUpdateManyWithWhereWithoutUserInput | UserProgressDayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressDayScalarWhereInput | UserProgressDayScalarWhereInput[]
  }

  export type PostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type LikePostUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput> | LikePostCreateWithoutUserInput[] | LikePostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutUserInput | LikePostCreateOrConnectWithoutUserInput[]
    upsert?: LikePostUpsertWithWhereUniqueWithoutUserInput | LikePostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikePostCreateManyUserInputEnvelope
    set?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    disconnect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    delete?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    update?: LikePostUpdateWithWhereUniqueWithoutUserInput | LikePostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikePostUpdateManyWithWhereWithoutUserInput | LikePostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type SubscriptionUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type UserProgressDayUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput> | UserProgressDayCreateWithoutUserInput[] | UserProgressDayUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressDayCreateOrConnectWithoutUserInput | UserProgressDayCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressDayUpsertWithWhereUniqueWithoutUserInput | UserProgressDayUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressDayCreateManyUserInputEnvelope
    set?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    disconnect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    delete?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    connect?: UserProgressDayWhereUniqueInput | UserProgressDayWhereUniqueInput[]
    update?: UserProgressDayUpdateWithWhereUniqueWithoutUserInput | UserProgressDayUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressDayUpdateManyWithWhereWithoutUserInput | UserProgressDayUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressDayScalarWhereInput | UserProgressDayScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type LikePostUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput> | LikePostCreateWithoutUserInput[] | LikePostUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutUserInput | LikePostCreateOrConnectWithoutUserInput[]
    upsert?: LikePostUpsertWithWhereUniqueWithoutUserInput | LikePostUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikePostCreateManyUserInputEnvelope
    set?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    disconnect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    delete?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    update?: LikePostUpdateWithWhereUniqueWithoutUserInput | LikePostUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikePostUpdateManyWithWhereWithoutUserInput | LikePostUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutProgressDaysInput = {
    create?: XOR<UserCreateWithoutProgressDaysInput, UserUncheckedCreateWithoutProgressDaysInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressDaysInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProgressDaysNestedInput = {
    create?: XOR<UserCreateWithoutProgressDaysInput, UserUncheckedCreateWithoutProgressDaysInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressDaysInput
    upsert?: UserUpsertWithoutProgressDaysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgressDaysInput, UserUpdateWithoutProgressDaysInput>, UserUncheckedUpdateWithoutProgressDaysInput>
  }

  export type UserCreateNestedOneWithoutPostsInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    connect?: UserWhereUniqueInput
  }

  export type LikePostCreateNestedManyWithoutPostInput = {
    create?: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput> | LikePostCreateWithoutPostInput[] | LikePostUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutPostInput | LikePostCreateOrConnectWithoutPostInput[]
    createMany?: LikePostCreateManyPostInputEnvelope
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutPostInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type LikePostUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput> | LikePostCreateWithoutPostInput[] | LikePostUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutPostInput | LikePostCreateOrConnectWithoutPostInput[]
    createMany?: LikePostCreateManyPostInputEnvelope
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    upsert?: UserUpsertWithoutPostsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostsInput, UserUpdateWithoutPostsInput>, UserUncheckedUpdateWithoutPostsInput>
  }

  export type LikePostUpdateManyWithoutPostNestedInput = {
    create?: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput> | LikePostCreateWithoutPostInput[] | LikePostUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutPostInput | LikePostCreateOrConnectWithoutPostInput[]
    upsert?: LikePostUpsertWithWhereUniqueWithoutPostInput | LikePostUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: LikePostCreateManyPostInputEnvelope
    set?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    disconnect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    delete?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    update?: LikePostUpdateWithWhereUniqueWithoutPostInput | LikePostUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: LikePostUpdateManyWithWhereWithoutPostInput | LikePostUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPostInput | CommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPostInput | CommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPostInput | CommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type LikePostUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput> | LikePostCreateWithoutPostInput[] | LikePostUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikePostCreateOrConnectWithoutPostInput | LikePostCreateOrConnectWithoutPostInput[]
    upsert?: LikePostUpsertWithWhereUniqueWithoutPostInput | LikePostUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: LikePostCreateManyPostInputEnvelope
    set?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    disconnect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    delete?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    connect?: LikePostWhereUniqueInput | LikePostWhereUniqueInput[]
    update?: LikePostUpdateWithWhereUniqueWithoutPostInput | LikePostUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: LikePostUpdateManyWithWhereWithoutPostInput | LikePostUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPostInput | CommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPostInput | CommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPostInput | CommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PostCreateNestedOneWithoutLikesInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    connect?: PostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLikedPostsInput = {
    create?: XOR<UserCreateWithoutLikedPostsInput, UserUncheckedCreateWithoutLikedPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikedPostsInput
    connect?: UserWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    upsert?: PostUpsertWithoutLikesInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutLikesInput, PostUpdateWithoutLikesInput>, PostUncheckedUpdateWithoutLikesInput>
  }

  export type UserUpdateOneRequiredWithoutLikedPostsNestedInput = {
    create?: XOR<UserCreateWithoutLikedPostsInput, UserUncheckedCreateWithoutLikedPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikedPostsInput
    upsert?: UserUpsertWithoutLikedPostsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLikedPostsInput, UserUpdateWithoutLikedPostsInput>, UserUncheckedUpdateWithoutLikedPostsInput>
  }

  export type PostCreateNestedOneWithoutCommentsInput = {
    create?: XOR<PostCreateWithoutCommentsInput, PostUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: PostCreateOrConnectWithoutCommentsInput
    connect?: PostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<PostCreateWithoutCommentsInput, PostUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: PostCreateOrConnectWithoutCommentsInput
    upsert?: PostUpsertWithoutCommentsInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutCommentsInput, PostUpdateWithoutCommentsInput>, PostUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CourseCreateWithoutLanguageInput = {
    id?: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
  }

  export type CourseUncheckedCreateWithoutLanguageInput = {
    id?: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
  }

  export type CourseCreateOrConnectWithoutLanguageInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput>
  }

  export type CourseCreateManyLanguageInputEnvelope = {
    data: CourseCreateManyLanguageInput | CourseCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type WordBankCreateWithoutLanguageInput = {
    id?: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
  }

  export type WordBankUncheckedCreateWithoutLanguageInput = {
    id?: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
  }

  export type WordBankCreateOrConnectWithoutLanguageInput = {
    where: WordBankWhereUniqueInput
    create: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput>
  }

  export type WordBankCreateManyLanguageInputEnvelope = {
    data: WordBankCreateManyLanguageInput | WordBankCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type QuizCreateWithoutLanguageInput = {
    id?: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizUncheckedCreateWithoutLanguageInput = {
    id?: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizCreateOrConnectWithoutLanguageInput = {
    where: QuizWhereUniqueInput
    create: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput>
  }

  export type QuizCreateManyLanguageInputEnvelope = {
    data: QuizCreateManyLanguageInput | QuizCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type ListeningCreateWithoutLanguageInput = {
    id?: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
  }

  export type ListeningUncheckedCreateWithoutLanguageInput = {
    id?: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
  }

  export type ListeningCreateOrConnectWithoutLanguageInput = {
    where: ListeningWhereUniqueInput
    create: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput>
  }

  export type ListeningCreateManyLanguageInputEnvelope = {
    data: ListeningCreateManyLanguageInput | ListeningCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type SpeakingCreateWithoutLanguageInput = {
    id?: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
  }

  export type SpeakingUncheckedCreateWithoutLanguageInput = {
    id?: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
  }

  export type SpeakingCreateOrConnectWithoutLanguageInput = {
    where: SpeakingWhereUniqueInput
    create: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput>
  }

  export type SpeakingCreateManyLanguageInputEnvelope = {
    data: SpeakingCreateManyLanguageInput | SpeakingCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLanguageInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput>
  }

  export type UserCreateManyLanguageInputEnvelope = {
    data: UserCreateManyLanguageInput | UserCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type CourseUpsertWithWhereUniqueWithoutLanguageInput = {
    where: CourseWhereUniqueInput
    update: XOR<CourseUpdateWithoutLanguageInput, CourseUncheckedUpdateWithoutLanguageInput>
    create: XOR<CourseCreateWithoutLanguageInput, CourseUncheckedCreateWithoutLanguageInput>
  }

  export type CourseUpdateWithWhereUniqueWithoutLanguageInput = {
    where: CourseWhereUniqueInput
    data: XOR<CourseUpdateWithoutLanguageInput, CourseUncheckedUpdateWithoutLanguageInput>
  }

  export type CourseUpdateManyWithWhereWithoutLanguageInput = {
    where: CourseScalarWhereInput
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyWithoutLanguageInput>
  }

  export type CourseScalarWhereInput = {
    AND?: CourseScalarWhereInput | CourseScalarWhereInput[]
    OR?: CourseScalarWhereInput[]
    NOT?: CourseScalarWhereInput | CourseScalarWhereInput[]
    id?: StringFilter<"Course"> | string
    languageCode?: StringFilter<"Course"> | string
    title?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    levelGroup?: StringFilter<"Course"> | string
    description?: StringFilter<"Course"> | string
    lessons?: IntFilter<"Course"> | number
    minutes?: IntFilter<"Course"> | number
    cover?: StringFilter<"Course"> | string
    tags?: JsonFilter<"Course">
    vipOnly?: BoolFilter<"Course"> | boolean
    courseOrder?: IntFilter<"Course"> | number
  }

  export type WordBankUpsertWithWhereUniqueWithoutLanguageInput = {
    where: WordBankWhereUniqueInput
    update: XOR<WordBankUpdateWithoutLanguageInput, WordBankUncheckedUpdateWithoutLanguageInput>
    create: XOR<WordBankCreateWithoutLanguageInput, WordBankUncheckedCreateWithoutLanguageInput>
  }

  export type WordBankUpdateWithWhereUniqueWithoutLanguageInput = {
    where: WordBankWhereUniqueInput
    data: XOR<WordBankUpdateWithoutLanguageInput, WordBankUncheckedUpdateWithoutLanguageInput>
  }

  export type WordBankUpdateManyWithWhereWithoutLanguageInput = {
    where: WordBankScalarWhereInput
    data: XOR<WordBankUpdateManyMutationInput, WordBankUncheckedUpdateManyWithoutLanguageInput>
  }

  export type WordBankScalarWhereInput = {
    AND?: WordBankScalarWhereInput | WordBankScalarWhereInput[]
    OR?: WordBankScalarWhereInput[]
    NOT?: WordBankScalarWhereInput | WordBankScalarWhereInput[]
    id?: StringFilter<"WordBank"> | string
    languageCode?: StringFilter<"WordBank"> | string
    level?: StringFilter<"WordBank"> | string
    word?: StringFilter<"WordBank"> | string
    translation?: StringFilter<"WordBank"> | string
    phonetic?: StringNullableFilter<"WordBank"> | string | null
    exampleSentence?: StringFilter<"WordBank"> | string
    vocabOrder?: IntFilter<"WordBank"> | number
  }

  export type QuizUpsertWithWhereUniqueWithoutLanguageInput = {
    where: QuizWhereUniqueInput
    update: XOR<QuizUpdateWithoutLanguageInput, QuizUncheckedUpdateWithoutLanguageInput>
    create: XOR<QuizCreateWithoutLanguageInput, QuizUncheckedCreateWithoutLanguageInput>
  }

  export type QuizUpdateWithWhereUniqueWithoutLanguageInput = {
    where: QuizWhereUniqueInput
    data: XOR<QuizUpdateWithoutLanguageInput, QuizUncheckedUpdateWithoutLanguageInput>
  }

  export type QuizUpdateManyWithWhereWithoutLanguageInput = {
    where: QuizScalarWhereInput
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyWithoutLanguageInput>
  }

  export type QuizScalarWhereInput = {
    AND?: QuizScalarWhereInput | QuizScalarWhereInput[]
    OR?: QuizScalarWhereInput[]
    NOT?: QuizScalarWhereInput | QuizScalarWhereInput[]
    id?: StringFilter<"Quiz"> | string
    languageCode?: StringFilter<"Quiz"> | string
    level?: StringFilter<"Quiz"> | string
    question?: StringFilter<"Quiz"> | string
    options?: JsonFilter<"Quiz">
    answer?: IntFilter<"Quiz"> | number
    explain?: StringFilter<"Quiz"> | string
    quizOrder?: IntFilter<"Quiz"> | number
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
  }

  export type ListeningUpsertWithWhereUniqueWithoutLanguageInput = {
    where: ListeningWhereUniqueInput
    update: XOR<ListeningUpdateWithoutLanguageInput, ListeningUncheckedUpdateWithoutLanguageInput>
    create: XOR<ListeningCreateWithoutLanguageInput, ListeningUncheckedCreateWithoutLanguageInput>
  }

  export type ListeningUpdateWithWhereUniqueWithoutLanguageInput = {
    where: ListeningWhereUniqueInput
    data: XOR<ListeningUpdateWithoutLanguageInput, ListeningUncheckedUpdateWithoutLanguageInput>
  }

  export type ListeningUpdateManyWithWhereWithoutLanguageInput = {
    where: ListeningScalarWhereInput
    data: XOR<ListeningUpdateManyMutationInput, ListeningUncheckedUpdateManyWithoutLanguageInput>
  }

  export type ListeningScalarWhereInput = {
    AND?: ListeningScalarWhereInput | ListeningScalarWhereInput[]
    OR?: ListeningScalarWhereInput[]
    NOT?: ListeningScalarWhereInput | ListeningScalarWhereInput[]
    id?: StringFilter<"Listening"> | string
    languageCode?: StringFilter<"Listening"> | string
    level?: StringFilter<"Listening"> | string
    title?: StringFilter<"Listening"> | string
    script?: StringFilter<"Listening"> | string
    blanks?: JsonFilter<"Listening">
    listenOrder?: IntFilter<"Listening"> | number
  }

  export type SpeakingUpsertWithWhereUniqueWithoutLanguageInput = {
    where: SpeakingWhereUniqueInput
    update: XOR<SpeakingUpdateWithoutLanguageInput, SpeakingUncheckedUpdateWithoutLanguageInput>
    create: XOR<SpeakingCreateWithoutLanguageInput, SpeakingUncheckedCreateWithoutLanguageInput>
  }

  export type SpeakingUpdateWithWhereUniqueWithoutLanguageInput = {
    where: SpeakingWhereUniqueInput
    data: XOR<SpeakingUpdateWithoutLanguageInput, SpeakingUncheckedUpdateWithoutLanguageInput>
  }

  export type SpeakingUpdateManyWithWhereWithoutLanguageInput = {
    where: SpeakingScalarWhereInput
    data: XOR<SpeakingUpdateManyMutationInput, SpeakingUncheckedUpdateManyWithoutLanguageInput>
  }

  export type SpeakingScalarWhereInput = {
    AND?: SpeakingScalarWhereInput | SpeakingScalarWhereInput[]
    OR?: SpeakingScalarWhereInput[]
    NOT?: SpeakingScalarWhereInput | SpeakingScalarWhereInput[]
    id?: StringFilter<"Speaking"> | string
    languageCode?: StringFilter<"Speaking"> | string
    level?: StringFilter<"Speaking"> | string
    phrase?: StringFilter<"Speaking"> | string
    translation?: StringFilter<"Speaking"> | string
    phonetic?: StringNullableFilter<"Speaking"> | string | null
    speakOrder?: IntFilter<"Speaking"> | number
  }

  export type UserUpsertWithWhereUniqueWithoutLanguageInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutLanguageInput, UserUncheckedUpdateWithoutLanguageInput>
    create: XOR<UserCreateWithoutLanguageInput, UserUncheckedCreateWithoutLanguageInput>
  }

  export type UserUpdateWithWhereUniqueWithoutLanguageInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutLanguageInput, UserUncheckedUpdateWithoutLanguageInput>
  }

  export type UserUpdateManyWithWhereWithoutLanguageInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutLanguageInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    exp?: IntFilter<"User"> | number
    streak?: IntFilter<"User"> | number
    lastActive?: DateTimeFilter<"User"> | Date | string
    targetLanguage?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    role?: StringFilter<"User"> | string
    goalMinutesPerDay?: IntFilter<"User"> | number
    jwtVersion?: IntFilter<"User"> | number
  }

  export type LanguageCreateWithoutCoursesInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutCoursesInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutCoursesInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutCoursesInput, LanguageUncheckedCreateWithoutCoursesInput>
  }

  export type LanguageUpsertWithoutCoursesInput = {
    update: XOR<LanguageUpdateWithoutCoursesInput, LanguageUncheckedUpdateWithoutCoursesInput>
    create: XOR<LanguageCreateWithoutCoursesInput, LanguageUncheckedCreateWithoutCoursesInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutCoursesInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutCoursesInput, LanguageUncheckedUpdateWithoutCoursesInput>
  }

  export type LanguageUpdateWithoutCoursesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutCoursesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateWithoutWordBankInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutWordBankInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutWordBankInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutWordBankInput, LanguageUncheckedCreateWithoutWordBankInput>
  }

  export type LanguageUpsertWithoutWordBankInput = {
    update: XOR<LanguageUpdateWithoutWordBankInput, LanguageUncheckedUpdateWithoutWordBankInput>
    create: XOR<LanguageCreateWithoutWordBankInput, LanguageUncheckedCreateWithoutWordBankInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutWordBankInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutWordBankInput, LanguageUncheckedUpdateWithoutWordBankInput>
  }

  export type LanguageUpdateWithoutWordBankInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutWordBankInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateWithoutQuizzesInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutQuizzesInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutQuizzesInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutQuizzesInput, LanguageUncheckedCreateWithoutQuizzesInput>
  }

  export type LanguageUpsertWithoutQuizzesInput = {
    update: XOR<LanguageUpdateWithoutQuizzesInput, LanguageUncheckedUpdateWithoutQuizzesInput>
    create: XOR<LanguageCreateWithoutQuizzesInput, LanguageUncheckedCreateWithoutQuizzesInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutQuizzesInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutQuizzesInput, LanguageUncheckedUpdateWithoutQuizzesInput>
  }

  export type LanguageUpdateWithoutQuizzesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutQuizzesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateWithoutListeningInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutListeningInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutListeningInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutListeningInput, LanguageUncheckedCreateWithoutListeningInput>
  }

  export type LanguageUpsertWithoutListeningInput = {
    update: XOR<LanguageUpdateWithoutListeningInput, LanguageUncheckedUpdateWithoutListeningInput>
    create: XOR<LanguageCreateWithoutListeningInput, LanguageUncheckedCreateWithoutListeningInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutListeningInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutListeningInput, LanguageUncheckedUpdateWithoutListeningInput>
  }

  export type LanguageUpdateWithoutListeningInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutListeningInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateWithoutSpeakingInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutSpeakingInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutSpeakingInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutSpeakingInput, LanguageUncheckedCreateWithoutSpeakingInput>
  }

  export type LanguageUpsertWithoutSpeakingInput = {
    update: XOR<LanguageUpdateWithoutSpeakingInput, LanguageUncheckedUpdateWithoutSpeakingInput>
    create: XOR<LanguageCreateWithoutSpeakingInput, LanguageUncheckedCreateWithoutSpeakingInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutSpeakingInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutSpeakingInput, LanguageUncheckedUpdateWithoutSpeakingInput>
  }

  export type LanguageUpdateWithoutSpeakingInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutSpeakingInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageCreateWithoutUsersInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankCreateNestedManyWithoutLanguageInput
    quizzes?: QuizCreateNestedManyWithoutLanguageInput
    listening?: ListeningCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutUsersInput = {
    code: string
    name: string
    native: string
    flag: string
    tagline: string
    levels: JsonNullValueInput | InputJsonValue
    status?: string
    courses?: CourseUncheckedCreateNestedManyWithoutLanguageInput
    wordBank?: WordBankUncheckedCreateNestedManyWithoutLanguageInput
    quizzes?: QuizUncheckedCreateNestedManyWithoutLanguageInput
    listening?: ListeningUncheckedCreateNestedManyWithoutLanguageInput
    speaking?: SpeakingUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutUsersInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
  }

  export type UserProgressDayCreateWithoutUserInput = {
    id?: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUncheckedCreateWithoutUserInput = {
    id?: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayCreateOrConnectWithoutUserInput = {
    where: UserProgressDayWhereUniqueInput
    create: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput>
  }

  export type UserProgressDayCreateManyUserInputEnvelope = {
    data: UserProgressDayCreateManyUserInput | UserProgressDayCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutAuthorInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
    likes?: LikePostCreateNestedManyWithoutPostInput
    comments?: CommentCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutAuthorInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
    likes?: LikePostUncheckedCreateNestedManyWithoutPostInput
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutAuthorInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostCreateManyAuthorInputEnvelope = {
    data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type LikePostCreateWithoutUserInput = {
    id?: string
    post: PostCreateNestedOneWithoutLikesInput
  }

  export type LikePostUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
  }

  export type LikePostCreateOrConnectWithoutUserInput = {
    where: LikePostWhereUniqueInput
    create: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput>
  }

  export type LikePostCreateManyUserInputEnvelope = {
    data: LikePostCreateManyUserInput | LikePostCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    content: string
    createdAt?: Date | string
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    status?: string
    tier?: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    amountTotal?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    status?: string
    tier?: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    amountTotal?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type LanguageUpsertWithoutUsersInput = {
    update: XOR<LanguageUpdateWithoutUsersInput, LanguageUncheckedUpdateWithoutUsersInput>
    create: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutUsersInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutUsersInput, LanguageUncheckedUpdateWithoutUsersInput>
  }

  export type LanguageUpdateWithoutUsersInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutUsersInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    native?: StringFieldUpdateOperationsInput | string
    flag?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    levels?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    courses?: CourseUncheckedUpdateManyWithoutLanguageNestedInput
    wordBank?: WordBankUncheckedUpdateManyWithoutLanguageNestedInput
    quizzes?: QuizUncheckedUpdateManyWithoutLanguageNestedInput
    listening?: ListeningUncheckedUpdateManyWithoutLanguageNestedInput
    speaking?: SpeakingUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type UserProgressDayUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProgressDayWhereUniqueInput
    update: XOR<UserProgressDayUpdateWithoutUserInput, UserProgressDayUncheckedUpdateWithoutUserInput>
    create: XOR<UserProgressDayCreateWithoutUserInput, UserProgressDayUncheckedCreateWithoutUserInput>
  }

  export type UserProgressDayUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProgressDayWhereUniqueInput
    data: XOR<UserProgressDayUpdateWithoutUserInput, UserProgressDayUncheckedUpdateWithoutUserInput>
  }

  export type UserProgressDayUpdateManyWithWhereWithoutUserInput = {
    where: UserProgressDayScalarWhereInput
    data: XOR<UserProgressDayUpdateManyMutationInput, UserProgressDayUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProgressDayScalarWhereInput = {
    AND?: UserProgressDayScalarWhereInput | UserProgressDayScalarWhereInput[]
    OR?: UserProgressDayScalarWhereInput[]
    NOT?: UserProgressDayScalarWhereInput | UserProgressDayScalarWhereInput[]
    id?: StringFilter<"UserProgressDay"> | string
    userId?: StringFilter<"UserProgressDay"> | string
    studyDate?: DateTimeFilter<"UserProgressDay"> | Date | string
    minutes?: IntFilter<"UserProgressDay"> | number
    wordsLearned?: IntFilter<"UserProgressDay"> | number
    wordCorrect?: IntFilter<"UserProgressDay"> | number
    wordTotal?: IntFilter<"UserProgressDay"> | number
    quizzesDone?: IntFilter<"UserProgressDay"> | number
    quizCorrect?: IntFilter<"UserProgressDay"> | number
    quizTotal?: IntFilter<"UserProgressDay"> | number
    speakingMinutes?: IntFilter<"UserProgressDay"> | number
    listeningMinutes?: IntFilter<"UserProgressDay"> | number
    moduleScores?: JsonFilter<"UserProgressDay">
  }

  export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
  }

  export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    topic?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type LikePostUpsertWithWhereUniqueWithoutUserInput = {
    where: LikePostWhereUniqueInput
    update: XOR<LikePostUpdateWithoutUserInput, LikePostUncheckedUpdateWithoutUserInput>
    create: XOR<LikePostCreateWithoutUserInput, LikePostUncheckedCreateWithoutUserInput>
  }

  export type LikePostUpdateWithWhereUniqueWithoutUserInput = {
    where: LikePostWhereUniqueInput
    data: XOR<LikePostUpdateWithoutUserInput, LikePostUncheckedUpdateWithoutUserInput>
  }

  export type LikePostUpdateManyWithWhereWithoutUserInput = {
    where: LikePostScalarWhereInput
    data: XOR<LikePostUpdateManyMutationInput, LikePostUncheckedUpdateManyWithoutUserInput>
  }

  export type LikePostScalarWhereInput = {
    AND?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
    OR?: LikePostScalarWhereInput[]
    NOT?: LikePostScalarWhereInput | LikePostScalarWhereInput[]
    id?: StringFilter<"LikePost"> | string
    postId?: StringFilter<"LikePost"> | string
    userId?: StringFilter<"LikePost"> | string
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    postId?: StringFilter<"Comment"> | string
    userId?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
  }

  export type SubscriptionUpsertWithoutUserInput = {
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tier?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    amountTotal?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutProgressDaysInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgressDaysInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgressDaysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgressDaysInput, UserUncheckedCreateWithoutProgressDaysInput>
  }

  export type UserUpsertWithoutProgressDaysInput = {
    update: XOR<UserUpdateWithoutProgressDaysInput, UserUncheckedUpdateWithoutProgressDaysInput>
    create: XOR<UserCreateWithoutProgressDaysInput, UserUncheckedCreateWithoutProgressDaysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgressDaysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgressDaysInput, UserUncheckedUpdateWithoutProgressDaysInput>
  }

  export type UserUpdateWithoutProgressDaysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgressDaysInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutPostsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPostsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
  }

  export type LikePostCreateWithoutPostInput = {
    id?: string
    user: UserCreateNestedOneWithoutLikedPostsInput
  }

  export type LikePostUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
  }

  export type LikePostCreateOrConnectWithoutPostInput = {
    where: LikePostWhereUniqueInput
    create: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput>
  }

  export type LikePostCreateManyPostInputEnvelope = {
    data: LikePostCreateManyPostInput | LikePostCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutPostInput = {
    id?: string
    content: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    content: string
    createdAt?: Date | string
  }

  export type CommentCreateOrConnectWithoutPostInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput>
  }

  export type CommentCreateManyPostInputEnvelope = {
    data: CommentCreateManyPostInput | CommentCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPostsInput = {
    update: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type LikePostUpsertWithWhereUniqueWithoutPostInput = {
    where: LikePostWhereUniqueInput
    update: XOR<LikePostUpdateWithoutPostInput, LikePostUncheckedUpdateWithoutPostInput>
    create: XOR<LikePostCreateWithoutPostInput, LikePostUncheckedCreateWithoutPostInput>
  }

  export type LikePostUpdateWithWhereUniqueWithoutPostInput = {
    where: LikePostWhereUniqueInput
    data: XOR<LikePostUpdateWithoutPostInput, LikePostUncheckedUpdateWithoutPostInput>
  }

  export type LikePostUpdateManyWithWhereWithoutPostInput = {
    where: LikePostScalarWhereInput
    data: XOR<LikePostUpdateManyMutationInput, LikePostUncheckedUpdateManyWithoutPostInput>
  }

  export type CommentUpsertWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutPostInput, CommentUncheckedUpdateWithoutPostInput>
    create: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutPostInput, CommentUncheckedUpdateWithoutPostInput>
  }

  export type CommentUpdateManyWithWhereWithoutPostInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutPostInput>
  }

  export type PostCreateWithoutLikesInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutPostsInput
    comments?: CommentCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutLikesInput = {
    id?: string
    authorId: string
    topic: string
    content: string
    createdAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutLikesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
  }

  export type UserCreateWithoutLikedPostsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    comments?: CommentCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLikedPostsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLikedPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLikedPostsInput, UserUncheckedCreateWithoutLikedPostsInput>
  }

  export type PostUpsertWithoutLikesInput = {
    update: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutLikesInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
  }

  export type PostUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutPostsNestedInput
    comments?: CommentUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutLikedPostsInput = {
    update: XOR<UserUpdateWithoutLikedPostsInput, UserUncheckedUpdateWithoutLikedPostsInput>
    create: XOR<UserCreateWithoutLikedPostsInput, UserUncheckedCreateWithoutLikedPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLikedPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLikedPostsInput, UserUncheckedUpdateWithoutLikedPostsInput>
  }

  export type UserUpdateWithoutLikedPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLikedPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type PostCreateWithoutCommentsInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutPostsInput
    likes?: LikePostCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutCommentsInput = {
    id?: string
    authorId: string
    topic: string
    content: string
    createdAt?: Date | string
    likes?: LikePostUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutCommentsInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutCommentsInput, PostUncheckedCreateWithoutCommentsInput>
  }

  export type UserCreateWithoutCommentsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export type PostUpsertWithoutCommentsInput = {
    update: XOR<PostUpdateWithoutCommentsInput, PostUncheckedUpdateWithoutCommentsInput>
    create: XOR<PostCreateWithoutCommentsInput, PostUncheckedCreateWithoutCommentsInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutCommentsInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutCommentsInput, PostUncheckedUpdateWithoutCommentsInput>
  }

  export type PostUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutPostsNestedInput
    likes?: LikePostUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikePostUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    language: LanguageCreateNestedOneWithoutUsersInput
    progressDays?: UserProgressDayCreateNestedManyWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostCreateNestedManyWithoutUserInput
    comments?: CommentCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    targetLanguage: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
    progressDays?: UserProgressDayUncheckedCreateNestedManyWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    likedPosts?: LikePostUncheckedCreateNestedManyWithoutUserInput
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    language?: LanguageUpdateOneRequiredWithoutUsersNestedInput
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CourseCreateManyLanguageInput = {
    id?: string
    title: string
    level: string
    levelGroup: string
    description: string
    lessons: number
    minutes: number
    cover: string
    tags: JsonNullValueInput | InputJsonValue
    vipOnly?: boolean
    courseOrder?: number
  }

  export type WordBankCreateManyLanguageInput = {
    id?: string
    level: string
    word: string
    translation: string
    phonetic?: string | null
    exampleSentence: string
    vocabOrder?: number
  }

  export type QuizCreateManyLanguageInput = {
    id?: string
    level: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    answer: number
    explain: string
    quizOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListeningCreateManyLanguageInput = {
    id?: string
    level: string
    title: string
    script: string
    blanks: JsonNullValueInput | InputJsonValue
    listenOrder?: number
  }

  export type SpeakingCreateManyLanguageInput = {
    id?: string
    level: string
    phrase: string
    translation: string
    phonetic?: string | null
    speakOrder?: number
  }

  export type UserCreateManyLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    avatar?: string | null
    level?: number
    exp?: number
    streak?: number
    lastActive?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string
    goalMinutesPerDay?: number
    jwtVersion?: number
  }

  export type CourseUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CourseUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CourseUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    levelGroup?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    lessons?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    cover?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    vipOnly?: BoolFieldUpdateOperationsInput | boolean
    courseOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type WordBankUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    exampleSentence?: StringFieldUpdateOperationsInput | string
    vocabOrder?: IntFieldUpdateOperationsInput | number
  }

  export type QuizUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    answer?: IntFieldUpdateOperationsInput | number
    explain?: StringFieldUpdateOperationsInput | string
    quizOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListeningUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ListeningUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type ListeningUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    listenOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type SpeakingUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    phrase?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    phonetic?: NullableStringFieldUpdateOperationsInput | string | null
    speakOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUpdateManyWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUpdateManyWithoutUserNestedInput
    comments?: CommentUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
    progressDays?: UserProgressDayUncheckedUpdateManyWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    likedPosts?: LikePostUncheckedUpdateManyWithoutUserNestedInput
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    exp?: IntFieldUpdateOperationsInput | number
    streak?: IntFieldUpdateOperationsInput | number
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: StringFieldUpdateOperationsInput | string
    goalMinutesPerDay?: IntFieldUpdateOperationsInput | number
    jwtVersion?: IntFieldUpdateOperationsInput | number
  }

  export type UserProgressDayCreateManyUserInput = {
    id?: string
    studyDate: Date | string
    minutes?: number
    wordsLearned?: number
    wordCorrect?: number
    wordTotal?: number
    quizzesDone?: number
    quizCorrect?: number
    quizTotal?: number
    speakingMinutes?: number
    listeningMinutes?: number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type PostCreateManyAuthorInput = {
    id?: string
    topic: string
    content: string
    createdAt?: Date | string
  }

  export type LikePostCreateManyUserInput = {
    id?: string
    postId: string
  }

  export type CommentCreateManyUserInput = {
    id?: string
    postId: string
    content: string
    createdAt?: Date | string
  }

  export type UserProgressDayUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type UserProgressDayUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    studyDate?: DateTimeFieldUpdateOperationsInput | Date | string
    minutes?: IntFieldUpdateOperationsInput | number
    wordsLearned?: IntFieldUpdateOperationsInput | number
    wordCorrect?: IntFieldUpdateOperationsInput | number
    wordTotal?: IntFieldUpdateOperationsInput | number
    quizzesDone?: IntFieldUpdateOperationsInput | number
    quizCorrect?: IntFieldUpdateOperationsInput | number
    quizTotal?: IntFieldUpdateOperationsInput | number
    speakingMinutes?: IntFieldUpdateOperationsInput | number
    listeningMinutes?: IntFieldUpdateOperationsInput | number
    moduleScores?: JsonNullValueInput | InputJsonValue
  }

  export type PostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikePostUpdateManyWithoutPostNestedInput
    comments?: CommentUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikePostUncheckedUpdateManyWithoutPostNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikePostUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikePostUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
  }

  export type LikePostUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikePostCreateManyPostInput = {
    id?: string
    userId: string
  }

  export type CommentCreateManyPostInput = {
    id?: string
    userId: string
    content: string
    createdAt?: Date | string
  }

  export type LikePostUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutLikedPostsNestedInput
  }

  export type LikePostUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type LikePostUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use LanguageCountOutputTypeDefaultArgs instead
     */
    export type LanguageCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LanguageCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostCountOutputTypeDefaultArgs instead
     */
    export type PostCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LanguageDefaultArgs instead
     */
    export type LanguageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LanguageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CourseDefaultArgs instead
     */
    export type CourseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CourseDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WordBankDefaultArgs instead
     */
    export type WordBankArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WordBankDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuizDefaultArgs instead
     */
    export type QuizArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuizDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ListeningDefaultArgs instead
     */
    export type ListeningArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ListeningDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SpeakingDefaultArgs instead
     */
    export type SpeakingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SpeakingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserProgressDayDefaultArgs instead
     */
    export type UserProgressDayArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserProgressDayDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostDefaultArgs instead
     */
    export type PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LikePostDefaultArgs instead
     */
    export type LikePostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LikePostDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommentDefaultArgs instead
     */
    export type CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionDefaultArgs instead
     */
    export type SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StripeEventDefaultArgs instead
     */
    export type StripeEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StripeEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}