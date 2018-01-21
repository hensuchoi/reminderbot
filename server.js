var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    moment = require ('moment'),
    mysql = require('mysql'),
    config = require(path.join(__dirname, 'config.js')),
    config1 = require(path.join(__dirname, 'app.js'));
    
    
    var str = '10 minutes'
        var myExp = /[^\s]+/g;
        var number = Number(myExp.exec(str));
        var unit = String(str.substring(3).trim());
        console.log (number + ' ' + unit);
        console.log(moment());
        console.log( moment().add(number,unit).format('YYYY/MM/DD HH:mm:ss'));
        console.log( moment().add(10,'minutes').format('YYYY/MM/DD HH:mm:ss'));
        
    
    
   
    
    
    var sendReminder = function() {
        
        var sql = "Select id, userID, message from message_date where new_date <= NOW();"
        
        
        
        connection.query(sql, function(err, result, fields) {
        
        if (!err)
            
            for (var i in result) {
                var newtweet ='@' + result[i].userID + ' Here is your reminder: ' + result[i].message ;
                var sql1 = "DELETE FROM message_date where id =" + result[i].id;
                connection.query(sql1, function(err, result, fields) {
                     if (!err)
                        console.log('deleted ');
                    else
                        console.log(err);
                });
                
                tweetIt(newtweet);
                
            }
         else
            console.log(err);
            
            
            })
        
    }
    
    let connection = mysql.createConnection(config1);


    var T = new Twit(config);
    var stream = T.stream('user');
    stream.on('tweet', tweetEvent);
    
    setInterval(sendReminder, 60000);
    
   
    
    
    
    function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
    
    
    
    function tweetEvent(eventMsg){
    var replyto = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var user = eventMsg.user.screen_name;
    var id_str = eventMsg.id_str;
    var from = eventMsg.user.screen_name;
    var flag = 0;
    var mentions = eventMsg.entities.user_mentions;
    for (var i in mentions) 
        if (mentions[i].screen_name == 'smartreminder')
            flag =1;
    
    
    if (replyto === 'smartreminder' || flag == 1 ) {
        
        var newtweet ='@' + from + ' ' + 'Messaging you on: ' +  getDate(text) ;
        var txt = getText(text)
        var sql = 'INSERT INTO  message_date (permalink, message, new_date, origin_date, userID) values("' + id_str + '","'+ txt +'","' + getDate(text) + '",NOW(),"'+ user +'");'
        tweetIt(newtweet);
        connection.query(sql, function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
         else
            console.log(err);
            console.log(this.sql);
        })
    }
    
};



    
function getDate(str){
        var parsedString = str.split('smartreminder')
        var str = parsedString[parsedString.length - 1];
        console.log(str);
        str = str.replace (/".*?"/,'');
        console.log(str);
        //var myExp = /[^\s]+/g;
       var str1 = str.split(" ");
       console.log(str1);
       console.log(moment(str1[1]));
       if (str1.length === 3)
            return moment(str1[1]).format('YYYY/MM/DD HH:mm:ss');
       else
       {
            console.log (str1);
            var number = str1[1];
            var unit = str1[2];
            //var number = Number(myExp.exec(str));
            
            //var unit = String(str.substring(3).trim());
            console.log (number + ' ' + unit);
            return moment().add(number,unit).format('YYYY/MM/DD HH:mm:ss');
       }
    
}  

function getText(str){
        var parsedString = str.split('smartreminder')
        var str = parsedString[parsedString.length - 1];
        var message = str.match(/".*?"/);
        return message[0].replace(/['"]+/g, '');
}  
    


    
function tweetIt(txt){
T.post('statuses/update', {
    status: txt
  },
  function(err, data, response) {
    if (err){
      console.log('Error!');
      console.log(err);
    }
    else{
        console.log("it worked");
      
    }
  })
};