var express = require('express');
var static = require('express-static');
var jade = require('jade');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var server = express();
server.listen(2182);
server.use(bodyParser.urlencoded({}));
//存文件
server.use('/setText',function(req,res){
	// console.log(req.body);
	//将数据存储到数据库中
	var pool = mysql.createPool({
		'host':'localhost',
		'password':'162129',
		'database':'test',
		'user':'root'
	});
	pool.getConnection(function(err,connection){
		if(err){
			console.log(err);
		}else{
			connection.query('INSERT INTO `article` (`name`,`time`,`title`,`text`) VALUES("'+req.body.name+'","'+req.body.time+'","'+req.body.title+'","'+req.body.text+'");',function(err,data){
				if(err){
					res.send('保存失败');
					console.log(err);
				}else{
					res.send('保存成功');
					connection.end();
				}
			})
		}
	})
})
// 显示文件列表
server.use('/getText.html',function(req,res){
	var pool = mysql.createPool({
		'host':'localhost',
		'password':'162129',
		'database':'test',
		'user':'root'
	});
	pool.getConnection(function(err,connection){
		if(err){
			console.log(err);
		}else{
			connection.query('SELECT id,title,name,time FROM `article`;',function(err,data){
				if(err){
					res.send('404');
					console.log(err);
				}else{
					var len = data.length;
					var max = Math.ceil(len/3);
					if(req.query.page==1 || !req.query.page){
						var needP = 1;
					}else{
						var needP = req.query.page;
					}
					var needArr = data.slice((needP-1)*3,needP*3)
					console.log(data.length);
					//得到的结果是数组数组的每一项是一个对象
					var str = jade.renderFile('./1.jade',{pretty:true,dataArr:needArr,maxL:max,page:needP})
					res.send(str);
					connection.end();
				}
			})
		}
	})
})
server.use('/Text.html',function(req,res){
	var pool = mysql.createPool({
		'host':'localhost',
		'password':'162129',
		'database':'test',
		'user':'root'
	});
	pool.getConnection(function(err,connection){
		if(err){
			console.log(err);
		}else{
			//通过地址栏的uid参数来显示对应内容
			connection.query('SELECT title,text FROM `article` WHERE id='+req.query.uid+';',function(err,data){
				if(err){
					res.send('404');
					console.log(err);
				}else{
					//得到的结果是数组数组的每一项是一个对象
					console.log(data);
					var str = jade.renderFile('./2.jade',{pretty:true,detail:data[0]})
					res.send(str);
					connection.end();
				}
			})
		}
	})
})
// 显示文章内容
server.use(static('./www'));