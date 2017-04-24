namespace Fable.Demo

open System

module Resources =
  // Create the interface for a File System.
  [<Interface>]
  type IFileSystem =
    abstract ``open``: string -> int
    abstract close: int -> unit
    abstract read: int -> string

  // This class is a resource hog that uses the file system.
  type ResourceHog (fs:IFileSystem, files) =
    let fileDescriptors = files |> List.map fs.``open``

    interface IDisposable with
      member x.Dispose () =
        fileDescriptors |> List.iter fs.close

    member x.readFiles () =
      fileDescriptors |> List.map fs.read

  // File system implementation.
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
    // Create file system and a file names that need to be opened.
    let fs = FileSystem ()
    let files = [
      "1.csv"
      "2.csv"
      "3.csv"
    ]

    do
      printfn "Running happy path test..."
      // Note: The use expression.
      use hog = new ResourceHog (fs, files)

      let dataList = hog.readFiles()
      for data in dataList do
        printfn "Data: %s" data

    // Now, try it with failure.
    do
      printfn "Running path with failure...\n"
      try
        use hog = new ResourceHog (fs, files)
        printfn "Failing test..."
        failwith "BAM!"
      with e ->
        printfn "Error: %s" e.Message
    ()
