namespace Fable.Demo

open System
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Fable.Import.Node

module NodejsInterop =
  type Params = {
    name: string
  }

  type Request = {
    ``params``: Params
  }

  type Response = {
    send: string -> unit
  }

  type Next = unit -> unit

  type Server = {
    get: JsFunc
    listen: JsFunc
    close: unit -> unit
  }

  type Restify = {
    createServer: unit -> Server
  }

  type Cmd =
    | Close

  let test () =
    let events = new Event<Cmd>()
    let restify: Restify = importDefault "restify"
    let server = restify.createServer()

    server.get.Invoke ("/hello/:name", JsFunc3(fun req res next ->
      res.send ("hello " + req.``params``.name)
      next()
    ))

    server.listen.Invoke (8080, fun () ->
      printfn "Started"
    )

    events.Publish.Add (function
      | Close ->
        printfn "Closing server..."
        server.close()
    )

    events
