namespace Ml.Js

open System

type ColType =
  | StringCol
  | FloatCol

type FrameSchema = (string * ColType) seq

type RowValue =
  | RowString of string
  | RowFloat of float

type Frame = {
  schema: FrameSchema
  columnKeys: string[]
  rows: obj[] seq
} with
  static member empty =
    { schema = Seq.empty
      columnKeys = Array.empty
      rows = Seq.empty
    }

module FrameUtils =
  let ofLines (schema:FrameSchema) (lines:string seq): Frame =
    let header = Seq.tryHead lines

    match header with
    | None -> Frame.empty
    | Some header ->
      let columnKeys = header.Split(',')
      let schemaRules = Map.ofSeq schema
      let rows: obj[] seq =
        // Cut through the lines and gather information about them.
        lines
        |> Seq.skip 1
        |> Seq.map (fun line ->
          let parts = line.Split(',')
          // Split the line and we will attempt some simple rules and gather the information, streaming style.

          Array.zip columnKeys parts
          |> Array.mapi (fun i (key, value) ->
            let rule = Map.find key schemaRules
            match rule with
            | StringCol -> value :> obj
            | FloatCol ->
              match Double.TryParse value with
              | false, _ -> failwith (sprintf "Expected row %i, column '%s' to have a valid 'float' -- Got %A" i key value)
              | true, value -> value :> obj
          )
        )
      { schema = schema
        columnKeys = columnKeys
        rows = rows
      }

  let rows (frame:Frame) = frame.rows

  let getColumn (key:string) (frame:Frame): ColType * (obj seq) =
    let i = Array.findIndex (fun k -> k = key) frame.columnKeys
    let colType = frame.schema |> Seq.item i |> snd
    let col =
      frame.rows
      |> Seq.map (Array.item i)
    colType, col