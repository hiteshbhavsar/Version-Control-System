//loadash=require('loadash');

// Here client path has to be changed onces you get the value from the UI

module.exports={
//Removing all the duplicate paths coming from the directory
remove_duplicates: function (arry)
{
    return Array.from(new Set(arry))
},


//Reading the manifest file

//Replaces the client path directory with the server path directory and vice versa
directorypathReplace:  function (filesnfolders,pathvalue1,pathvalue2)
{
  for(var u=0;u<filesnfolders.length;u++)
  {
    filesnfolders[u]=filesnfolders[u].replace(pathvalue1,pathvalue2);
  }
  return filesnfolders;
}
,
//Function outdated
//This function gives all the files in the directory
// without accessing the folders in the list
getFileDir: function(path)
{
  const fs=require("fs");
  console.log(path);
  files=[];

  files=fs.readdirSync(path,(err,files)=>{
    if(err) throw err;console.log(err);
    console.log(files);
    return files;
  });

  /*
  fs.readdir(path, function(err, files){
  files = files.map(function (fileName) {
    return {
      name: fileName,
      time: fs.statSync(path + '/' + fileName).mtime.getTime()
    };
  })
  .sort(function (a, b) {
    return a.time - b.time; })
  .map(function (v) {
    return v.name; });

*/
return files;
}
,
//finds the artifact numeric part
GetCheckSum:function(file_text)
{
  const text=file_text;
  const asc_arr=[];
  const weights=[1,3,7,11,13]

  for(var i=0;i<text.length;i++)
  {
    asc_arr.push(text.charCodeAt(i));
  }
  console.log(asc_arr);
  var w_index=0,sum=0;
  for(var j=0;j<asc_arr.length;j++)
  {
    if(w_index<weights.length)
    {
     //console.log("Adding "+asc_arr[j]+"*"+weights[w_index]+" to the sum");
      w_index=0;
    }
    sum+=asc_arr[j]*weights[w_index];
    w_index++;

  }
  //console.log("Sum: "+sum);
  m=Math.pow(2,31)-1;
  sum=sum%(m);
return sum; //to check the artifact id of data
},
//Create the artifact id complete name
GetArtifactName:function(file_text,file_name)
{
const text=file_text;
const asc_arr=[];
const weights=[1,3,7,11,13]

for(var i=0;i<text.length;i++)
{
  asc_arr.push(text.charCodeAt(i));
}
console.log(asc_arr);
var w_index=0,sum=0;
for(var j=0;j<asc_arr.length;j++)
{
  if(w_index<weights.length)
  {
   //console.log("Adding "+asc_arr[j]+"*"+weights[w_index]+" to the sum");
    w_index=0;
  }
  sum+=asc_arr[j]*weights[w_index];
  w_index++;

}
//console.log("Sum: "+sum);
m=Math.pow(2,31)-1;
sum=sum%(m);
//console.log("Modulus operator : "+m);
//console.log(sum);
return sum.toString()+"_L"+file_text.length.toString()+"."+GetExtension(file_name);
},

replaceAll:function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
},


// Check if the directory exists in the path
// and if not create the directory
//makes all the folders at the server location
CheckDirExists:function(fold,server_path)
{
  for(var k=0;k<fold.length;k++)
  {
    var str=fold[k];
    //F:\\important files\\Website practise\\Nodejs Code\\server\\testfolder
    //var str='server/Client1/New_test/new 1'
    console.log("Path in checkdirexits function: "+str);
    var strarr=str.split('\\')
    var length_of_array=strarr.length;
    var count_change_dir=0;
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
  }

},


dateFormat:function(date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
},

//function used to write the files to the path
Write_file_toserver:function(l_files,label_text='',server_path,client_path)
{
  //console.log(process.cwd());
  var sManifestStr='';
  var fil1=l_files.slice(0);
  fs=require('fs')
  os=require('os')
  console.log("Inside write_file function value of fil1 :"+fil1);
  //console.log('before directorypathReplace:'+files);
  l_files=directorypathReplace(l_files,client_path,server_path);
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
    modified_file_name=GetArtifactName(file_text,file_name);
    var TAB="\t"
    sManifestStr+='CR'+TAB+fil1[i]+TAB+" -> "+TAB+l_files[i]+"\\"+modified_file_name+os.EOL;
    //Not needed yet to confirm with professor
    //sManifestStr+='Source_path : '+fil1[i]+os.EOL;
    //sManifestStr+='Dest_path : '+l_files[i]+'/'+modified_file_name+os.EOL;
    //sManifestStr+='Text in the file : '+file_text+os.EOL;
    sDatetime=dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString();
    sManifestStr+="Time stamp: "+dateFormat(new Date(),"%d%m%Y%H%M%S",true).toString()+os.EOL;;
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
  CreateManifestFile(server_path,project_name,sManifestStr,sDatetime,label_text);
},



