module.exports.getDate = () =>{
const today = new Date();
var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
}
return today.toLocaleDateString("en-US", options);
}
module.exports.getDay = () =>{
const today = new Date();
var options = {
    weekday: "long"
}
return today.toLocaleDateString("en-US", options);
}