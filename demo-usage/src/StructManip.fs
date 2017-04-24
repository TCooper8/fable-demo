namespace Fable.Demo

module StructManip =
  type Expr =
    | String of string
    | Int of int
    | Float of float
    | List of Expr list
    | Bool of bool

  type Contact = {
    name: string
    phone: string
    confirmed: bool
  }

  type User = {
    name: string
    age: int
    contacts: Contact seq
  }

  let invalidStrs =
    [ string '"'
      string '\n'
    ]

  // Checking for invalid characters.
  let (|ValidString|_|) = function
    | String str ->
      if Seq.exists (fun s -> str.Contains(s)) invalidStrs then None
      else Some str
    | _ -> None

  // Evaluate embedded DSL.
  let evalContact = function
    | List [ ValidString name; String phone; Bool confirmed ] ->
      { name = name
        phone = phone
        confirmed = confirmed
      }
    | any -> failwith (sprintf "Expected List of (name:string, phone:string, confirmed:bool) but got %A" any)

  // Evaluate embedded DSL.
  let evalUser = function
    | List [String name; Int age; List contacts ] ->
      { name = name
        age = age
        contacts = contacts |> Seq.map evalContact
      }
    | any -> failwith (sprintf "Expected List of (name:string, age:int, contact: list) but got %A" any)

  let test () =
    let test =
      List [
        String "bob"
        Int 5
        List [
          List [
            String "jim"
            String "1-800-do-not-call"
            Bool false
          ]
          List [
            String "john"
            String "1-800-ok-number"
            Bool true
          ]
        ]
      ]
    printfn "%A" test
    let user = evalUser test
    printfn "User: %A" user