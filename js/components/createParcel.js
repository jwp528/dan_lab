Vue.component('create-parcel', {
    data: function () {
        return {
            files: [],

            uploadStatus: "Please select a file to ship",
            skipped: [],
            show: false,

            destination: "",
            express: false,

            destinations: [
                "Alberta", "British Columbia", "Manitoba", "New Brunswick",
                "Newfoundland", "Northwest Territories", "Nova Scotia",
                "Nunavut", "Ontario", "P.E.I", "Quebec", "Saskatchewan",
                "Yukon"
            ]//end destinations
        }
    },
    watch: {
        skipped: function() {
            if (this.skipped.length == 0) this.show = false;
            else this.show = true;
        },
    },    

    computed: {
        fileStatus: function(){
            if(this.files.length == 0)
                return "Choose file";

            if(this.files.length == 1)
                return this.files[0].name;
            else
                return `${this.files.length} files`;
        }
    },
    methods: {
        assignFiles: function() {
            this.files = this.$refs.myFiles.files;
        }, //end assignFiles

        //Runs when the file uploader is changed
        scanFiles: function() {
            //new file scan, hide the skipped parts
            this.skipped = [];

            if (this.files.length == 0) {
            this.uploadStatus =
                "You must have something to ship. Please include a file for shipping";
            return;
            } //end if

            if (this.destination == "") {
            this.uploadStatus =
                "You can't ship a file to nowhere, please include a destination.";
            return;
            } //end if

            this.uploadStatus = `Scanning ${this.files.length} files.`;

            //set the trackingID for all files
            let trackingID = this.generateTrackingNumber();

            for (var i = 0; i < this.files.length; ++i) {
                //make sure there are no .exe or .zip files uploaded
                let file = this.files[i];

                let ext = file.name.split(".");
                ext = ext[ext.length - 1];

                if (ext === "zip" || ext === "exe") {
                    this.uploadStatus =
                    "There were issues with your upload. Please review the information below and try again.";
                    this.skipped.push({
                    name: file.name,
                    reason: `Invalid file type ${ext}`
                    });

                    this.files = [];
                    this.$refs.myFiles.value = "";

                    return;
                } //end if

                //create the parcel
                let p = {
                    id: trackingID,
                    status: "Processing",
                    destination: this.destination,
                    weight: file.size,
                    cost: (file.size / 1024),
                    created: new Date(),
                    express: this.express,
                    file: {
                        name: file.name,
                        type: file.type,
                    }
                }

                if (this.express) p.cost += 5;

                //round it
                p.cost = (Math.floor(p.cost * 100) / 100).toFixed(2);

                this.$parent.updateParcels(p);
            } //end for

            //reset the values
            this.express = false; //reset the express value
            this.destination = ""; //reset the destination
            this.files = ""; //empty the files
            this.$refs.myFiles.value = ""; //reset the file upload
            this.uploadStatus = "Please Select a file to ship";
        }, //end scanFiles

        generateTrackingNumber: function() {
            const TN_LENGTH = 10;
            const TN_PREFIX = "IWD";
            var tokens = [
            "A", "B", "C", "D", "E",
            "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O",
            "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y",
            "Z", "1", "2", "3", "4",
            "5", "6", "7", "8", "9",
            "0"
            ];
            var trackingNumber = new String(TN_PREFIX);
            for (var x = 0; x < TN_LENGTH; x++) {
            trackingNumber = trackingNumber.concat(
                tokens[Math.floor(Math.random() * tokens.length)]
            );
            }
            //   console.log("Generated: " + trackingNumber);
            return trackingNumber;
        } //end generateTrackingNumber
    },//end methods

    template: `
        <div class="create-component">
            <h2>Create a parcel</h2>
            
            <div class="status">
                <p>{{ uploadStatus }}</p>

                <div v-if="show">
                    <p>The following files were skipped</p>
                    <ul class="skipped">
                    <li v-for="(item, index) in skipped">
                        {{ item.name }} - {{ item.reason }}
                    </li>
                    </ul>
                </div>
            </div>

            <div class="col-md-6 col-sm-12">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
                    </div>
                    <div class="custom-file ">
                        <input type="file" class="custom-file-input" id="parcelFileUpload" ref="myFiles" @change="assignFiles" aria-describedby="parcelFileUpload" multiple />
                        <label id="fileLabel" class="custom-file-label" for="parcelFileUpload">{{fileStatus}}</label>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6 col-sm-12">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Where is this going?</span>
                    </div>
                    <select v-model="destination" class="form-control">
                        <option value="">--SELECT A DESTINATION--</option>
                        <option v-for="(item, index) in destinations">
                        {{ item }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-md-6 col-sm-12">
                <div class="custom-control custom-checkbox mb-3">
                <input type="checkbox" class="custom-control-input" id="checkbox" v-model="express">
                <label class="custom-control-label" for="checkbox">Ship Express? ($5 charge)</label>
                </div>
            </div>      

            <div class="col-md-6 col-sm-12">
            <button type="button" @click="scanFiles" class="btn btn-primary mb-5">Create Parcel</button>
            </div>
        </div>
    `
});//end component