//&emsp; print the tab on the screen
//Generates the Manifest file and copy all the manifest content in the file
CreateManifestFile:function(ff_paths,project_name,sman_txt,sTimeStamp,labeltext)
{
    os=require('os')
    fs=require('fs')
    console.log("Inside the Create Manifest file function")
    path=ff_paths;
    console.log("Inside the Create Manifest file function Path : "+path)
    sManifestFileName='Manifest_'+sTimeStamp+'.txt'
    file_path=path+'\\'+sManifestFileName
    console.log(file_path)
    fs.writeFile(file_path,sman_txt,function(err)
    {
      if (err) throw err;
      console.log('Manifest file Saved!');
    });
    file_path=path+'\\labels.txt'
    //file_path=path+"\\"+project_name+'\\labels.txt'
    console.log(file_path)
    fs=require('fs');
    exists=fs.existsSync(file_path)
    if(!exists)
    {
      if(labeltext!=null)
      {
        fs.writeFile(file_path,"\nManifest_"+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n",function(err)
        {
          if (err) throw err;
          console.log('Label file Saved!');
        });
      }
    }
    else {
          if(labeltext!=null)
          {
              content = fs.readFileSync(path+'\\labels.txt','UTF8',function(data,err)
              {
                  if(err) throw err;
                  return data
              });
              content=content+"\nManifest_"+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n"
              console.log(content)
              fs.writeFile(path+'\\labels.txt', os.EOL+'Manifest_'+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n", { flag: 'a+' }, (err) => {})
        }

    }
return sManifestFileName

/*
    fs.appendFileSync(path+'\\labels.txt',os.EOL+'Manifest_'+sTimeStamp+'.txt'+"    "+labeltext+os.EOL+" ","utf8",function(err)
    {
      if(err) throw err;
      console.log('Label Saved!')
    });
*/

},

// Get the file updated time of the file
 getFileUpdatedDate : function(path){
  const stats = fs.statSync(path)
  return stats.mtime
},
// Get the extension of the file  from the filenames
GetExtension:function(file_name)
{
    arr=file_name.split(".");
    return arr[arr.length-1];
},

// Find the directory under directory and list the directory in the string format
/*
var findfolder=function(client_path)
{
  var folders=[];
  fs.readdirSync(client_path).foreach(function(file)
  {
      var stats=fs.statSync(client_path+"/"+file);
      if(stats.isDirectory())
      {
          findfolder(client_path+'/'+file);
          var a=client_path+'/'+file;
          folder.push(a);
      }
  })
}
*/


/*
// List of all the folder and files in one directory
var findFileAndFolder, jsFiles, rootDir;
var folder = [],file_path=[];
var dir='';var tcase='';
function findFileAndFolder(dir,tcase='')
{
    console.log('Directory searching for'+dir);
    Filesystem.readdirSync(dir).forEach(function(file) {
    var stat;
    stat = Filesystem.statSync("" + dir + "/" + file);
    if (stat.isDirectory())
    {
      var a="" + dir + "/" + file;
      folder.push(a);
      console.log("Directory : "+a);
      return findFileAndFolder(a,tcase);
    }
    else //if (file.split('.').pop() === 'js')
    {
      console.log("Files : "+"" + dir + "/" + file);
      return file_path.push("" + dir + "/" + file);
    }
  });

  console.log(os.EOL+"Tcase: "+tcase+os.EOL);
  if(tcase=="client")
  {
    console.log('inside Client will display client directory');
    folder=folder.filter(folder=>!folder.startsWith('./server'));
    file_path=file_path.filter(file_path=>!file_path.startsWith('./server'));

  }
  else if(tcase=="server") {
    console.log('inside server will display server directory');
    //folder=folder.filter(folder=>!folder.startsWith('./Client'||'Client'));
    folder=folder.filter(folder=>folder.startsWith('./server'||'server'));
    //file_path=file_path.filter(file_path=>!file_path.startsWith('./Client'||'Client'));
    file_path=file_path.filter(file_path=>file_path.startsWith('./server'||'server'));

  }
return [file_path,folder];
};
*/

/* // Code that needs to be checked
Filesystem = require('fs');
// List of all the folder and files in one directory
var findFileAndFolder, jsFiles, rootDir;
var folder = [],file_path=[];
var dir='';var tcase='';
function findFileAndFolder(dir,tcase='')
{
    console.log('Directory searching for'+dir);
    Filesystem.readdirSync(dir).forEach(function(file) {
    var stat;
    stat = Filesystem.statSync("" + dir + "/" + file);
    if (stat.isDirectory())
    {
      var a="" + dir + "/" + file;
      folder.push(a);
      console.log("Directory : "+a);
      return findFileAndFolder(a,tcase);
    }
    else //if (file.split('.').pop() === 'js')
    {
      console.log("Files : "+"" + dir + "/" + file);
      return file_path.push("" + dir + "/" + file);
    }
  });

  console.log(os.EOL+"Tcase: "+tcase+os.EOL);
  if(tcase=="client")
  {
    console.log('inside Client will display client directory');
    folder=folder.filter(folder=>!folder.startsWith('./server'));
    file_path=file_path.filter(file_path=>!file_path.startsWith('./server'));

  }
  else if(tcase=="server") {
    console.log('inside server will display server directory');
    //folder=folder.filter(folder=>!folder.startsWith('./Client'||'Client'));
    folder=folder.filter(folder=>folder.startsWith('./server'||'server'));
    //file_path=file_path.filter(file_path=>!file_path.startsWith('./Client'||'Client'));
    file_path=file_path.filter(file_path=>file_path.startsWith('./server'||'server'));

  }
return [file_path,folder];
};
*/
//Push to server code

//Pull
//Yet to be made

getClientDirectory:function()
{
  var obj=findFileAndFolder(client_path,'client');
  return obj;
},

getServerDirectory:function()
{
  return findFileAndFolder(server_path,'server');

},

//Creates the empty directories in the server for a particular user
createServerDirectory:function(folders,client_path,server_path,project_path)
{

    //console.log('Parameter Sent  : '+ folders);
    //folders=directorypathReplace(folders,'./Client','server');
    folders=directorypathReplace(folders,client_path,server_path);
    console.log("Inside the createServerDirectory : "+folders)
    //CheckDirExists(folders,server_path,project_path);
    return folders;
}




//module.exports=getClientDirectory(client_path);
//module.export=getServerDirectory(server_path);
//module.export=CheckDirExists(folders)
//module.exports=directorypathReplace(files,pathvalue1,pathvalue2)


//  remove_duplicates,directorypathReplace,GetCheckSum,GetArtifactName,replaceAll,CheckDirExists,dateFormat,Write_file_toserver,CreateManifestFile,GetExtension,findFileAndFolder,createServerDirectory}





/// Output check
//var chk=0;
//chk=GetCheckSum("Hello World");
//files=getFileDir(path);
//console.log(process.cwd());
//print all the files with folder
//console.log(getFileDir(path));
//print all the folders inside the folders
//console.log("Checkdirinpath : "+checkdirinpath(path));
//print all the modified date of the files
//console.log(getFileUpdatedDate(path));

/*
for(var t=0;t<every_thing[0].length;t++)
{
  console.log(every_thing[0][t]+os.EOL);
}

for(var t=0;t<every_thing[1].length;t++)
{
  console.log(every_thing[1][t]+os.EOL);
}
*/


//print all the folders inside the folders
//var every_thing=findFileAndFolder(client_path,'client');

//console.log('*************************************************************************************')
//console.log('*********************Inside Client directory')
//console.log("files ="+every_thing[0]);
//console.log("folders="+every_thing[1])
//console.log("folders"+every_thing[1]);
//console.log('********************* Removing the duplicate paths from the array ')
//console.log(remove_duplicates(every_thing[0].concat(every_thing[1])))

//console.log('********************* before calling directorypathReplace')
//console.log(directorypathReplace(every_thing[1],'./Client','server'))
//console.log("Initial Stage at the server getserverdirectory: "+getServerDirectory(server_path));
//console.log("Initial Stage at the server getclientdirectory: "+getClientDirectory(client_path));
//result()
//console.log(module);
//console.log('********************* before calling createServerDirectory ')
//console.log(createServerDirectory(every_thing[0].concat(every_thing[1])));
//console.log(Write_file_toserver(remove_duplicates(every_thing[0])));



//console.log(file_text);

//var file_path=every_thing[0][0];
//.replace('./Client/Client1/1Def.txt','Client/Client1/1Def.txt');
//console.log(findFileAndFolder())
}

