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
                                    orders_count
                                </th>
                                <th>
                                    total_spent
                                </th>
                                <th>
                                    address
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
                                    ${cart.customer.orders_count}
                                </td>
                                <td>
                                    ${cart.customer.total_spent}
                                </td>
                                <td>
                                    ${JSON.stringify(cart.customer.address)}
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