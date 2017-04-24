namespace Fable.Demo

module Performance =
  let testArray size =
    Array.init size (fun i -> i)
    |> Array.sum

  let testSeq size =
    Seq.init size id
    |> Seq.sum

  let testForLoop size =
    let mutable sum = 0
    for i in 1 .. size - 1 do
      sum <- sum + i
    sum
