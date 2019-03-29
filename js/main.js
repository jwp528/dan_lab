// wait until the DOM specified in <body> has loaded before executing the
// function, if you have ever used jQuery $(document).ready() it is
// basically the same thing.
$(function() {
    // create a new Vue.js instance and specify the template as well as the
    // data that should be displayed in it.
    var parcelShipper = new Vue({
        el: "#parcelShipper",
        data: {
            parcels: []
        },//end data

        watch:{
            parcels: function() {
                localStorage.parcels = JSON.stringify(this.parcels);
            }//end parcels
        },//end watch
        mounted: function() {
            if (localStorage.parcels)
                this.parcels = JSON.parse(localStorage.parcels);
        },//end mounted
        created: function() {
            // _.debounce is a function provided by lodash to limit how
            // often a particularly expensive operation can be run.
            // In this case, we want to limit how often we access
            // yesno.wtf/api, waiting until the user has completely
            // finished typing before making the ajax request. To learn
            // more about the _.debounce function (and its cousin
            // _.throttle), visit: https://lodash.com/docs#debounce
            this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
        },//end created
        methods: {
            updateParcels: function(p){
                this.parcels.push(p);
            },//end testEvent
            getAnswer: function() {
                if (this.question.indexOf("?") === -1) {
                    this.answer = "Questions usually contain a question mark. ;-)";
                    return;
                }
                this.answer = "Thinking...";
                var vm = this;
                axios
                    .get("https://yesno.wtf/api")
                        .then(function(response) {
                            vm.answer = _.capitalize(response.data.answer);
                    })
                    .catch(function(error) {
                        vm.answer = "Error! Could not reach the API. " + error;
                    });//end axios call
            },//end getAnswer
        }//end methods

    });//end Vue instance
});//end body onload