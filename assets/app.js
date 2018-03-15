var db = firebase.database();


$("#add-Train").on("click", function (e) {                                                     //submit button has been pressed put values in database for new times
    e.preventDefault();

    var trainName = $("#train-Name").val().trim();
    var trainDestination = $("#train-Destination").val().trim();
    var firstTrainTime = $("#first-Train-Time").val().trim();
    var trainFrequency = $("#train-Frequency").val().trim();
    var properFormat = moment(firstTrainTime, 'HH:mm').isValid();                               // has proper format been used?
    console.log(properFormat);

    if (trainName != "" && trainDestination != "" && firstTrainTime != "" && trainFrequency != "" && properFormat) { //all fields must be entered before submission
        db.ref().push({                                                                         // this creates new object rather then writting over like set does
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrainTime: firstTrainTime,
            trainFrequency: trainFrequency
        });

        $("#train-Name").val("");                                                             //clear all fields once input has been accepted
        $("#train-Destination").val("");
        $("#first-Train-Time").val("");
        $("#train-Frequency").val("");
    }

    else {
        alert("Please enter all data in proper format!");                                     //all fields have not been filled out, or proper format has not been followed
    }
});


db.ref().orderByChild("trainDestination").on("child_added", function (snapshot) {
    var data = snapshot.val();
    var firstTrainTime = data.firstTrainTime;
    var trainFrequency = data.trainFrequency;
    var format = "HH:mm";
    var convertedTime = moment(firstTrainTime, format);
    var newTime;
    var nextTrainTime;
    var difference = moment().diff(moment(convertedTime), "minutes");

    //keep adding frequency intervals to first departure time till difference between the sum 
    // and current time is < frequency interval. This gives us the time for the train that just left
    if (difference > 0) {                                                                   // if first train has alrady started else...
        while (difference > trainFrequency) {
            newTime = moment(convertedTime).add(trainFrequency, "minutes");
            convertedTime = newTime;
            difference = moment().diff(moment(newTime), "minutes");
        }
        newTime = moment(convertedTime).add(trainFrequency, "minutes");                     // this is the next train time    
        nextTrainTime = moment(newTime).format("HH:mm");                                    // converting to display fromat
        difference = moment(newTime).diff(moment(), "minutes");
    }

    else {                                                                                  // first train has not started, next train will be first train
        nextTrainTime = moment(convertedTime).format("HH:mm");                              // converting to display fromat
        difference = Math.abs(difference);
    }

    var newTr = $("<tr>");                                                                  // creating new table with all the information
    var newTdName = $("<td>").text(data.trainName);
    var newTdDestination = $("<td>").text(data.trainDestination);
    var newTdFirstTime = $("<td>").text(data.firstTrainTime);
    var newTdFrequency = $("<td>").text(data.trainFrequency);
    var newTdnextTime = $("<td>").text(nextTrainTime);
    var newTdMinutesAway = $("<td>").text(difference);
    newTr.append(newTdName).append(newTdDestination).append(newTdFrequency).append(newTdnextTime).append(newTdMinutesAway);
    $("#table").append(newTr);
});
