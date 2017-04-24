namespace Fable.Plugins

#r "../node_modules/fable-core/Fable.Core.dll"

open Fable
open Fable.AST

type CharPlugin() =
  interface IReplacePlugin with
    member x.TryReplace com (info: Fable.ApplyInfo) =
      printfn "Checking info %A" info
      match info.ownerFullName with
      | "System.Char" ->
        match info.methodName with
        | ".ctor" -> failwith "TODO"
          //let o = Fable.ObjExpr ([], [], None, info.range)
          //Fable.Wrapped (o, info.returnType) |> Some
        | "IsWhiteSpace" ->
          let c =
            match info.args with
            | [] -> failwith "Expected 1 char argument for System.Char.IsWhiteSpace"
            | [ c ] -> c
            | _ -> failwith "Unexpected arg count for System.Char.IsWhiteSpace"
          let expr = Fable.Emit("/^\s*$/.test($0)")

          Fable.Apply(Fable.Value expr, [c], Fable.ApplyMeth, info.returnType, info.range)
          |> Some
        | "IsDigit" ->
          let c =
            match info.args with
            | [] -> failwith "Expected 1 char argument for System.Char.IsWhiteSpace"
            | [ c ] -> c
            | _ -> failwith "Unexpected arg count for System.Char.IsWhiteSpace"
          let expr = Fable.Emit("!isNaN(parseInt($0))")

          Fable.Apply(Fable.Value expr, [c], Fable.ApplyMeth, info.returnType, info.range)
          |> Some

        | _ -> None
      | _ -> None
