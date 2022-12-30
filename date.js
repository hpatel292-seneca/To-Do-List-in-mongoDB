module.exports.getDate = getDate;

function getDate(){
    var today = new Date();

        var options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        };

        return day = today.toLocaleDateString("en-US", options);
}