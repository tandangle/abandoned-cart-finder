let apiKey = '';
let server = '';
let store_id= '';''

const corsProxy = 'https://cors-anywhere.herokuapp.com/';



// Helper function to get server

const getServer = (str) => {
    return str.split('-')[1]
}


const submitForm = () => {
    document.getElementById('results').innerHTML = ""
    document.getElementById('wrapper').style.opacity = "0.1"
    document.getElementById('loader').style.display = "block"
    email_address = document.getElementById('email').value.trim().toLowerCase();
    apiKey = document.getElementById('apiKey').value;
    server = getServer(document.getElementById('apiKey').value)
    const axiosHeaders = {
        'authorization': "Basic " + apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const url = `https://${server}.api.mailchimp.com/3.0`

    // Get store id

    axios.get(corsProxy + url + '/ecommerce/stores/', { headers: axiosHeaders })
    .then(response => {
        // This currently only works on users with 1 store. If there is more than 1 store, it'll 
        // parse through the data for the first store listed
        store_id = response.data.stores[0].id
        console.log(store_id)
        axios.get(corsProxy + url + `/ecommerce/stores/${store_id}/carts`, {headers: axiosHeaders})
        .then(response => {
            const numberOfCarts = response.data.total_items
            console.log(response);
            let found = false;
            for(i = 0; i < Math.floor(numberOfCarts / 1000) + 1; i++) {
                axios.get(corsProxy + url + `/ecommerce/stores/${store_id}/carts?count=1000&offset=${i}000`, {headers: axiosHeaders})
                .then(response => {
                    console.log(response);
                    response.data.carts.forEach(cart => {
                        if(cart.customer.email_address.toLowerCase() === email_address) {
                            console.log("match found");
                            found = true;
                            document.getElementById('results').innerHTML = `
                            <p>cart_id: ${cart.id}</p>
                                <table>
                                    <tr>
                                        <th>
                                            email_address
                                        </th>
                                        <th>
                                            opt_in_status
                                        </th>
                                        <th>
                                            company
                                        </th>
                                        <th>
                                            first_name
                                        </th>
                                        <th>
                                            last_name
                                        </th>
                                        <th>
                                            created_at
                                        </th>
                                        <th>
                                            updated_at
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>
                                            ${cart.customer.email_address}
                                        </td>
                                        <td>
                                            ${cart.customer.opt_in_status}
                                        </td>
                                        <td>
                                            ${cart.customer.company}
                                        </td>   
                                        <td>
                                            ${cart.customer.first_name}
                                        </td>
                                        <td>
                                            ${cart.customer.last_name}
                                        </td>
                                        <td>
                                            ${cart.created_at}
                                        </td>
                                        <td>
                                            ${cart.updated_at}
                                        </td>
                                    </tr>
                                </table>
                            Raw JSON:
                            <code>${JSON.stringify(cart)}</code>
                            `
                        }
                    })
                })
                .then(() => {
                    if(!found) {
                        document.getElementById('results').innerHTML = 'No carts found'
                    }
                    document.getElementById('wrapper').style.opacity = "1"
                    document.getElementById('loader').style.display = "none"
                })
                .catch(error =>{
                    console.log(error)
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    })
    .catch(error => {
        console.log(error)
    })
}

