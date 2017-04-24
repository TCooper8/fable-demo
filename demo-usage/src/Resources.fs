namespace Fable.Demo

open System

module Resources =
  [<Interface>]
  type IFileSystem =
    abstract ``open``: string -> int
    abstract close: int -> unit
    abstract read: int -> string

  type ResourceHog (fs:IFileSystem, files) =
    let fileDescriptors = files |> List.map fs.``open``

    interface IDisposable with
      member x.Dispose () =
        fileDescriptors |> List.iter fs.close

    member x.readFiles () =
      fileDescriptors |> List.map fs.read

  type FileSystem () =
    let files: Map<int, string> ref = ref Map.empty

    interface IFileSystem with
      member x.``open`` filename =
        let fd: int = filename |> Seq.map int |> Seq.sum
        files := Map.add fd filename !files
        printfn "%A opened" fd
        fd

      member x.close fd =
        files := Map.remove fd !files
        printfn "%i closed" fd

      member x.read fd =
        Map.find fd !files

  let test () =
    let fs = FileSystem ()
    let files = [
      "hello"
      "goodbye"
      "test.csv"
    ]

    use hog = new ResourceHog (fs, files)
    let dataList = hog.readFiles()
    for data in dataList do
      printfn "Data: %s" data
    ()