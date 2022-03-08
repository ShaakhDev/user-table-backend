export default Date.prototype.addMinutes = function(min){
    this.setMinutes(this.getMinutes() + min);
    return this;
}