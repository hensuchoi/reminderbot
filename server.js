var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    moment = require ('moment'),
    mysql = require('mysql'),
    config = require(path.join(__dirname, 'config.js')),
    config1 = require(path.join(__dirname, 'app.js'));
    
    let connection = mysql.createConnection(config1);


    var T = new Twit(config);
    var stream = T.stream('user');
    stream.on('tweet', tweetEvent);
    sendReminder();
    
    function sendReminder(){
        var sql = "Select userID, message from message_date;"
        
        connection.query(sql, function(err, result, fields) {
        if (!err)
            console.log('The solution is: ', result );
         else
            console.log('Error while performing Query.');
            
            connection.end();
        
        })
        
        
        
        
        
        
    }
    
    
    
    function tweetEvent(eventMsg){
    var replyto = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var user = eventMsg.user.screen_name;
    var id_str = eventMsg.id_str;
    var from = eventMsg.user.screen_name;
    
    var mentions = eventMsg.entities.user_mentions[0].name;
   
    
    
    
    if (replyto === 'smartreminder' || mentions === 'smartreminder' ) {
        
        var newtweet ='@' + from + ' ' + 'Te recordare el dia: ' + getDate(text) ;
        var sql = 'INSERT INTO  message_date (permalink, message, new_date, origin_date, userID) values("' + id_str + '","'+ text +'","' + getDate(text) + '",CURDATE(),"'+ user +'");'
        tweetIt(newtweet);
        connection.query(sql, function(err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
         else
            console.log('Error while performing Query.');
            
            connection.end();
        })
    }
    
};


function getDate(str){
        var parsedString = str.split('smartreminder')
        var parsedDate = parsedString[parsedString.length - 1];
        var number = Number(parsedDate.slice(1,2));
        var unit = String(parsedDate.substring(3));
        return moment().add(number,unit).format('YYYY/MM/DD');
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