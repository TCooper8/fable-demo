namespace Ml.Js

type Series<'key, 'a> = {
  keys: 'key seq
  values: 'a seq
}

module Series =
  let map (f:'key -> 'a -> 'b) (series:Series<'key, 'a>) =
    Seq.zip series.keys series.values |> Seq.map (fun (k,v) -> f k v)