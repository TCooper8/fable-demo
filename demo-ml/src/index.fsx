#r "../node_modules/fable-core/Fable.Core.dll"
#load "Frame.fs"
#load "Series.fs"
#load "Stats.fs"

open Ml.Js

module Test =
  let lines =
    seq {
      yield "hour,day,on"
      while true do
        for day in 0 .. 6 do
          for hour in 0 .. 23 do
            if day >= 4 then
              let res = 
                if hour >= 7 && hour <= 9 then sprintf "%i,%i,on" hour day
                elif hour >= 11 && hour < 13 then sprintf "%i,%i,on" hour day
                elif hour >= 17 && hour < 21 then sprintf "%i,%i,on" hour day
                else sprintf "%i,%i,off" hour day
              yield res
    }
    |> Seq.truncate 10000

  let length = Seq.length lines
  printfn "Length %A" length

  let schema =
    seq [
      "hour", FloatCol
      "day", FloatCol
      "on", StringCol
    ]

  let frame = FrameUtils.ofLines schema lines

  seq [
    "Hour:Sum", fun () -> Stats.sum "hour" frame
    "Hour:Mean", fun () -> Stats.mean "hour" frame
    "Hour:+/-", fun () -> Stats.stdDev "hour" frame
    "Day:Sum", fun () -> Stats.sum "day" frame
    "Day:Mean", fun () -> Stats.mean "day" frame
    "Day:+/-", fun () -> Stats.stdDev "day" frame
  ]
  |> Seq.iter (fun (label, work) ->
    work () |> printfn "%s: %A" label
  )