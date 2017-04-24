namespace Fable.Demo

type 'a Try =
  | Success of 'a
  | Failure of exn

module Try =
  let success value = Success value
  let failure e = Failure e

  let map mapping = function
    | Success value ->
      try value |> mapping |> Success
      with e -> e |> Failure
    | Failure e -> Failure e

  let get = function
    | Success value -> value
    | Failure e -> raise e

  let recover compensation = function
    | Success value -> Success value
    | Failure e ->
      try e |> compensation |> Success
      with e -> e |> Failure

  let bind binding = function
    | Success value ->
      try value |> binding
      with e -> e |> Failure
    | Failure e -> Failure e
