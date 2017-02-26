var page=1;
var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;

$(window).load(function(){ // 暫存回覆頁面
  var url = document.URL;
  if(url.match('forum')!=null){
    var regex = /.*forum\/+(.*)+\#+(.*)/;
    page = url.replace(regex,"$1");
  }
});

$(document).ready(function(){  
  FB_API();
  checkAuth();
  markMenuItem();
  // 強制貼上純文字
  $(document).on("paste", "div[contenteditable='true']" ,function(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  $('.dropdown-toggle').dropdown(); //For bootstrap dropdown menu
  // $( "#setUp" ).click(function() {
  //   if(setUpMenu.style.display=="block"){
  //     setUpMenu.style.display="none";
  //   }else{
  //     setUpMenu.style.display="block";
  //   }
  // });
});

  // This is called with the results from from FB.getLoginStatus().
 function FB_API(){
 

//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '1805396253053866',
//       xfbml      : true,
//       version    : 'v2.8'
//     });
//     FB.AppEvents.logPageView();
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "//connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1639694986252116',
      xfbml      : true,
      version    : 'v2.2'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=1639694986252116&version=v2.3";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


}



function checkAuth() {
  $.get("/checkAuth", function(auth){
    if(auth) {
      if(auth.isAdmin==true){
        document.getElementById("backend").style.display="block";
        document.getElementById("mobile_backend").style.display="block";
      }

      checkNot();
      setInterval("checkNot()", 5000);
      checkForum();
      setInterval("checkForum()", 5000);

      var setUp=document.getElementById("setUp");
      setUp.style.display="inline";

      var login=document.getElementById("loginSection");
      login.style.display="none";

      var gs_content = document.getElementById("gs_content");
      if(gs_content){
        gs_content.className = "container-fluid col-md-9";
      }

      var simpleS=document.getElementById("signup");
      if(simpleS){
        simpleS.style.display="none";
      }
      var profile=document.getElementById("profile");
      profile.style.display="block";
      document.getElementById("userAlias").innerHTML = "嗨！ "+auth.alias;
      document.getElementById("userimg").src = auth.img;

      var logout=document.getElementById("logout");
      logout.style.display="block";

      // var post=document.getElementById("post");
      // if(post){
      //   post.style.display="block";
      // }

      // var post=document.getElementById("post");
      // if(post){
      //   post.style.display="block";
      // }

      var profile_page=document.getElementById("profile_page");
      profile_page.style.display="block";
      var mprofiles=document.getElementById("mobile_profilepage");
      mprofiles.style.display="block";

      var setUp=document.getElementById("mobile_setUp");
      setUp.style.display="block";

      var friends=document.getElementById("friends");
      friends.style.display="block";

      var mfriends=document.getElementById("mobile_friends");
      mfriends.style.display="block";

      var mlogin=document.getElementById("mobile_loginSection");
      mlogin.style.display="none";

      // var mlogout=document.getElementById("mobile_logout");
      // mlogout.style.display="block";

      var profile=document.getElementById("mobile_profile");
      profile.style.display="block";
      document.getElementById("mobile_userAlias").innerHTML = "嗨！ "+auth.alias;
      document.getElementById("mobile_userimg").src = auth.img;

      $.get("/checkFull", function(full){
        var fullSignup1=document.getElementById("mobile_fullSignup");
        var fullSignup2=document.getElementById("fullSignup");
        var profile1=document.getElementById("profilePage");
        var profile2=document.getElementById("mobile_profilepage");
        if(!full){
          fullSignup1.style.display="block";
          fullSignup2.style.display="block";
          profile1.style.display="none";
          profile2.style.display="none";
        }else{
          fullSignup1.style.display="none";
          fullSignup2.style.display="none";
          profile1.style.display="block";
          profile2.style.display="block";
        }
      });


      var leaveMessage=document.getElementById("leaveMessage");
      if(leaveMessage) {
        leaveMessage.style.display="block";
      }

      var postformmain=document.getElementById("post-form-main");
      if(postformmain) {
        postformmain.style.width="100%";
      }
      
    }else{
      var setUp=document.getElementById("setUp");
      setUp.style.display="none";
      document.getElementById("setUpMenu").style.display="none"

      var logout=document.getElementById("logout");
      logout.style.display="none";

      var gs_content = document.getElementById("gs_content");
      if(gs_content){
        gs_content.className = "container-fluid col-md-6";
      }
      // var mlogout=document.getElementById("mobile_logout");
      // mlogout.style.display="none";
     
      var setUp=document.getElementById("mobile_setUp");
      setUp.style.display="none";




      // var post=document.getElementById("post");
      // if(post){
      //   post.style.display="none";
      // }

      var leaveMessage=document.getElementById("leaveMessage");
      if(leaveMessage) {
        leaveMessage.style.display="none";
      }

      var postformmain=document.getElementById("post-form-main");
      if(postformmain) {
        postformmain.style.width="100%";
      }

      var simpleS=document.getElementById("signup");
      if(simpleS){
        simpleS.style.display="block";
      }

      var login=document.getElementById("loginSection");
      login.style.display="block";

      var mlogin=document.getElementById("mobile_loginSection");
      mlogin.style.display="block";
    }
  });
}


function check(){
  allow_create = 1;
  if($("#UserAlias").val() == ""){
    $("label[id = checkAlias]").text("  *這裡也要填喔！");allow_create = 0;
  }else{
      var len = $("#UserAlias").val().replace(/[^\x00-\xff]/g,"rr").length;
      if(len > 16){
        $("label[id = checkAlias]").text("  *暱稱不能超過 8 個中文字 / 16 個英文字喔！");allow_create = 0;
      }else{$("label[id = checkAlias]").text("");}
  }

  // .search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)== -1)

  if($("#UserAccount").val() == ""){
    $("label[id = checkAccount]").text("  *這裡也要填喔！");allow_create = 0;
  }else{
    if($("#UserAccount").val().search(/^[A-Za-z0-9]+$/)== -1){
      $("label[id = checkAccount]").text("  *暱稱只能填英文字和數字喔！");allow_create = 0;
    }else{
    $("label[id = checkAccount]").text("");}
  }

  if($("#UserPwd").val() == ""){
    $("label[id = checkPwd]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwd]").text("");}

  if($("#UserPwdConfirm").val() == ""){
    $("label[id = checkPwdConfirm]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwdConfirm]").text("");}

  if(allow_create==1) {
    if($("#UserEmail").val() != "") {
      if(checkEmail()&&checkPwd()) {
        Submit();
      }
    } else {
      bootbox.dialog({
        message: "是否真的不要輸入E-mail？",
        title: "再次確認",
        buttons: {
          yes: {
            label: "確認",
            className: "btn-primary",
            callback: function() {
              allow_create=1;
              checkPwd();
              Submit();
            }
          },
          no: {
            label: "取消",
            className: "btn-primary",
            callback: function() {
              allow_create=0;
            }
          }
        }
      });
      // if(confirm("是否真的不要輸入 e-mail？")) {
      // } else {
      //   allow_create=0;
      // }
    }
  }
  // if(checkPwd()&&checkEmail) {
  //   checkPwd();
  // }

  // if(allow_create==1){
  //   Submit();
  // }
}

function checkIfAccountExist(){
  if($("#UserAccount").val().trim().length > 0){

    var account = $("#UserAccount").val();
    var posting = $.post( "/simpleSignupAccountCheck", { account: account}, 
    function(res){

      if($("#UserAccount").val().trim().length > 0 ){
        if($("#UserAccount").val().search(/^[A-Za-z0-9]+$/)== -1){
            $("label[id = checkAccount]").text("  *帳號只能為英文字和數字的組合喔！");allow_create = 0;
          }else{
            $("label[id = checkAccount]").removeClass("check").addClass("checkOK");
            $("label[id = checkAccount]").text("  *您可以使用此帳號！"); //alert(res.responseJSON);
        }
      }
    })
    .error(function(res){
      $("label[id = checkAccount]").removeClass("checkOK").addClass("check");
      $("label[id = checkAccount]").text("  *此帳號已經有人使用囉！"); //alert(res.responseJSON.err);
    });
  }else{
    $("label[id = checkAccount]").text("");
  }
}

function checkEmail(){
  if($("#UserEmail").val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)== -1){
    $("label[id = checkEmail]").text("  *E-mail格式錯誤！");
    allow_create = 0;
    return false;
  }
  else {
    $("label[id = checkEmail]").text("");
    return true;
  }
}

function checkPwd(){
  if($("#UserPwdConfirm").val().length > 0 && $("#UserPwd").val() != $("#UserPwdConfirm").val()){
    $("label[id = checkPwdConfirm]").removeClass("checkOK").addClass("check");
    $("label[id = checkPwdConfirm]").text("  *原密碼與確認密碼不同！");allow_create = 0;
    return 0;
  }
  else if($("#UserPwd").val().length > 0 && $("#UserPwdConfirm").val().length > 0 && $("#UserPwd").val() == $("#UserPwdConfirm").val()){
    $("label[id = checkPwdConfirm]").removeClass("check").addClass("checkOK");
    $("label[id = checkPwdConfirm]").text("  *已完成確認密碼！");
    return 1;
  }
  else{
    $("label[id = checkPwdConfirm]").text("");
    return 0;
  }
}

function check_allnotblank() 
{
  if($("#UserAlias").val()!="" && $("#UserAccount").val()!="" && $("#UserPwd").val()!="" && $("#UserPwdConfirm").val()!="" && 
    $("#UserType").val()!="")
  {
    $("#submit").prop("disabled", false);
    $("#submit").css("background-color","#FFCE54");
  }
  else
  {
    $("#submit").prop("disabled", true);
    $("#submit").css("background-color", "gray");
  }
}

function Submit(){
  console.log("sumbmit");
  var alias = $("#UserAlias").val();
  var account = $("#UserAccount").val();
  var password = $("#UserPwd").val();
  var email = $("#UserEmail").val();
  var type = $("#UserType").val();
  var FB_id = $("#FB_id").val();
  var gender = $("#UserGender").val();
  var fname = $("#fname").val();
  var lname = $("#lname").val();
  bootbox.dialog({
    message: "在您同意加入「作夥 ZOHUE 台灣頭頸部癌病友加油站」後，我們會保護您所提供的一切個人資料，以及在本網站上所產生之資訊，這些資料僅會在去除個人識別後，依照臺灣大學與臺大醫院的學術規範，做為學術研究與平臺改進之用，並且絕對不會用於任何商業用途。如果您選擇同意，您將會成功地加入作夥，若您選擇不同意，註冊則不會生效，我們亦不會將您方才所輸入資訊做任何形式之使用。",
    title: "使用者同意書",
    buttons: {
      danger: {
        label: "不同意",
        className: "btn-default",
        callback: function() {
//          window.location.assign("/home");
        }
      },
      main: {
        label: "同意",
        className: "btn-primary",
        callback: function() {
          var posting = $.post( "/simpleSignup", { account: account, password: password, alias: alias, email: email,FB_id:FB_id,gender:gender, type: type,fname:fname,lname:lname, isFullSignup: false}, 
          function(res){
              showDialog("一般訊息","註冊成功！如果在網站操作上有任何問題，可以參考左邊選單的「新手上路」喔！",function(){
                loginWithAccount(account, password);
              });
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
        }
      }
    }
  });
}

function Login(){
  var url = document.URL;
  if ($(window).width() <= 979){
    var account=$("#mLoginAccount").val();
    var password=$("#mLoginPwd").val();
  }else{
    var account=$("#LoginAccount").val();
    var password=$("#LoginPwd").val();
  }

  if(account == ""|| password == ""){
    showDialog("錯誤訊息","帳號與密碼都要輸入喔！");
  } else {
    var posting = $.post( "/login", { account: account, password: password}, function(res){
      if(res.suspended==true){
        bootbox.dialog({
          title: "此帳號已被停權",
          message: '由於您的帳號可能有不正常的使用情況，我們已停止此帳號的使用權限。<br><br>'
            +'停權原因：' + res.reason + '<br><br>如有任何問題，您可以利用以下「申訴欄位」向管理員反應。'
            +'<textarea id="appeal" placeholder="申訴欄位" class="form-control" style="margin-top:10px;" rows="3"></textarea>',
          buttons: {
            confirm: {
              label: "確認",
              className: "btn-primary",
              callback: function () {
                var appeal = $('#appeal').val();
                if(appeal!=""){
                  $.post( "/appeal", { account: account, appeal: appeal}, function(res){
                    showDialog("一般訊息", res);
                  });
                }
              }
            }
          }
        });
      }else{
        if(res.isFullSignup==true){
          showDialog("一般訊息",res.alias+"，歡迎回來作夥！",function(){

            if ($(window).width() <= 979){
              window.location.assign("/home");
            }else{
                 location.replace(url);
            }
           
          });
        }else{
          bootbox.dialog({
            message: res.alias+"，歡迎回來作夥！\n\n您尚未完整註冊喔 ~ 完整註冊後就可以在論壇發表文章、創建自己的動態時報，更可以和其他會員成為好友。\n快填寫資料加入大家的行列吧！",
            title: "一般訊息",
            buttons: {
              yes: {
                label: "好，立即前往完整註冊",
                className: "btn-primary",
                callback: function() {
                window.location.assign("/signup");
              }
              },
              no: {
                label: "以後再說",
                className: "btn-default",
                callback: function() {
                      if ($(window).width() <= 979){
                        window.location.assign("/home");
                      }else{
                           location.replace(url);
                      }
                }
              }
            }
          });  
        }
      }
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}

function loginWithAccount(account, password) {
  var posting = $.post( "/login", { account: account, password: password}, function(res){
    showDialog("一般訊息","首次登入成功，歡迎來作夥！",function(){
      if ($(window).width() <= 979){
         window.location.assign("/home");
      }else{
        location.reload();
      }
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function Logout(){
  var url = document.URL;
  var posting = $.post( "/logout", {}, function(res){
    showDialog("一般訊息","登出成功！",function(){
      window.location.assign("/home");
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function editProfile(){
  content.style.display="none";
}

function enterLogin(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    Login();
  } else {
    return true;
  }
}


function subscribe(){
  var subscribeEmail = $("#subscribeEmail").val();
  $.post( "/subscribe", { email: subscribeEmail}, function(res){
    //alert(res);
    showDialog("訂閱訊息",res);
    $("#subscribeEmail").val("");
  }).error(function(res){
    showDialog("訂閱訊息",res.responseJSON.err);
  });
}


function fbLogin() {  
      FB.login(function(response) {
        //console.log(response)
       if (response.status === 'connected') {
      // Logged into your app and Facebook.
      // add by Peter
      // window.location.assign("/home").
      // res.isFullSignup==true
      //     showDialog("一般訊息",res.alias+"，歡迎回來作夥！",function(){

      //       if ($(window).width() <= 979){
      //         window.location.assign("/home");
      //       }else{
      //            location.replace(url);
      //       }}
      FB.api('/me',function(response){
        console.log(response);
        
        $.post('/checkFB',{FB_id:response.id},function(res){
          if(res){
            location.reload();
          }else{
            var password=response.id+Math.random();
            document.getElementById('FBlogin').style.display='none';
            document.getElementById('mobile_fblogin').style.display='none';
            document.getElementById('UserAccount').value=response.id;
            document.getElementById('UserAlias').value=response.name;
            document.getElementById('UserPwd').value=password;
            document.getElementById('UserPwdConfirm').value=password;
            document.getElementById('FB_id').value=response.id;            
            document.getElementById('UserGender').value=response.gender;
            document.getElementById('fname').value=response.first_name;
            document.getElementById('lname').value=response.last_name;
            if (typeof response.email != "undefined"){
              document.getElementById('UserEmail').value= response.email;
            }
          }

        });
      });
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
     }); //設定需要授權的項目
  }
function notification() {

      window.location.assign("/notifications");
    
}
function login_mobile() {

      window.location.assign("/mlogin");
    
}
function quickSignup_mobile() {

      window.location.assign("/mquickSignup");
    
}

function checkNot() {
  /*$.get('/countNot',function(res){*/
  io.socket.get('/countNot',function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      document.getElementById('notification').innerHTML="&nbsp;通知 ("+res.num+")";
      $("#mobile_notification").html("&nbsp;通知 ("+res.num+")");
      // if(res.num==0) {
      //   $("#notification").removeClass("orange").addClass("lightgray");
      //   $("#mobile_notification").removeClass("orange").addClass("lightgray");
      // } else {
      //   $("#notification").removeClass("lightgray").addClass("orange");
      //   $("#mobile_notification").removeClass("lightgray").addClass("orange"); 
      //   $("#mobile_notification").css("color","#080707"); 
      // }
    }
  });
}

function checkForum() {
  /*$.get('/countForum',function(res){*/
  io.socket.get('/countForum',function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      if(res.login) {
        $("#forum1").html('<span class="glyphicon glyphicon-comment" style="color:rgb(129, 108, 88)" aria-hidden="true"></span>&nbsp;作夥論壇&nbsp('+res.num+')');
        $("#forum2").html("作夥論壇&nbsp("+res.num+")");
      }
    }
  });
}

function showDialog(title, message, cb){
  bootbox.dialog({
    message: message,
    title: title,
    buttons: {
      main: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          if(typeof cb == "function")
            cb();
        }
      }
    }
  });
}

function showSimpleSignup() {
  $("#signup").removeClass("hidden-phone");
  $("#signup").show();
  if($( window ).width() < 768){
          $("html, body").animate({ scrollTop: "440px"} , 170, "swing");
        }
}

function recordLink(target){
  $.get("/recordLink/"+target,function(ret){
    return true 
  })
}


function markMenuItem(){
  var url = document.URL;
   $("#profile_page").css("color","#533828");
   $("#forum").css("color","#533828");
   $("#proInfo").css("color","#533828");
   $("#friends").css("color","#533828");
   $("#gettingStarted").css("color","#533828");
   $("#setUp").css("color","#533828");
    
  if(url.match('profile')!=null){
    $("#profile_page").css("color","#D26900");
  }else if(url.match('frontboard')!=null){
    $("#forum").css("color","#D26900");
  }else if(url.match('proInfo')!=null){
    $("#proInfo").css("color","#D26900");
  }else if(url.match('friends')!=null){
    $("#friends").css("color","#D26900");
  }else if(url.match('gettingStarted')!=null){
    $("#gettingStarted").css("color","#D26900");
  }else if(url.match('change')!=null || url.match('changePassword')!=null){
    $("#setUp").css("color","#D26900");
  }
}