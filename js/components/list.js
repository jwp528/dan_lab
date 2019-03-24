Vue.component('display-parcels', {
    props: ['data'],
    template: `
        <div class="parcels">
            <h2>Current Parcels:</h2>
            <table id="parcelsData" class="table-striped">
            <thead>
                <tr>
                <th class="text-center">Tracking #</th>
                <th class="text-center">Name</th>
                <th class="text-center">Destination</th>
                <th class="text-center">Weight</th>
                <th class="text-center">Cost</th>
                <th class="text-center">Status</th>
                <th class="text-center">Shipped Express?</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" style="text-align:center;">
                    <td>{{ item.id }}</td>
                    <td><div class="text-truncate" style="width:250px;">{{ item.file.name }}</div></td>
                    <td>{{ item.destination }}</td>
                    <td>{{ item.weight }} bytes</td>
                    <td>&#36;{{ item.cost }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <span key="1" v-if="item.express">Yes</span>
                        <span key="2" v-else>No</span>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    `
});//end component