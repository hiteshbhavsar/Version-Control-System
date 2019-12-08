var os = require("os");
const fs=require("fs");
const process_working_directory=process.cwd();
core=require(process_working_directory+'/core.js')
check=require(process_working_directory+'/check.js')
project_path=process.cwd()
//client_path='F:\\testfolder\\test'
client_path='F:\\testfolder\\test3'
const project_name=client_path.split("\\").pop()
//files_n_folders=[]


const dirTree = require("directory-tree");
const { readdirSync, statSync } = require('fs')
const { join } = require('path')

//function for checking the whether if there is a directory inside a directory
const checkdirinpath = path => readdirSync(path).filter(f => statSync(join(path, f)).isDirectory())
const checkfileinpath = path => readdirSync(path).filter(f => !statSync(join(path, f)).isDirectory())
var TAB="\t"
var labeltext='This is first label'


/*
Creating Repository :    CR F:\important files\Website practise\Nodejs Code\local
Checking out Repository: 1) CHECKOUT  F:\test folder
						 2) CHECKOUT  F:\test folder - [branch_name]
Checking IN Repository: CHECKIN  F:\test folder
Merge Out Repository : MERGEOUT
Merge IN Repository : MERGEIN

*/

/*
[
Core functions :'remove_duplicates',  'directorypathReplace',  'getFileDir',  'GetCheckSum',
  'GetArtifactName',  'replaceAll',  'CheckDirExists',  'dateFormat',  'Write_file_toserver',
  'CreateManifestFile',  'getFileUpdatedDate',  'GetExtension',  'findFileAndFolder',  'getClientDirectory',
  'getServerDirectory',  'createServerDirectory'

Check funtions :

]

*/



function checkifitwillrun(project_name,str)
{
  strArray=[]
  console.log(str)
  strArray=str.split(" ")
  server_path=project_path+'\\server\\'+project_name
  console.log("Inside the function")
  console.log(strArray.length)
  for(i=0;i<strArray.length;i++)
  {
    console.log("for "+i+" the element value : "+strArray[i])
  }
  // Check the length of array
  if(strArray.length==2)
  {
    if(strArray[0]=='CR')
    {
      client_path=strArray[1]
      files_n_folders=findFileAndFolder(client_path,tcase='client')
      org_files=files_n_folders[0].slice(0)
      files_n_folders[0].push(client_path+"\\branch") //Added branch folder at runtime in the new repository
      files_n_folders[0]=core.directorypathReplace(files_n_folders[0],client_path,server_path)
      files_n_folders[1]=core.directorypathReplace(files_n_folders[1],client_path,server_path)
      console.log("Files : ->")
      console.log(files_n_folders[0])
      console.log("Folders : ->")
      console.log(files_n_folders[1])
      CheckDirExists(files_n_folders[0],project_name,server_path,'server')
      CheckDirExists(files_n_folders[1],project_name,server_path,'server')
     // Added to add details of the new upcoming branches
     fs.writeFile(server_path+"\\branch\\Branch.txt"," ", function (err) {
       if (err) throw err;
       console.log('Saved the new file ');
     });

      Create_Repository_In_Server(core.remove_duplicates(org_files),' ',server_path=server_path,client_path=client_path)
    }
  }


// Check if the array contains 3 elements
  if(strArray.length==3)
  {

    //checking in the changes done in the
     if(strArray[0]=='CHECKIN')
    {
        client_path=strArray[1]
        sManifestStr=str+os.EOL
        CheckInCodeToServer(client_path+"\\"+project_name,server_path,sManifestStr)

    }
    else if(strArray[0]=='MERGEOUT')
    {

    }
    else if(strArray[0]=='MERGEIN')
    {

    }

  }

  // Check if the array contains 4 elements
  else if(strArray.length==4)
  {
        if(strArray[0]=='CHECKOUT')
        {
          //Checking out the code without branch
          sManifestFileName=""
          client_path=strArray[1]
          //server_path=strArray[2]+"\\"+project_name
          manifestfilename=strArray[3]
          file_mappings=check.readManifestFile(manifestfilename,project_name)
          console.log("File mappings ---------->")
          console.log(file_mappings)
          files_n_folders=findFileAndFolder(server_path,tcase='server')
          console.log("File and folders ---------->"+files_n_folders)
          Write_file_toClient(files_n_folders,file_mappings,server_path,client_path,project_name) //Checkout process
          sManifestStr="CHECKOUT "+server_path+" "+client_path+os.EOL
          sManifestStr+="Manifest : "+manifestfilename+os.EOL
          sTimeStamp=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()
          sManifestStr+="TimeStamp: "+sTimeStamp+os.EOL
          sManifestFileName=core.CreateManifestFile(server_path,project_name,sManifestStr,sTimeStamp,null)
          console.log("Manifest File Name: "+sManifestFileName)
          //Making a temporary file for saving the state of the branch

          check.makeTempFileAndDump("CHECKOUT "+server_path+" "+client_path+" "+manifestfilename+" "+sManifestFileName+os.EOL,client_path)
          branch_name=check.createBranchFile(sManifestFileName,server_path,client_path)
          check.createProjectBranchFile(branch_name+".txt",sManifestFileName,server_path,client_path)
        }
        else if(strArray[0]=='CHECKIN')
        {
          client_path=strArray[1]
          sManifestStr=str+os.EOL
          CheckInCodeToServer(client_path,server_path) //+"\\"+project_name
        }
        else if(strArray[0]=='MERGEOUT')
        {

        }
        else if(strArray[0]=='MERGEIN')
        {

        }

  }
  else {
    if(strArray[0]=="list_proj")
    {
      //List all the project at the server
      listRepositories()
    }

  }


}