function directorypathReplace(filesnfolders,pathvalue1,pathvalue2)
{
 for(var u=0;u<filesnfolders.length;u++)
 {
   filesnfolders[u]=filesnfolders[u].replace(pathvalue1,pathvalue2);
 }
 return filesnfolders;
}


function GetCheckSum(file_text)
{
  const text=file_text;
  const asc_arr=[];
  const weights=[1,3,7,11,13]

  for(var i=0;i<text.length;i++)
  {
    asc_arr.push(text.charCodeAt(i));
  }
  console.log(asc_arr);
  var w_index=0,sum=0;
  for(var j=0;j<asc_arr.length;j++)
  {
    if(w_index<weights.length)
    {
     //console.log("Adding "+asc_arr[j]+"*"+weights[w_index]+" to the sum");
      w_index=0;
    }
    sum+=asc_arr[j]*weights[w_index];
    w_index++;

  }
  //console.log("Sum: "+sum);
  m=Math.pow(2,31)-1;
  sum=sum%(m);
return sum; //to check the artifact id of data
}

function GetExtension(file_name)
{
    arr=file_name.split(".");
    return arr[arr.length-1];
}

//&emsp; print the tab on the screen
//Generates the Manifest file and copy all the manifest content in the file

/*
function CreateManifestFile(ff_paths,project_name,sman_txt,sTimeStamp,labeltext)
{
    path=server_path+'/'+project_name;
    fs.writeFile(path+'/Manifest_'+sTimeStamp+'.txt',sman_txt,function(err)
    {
      if (err) throw err;
      console.log('Saved!');
    });

    fs.appendFile(path+'/labels.txt','Manifest_'+sTimeStamp+'.txt'+"    "+labeltext,function(err)
    {
      if(err) throw err;

    });


}
*/

