$(document).ready(function(){
   $("#showfkey").click(fkey);
   $("#showskey").click(skey);
   $("#innerjoin").click(callinnerjoin);
   $("#leftoutjoin").click(callleftoutjoin);
   $("#rightoutjoin").click(callrightoutjoin);
   $("#fulloutjoin").click(callfulloutjoin);
   //when the webpage load, the names of tables/files will be list in select box
   ftnameList();
   stnameList();
});

//show list of table names in the select box
function ftnameList(){
   $.ajax({
   	  method: "GET",
   	  url: "/ftablename",
   	  dataType: "json",
   	  success: function(data){
   	  	//show the namelist
   	  	if(data.filenames.length){
   	  	  //exist file in datafold
   	  	  for(var i = 0; i < data.filenames.length; i++){
   	  	  	//remove the file type and just keep filename
   	  	  	var shownamelength = data.filenames[i].length - 5;
   	  	  	var showname = data.filenames[i].substring(0,shownamelength);
   	  		$('#ftdropdown').append('<option value= "'+showname+'">'+ showname+ '</option>');
   	  	  }
   	  	}else{
   	  	   //datafold is empty
   	  	   $('#ftdropdown').append('<option value= "foldempty"> you data fold is empty</option>');
   	  	 }
   	  }
   });
};
//show list of table names in the select box
function stnameList(){
   $.ajax({
   	  method: "GET",
   	  url: "/stablename",
   	  dataType: "json",
   	  success: function(data){
   	  	//show the namelist
   	  	if(data.filenames.length){
   	  	  //exist file in datafold   	  	  
   	  	  for(var i = 0; i < data.filenames.length; i++){
   	  	  	//remove the file type and just keep filename
   	  	  	var shownamelength = data.filenames[i].length - 5;
   	  	  	var showname = data.filenames[i].substring(0,shownamelength);
   	  		$('#stdropdown').append('<option value= "'+showname+'">'+ showname+ '</option>');
   	  	  }
   	  	}else{
   	  	   //datafold is empty
   	  	   $('#stdropdown').append('<option value= "foldempty"> you data fold is empty</option>');
   	  	 }
   	  }
   });
};

//click "choose key" button,generate key list for first table
function fkey(){
	var ftablename = $('#ftdropdown :selected').val();
	$('#fkdropdown').empty();
	$('#fkdropdown').css('color','black');
	//load all possible keys in ftable
	$.ajax({
   	  method: "GET",
   	  url: "/ftablename?"+ ftablename,
   	  dataType: "json",
   	  success: function(data){
   	  	 if(data.keys.length){
   	  	  //obj is not empty , in case of this [{},{},{}]
   	  	  for(var i = 0; i < data.keys.length; i++){
   	  		$('#fkdropdown').append('<option value= "'+data.keys[i]+'">'+ data.keys[i]+ '</option>');
   	  	  }
   	  	}else{
   	  	   //in case of this [{},{},{}]
   	  	   $('#fkdropdown').append('<option value= "objempty"> your obj is empty</option>');
   	  	 }

   	  }
    });

};
//click "choose key" button,generate key list for second table
function skey(){
	var stablename = $('#stdropdown :selected').val();
	$('#skdropdown').empty();
	$('#skdropdown').css('color','black');
	//load all possible keys in ftable
	$.ajax({
   	  method: "GET",
   	  url: "/stablename?"+ stablename,
   	  dataType: "json",
   	  success: function(data){
   	  	 if(data.keys.length){
   	  	  //obj is not empty , in case of this [{},{},{}]
   	  	  for(var i = 0; i < data.keys.length; i++){
   	  		$('#skdropdown').append('<option value= "'+data.keys[i]+'">'+ data.keys[i]+ '</option>');
   	  	  }
   	  	}else{
   	  	   //in case of this [{},{},{}]
   	  	   $('#skdropdown').append('<option value= "objempty"> your obj is empty</option>');
   	  	 }

   	  }
    });

};

function callinnerjoin(){
	var ftablename = $('#ftdropdown :selected').val();
    var stablename = $('#stdropdown :selected').val();
    var fkey = $('#fkdropdown :selected').val();
    var skey = $('#skdropdown :selected').val();
    //in case click join button before chose keys
    if(!fkey || !skey){
    	alert("Please select key value in both two table");

    }else{
      $.ajax({
   	  method: "GET",
   	  url: "/innerjoin?"+ ftablename+ ".json" + "&"+ stablename + ".json" +"&"+ fkey +"&"+skey,
   	  dataType: "text",
   	  success: function(){
         window.alert("Innerjoin Success!New file generates in you data file");
   	  },
   	  //error for debug
   	  error: function(jqXHR, textStatus, errorThrown){
          alert('error');
      } 
    });
    } 
};

function callrightoutjoin(){
	var ftablename = $('#ftdropdown :selected').val();
    var stablename = $('#stdropdown :selected').val();
    var fkey = $('#fkdropdown :selected').val();
    var skey = $('#skdropdown :selected').val();
    //in case click join button before chose keys
    if(!fkey || !skey){
    	alert("Please select key value in both two table");
    }else{
      $.ajax({
   	  method: "GET",
   	  url: "/rightoutjoin?"+ ftablename+ ".json" + "&"+ stablename + ".json" +"&"+ fkey +"&"+skey,
   	  dataType: "text",
   	  success: function(){
         window.alert("Rightjoin Success!New file generates in you data file");
   	  },
   	  //error for debug
   	  error: function(jqXHR, textStatus, errorThrown){
          alert('error');
      } 
    });
    } 
};

function callleftoutjoin(){
	var ftablename = $('#ftdropdown :selected').val();
    var stablename = $('#stdropdown :selected').val();
    var fkey = $('#fkdropdown :selected').val();
    var skey = $('#skdropdown :selected').val();
    //in case click join button before chose keys
    if(!fkey || !skey){
    	alert("Please select key value in both two table");

    }else{
      $.ajax({
   	  method: "GET",
   	  url: "/leftoutjoin?"+ ftablename+ ".json" + "&"+ stablename + ".json" +"&"+ fkey +"&"+skey,
   	  dataType: "text",
   	  success: function(){
         window.alert("Leftjoin Success!New file generates in you data file");
   	  },
   	  //error for debug
   	  error: function(jqXHR, textStatus, errorThrown){
          alert('error');
      } 
    });
    } 
};

function callfulloutjoin(){
	var ftablename = $('#ftdropdown :selected').val();
    var stablename = $('#stdropdown :selected').val();
    var fkey = $('#fkdropdown :selected').val();
    var skey = $('#skdropdown :selected').val();
    //in case click join button before chose keys
    if(!fkey || !skey){
    	alert("Please select key value in both two table");
    }else{
      $.ajax({
   	  method: "GET",
   	  url: "/fulloutjoin?"+ ftablename+ ".json" + "&"+ stablename + ".json" +"&"+ fkey +"&"+skey,
   	  dataType: "text",
   	  success: function(){
         window.alert("Fulljoin Success!New file generates in you data file");
   	  },
   	  //error for debug
   	  error: function(jqXHR, textStatus, errorThrown){
          alert('error');
      } 
    });
    } 
};
