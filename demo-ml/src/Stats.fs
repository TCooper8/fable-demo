namespace Ml.Js

open System

module Stats =
  let sqr x = x * x

  type internal Sums = {
    observations: float
    sum: float
    sump2: float
    sump3: float
    sump4: float
  } with
    static member empty =
      { observations = 0.0
        sum = 0.0
        sump2 = 0.0
        sump3 = 0.0
        sump4 = 0.0
      }

  let internal varianceSums sums =
    let variance = (sums.observations * sums.sump2 - (sqr sums.sum)) / ((sqr sums.observations) - sums.observations)
    if variance < 0.0 then Double.NaN else variance

  let internal initSums moment values =
    let count = Seq.length values

    let sum = if moment < 1 then 0.0 else values |> Seq.sum
    let sump2 = if moment < 2 then 0.0 else values |> Seq.sumBy (fun x -> pown x 2)
    let sump3 = if moment < 3 then 0.0 else values |> Seq.sumBy (fun x -> pown x 3)
    let sump4 = if moment < 4 then 0.0 else values |> Seq.sumBy (fun x -> pown x 4)

    { observations = float count
      sum = sum
      sump2 = sump2
      sump3 = sump3
      sump4 = sump4
    }

  let sum column (frame:Frame) =
    let colType, column = FrameUtils.getColumn column frame

    match colType with
    | StringCol -> Double.NaN
    | FloatCol ->
      column
      |> Seq.cast<float>
      |> Seq.sum

  let mean column (frame:Frame) =
    let colType, column = FrameUtils.getColumn column frame

    match colType with
    | StringCol -> Double.NaN
    | FloatCol ->
      column
      |> Seq.cast<float>
      |> Seq.fold (fun (n, sum) value -> 
        n + 1, sum + value
      ) (0, 0.0)
      |> fun (n, sum) -> sum / float n

  let stdDev column (frame:Frame) =
    let colType, column = FrameUtils.getColumn column frame

    match colType with
    | StringCol -> Double.NaN
    | FloatCol ->
      column
      |> Seq.cast<float>
      |> initSums 2
      |> varianceSums
      |> sqrt