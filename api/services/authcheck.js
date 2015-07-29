module.exports = {
	authCheck: function (req,cb){      //看這兩個人關係能看到什麼
	    function checkAuth(id, cb){         //先看這個帳號有沒有在table裡面
	        Userauth.find({user:id}).exec(function(err,result){
	            if (err){
	                //res.send(500,{err:"DB error"});
	            }
	            else{
	                if (result.length>0){
	                    cb(true);
	                }
	                else{
	                    cb(false);
	                }
	            }
	        });
	    }

	    var id=req.session.user.id;
	    var account=req.param("account")
	    checkAuth(id,function(inTable){
	        if(inTable){                    //如果有的話，在去看，沒有就全部都可以
	            var doctor=false;
	            var friend=false;
	            var self=false;
	            var viewer = req.session.user.account;

	            User.find({account:viewer}).populate('friends').exec(function(err,user){
	                if(err){

	                }
	                if (user[0].type=="D"){
	                    doctor=true;
	                }
	                for (var i=0 ; i<user[0].friends.length;i=i+1){
	                    if (user[0].friends[i].account==account)
	                        friend=true;
	                }
	            });
	            if (viewer==account){
	                self=true;
	                friend=true;
	                doctor=true;
	            }
	            str = '{"name":false,"city":false,"email":false,"gender":false,"phone":false,"bday":false}';
	            var index = JSON.parse('{"0":"city","1":"email","2":"gender","3":"phone","4":"bday","5":"name"}');
	            var ret_status=JSON.parse(str);
	            User.find({account:account}).exec(function(err,user){
	                var id=user[0].id;
	                Userauth.find({user:id}).exec(function(err,auth){
	                    if (err){
	                        //res.send(500,"DB error");
	                    }
	                    var auth_set = auth[0]
	                    for (var i =0;i<=5;i++){
	                        var ind = index[i];
	                        //console.log(auth_set[ind])
	                        if (auth_set[ind]==="self" && self){
	                            ret_status[ind]=true;
	                        }
	                        else if (auth_set[ind]==="friend" && friend){
	                            ret_status[ind]=true;
	                        }
	                        else if (auth_set[ind]==="doctor"&&doctor){
	                            ret_status[ind]=true;
	                        }
	                        else if (auth_set[ind]==="all"){
	                            ret_status[ind]=true;
	                        }
	                    }
	                    //console.log("asdfsadf"+JSON.stringify(ret_status))
	                    cb(ret_status);
	                })
	                
	            });
	            
	        }
	        else{
	            cb(JSON.parse('{"name":"true","city":true,"email":true,"gender":true,"phone":true,"bday":true}'));
	        }
	    });
	}
};