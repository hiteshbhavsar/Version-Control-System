/*
const items = ['item 1', 'thing', 'id-3-text', 'class'];
const matches = items.filter(s => s.includes('thi'));
console.log(matches)
*/
//const core=require('./core.js')

server_path="./server"
project_name="Client1"
client_path="F:\\test folder"
var fs=require('fs')
//const checkfileinpath = path => fs.readdirSync(path).filter(f => !statSync(join(path, f)).isDirectory())
const os=require('os')
TAB="\t"
Filesystem = require('fs');

//Removing all the duplicate paths coming from the directory
function remove_duplicates(arry)
{
    return Array.from(new Set(arry))
}


// New function updated on 26-10-2019
// List of all the folder an-d files in one directory-
var findFileAndFolder, jsFiles, rootDir;
var folder = [],file_path=[];
var dir='';var tcase='';
function findFileAndFolder(dir,tcase='Client')
{
    if(tcase=="server")
    {
      console.log('Directory searching for'+dir);
      Filesystem.readdirSync(dir).forEach(function(file) {
      var stat;
      stat = Filesystem.statSync("" + dir + "\\" + file);
      if (stat.isDirectory())
      {
        var a="" + dir +  "\\" + file;
        folder.push(a);
        console.log("Directory : "+a);
        return findFileAndFolder(a,tcase);
      }
      else //if (file.split('.').pop() === 'js')
      {
        console.log("Files : "+"" + dir + "\\" + file);
        return file_path.push("" + dir +  "\\" + file);
      }
      });
      console.log('inside server will display server directory');
      //folder=folder.filter(folder=>!folder.startsWith('./Client'||'Client'));
      folder=folder.filter(folder=>folder.startsWith('./server'||'server'));
      //file_path=file_path.filter(file_path=>!file_path.startsWith('./Client'||'Client'));
      file_path=file_path.filter(file_path=>file_path.startsWith('./server'||'server'));
      //folder=new Set(folder)
      //file_path=new Set(file_path)
      folder=remove_duplicates(folder)
      file_path=remove_duplicates(file_path)
    }
    else {
      console.log('Directory searching for'+dir);
      //Adding project name to make sure if more than 1 project then no other folder is traversed
      Filesystem.readdirSync(dir).forEach(function(file) { //dir+abs_delemiter+project_name
      var stat;
      stat = Filesystem.statSync("" + dir + abs_delemiter + file);
      if (stat.isDirectory())
      {
        var a="" + dir + abs_delemiter + file;
        folder.push(a);
        console.log("Directory : "+a);
        return findFileAndFolder(a,tcase);
      }
      else //if (file.split('.').pop() === 'js')
      {
        console.log("Files : "+"" + dir + abs_delemiter + file);
        return file_path.push("" + dir + abs_delemiter + file);
      }
    });
    console.log('inside Client will display client directory');
    folder=folder.filter(folder=>!folder.startsWith('./server'));
    file_path=file_path.filter(file_path=>!file_path.startsWith('./server'));
    folder=remove_duplicates(folder)
    file_path=remove_duplicates(file_path)
  }
return [file_path,folder];
};

//Listing all the manifest files
function getManifestFiles(server_path,project_name)
{
  files=readfilesinDirectory(server_path+"\\"+project_name)
  files=files.filter(files=>files.toLowerCase().includes("Manifest_".toLowerCase()))
  //console.log(files)
  return files
}


//Make a branch file in the server folder
function createBranchFile(server_path,client_path)
{
  fs=require('fs')
  if(fs.statsSync(server_path+"\\branch\\branch.txt"))
  {
    text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    data=text.split(os.EOL)
    text=text+os.EOL+"Branch"+(data.length+1)+" -> "+client_path+os.EOL
    fs.writeFile(server_path+"\\branch\\branch.txt",text)
  }
  else {

    fs.writeFile(server_path+"\\branch\\branch.txt","Branch1 -> "+client_path+" -> "+sManifestFileName)
  }
}

//checks if the branch is there in the path
function checkifisbranch(server_path,client_path)
{
  if(fs.existsSync(server_path+"\\branch\\branch.txt"))
  {
    text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    b=false
    data=text.split(os.EOL)
    for(i=0;i<data.length;i++)
    {
      brancharray=data[i].split("->")
      if(brancharray[1].trim()===client_path)
      {
        b=true
      }
    }
    return b
  }
  else {
    return false
  }
}

// Get the latest file
function getLatestManifest(server_path,project_name)
{
  str=''
  // if there is a branch created
  if(branch_name!="")
  {
  }
  else {
    files=getManifestFiles(server_path,project_name)
    for(i=0;i<files.length;i++)
    {
      str=files[i].split("")
    }
  }


}
//console.log(manifest)


