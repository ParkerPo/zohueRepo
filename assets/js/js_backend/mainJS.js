var userTable="";
var articleTable="";
var articleList="";
var searchUser="";
var attachmentList=[];
var attachmentNameList=[];
var categoryList={};
var formNum;

$(document).ready(function(){
  checkAuth();

  $(document).on("click","#adminLogin",function(e){
    var adminAccount = $("#adminAccount").val();
    var adminPassword = $("#adminPassword").val();
    var url = document.URL;

    $.post("/adminLogin",{adminAccount: adminAccount, adminPassword: adminPassword}, function(res){
      if (res == "success"){
        alert("登入成功！");
        location.replace(url);
      }else{
        alert(res);
      }
    });
  });

  function checkAuth() {
    $.get("/checkAdmin", function(res){
      if(res=="true") {
        alert("Admin desu.");
        $("#backendContent").css("display","block");
      }else{
        alert("Not admin.");
      }
    });
  }

  $.get("/getBoardCategory", function(boardCategory){
    for(c=0; c<boardCategory.length; c++) {
      categoryList[boardCategory[c].id]=boardCategory[c].title;      
      $("#boardCategory").append("<option value='"+boardCategory[c].id+"''>"+boardCategory[c].title+"</option>");
    }
    $("#boardCategory").append("<option value='allCategory'>選擇全部</option>")
  }).error(function(res){
    alert(res.responseJSON.err);
  });

  $("#boardCategory").change(function(){
    var category = $("#boardCategory").val();
    var board = $("#board").val();

    if(category=="allCategory"){
      $("#board").empty();
      $("#board").append("<option>選擇全部</option>")
      //board="allCategory";
      getart(loadForumList, 2);
    }else{
      $("#board").empty();
      $.get("/getBoardsOfCategory/"+category, function(boards) {
        $("#board").append("<option selected='selected'>請選擇</option>")
        for(b=0; b<boards.length; b++) {
          $("#board").append("<option value='"+boards[b].id+"''>"+boards[b].title+"</option>");
        }
        $("#board").append("<option value='allBoards'>選擇全部</option>")
      });
    }
  });

  $("#board").change(function(){
    if($(this).val()=="allBoards"){
      getart(loadForumList, 1);
    }else{
      board=$(this).val();
      getart(loadForumList, 0);
    }   
  });

  $(document).on("click",".sortByChar",function(e){
    sortByChar($(this).attr("value"));
  });
  $(document).on("click",".sortByLength",function(e){
    sortByLength($(this).attr("value"));
  });
  $(document).on("click",".sortByCreatedAt",function(e){
    sortByCreatedAt();
  });
    $(document).on("click",".sortByUpdatedAt",function(e){
    sortByUpdatedAt();
  });


  $("input[name='uploadFile']").change(function(){
    var fullPath = $(this).val();
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
    }
    $("form#uploadForm").submit();
    attachmentNameList.push(filename);
    $("#attachmentEdit label").css("display", "block");
    $("#attachmentList").append("<tr><td>"+filename+"</td><td class='text-right'><span class='glyphicon glyphicon-remove removeFile' value='"+filename+"' aria-hidden='true'></span></td></tr>");
  });

  $("form#uploadForm").submit(function(){
    var formData = new FormData($(this)[0]);
    $("[name=uploadFile]").val("");

    $.ajax({
        url: '/fileUpload',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            console.log(data);
            attachmentList.push(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
  });

  $(document).on("click",".removeFile",function(e){
    var index = attachmentNameList.indexOf($(this).attr("value"));

    $.post("/deleteFile",{fileName: attachmentList[index]}, function(res){
      if (res != "SEND"){
        console.log("刪除失敗");
      }
    });

    attachmentNameList.splice(index, 1);
    attachmentList.splice(index, 1);
    $(this).parent().parent().remove();
  });

  $(document).on("click","#sendNewsLetter",function(e){
    var mailSubject = document.getElementById("mailSubject").value;
    var mailContent = document.getElementById("mailContent").value;
    if (mailSubject=="" && mailContent==""){
      alert("尚未輸入主旨或內文!");
    }else{
      if(confirm("確定要發送電子報嗎？")){
        document.getElementById("mailSpinner").style.display="block";
        document.getElementById("mailEdit").style.display="none";
        document.getElementById("attachmentEdit").style.display="none";
        document.getElementById("emailButtonGroups").style.display="none";

        $.post("/sendNewsLetter",{mailSubject: mailSubject,mailContent: mailContent, attachmentList: attachmentList.toString(), attachmentNameList: attachmentNameList.toString()}, function(res){
          if (res == "SEND"){
            attachmentList=[];
            attachmentNameList=[];
            alert("電子報發送成功!");
            document.getElementById("mailSubject").value="";
            document.getElementById("mailContent").value="";
            document.getElementById("mailEdit").style.display="block"; 
            document.getElementById("mailSpinner").style.display="none";
            document.getElementById("attachmentEdit").style.display="block";
            document.getElementById("emailButtonGroups").style.display="block";
            $("#attachmentEdit label").css("display", "none");
            $("#attachmentList").html("");
          }else{
            attachmentList=[];
            attachmentNameList=[];
            alert("電子報發送失敗!");
            document.getElementById("mailSubject").value="";
            document.getElementById("mailContent").value="";
            document.getElementById("mailEdit").style.display="block"; 
            document.getElementById("mailSpinner").style.display="none";
            document.getElementById("attachmentEdit").style.display="block";
            document.getElementById("emailButtonGroups").style.display="block";
          }
        });
      }
    }
  });
});

function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";

  searchUser=document.getElementById("searchUser").value;

  $.get("/getAllUsers"+"?searchUser="+searchUser, function(userList){

    if(typeof(userList)=="string"){
      alert(userList);
    }else{
      userTable="<tr class='tableHead'><th>帳號</th><th>姓名</th><th>暱稱</th><th>性別</th><th>身分別</th><th>E-mail</th><th>註冊日期</th><th>正式會員</th><th>發文數</th><th>文章平均檢舉數</th><th>停權</th><tr>";

      for(i=0; i<userList.length; i++) {
        fullName=userList[i].lname+" "+userList[i].fname;
        createdAt=new Date(userList[i].createdAt).toLocaleString();
        postNum = userList[i].articlesPost.length;
        totalReport=0;
        for(j=0; j<userList[i].articlesPost.length; j++) {
          totalReport+=userList[i].articlesPost[j].report.length;
        }
        if(postNum==0){
          avgReportNum = 0
        }else{
          avgReportNum = formatFloat(totalReport/postNum);
        }
        
        userTable+="<tr><td>"+userList[i].account+"</td><td>"+fullName+"</td><td>"+userList[i].alias+"</td><td>"+userList[i].gender+"</td>";
        userTable+="</td><td>"+userList[i].type+"</td><td>"+userList[i].email+"</td><td>"+createdAt+"</td>";
        if (userList[i].isFullSignup==false){
          userTable+="<td><span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span></td>";
        }else{
          userTable+="<td><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span></td>";
        }
        userTable+="<td>"+postNum+"</td>";
        if (avgReportNum>=3){
          userTable+="<td>"+avgReportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' title='文章平均檢舉數超過3'></span></td>";
        }else{
          userTable+="<td>"+avgReportNum+"</td>";
        }
        userTable+="<td><span class='glyphicon glyphicon-ban-circle' aria-hidden='true'></span></td></tr>";
      }
      document.getElementById("backend_userList").innerHTML = userTable;
    }    
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function getart(callback, action){
  var category = $("#boardCategory").val();
  var board = $("#board").val();
  var categoryName = $("#boardCategory").val();

  switch(action) {
    case 0: // 根據board及category撈文章。
      $.get("/getArticles/"+board, function(res){ 
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
          alert(res.responseJSON.err);
      });  
      break;
    case 1: // 根據category撈文章。
      $.get("/getArticlesByCategory/"+category, function(res){
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
          alert(res.responseJSON.err);
      });
      break;
    case 2: // 根據board撈文章。
      $.get("/getArticlesByBoards", function(res){
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
        alert(res.responseJSON.err);
      });
      break;
  }
}

function loadForumList(articleList){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";
  
  if(typeof(articleList)!="undefined"){
    articleTable="<tr class='tableHead'><th>看板位置</th><th class='sortable sortByChar' value='classification'>文章類別</th><th class='sortable sortByChar' value='title' style='width:400px;'>文章標題</th><th style='width:200px;'>發表人</th><th>身分別</th>";
    articleTable+="<th class='sortable sortByCreatedAt'>發表時間</th><th class='sortable sortByUpdatedAt'>最新回應時間</th><th>點閱數／回覆數</th><th class='sortable sortByLength' value='nicer'>推薦數</th><th class='sortable sortByLength' value='report' style='width:200px;'>檢舉數</th><tr>";

      for(i=0; i<articleList.length; i++) {
        clickNum=articleList[i].clickNum;
        responseNum=articleList[i].responseNum;
        niceNum=articleList[i].nicer.length;
        lastTime=new Date(articleList[i].lastResponseTime).toLocaleString();
        lastResponseTime=lastTime.slice(0, lastTime.length-3);
        createdAt=new Date(articleList[i].createdAt).toLocaleString();
        postTime=createdAt.slice(0,createdAt.length-3);
        authorType=articleList[i].author.type;
        reportNum=articleList[i].report.length;
        var boardName=articleList[i].board.title;

        articleTable+="<tr><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
        articleTable+="<td>"+articleList[i].classification+"</td><td>"+articleList[i].title+"</td><td>"+articleList[i].author.alias+"</td>";
        articleTable+="<td>"+authorType+"</td><td>"+postTime+"</td><td>"+lastResponseTime+"</td><td>"+clickNum+"／"+responseNum+"</td><td>"+niceNum+"</td>";
        
        reportobj=articleList[i].report;
        var reasonHtml = reasonHtmlCreate(reportobj);

        if(reportNum>0 && reportNum<3){
          articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum;
          articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td></tr>";
        }else if(reportNum>=3){
          articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum+"<span class='glyphicon glyphicon-exclamation-sign aria-hidden='true' title='該篇文章檢舉次數超過3'></span>";
          articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td></tr>";
        }else{
          articleTable+="<td>"+reportNum+"</td></tr>";
        }
      }
    document.getElementById("backend_articleList").innerHTML = articleTable;
  }
}

function loadEnlManage(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="block";
  document.getElementById("subscriberManage").style.display="none";
}

function loadsubscriberList(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="block";

  searchEmail=document.getElementById("searchEmail").value;

  $.get("/getAllSubscribers"+"?searchEmail="+searchEmail, function(subscribers){
    
    //subscribers=res;
    if(typeof(subscribers)=="string"){
      alert(subscribers);
    }else{
      subscriberTable="<tr class='tableHead'><th>編號</th><th>電子郵件地址</th><th>訂閱日期</th><th>刪除訂閱者</th><tr>";
      for(i=0; i<subscribers.length; i++){
        createdAt=new Date(subscribers[i].createdAt).toLocaleString();
        subscriberId=subscribers[i].id;
        subscriberTable+="<tr><td>"+(i+1)+"</td><td>"+subscribers[i].email+"</td><td>"+createdAt+"</td>";
        subscriberTable+="<td><span class='glyphicon glyphicon-trash delSub' aria-hidden='true' onclick='deleteSubscriber("+subscriberId+");'></span></td></tr>";
      }
      document.getElementById("backend_subscriberList").innerHTML = subscriberTable;
    }
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function sortByChar(sortby){
  articleList=articleList.sort(function(a, b) {
      return a[sortby].localeCompare(b[sortby])
  });
  loadForumList(articleList);
}
function sortByLength(sortby){
  articleList=articleList.sort(function(a, b) {
      return b[sortby].length-a[sortby].length;
  });
  loadForumList(articleList);
}

function sortByCreatedAt(){
  articleList=articleList.sort(function(a, b) {
    return new Date(b.createdAt)-new Date(a.createdAt);
  });
  loadForumList(articleList);
}

function sortByUpdatedAt(){
  articleList=articleList.sort(function(a, b) {
    return new Date(b.updatedAt)-new Date(a.updatedAt);
   });
  loadForumList(articleList);
}

function reasonHtmlCreate(reportobj){
  var reportReasonHtml="";
  for(k=0; k<reportobj.length; k++){
    reportReasonHtml+="<ul><li>"+reportobj[k].reason+"</li></ul>";
  }
  return(reportReasonHtml);
}

function showReason(ulId){
  if(document.getElementById("reportReason_"+ulId).style.display=="none"){
     document.getElementById("reportReason_"+ulId).style.display="block";
   }else{
     document.getElementById("reportReason_"+ulId).style.display="none";
   }
}

function sendNewsLetter(){

  var mailSubject = document.getElementById("mailSubject").value;
  var mailContent = document.getElementById("mailContent").value;
  if (mailSubject=="" && mailContent==""){
    alert("尚未輸入主旨或內文!");
  }else{
    if(confirm("確定要發送電子報嗎？")){
      document.getElementById("mailSpinner").style.display="block";
      document.getElementById("mailEdit").style.display="none";
      $.post("/sendNewsLetter",{mailSubject: mailSubject,mailContent: mailContent}, function(res){
        if (res == "SEND"){
          alert("電子報發送成功!");
          document.getElementById("mailSubject").value="";
          document.getElementById("mailContent").value="";
          document.getElementById("mailEdit").style.display="block"; 
          document.getElementById("mailSpinner").style.display="none";
        }else{
          alert("電子報發送失敗!");
          document.getElementById("mailSubject").value="";
          document.getElementById("mailContent").value="";
          document.getElementById("mailEdit").style.display="block"; 
          document.getElementById("mailSpinner").style.display="none";
        }
      });
    }
  }
}

function deleteSubscriber(id) {
  var r = confirm("確定要刪除該訂閱者嗎？");
  if (r == true) {
    $.post( "/deleteSubscriber", { id: id}, function(res){
     alert("刪除成功！");
     loadsubscriberList();
    })
    .error(function(res){
      alert(res.responseJSON.err);
  });} 
}

function cancelUserSearch(){
  document.getElementById("searchUser").value="";
  loadUserList();
}

function cancelEmailSearch(){
  document.getElementById("searchEmail").value="";
  loadsubscriberList();
}

// 輸入要搜尋的字之後，按enter可以直接送出
function userSearch(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    loadUserList();
  } else {
    return true;
  }
}

function emailSearch(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    loadsubscriberList();
  } else {
    return true;
  }
}

function formatFloat(num){ // 小數點第2位四捨五入
  return Math.round(num * 100) / 100;
}