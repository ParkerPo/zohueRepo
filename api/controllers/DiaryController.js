/**
 * DiaryController
 *
 * @description :: Server-side logic for managing diaries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	findDiary :function(request,res){
		var userA=req.session.user.id;
		Diary.find({author:userA}).exec(
			function(err,ret){
				// if(!err){
				// 	res.view("welcome.ejs",{result:ret});
				// }
				//console.log("Login!");
				//console.log(name1);
				//console.log(password1);
				if(ret.length >0){
					res.send(ret)
				}
				else{
					res.send("no data")
				}
			}
		);

	},

	addDiary: function(req,res){
		//test
		var Aauthor=req.session.user.id;
 	    var Adate = req.param("adddate");
 	    var Aweight = req.param("addweight");
 	    var Amemo = req.param("addmemo");
 	    var AsqubloodPresure = req.param("squ");
	    var AbloodPresure = req.param("addbloodPresure");
	  	Diary.create({author:Aauthor,date:Adate,weight:Aweight,memo:Amemo,squbloodPresure:AsqubloodPresure,bloodPresure:AbloodPresure}).exec(
	  			function(err,ret){
	  				if(err){
	  					console.log(err);
	  					res.send({err:"DB error"});
	  				}
	  				else{
	  					res.send("健康紀錄新增成功！");
	  					// console.log("success");
	  				}
	  			}
	  	);
	},
	//request是進入 res是出去
	editDiary: function (request,ress){
		var Ndate = request.param("date")
		var Nweight = request.param("weight")
		var Nmemo = request.param("memo")
		var NsqubloodPresure = request.param("squbloodPresure")
		var NbloodPresure = request.param("bloodPresure")
		var Nauthor = request.session.user.id;
		var nndate = new Date(Ndate);
		// console.log(nndate.toISOString());
		// console.log(err);
		Diary.update({author:Nauthor, date:nndate.toISOString() },{weight:Nweight,memo:Nmemo,squbloodPresure:NsqubloodPresure,bloodPresure:NbloodPresure}).exec(
			//ret是執行結果
			function(errr,rett){
				if(errr){
					console.log(errr);
					ress.send("error!");
				} 
				else {			
					if(rett.length==0)
						ress.send("找不到此日的紀錄! 請重新填寫!");
					else
						ress.send("健康紀錄編輯成功！");
				}				

			}
		)
	},

	deleteDiary: function(req, res){
		var Ddate = req.param("date")
		var author=req.session.user.id;
		var DDdate = new Date(Ddate);

		Diary.destroy({date: DDdate.toISOString(), author: author}).exec(function(err, ret)
		{
			if(err)
			{
				console.log(err);
				res.send(500, {err: "DB Error"});
			} 
			else 
			{			
				if(ret.length==0)
					res.send("找不到此紀錄！");
				else
					res.send("健康紀錄刪除成功！");
			}
		});
	},

	
};