//functions prints out all the repository at the sever side code
function listRepositories()
{
  repo_names=[]
  files=readfilesinDirectory(process.cwd()+"//server")
  for(i=0;i<files.length;i++)
  {
    repo_names.push(files.split("\\").pop())
  }

  return repo_names
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

//Writes files to the client target folder
function Write_file_toClient(filesandfolders,mapping,server_path,client_path,project_name)
{
  files=filesandfolders[0]
  folders=filesandfolders[1]
  //Working on folders
  // Removing the last folder part of the folders list as it contain the name of the files
  //console.log(folders)
  new_fold=[]

  for(i=0;i<folders.length;i++)
  {
    str=folders[i]
    last_str=str.split("\\").pop().toString()
    str=str.substring(0,str.lastIndexOf("\\"))
    //console.log("String inside for loop:  "+str)
    new_fold.push(str)
  }
  folders=remove_duplicates(new_fold)
  //Removing the project folder_name from the list
  //folders=folders.filter(folders=>folders.)
  console.log(folders)
  console.log("Before calling directorypathReplace in Write_file_toClient server_path : "+server_path)
  core.directorypathReplace(folders,server_path,client_path)
  console.log("Before calling CheckDirExists in Write_file_toClient")
  console.log(folders)

  //Writing the folders into client target directory
  CheckDirExists(folders,project_name,server_path,tcase='client')
  console.log("New Folders : -->>>>>>>>>>>")
  console.log(folders)
  console.log("New files : -->>>>>>>>>>>")
  console.log(files)
  // Working on files
  //filter out the manifest files First
  files=files.filter(files=>!files.toLowerCase().includes("Manifest_".toLowerCase()))
  files=files.filter(files=>!files.toLowerCase().includes("labels".toLowerCase()))
  console.log("New files : -->>>>>>>>>>>")
  console.log(files)
  console.log("Mapping : -->>>>>>>>>>>")
  console.log(mapping)

  //filtering the files need to be send to the client folder through mapping
  new_f=[]
  for(i =0;i<mapping[0].length;i++)
  {
    console.log("Searching for string : "+mapping[i][0])
    filename=files.filter(files=>files.toLowerCase().includes(mapping[i][0].toString().toLowerCase()))
    new_f.push(filename.toString())
  }


  console.log("Server Path : "+server_path+os.EOL)
  console.log("Client Path : "+client_path+os.EOL)

  console.log("Before Replacing server_path with client_path -->>>>>>>>>>>"+os.EOL)
  console.log(new_f)





  //Writing the file into client target directory
  files=new_f.slice(0)
  core.directorypathReplace(new_f,server_path,client_path)
  //new_f=splitMerge(new_f,"/","\\")

  console.log(files)
  console.log("New Files : after Replacing server_path with client_path -->>>>>>>>>>>")
  console.log(new_f)
  for(j=0;j<files.length;j++)
  {

    if(files[j].split('\\').pop()==new_f[j].split('\\').pop())
    {
      new_f[j]=new_f[j].substring(0,new_f[j].lastIndexOf('\\'))
      fs.copyFile(files[j], new_f[j], (err) => {
        if (err) throw err;
        console.log('Copy succesfull');
      });

    }
  }

}


// New function updated on 26-10-2019
// List of all the folder an-d files in one directory-
var file_path=[],folder=[]
function findFileAndFolder(dir,tcase=' ')
{
    console.log("Directory in the call : "+dir+", with test case : "+tcase)
    Filesystem = require('fs');
    abs_delemiter="\\"

    if(tcase=="server")
    {
      console.log('Directory searching for'+dir);
      Filesystem.readdirSync(dir).forEach(function(file) {
      var stat;
      stat = Filesystem.statSync("" + dir + "\\" + file);
      if (stat.isDirectory())
      {
        var a="" + dir + "\\" + file;
        folder.push(a);
        console.log("Directory : "+a);
        return findFileAndFolder(a,tcase);
      }
      else //if (file.split('.').pop() === 'js')
      {
        console.log("Files : "+"" + dir + "\\" + file);
        return file_path.push("" + dir + "\\" + file);
      }
      });
      console.log('inside server will display server directory');
      //folder=folder.filter(folder=>!folder.startsWith('./Client'||'Client'));
      //folder=folder.filter(folder=>folder.startsWith('./server'||'server'));
      //file_path=file_path.filter(file_path=>!file_path.startsWith('./Client'||'Client'));
      //file_path=file_path.filter(file_path=>file_path.startsWith('./server'||'server'));
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
      folder.push(dir)
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
    //folder=folder.filter(folder=>!folder.startsWith('./server'));
    //file_path=file_path.filter(file_path=>!file_path.startsWith('./server'));
    folder=remove_duplicates(folder)
    file_path=remove_duplicates(file_path)
  }
return [file_path,folder];
}


function CheckDirExists(fold,project_name,server_path,tcase)
{
  for(var k=0;k<fold.length;k++)
  {
    var str=fold[k];
    //F:\\important files\\Website practise\\Nodejs Code\\server\\testfolder
    //var str='server/Client1/New_test/new 1'
    i=0
    console.log("Project Name : "+project_name)
    console.log("Tcase : "+tcase)
    if(tcase=="server")
    {
      console.log("Inside the server case")
      while(str.split('\\').pop()!='server')
      {
        i++
        console.log(str)
        var exists=fs.existsSync(str);
        if(!exists)
        {
           fs.mkdirSync(str);
        }
        arr=str.split('\\')
        rem_str=str.split('\\').pop()
        str=arr.splice(0,arr.length-1).join('\\')
        console.log(str)
      }
        console.log("Path in checkdirexits function: "+str);
  }
  else {
    console.log("Inside the client case")
    while(str.indexOf("\\")>0)
    {
      i++
      console.log(str)
      var exists=fs.existsSync(str);
      if(!exists)
      {
        console.log("before making directory : "+str)
         fs.mkdirSync(str);
      }
        arr=str.split('\\')
        rem_str=str.split('\\').pop()
        str=arr.splice(0,arr.length-1).join('\\')
        console.log(str)

    }
      console.log("Path in checkdirexits function: "+str);
  }
    //var strarr=str.split('\\')
    //var length_of_array=strarr.length;
    //var count_change_dir=0;
    /*
    console.log(process.cwd());
    for(var p=1;p<length_of_array;p++)
    {
      var exists=fs.existsSync(strarr[p-1]+'\\'+strarr[p]);
      if(!exists)
      {fs.mkdirSync(strarr[p-1]+'\\'+strarr[p]);}
      count_change_dir=count_change_dir+1;
      //if(process.cwd()!="F:\\important files\\Website practise\\Nodejs Code")
      //{
        process.chdir(strarr[p-1]);
      //}

    }
    //console.log("Current path after traversing inside"+process.cwd());
    //console.log('count_change_dir : '+count_change_dir);
    for(var ch=0;ch<count_change_dir;ch++)
    {
      process.chdir('../');
    }
    console.log("Current path after coming outside the folder"+process.cwd());
    process.chdir(server_path);
*/
  }

}

//Removing all the duplicate paths coming from the directory
function remove_duplicates(arry)
{
    return Array.from(new Set(arry))
}



//path="CR "+client_path
//console.dir(Object.keys(require(process.cwd()+'/core.js')));
//console.dir(Object.keys(require(process.cwd()+'/check.js')));


//checkifitwillrun(project_name,"CR F:\\testfolder\\test3")

//// Checking out the CHECKOUT functionality :: Working good
//checkifitwillrun(project_name,"CHECKOUT F:\\testfolder\\test2 F:\\important_files\\Website_practise\\Nodejs_Code\\server Manifest_23112019065933.txt")

//// Checking out the CHECKIN functionality :: Working good for branches
//checkifitwillrun(project_name,"CHECKIN F:\\testfolder\\test3  F:\\important_files\\Website_practise\\Nodejs_Code\\server")


//// Checking out the CHECKIN functionality :: Working good for home branch
//checkifitwillrun(project_name,"CHECKIN F:\\testfolder\\test3  F:\\important_files\\Website_practise\\Nodejs_Code\\server")


//console.log("Check if there is  branch : "+check.checkifisbranch(project_path+'\\server\\'+project_name,"F:\\testfolder\\test2"))


//CheckDirExists(files_n_folders[0].concat(files_n_folders[1]),project_path)
/*
str='F:\\important files\\Website practise\\Nodejs Code\\server\\testfolder\\client2'
i=0
while(str.split('\\').pop()!='server')
{
  i++
  //console.log(i)
  var exists=fs.existsSync(str);
  console.log("Exists : "+exists)
  if(!exists)
  {
    fs.mkdirSync(str);
  }
  arr=str.split('\\')
  rem_str=str.split('\\').pop()
  str=arr.splice(0,arr.length-1).join('\\')
  console.log(str)
}
*/


//Checking in code to server
function CheckInCodeToServer(client_path,server_path,label_text)
{
  try {

  os=require('os')
  console.log("Inside the function CheckInCodeToServer ")
  sManifestStr="CHECKIN ->"+client_path+"->"+server_path+os.EOL
  client_files_folders=  findFileAndFolder(client_path,tcase='client')

  console.log("Server path: "+server_path+os.EOL)
  console.log("Client path: "+client_path+os.EOL)
  console.log("Server folders before directory replace :"+os.EOL)
  console.log(client_files_folders[0])
  //Server folders to check if there in the server path
  server_folders=core.directorypathReplace(client_files_folders[0].concat(client_files_folders[1]),client_path,server_path)

  server_folders=server_folders.filter(folders=>!folders.toLowerCase().includes("tempseq".toLowerCase())) //filtering the tempseq file
  sManifestFileName=""
  console.log("Server folders :"+os.EOL)
  console.log(server_folders)

  for(i=0;i<server_folders.length;i++)
  {
    //Check if the path exist
    if(!fs.existsSync(server_folders[i]))
    {
      fs.mkdirSync(server_folders[i])
    }
  }

  //Client files gives are the path to the server folders and then we can check the leaf nodes
  client_files=client_files_folders[0]
  //server_files_path=directorypathReplace(client_files_folders[1],client_path,server_path)
  //Remove the temporary file
  client_files=client_files.filter(files=>!files.toLowerCase().includes("tempseq".toLowerCase()))

  //Read the each client file, make the artifactid for it and check at the server side if there is a match
  // and if not make file

  console.log("Client Files :"+os.EOL)
  console.log(client_files)

  server_file_path=""
  sManifestFileName=""
  for(j=0;j<client_files.length;j++)
  {

    file_text=fs.readFileSync(client_files[j],"UTF8",function(data,err)
    {
        if(err) throw err;
        return data
    })


    file_to_find=core.GetArtifactName(file_text,client_files[j].split("\\").pop())
    console.log("File to find "+file_to_find)
    console.log("Client file path : "+client_files[j])
    console.log(typeof client_files[j])
    server_file_path=client_files[j]
    server_file_path=server_file_path.replace(client_path,server_path)
    console.log("Server file path : "+server_file_path)
    server_files=fs.readdirSync(server_file_path)
    bfileAlreadyMade=false
    for(i=0;i<server_files.length;i++)
    {
        if(server_files[i].split("\\").pop()==file_to_find)
        {
            bfileAlreadyMade=true
            break;
        }
    }

    if(!bfileAlreadyMade)
    {
      //if file is modified or not made
      console.log("New file created")
      console.log("File text : "+file_text)
      console.log("complete path :" +server_file_path+"\\"+file_to_find)
      //fs.writeFile(server_file_path+"\\"+file_to_find,file_text)
      fs.writeFile(server_file_path+"\\"+file_to_find, file_text, function (err) {
        if (err) throw err;
        console.log('Saved the new file ');
      });
      sManifestStr=sManifestStr+client_files[j]+" -> "+server_file_path+"\\"+file_to_find+os.EOL
      sTimeStamp=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()
      sManifestStr=sManifestStr+"TimeStamp : "+sTimeStamp+os.EOL
      sManifestStr=sManifestStr+"Artifact id: "+file_to_find
    }


  }
  sTimeStamp=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()
  //Creating Manifest file
  sManifestFileName=core.CreateManifestFile(server_path,server_path.split("\\").pop(),sManifestStr,sTimeStamp,label_text)

  //Checking if branch exist for the file_path
  if(check.checkifisbranch(server_path,client_path))
  {
    //Creating the file if it doesn't exists and writing all checkings iwth
    check.makeTempFileAndDump(sManifestStr,client_path)
    branchname=check.extractBranchName(server_path,client_path)
    sManifestFileName=check.createProjectBranchFile(branchname+".txt",sManifestFileName,server_path,client_path)
  }
  else {
    check.makeTempFileAndDump(sManifestStr,client_path)
    check.createParentProjectBranchFile(server_path+"\\branch",client_path,sManifestFileName)
  }

  console.log("checkin code succesfully runned")
} catch (e) {
    console.log(e)
}
}





//mergeOutCodeToServer('')
function writeFile(path,file_text=" ")
{
  fs.writeFile(path, file_text, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}



//function used to write the files to the path
function Create_Repository_In_Server(l_files,label_text='',server_path,client_path)
{
  //console.log(process.cwd());
  var sManifestStr='';
  var fil1=l_files.slice(0);
  //fs=require('fs')
  os=require('os')
  console.log("Inside write_file function value of fil1 :"+fil1);
  //console.log('before directorypathReplace:'+files);
  l_files=core.directorypathReplace(l_files,client_path,server_path);
  console.log("Inside write_file function value of files :"+l_files);
  for(var i=0;i<fil1.length;i++)
  {
    //console.log("Inside write_file function value of files :"+files);
    //console.log("Inside write_file function value of fil :"+fil1);
    var file_path=fil1[i];var file_name=l_files[i].split('\\').pop();
    console.log('fileName:'+file_name);
    var modified_file_name='';
    var file_text=""
    console.log('File path : '+file_path);
    file_text=fs.readFileSync(file_path, "utf8",function(err,data)
    {
      if (err) throw err;
      console.log(" content is :"+data);
      return data;
    });
    //Finds the artifact id and creates the name for it
    modified_file_name=core.GetArtifactName(file_text,file_name);
    var TAB="\t"
    sManifestStr+='CR'+TAB+fil1[i]+TAB+" -> "+TAB+l_files[i]+"\\"+modified_file_name+os.EOL;
    //Not needed yet to confirm with professor
    //sManifestStr+='Source_path : '+fil1[i]+os.EOL;
    //sManifestStr+='Dest_path : '+l_files[i]+'/'+modified_file_name+os.EOL;
    //sManifestStr+='Text in the file : '+file_text+os.EOL;
    sDatetime=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString();
    sManifestStr+="Time stamp: "+core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()+os.EOL;;
    //console.log('Inside write_file function with the filetext: '+file_text);
    sManifestStr+='Aritifactid :'+modified_file_name+os.EOL;
    // Working code of fs.writeline
    /*
    fs.writeFile(l_files[i]+'/'+modified_file_name, file_text, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
*/
    console.log('Modified file name '+modified_file_name);
    console.log('File Path='+file_path);
    console.log('New Path='+l_files[i]+'\\'+modified_file_name);

    fs.copyFile(file_path, l_files[i]+'\\'+modified_file_name, (err) => {
      if (err) throw err;
      console.log('Source file got copied to Destination path');
    });

    console.log('Renaming files file 1 ='+fil1[i]);
    console.log('Renaming files file 2 ='+l_files[i]);
    //fs.renameSync(fil1[i],files[i]);


  }
  sManifestStr+='************************************************************'+os.EOL;
  console.log(sManifestStr);
  console.log("Before calling Create Manifest")
  console.log("Server Path : "+server_path)
  console.log("project_name : "+project_name)
  label_text  ='This is demo label'
  sManifestFileName='';
  sManifestFileName=core.CreateManifestFile(server_path,project_name,sManifestStr,sDatetime,label_text);
  check.createParentProjectBranchFile(server_path+"\\branch",client_path,sManifestFileName)
}


// To merge out the code from client side to server
function mergeOutCodeToServer(client_path,server_path,sManifestStr)
{
    //Read the file
    text=fs.readFileSync(client_path+"\\TempSeq.txt")
    data_in_text=text.toString().split(os.EOL)
    checkoutStr=data_in_text[0] //Checkout string

    data=checkoutStr.split(" ")
    project_name=data[1].split("\\").pop()
    console.log(project_name)
    console.log(data)
    grand_Parent_Manifestfile=data[data.length-2] // find the manifest from which the branch was made
    parent_Manifestfile=data[data.length-1]// |Name of the file of the first comit done at the branch

}

// To merge in the code from client side to sever
function mergeInCodeToServer(client_path,server_path,sManifestStr,sManifestToMerge)
{
    manf_text=fs.readFileSync(client_path+"\\TempSeq.txt")
    //Deleting the file
    fs.unlink(client_path+"\\TempSeq.txt", (err) => {
      if (err) {
        console.error(err)
        return
      }});
    //The rest remains the same as we do for checkin part
    try {




    os=require('os')
    console.log("Inside the function mergeInCodeToServer ")
    sManifestStr="MERGEIN ->"+client_path+"->"+server_path+" "+sManifestToMerge+os.EOL
    client_files_folders=  findFileAndFolder(client_path,tcase='client')

    console.log("Server path: "+server_path+os.EOL)
    console.log("Client path: "+client_path+os.EOL)
    console.log("Server folders before directory replace :"+os.EOL)
    console.log(client_files_folders[0])
    //Server folders to check if there in the server path
    server_folders=core.directorypathReplace(client_files_folders[0].concat(client_files_folders[1]),client_path,server_path)
    //No need to filter the tempseq file because we already deleted it
    //server_folders=server_folders.filter(folders=>!folders.toLowerCase().includes("tempseq".toLowerCase()))
    sManifestFileName=""
    console.log("Server folders :"+os.EOL)
    console.log(server_folders)

    for(i=0;i<server_folders.length;i++)
    {
      //Check if the path exist
      if(!fs.existsSync(server_folders[i]))
      {
        fs.mkdirSync(server_folders[i])
      }
    }

    //Client files gives are the path to the server folders and then we can check the leaf nodes
    client_files=client_files_folders[0]
    //server_files_path=directorypathReplace(client_files_folders[1],client_path,server_path)

    // No need to remove the temporary file as its already removed
    //Remove the temporary file
    //client_files=client_files.filter(files=>!files.toLowerCase().includes("tempseq".toLowerCase()))

    //Read the each client file, make the artifactid for it and check at the server side if there is a match
    // and if not make file

    console.log("Client Files :"+os.EOL)
    console.log(client_files)

    server_file_path=""
    sManifestFileName=""
    for(j=0;j<client_files.length;j++)
    {

      file_text=fs.readFileSync(client_files[j],"UTF8",function(data,err)
      {
          if(err) throw err;
          return data
      })


      file_to_find=core.GetArtifactName(file_text,client_files[j].split("\\").pop())
      console.log("File to find "+file_to_find)
      console.log("Client file path : "+client_files[j])
      console.log(typeof client_files[j])
      server_file_path=client_files[j]
      server_file_path=server_file_path.replace(client_path,server_path)
      console.log("Server file path : "+server_file_path)
      server_files=fs.readdirSync(server_file_path)
      bfileAlreadyMade=false
      for(i=0;i<server_files.length;i++)
      {
          if(server_files[i].split("\\").pop()==file_to_find)
          {
              bfileAlreadyMade=true
              break;
          }
      }

      if(!bfileAlreadyMade)
      {
        //if file is modified or not made
        console.log("New file created")
        console.log("File text : "+file_text)
        console.log("complete path :" +server_file_path+"\\"+file_to_find)
        //fs.writeFile(server_file_path+"\\"+file_to_find,file_text)
        fs.writeFile(server_file_path+"\\"+file_to_find, file_text, function (err) {
          if (err) throw err;
          console.log('Saved the new file ');
        });
        sManifestStr=sManifestStr+client_files[j]+" -> "+server_file_path+"\\"+file_to_find+os.EOL
        sTimeStamp=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()
        sManifestStr=sManifestStr+"TimeStamp : "+sTimeStamp+os.EOL
        sManifestStr=sManifestStr+"Artifact id: "+file_to_find
      }


    }
    sTimeStamp=core.dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()
    //Creating Manifest file
    sManifestFileName=core.CreateManifestFile(server_path,server_path.split("\\").pop(),sManifestStr,sTimeStamp,label_text)

      //Creating the file if it doesn't exists and writing all checkings iwth
      //check.makeTempFileAndDump(sManifestStr,client_path)
      branchname=check.extractBranchName(server_path,client_path) // Removing the branch from the branch txt file
      sManifestFileName=check.createProjectBranchFile(branchname+".txt",sManifestFileName,server_path,client_path)

    console.log("MERGEIN code succesfully runned")
    } catch (e) {
      console.log(e)
    }

}


//mergeOutCodeToServer("F:\\testfolder\\test2","F:\\important_files\\Website_practise\\Nodejs_Code\\server"," ")
