#r "../node_modules/fable-core/Fable.Core.dll"
#r "../node_modules/fable-powerpack/Fable.PowerPack.dll"
#load "Try.fs"
#load "StructManip.fs"
#load "Resources.fs"
#load "NodejsInterop.fs"
#load "Mongodb.fs"

open Fable.Demo
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Node

module Samples =
  type User = {
    id: string
    name: string
    age: int
  }

  type UserChanged =
    | UserCreated of User
    | UserDeleted of User
    | UserUpdated of User

  let listen =
    Observable.subscribe(function
      | UserCreated user -> printfn "User %A created." user
      | UserDeleted user -> printfn "User %A deleted." user
      | UserUpdated user -> printfn "User %A updated." user
    )

  let test () =
    let events = new Event<UserChanged>()
    use listener = listen events.Publish

    for i in 0 .. 1 do
      let user = {
        id = string i
        name = "User " + string i
        age = i
      }
      events.Trigger (UserCreated user)

    for i in 0 .. 10 do
      let user = {
        id = string i
        name = "UserName" + string i
        age = i
      }
      events.Trigger (UserUpdated user)
      events.Trigger (UserDeleted user)

//Samples.test()
//StructManip.test()
//Resources.test()

//let events = NodejsInterop.test()
//
//async {
//  printfn "Closing server in 10 seconds..."
//  do! Async.Sleep 10000
//  events.Trigger (NodejsInterop.Close)
//}
//|> Async.Start

Mongodb.test().catch(System.Func<obj, unit>(fun e -> printfn "Error: %A" e))