//Reading the manifest file to get the fileMapping
function readManifestFile(manifestfilename,project_name)
{
    path="./server/"+project_name+"/"+manifestfilename
    console.log(path)
    text = fs.readFileSync("./server/"+project_name+"/"+manifestfilename,"UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    text= text.split(os.EOL)
    file_mapping=[]
    console.log("Length of array : "+text.length);

    // Need to fix the issue of the length of the
    for(i=0;i<text.length-2;i+=3)
    {
      intext=text[i]
      console.log("Text on line no "+i+" :  "+intext)
    }
    console.log('*************************************************************')
    for(i=0;i<text.length-2;i+=3)
    {
      intext=text[i]
      console.log("Text on line no "+i+" :  "+intext)
      intext=intext.split(TAB)
      console.log("After splitting the line")
      intext.forEach(function(value ,i){
        console.log(i+" "+value+" "+os.EOL)
      })
      client_filename=intext[1].split('\\').pop()
      server_filename=intext[3].split('\\').pop()
      console.log("Client file name : "+client_filename)
      console.log("server file name : "+server_filename)
      file_mapping.push([server_filename,client_filename])
    }


    return file_mapping;
}


function cleanfileList(listf)
{
  newf=fls.slice() // copying 1 array into another
  //fls=fls.filter(s => s.includes('351_L7.txt'));//_.filter(fs,function(s){return})
  //console.log(fls)
  new_fls=[]

  for(j=0;j<filemap.length;j++)
  {
    fls=newf.slice()
    str=filemap[j][0]
    fls=fls.filter(s => s.includes(str))
    new_fls.push(fls[0]) //pushing only one element in the array

  }
  return new_fls
}
//console.log(fls)
//console.log("F_set-----------------------------")
//console.log(f_set)
////newf=fls.slice() // copying 1 array into another
//fls=fls.filter(s => s.includes('351_L7.txt'));//_.filter(fs,function(s){return})
//console.log(fls)
////new_fls=[]

////for(j=0;j<filemap.length;j++)
////{
  ////fls=newf.slice()
  ////str=filemap[j][0]
  ////fls=fls.filter(s => s.includes(str))
  ////new_fls.push(fls[0]) //pushing only one element in the array

////}
//Client directory should be sent from the user side everytime
//Listed all the necessary files from the manifest file to be copied to client directory
//console.log(new_fls)
//console.log(file_mapping)
/*
//console.log('./server/Client1/1Def.txt/351_L7.txt'.indexOf('351_L7.txt'))
*/


//console.log(clientfilesndfolders);
function directorypathReplace(filesnfolders,pathvalue1,pathvalue2)
{
  for(var u=0;u<filesnfolders.length;u++)
  {
    filesnfolders[u]=filesnfolders[u].replace(pathvalue1,pathvalue2);
  }
  return filesnfolders;
}


// this function reads only the directory without digging deeper into subdirectories
function readfilesinDirectory(path)
{
  files=[]
  fs.readdirSync(path).forEach(file => {
    console.log(file);
    files.push(file)
  });
  return files
}

// Used specifically for the path operation
function splitMerge(files,splitchar,mergechar)
{
  arrayf=[]
  for(i=0;i<files.length;i++)
  {
    array=[]
    //console.log("Original string : "+files[i])
    array=files[i].split(splitchar)
    //console.log(array)
    str=array.join(mergechar)
    //console.log("Final string : "+str)
    arrayf.push(str)
  }

    return arrayf
}



//Code runned
//var manifest=getManifestFiles("./server/","Client1")
//readManifestFile('Manifest_27092019220023.txt','Client1')
//console.log(readManifestFile('Manifest_10262019230043.txt','Client1'))
//filemap=readManifestFile('Manifest_10262019230043.txt','Client1')
//clientfilesndfolders=findFileAndFolder(client_path,'client')
//console.log("Printing clientfilesndfolders")
//console.log(clientfilesndfolders)


//filesndfolders=findFileAndFolder(server_path,'server')
//filesndfolders[0]=remove_duplicates(filesndfolders[0])
//filesndfolders[1]=remove_duplicates(filesndfolders[1])
//console.log('----------------------------filesndfolders')
//console.log(filesndfolders)


////operation to be performed on
//fls=filesndfolders[0]

//filesndfolders=findFileAndFolder(server_path,'server')
//Write_file_toClient(filesndfolders,file_mapping)


//console.log(readfilesinDirectory(server_path))

//module.export={remove_duplicates,getManifestFiles,readManifestFile,readfilesinDirectory,splitMerge,findFileAndFolder}


module.exports={

  //Removing all the duplicate paths coming from the directory
  remove_duplicates:function(arry)
  {
      return Array.from(new Set(arry))
  },
  //Listing all the manifest files
  getManifestFiles:function(server_path,project_name)
  {
    files=findFileAndFolder("./server/"+project_name,'server')[0]
    files=files.filter(files=>files.toLowerCase().includes("Manifest_".toLowerCase()))
    //console.log(files)
    return files
  },

  //console.log(manifest)


  //Reading the manifest file
  readManifestFile:function(manifestfilename,project_name)
  {
      path="./server/"+project_name+"/"+manifestfilename
      console.log(path)
      text = fs.readFileSync("./server/"+project_name+"/"+manifestfilename,"UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      text= text.split(os.EOL)
      file_mapping=[]
      console.log("Length of array : "+text.length);

      // Need to fix the issue of the length of the
      for(i=0;i<text.length-2;i+=3)
      {
        intext=text[i]
        console.log("Text on line no "+i+" :  "+intext)
      }
      console.log('*************************************************************')
      for(i=0;i<text.length-2;i+=3)
      {
        intext=text[i]
        console.log("Text on line no "+i+" :  "+intext)
        intext=intext.split(TAB)
        console.log("After splitting the line")
        intext.forEach(function(value ,i){
          console.log(i+" "+value+" "+os.EOL)
        })
        //client_filename=intext[1].split('/').pop()
        //server_filename=intext[3].split('/').pop()
        client_filename=intext[1].split('\\').pop()
        server_filename=intext[3].split('\\').pop()
        console.log("Client file name : "+client_filename)
        console.log("server file name : "+server_filename)
        file_mapping.push([server_filename,client_filename])
      }


      return file_mapping;
  },


  cleanfileList:function(listf)
  {
    newf=fls.slice() // copying 1 array into another
    //fls=fls.filter(s => s.includes('351_L7.txt'));//_.filter(fs,function(s){return})
    //console.log(fls)
    new_fls=[]

    for(j=0;j<filemap.length;j++)
    {
      fls=newf.slice()
      str=filemap[j][0]
      fls=fls.filter(s => s.includes(str))
      new_fls.push(fls[0]) //pushing only one element in the array

    }
    return new_fls
  },
  //console.log(fls)
  //console.log("F_set-----------------------------")
  //console.log(f_set)
  ////newf=fls.slice() // copying 1 array into another
  //fls=fls.filter(s => s.includes('351_L7.txt'));//_.filter(fs,function(s){return})
  //console.log(fls)
  ////new_fls=[]

  ////for(j=0;j<filemap.length;j++)
  ////{
    ////fls=newf.slice()
    ////str=filemap[j][0]
    ////fls=fls.filter(s => s.includes(str))
    ////new_fls.push(fls[0]) //pushing only one element in the array

  ////}
  //Client directory should be sent from the user side everytime
  //Listed all the necessary files from the manifest file to be copied to client directory
  //console.log(new_fls)
  //console.log(file_mapping)
  /*
  //console.log('./server/Client1/1Def.txt/351_L7.txt'.indexOf('351_L7.txt'))
  */


  //console.log(clientfilesndfolders);

  // this function reads only the directory without digging deeper into subdirectories
  readfilesinDirectory:function(path)
  {
    files=[]
    fs.readdirSync(path).forEach(file => {
      console.log(file);
      files.push(file)
    });
    return files
  },

  // Used specifically for the path operation
  splitMerge:function(files,splitchar,mergechar)
  {
    arrayf=[]
    for(i=0;i<files.length;i++)
    {
      array=[]
      //console.log("Original string : "+files[i])
      array=files[i].split(splitchar)
      //console.log(array)
      str=array.join(mergechar)
      //console.log("Final string : "+str)
      arrayf.push(str)
    }

      return arrayf
  },



  //Code runned
  //var manifest=getManifestFiles("./server/","Client1")
  //readManifestFile('Manifest_27092019220023.txt','Client1')
  //console.log(readManifestFile('Manifest_10262019230043.txt','Client1'))
  //filemap=readManifestFile('Manifest_10262019230043.txt','Client1')
  //clientfilesndfolders=findFileAndFolder(client_path,'client')
  //console.log("Printing clientfilesndfolders")
  //console.log(clientfilesndfolders)


  //filesndfolders=findFileAndFolder(server_path,'server')
  //filesndfolders[0]=remove_duplicates(filesndfolders[0])
  //filesndfolders[1]=remove_duplicates(filesndfolders[1])
  //console.log('----------------------------filesndfolders')
  //console.log(filesndfolders)


  ////operation to be performed on
  //fls=filesndfolders[0]

  //filesndfolders=findFileAndFolder(server_path,'server')
  //Write_file_toClient(filesndfolders,file_mapping)


  //console.log(readfilesinDirectory(server_path))
  // Get the latest file
  getLatestManifest: function (server_path,project_name,branch_name="")
  {
    str=''
    // if there is a branch created
    if(branch_name!="")
    {
    }
    else {
      files=getManifestFiles(server_path,project_name)
      for(i=0;i<files.length;i++)
      {
        str=files[i].split("")
      }
    }


  },

  makeTempFileAndDump:function(sManifestStr,client_path)
  {
    path=client_path+"\\TempSeq.txt"
      if(!fs.existsSync(path))
      {
        fs.writeFile(path, sManifestStr, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      }
      else {
        text = fs.readFileSync(path,"UTF8",function(data,err)
        {
            if(err) throw err;
            return data
        })
        data=text.split(os.EOL)
        text=text+os.EOL+sManifestStr
        fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
      }
  },

  //Make a branch file in the server folder
  createBranchFile: function(sManifestFileName,server_path,client_path)
  {
    fs=require('fs')
    console.log("Before calling if statement")
    try {


    if(fs.existsSync(server_path+"\\branch\\branch.txt"))
    {
      console.log("Inside if statement")
      text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      console.log("Data inside text");
      console.log(text);

      if(text === "")
      {
        console.log("Text length condition true")
        text=text+"Branch"+1+" -> "+client_path+" -> "+sManifestFileName+os.EOL
        //fs.writeFile(server_path+"\\branch\\branch.txt",text)
        branch_name="Branch"+1
        console.log("Data inside text : "+text);
        fs.writeFile(server_path+"\\branch\\branch.txt", text, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });

      }
      else {
        console.log("Text length condition false")
        data=text.split(os.EOL)
        text=text+os.EOL+"Branch"+(data.length+1)+" -> "+client_path+" -> "+sManifestFileName+os.EOL
        branch_name="Branch"+(data.length+1)
        fs.writeFile(server_path+"\\branch\\branch.txt", text, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
      return branch_name

    }
    /*
    else {
      console.log("Inside else statement")
      fs.writeFile(server_path+"\\branch\\branch.txt","Branch1 -> "+client_path+" -> "+sManifestFileName,{ flag: 'a+' }, (err) => {})
    }
    */
  } catch (e) {
    console.log("Inside exception of createBranchFile"+os.EOL)
    console.log(e);
  }
  },
  //Create project
  createProjectBranchFile: function(branch_name,sManifestFileName,server_path,client_path)
  {
    path=server_path+"\\branch\\"+branch_name
    console.log("Inside Create Project Branch file : "+path)
    if(!fs.existsSync(path))
    {
      console.log("Inside the if statement")
      fs.writeFile(path, sManifestFileName, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
    else {
      console.log("Inside the else statement")
      text = fs.readFileSync(path,"UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      data=text.split(os.EOL)
      text=text+os.EOL+sManifestFileName
      fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
    }

  },

  checkifisbranch:function(server_path,client_path)
  {
    if(fs.existsSync(server_path+"\\branch\\branch.txt"))
    {
      text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      b=false
      data=text.split(os.EOL)
      console.log("Data length : "+data.length)

      if(data.length==1)
      {
        //There is no branch made for this path
        return false
      }

      for(i=0;i<data.length;i++)
      {
        brancharray=data[i].split("->")
        console.log("Client path in brancharray[1] :"+brancharray[1])
        if(brancharray[1].trim()===client_path)
        {
          b=true
        }
      }
      return b
    }
    else {
      return false
    }
  },

  // Parent Repository
  createParentProjectBranchFile:function(server_path,client_path,sManifestFileName)
  {
      path=server_path+"\\ParentBranch.txt"
      if(!fs.existsSync(path))
      {
        fs.writeFile(path, sManifestFileName, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      }
      else {
        text = fs.readFileSync(path,"UTF8",function(data,err)
        {
            if(err) throw err;
            return data
        })
        data=text.split(os.EOL)
        text=text+os.EOL+sManifestFileName
        fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
      }


  },



  //Extracting existing brach name from
  extractBranchName:function(server_path,client_path)
  {
      if(!fs.existsSync(server_path+"\\branch\\branch.txt"))
      {
        return "error.txt"
      }
      else {
        text=fs.readFileSync(server_path+"\\branch\\branch.txt",function(data,err)
        {
          if(err) console.log(err)

          return data
        });
        berror=true;
        data=text.toString().split(os.EOL)
        filename=""
        for(i=0;i<data.length;i++)
        {
          dataArray=data[i].split("->")
          if(dataArray[1].trim()===client_path)
          {
            filename=dataArray[0].trim()
            berror=false;
          }
        }
        if(!berror)
        {
          return filename;
        }
        else {
          return "error.txt";
        }
      }

  }


}




// Parent Repository
function createParentProjectBranchFile(server_path,client_path,sManifestFileName)
{
    path=server_path+"\\branch\\ParentBranch.txt"
    if(!fs.existsSync(path))
    {
      fs.writeFile(path, sManifestFileName, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
    else {
      text = fs.readFileSync(path,"UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      data=text.split(os.EOL)
      text=text+os.EOL+sManifestFileName
      fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
    }


}

//Extracting existing brach name from
function extractBranchName(server_path,client_path)
{
    if(!fs.existsSync(server_path+"\\branch\\branch.txt"))
    {
      return "error.txt"
    }
    else {
      text=fs.readFileSync(server_path+"\\branch\\branch.txt",function(data,err)
      {
        if(err) console.log(err)

        return data
      });
      berror=true;
      console.log("Data inside data: "+text)
      console.log("Type of the text variable : "+typeof text.toString())
      data=text.toString().split(os.EOL)
      filename=""
      for(i=0;i<data.length;i++)
      {
        dataArray=data[i].split("->")
        if(dataArray[1].trim()===client_path)
        {
          filename=dataArray[1].trim()
          berror=false;
        }
      }
      if(!berror)
      {
        return filename;
      }
      else {
        return "error.txt";
      }
    }

}

//Create project branch file which contains the latest manifest file name for that particular branch
function createProjectBranchFile(branch_name,sManifestFileName,server_path,client_path)
{
  path=server_path+"\\"+branch_name
  if(!fs.existsSync(path))
  {
    fs.writeFile(path, sManifestFileName, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  }
  else {
    text = fs.readFileSync(path,"UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    data=text.split(os.EOL)
    text=text+os.EOL+sManifestFileName
    fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
  }

}

//Make a branch file in the server folder
function createBranchFile(sManifestFileName,server_path,client_path)
{

  console.log("Before calling if statement")

  if(fs.existsSync(server_path+"\\branch\\branch.txt"))
  {
    console.log("Inside if statement")
    text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    console.log("Data inside text");
    console.log(text);

    if(text === "")
    {
      console.log("Text length condition true")
      text=text+"Branch"+1+" -> "+client_path+" -> "+sManifestFileName+os.EOL
      //fs.writeFile(server_path+"\\branch\\branch.txt",text)
      branch_name="Branch"+1
      console.log("Data inside text : "+text);
      fs.writeFile(server_path+"\\branch\\branch.txt", text, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

    }
    else {
      console.log("Text length condition false")
      data=text.split(os.EOL)
      text=text+os.EOL+"Branch"+(data.length+1)+" -> "+client_path+" -> "+sManifestFileName+os.EOL
      branch_name="Branch"+(data.length+1)
      fs.writeFile(server_path+"\\branch\\branch.txt", text, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
    return branch_name
  }
  /*
  else {
    console.log("Inside else statement")
    fs.writeFile(server_path+"\\branch\\branch.txt","Branch1 -> "+client_path+" -> "+sManifestFileName,{ flag: 'a+' }, (err) => {})
  }
  */

}

//checks if the branch is there in the path
function checkifisbranch(server_path,client_path)
{
  if(fs.existsSync(server_path+"\\branch\\branch.txt"))
  {
    text = fs.readFileSync(server_path+"\\branch\\branch.txt","UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })
    b=false
    data=text.split(os.EOL)
    for(i=0;i<data.length;i++)
    {
      brancharray=data[i].split("->")
      if(brancharray[1].trim()===client_path)
      {
        b=true
      }
    }
    return b
  }
  else {
    return false
  }
}





//Checkin code part
//to Write checkins and checkouts in the temporary file and then keep on adding the checkins till the merge in command is called
//Made at the client side
//Here client path contains path with project_name
function makeTempFileAndDump(sManifestStr,client_path)
{
  path=client_path+"\\TempSeq.txt"
    if(!fs.existsSync(path))
    {
      fs.writeFile(path, sManifestStr, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
    else {
      text = fs.readFileSync(path,"UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })
      data=text.split(os.EOL)
      text=text+os.EOL+sManifestStr
      fs.writeFile(path,text, { flag: 'a+' }, (err) => {})
    }
}


function writeFile(path,file_text=" ")
{
  fs.writeFile(path, file_text, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}
