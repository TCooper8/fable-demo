namespace Fable.Demo

open System
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Node
open Fable.Import.JS
open Fable.PowerPack

module Mongodb =
  type Result = {
    ok: int
    n: int
  }

  type Ops = {
    _id: string
  }

  type 'a InsertResult = {
    result: Result
    ops: 'a array
    insertedCount: int
    insertedIds: string array
  }

  [<Interface>]
  type 'a Collection =
    abstract insertMany: 'a array -> 'a InsertResult Promise
    abstract insert: 'a -> 'a InsertResult Promise
    abstract count: obj -> int Promise

  [<Interface>]
  type Db =
    abstract close: unit -> unit
    abstract collection: string -> 'a Collection

  [<Interface>]
  type MongoClient =
    abstract connect: string -> Db Promise

  type Mongodb = {
    MongoClient: MongoClient
  }

  let internal mongodb: Mongodb = importDefault "mongodb"

  type User = {
    name: string
    age: int
  }

  [<Emit("Math.random()")>]
  let nextInt (): float = jsNative

  let test () =
    let client = mongodb.MongoClient

    let users =
      seq [
        for i in 0 .. 10 do
          let user =
            { name = sprintf "Name %i" i
              age = nextInt() * 10.0 |> int
            }
          yield user
      ]

    promise {
      let! db = client.connect "mongodb://localhost:27017/test"
      use _db = { new IDisposable with member x.Dispose () = db.close () }

      let userCol = db.collection<User> "users"

      do! promise {
        let user = Seq.head users
        let! result = userCol.insert user
        printfn "Result: %A" result
      }

      do! promise {
        let! count =
          createObj [
            "age" ==> 0
          ]
          |> userCol.count
        printfn "Count = %i" count
      }

      ()
    }
