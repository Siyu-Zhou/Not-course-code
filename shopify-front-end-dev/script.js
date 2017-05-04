$(document).ready(function(){
  $("#button").click(submitemailadd);
});

function submitemailadd(){
	console.log("Submit email address");
	var inputcontent = $("#input").val();
	console.log("Input"+inputcontent);
	//this function used for check inputcontent
	checkInputContent(inputcontent);
};

function checkInputContent(input){
    if(input){
    	console.log("Here");
    	//if not click without empty, green text will show
    	$("#clickwithempty").css("display","none");
        $("#senddata").css("display","inline");
    }else{
        //if not click with empty, red text will show
    	console.log("empty");
        $("#senddata").css("display","none");
    	$("#clickwithempty").css("display","inline");
    }
}