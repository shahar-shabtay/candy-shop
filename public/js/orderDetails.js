// function fetchOrderDetails(orderId) {
//     fetch('/getOrderDetails', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ orderId: orderId })
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Populate the modal with the fetched order details
//         document.getElementById('orderId').innerText = `Order ID: ${data.orderId}`;
//         document.getElementById('productName').innerText = `Product Name: ${data.productName}`;
//         document.getElementById('quantity').innerText = `Quantity: ${data.quantity}`;
//         document.getElementById('price').innerText = `Price: ${data.price}`;

//         // Show the modal
//         openModal();
//     })
//     .catch(error => {
//         console.error('Error fetching order details:', error);
//     });
// }

// Function to open the modal
function openModal() {
    document.getElementById('orderModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}