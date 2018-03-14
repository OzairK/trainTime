var db = firebase.database();


$("#add-Train").on("click", function (e) {          //@todo: get input data and put it in proper format so it is ordered properly                       //submit button has been pressed put values in database for new times
    e.preventDefault();

    var trainName = $("#train-Name").val().trim();
    var trainDestination = $("#train-Destination").val().trim();
    var firstTrainTime = $("#first-Train-Time").val().trim();
    var trainFrequency = $("#train-Frequency").val().trim();

    if (trainName != "" && trainDestination != "" && firstTrainTime != "" && trainFrequency != "") { //all fields must be entered before submission
        db.ref().push({                                             // this creates new object rather then writting over like set does
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrainTime: firstTrainTime,
            trainFrequency: trainFrequency
        });
    }

});


db.ref().orderByChild("trainDestination").on("child_added", function (snapshot) {
    var data = snapshot.val();

    var firstTrainTime = data.firstTrainTime;
    var trainFrequency = data.trainFrequency;
    var format = "HH:mm";
    var convertedTime = moment(firstTrainTime, format);
    var difference = moment().diff(moment(convertedTime), "minutes");
    // console.log(difference);
    // console.log(`this is original time: ${convertedTime}`);
    // var newTime= moment(convertedTime).add(trainFrequency, "minutes");
    // console.log(`this is ${newTime}`);

    console.log(difference, trainFrequency)
    var newTime;
    var difference;


    //keep adding frequency intervals to first departure time till difference between the sum 
    // and current time is < frequency interval. This gives us the time for the train that just left
    while (difference > trainFrequency) {
        newTime = moment(convertedTime).add(trainFrequency, "minutes");
        convertedTime = newTime;
        difference = moment().diff(moment(newTime), "minutes"); 
    }
    newTime = moment(convertedTime).add(trainFrequency, "minutes");                      // this is the next train time    
    var nextTrainTime = moment(newTime).format("HH:mm");                                 // converting to display fromat
    difference = moment(newTime).diff(moment(), "minutes"); 
    
    


    var newTr = $("<tr>");
    var newTdName = $("<td>").text(data.trainName);
    var newTdDestination = $("<td>").text(data.trainDestination);
    var newTdFirstTime = $("<td>").text(data.firstTrainTime);
    var newTdFrequency = $("<td>").text(data.trainFrequency);
    var newTdnextTime = $("<td>").text(nextTrainTime);
    var newTdMinutesAway= $("<td>").text(difference);

    newTr.append(newTdName).append(newTdDestination).append(newTdFrequency).append(newTdnextTime).append(newTdMinutesAway);
    $("#table").append(newTr);

});


// @tod0: moment('It is 2012-05-25', 'YYYY-MM-DD').isValid();       // true