//Create the artifact id complete name
function GetArtifactName(file_text,file_name)
{
const text=file_text;
const asc_arr=[];
const weights=[1,3,7,11,13]

for(var i=0;i<text.length;i++)
{
  asc_arr.push(text.charCodeAt(i));
}
console.log(asc_arr);
var w_index=0,sum=0;
for(var j=0;j<asc_arr.length;j++)
{
  if(w_index<weights.length)
  {
   //console.log("Adding "+asc_arr[j]+"*"+weights[w_index]+" to the sum");
    w_index=0;
  }
  sum+=asc_arr[j]*weights[w_index];
  w_index++;

}
//console.log("Sum: "+sum);
m=Math.pow(2,31)-1;
sum=sum%(m);
//console.log("Modulus operator : "+m);
//console.log(sum);
return sum.toString()+"_L"+file_text.length.toString()+"."+GetExtension(file_name);
}


// Check if the directory exists in the path
// and if not create the directory
//makes all the folders at the server location
function CheckDirExists(fold,server_path,project_path)
{
  for(var k=0;k<fold.length;k++)
  {
    var str=fold[k];
    //F:\\important files\\Website practise\\Nodejs Code\\server\\testfolder
    //var str='server/Client1/New_test/new 1'
    i=0
    while(str.split('\\').pop()!='server')
    {
      i++
      //console.log(i)
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
  /*
  for(var k=0;k<fold.length;k++)
  {
    var str=fold[k];
    //var str='server/Client1/New_test/new 1'
    console.log("Path in checkdirexits function: "+str);
    var strarr=str.split('/')
    var length_of_array=strarr.length;
    var count_change_dir=0;
    console.log(process.cwd());
    for(var p=1;p<length_of_array;p++)
    {
      var exists=fs.existsSync(strarr[p-1]+'/'+strarr[p]);
      if(!exists)
      {fs.mkdirSync(strarr[p-1]+'/'+strarr[p]);}
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
  }
  */
}


function dateFormat(date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}

//Generates the Manifest file and copy all the manifest content in the file
function CreateManifestFile(ff_paths,project_name,sman_txt,sTimeStamp,labeltext)
{
  console.log("Inside the Create Manifest file function")
  path=ff_paths;
  console.log("Inside the Create Manifest file function Path : "+path)
  sManifestFileName='Manifest_'+sTimeStamp+'.txt'
  file_path=path+'\\'+sManifestFileName
  console.log(file_path)
  fs.writeFile(file_path,sman_txt,function(err)
  {
    if (err) throw err;
    console.log('Manifest file Saved!');
  });
  file_path=path+'\\labels.txt'
  //file_path=path+"\\"+project_name+'\\labels.txt'
  console.log(file_path)
  exists=fs.existsSync(file_path)
  if(!exists)
  {
    if(labeltext!=null)
    {
      fs.writeFile(file_path,"\nManifest_"+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n",function(err)
      {
        if (err) throw err;
        console.log('Label file Saved!');
      });
    }
  }
  else {
        if(labeltext!=null)
        {
            content = fs.readFileSync(path+'\\labels.txt','UTF8',function(data,err)
            {
                if(err) throw err;
                return data
            });
            content=content+"\nManifest_"+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n"
            console.log(content)
            fs.writeFile(path+'\\labels.txt', os.EOL+'Manifest_'+sTimeStamp+'.txt'+"    "+labeltext+os.crlf+"\n", { flag: 'a+' }, (err) => {})
      }
      return sManifestFileName
}
}
//Removing all the duplicate paths coming from the directory
function remove_duplicates(arry)
{
    return Array.from(new Set(arry))
}
