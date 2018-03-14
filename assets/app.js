var db = firebase.database();


$("#add-Train").on("click", function (e) {          //@todo: get input data and put it in proper format so it is ordered properly                       //submit button has been pressed put values in database for new times
    e.preventDefault();
   
    var trainName = $("#train-Name").val().trim();
    var trainDestination = $("#train-Destination").val().trim();
    var firstTrainTime = $("#first-Train-Time").val().trim();
    var trainFrequency = $("#train-Frequency").val().trim();
    console.log(trainDestination,trainFrequency,trainName,firstTrainTime);

    if (trainName != "" && trainDestination != "" && firstTrainTime != "" && trainFrequency != "") { //all fields must be entered before submission
        db.ref().push({                                             // this creates new object rather then writting over like set does
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrainTime: firstTrainTime,
            trainFrequency: trainFrequency
        });
    }
  
});


db.ref().orderByChild("trainDestination").on("child_added", function(snapshot){
    var data= snapshot.val();

    var newTr= $("<tr>");
    var newTdName = $("<td>").text(data.trainName);
    var newTdDestination= $("<td>").text(data.trainDestination);
    var newTdFirstTime = $("<td>").text(data.firstTrainTime);
    var newTdFrequency= $("<td>").text(data.trainFrequency);
    
    newTr.append(newTdName).append(newTdDestination).append(newTdFrequency)
    $("#table").append(newTr);

});