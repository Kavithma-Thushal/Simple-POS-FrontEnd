const placeOrderUrl = "http://localhost:8080/api/v1/order";

let cart = [];

$(document).ready(function () {
    generateOrderId();
    loadAllCustomersToCombo();
    loadAllItemsToCombo();
    loadOrderDetails();
});

function generateOrderId() {
    $.ajax({
        url: placeOrderUrl + "/generateOrderId",
        method: "GET",
        success: function (res) {
            let lastOrderId = res.data;

            // Split and generate new id
            let parts = lastOrderId.split('-');
            let prefix = parts[0];
            let number = parseInt(parts[1]) + 1;
            let newOrderId = prefix + '-' + number.toString().padStart(3, '0');

            $("#txtPlaceOrderOrderId").val(newOrderId);

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function loadAllCustomersToCombo() {
    $.ajax({
        url: customerUrl + "/loadAllCustomers",
        method: "GET",
        success: function (res) {
            let cmbCustomerId = $("#txtPlaceOrderCustomerId");
            cmbCustomerId.empty();

            // Add Disabled Option
            cmbCustomerId.append(
                $("<option></option>")
                    .attr("value", "")
                    .attr("disabled", "disabled")
                    .attr("selected", "selected")
                    .text("Select a Customer ID")
            );

            // Add customer ID
            res.data.forEach(customer => {
                let option = $("<option></option>")
                    .attr("value", customer.id)
                    .text(customer.id);
                cmbCustomerId.append(option);
            });

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function loadCustomerDetailsToInputs() {
    let selectedCustomerId = $("#txtPlaceOrderCustomerId").val();

    $.ajax({
        url: customerUrl + "/searchCustomer/" + selectedCustomerId,
        method: "GET",
        success: function (res) {
            $("#txtPlaceOrderCustomerName").val(res.data.name);
            $("#txtPlaceOrderCustomerAddress").val(res.data.address);
            $("#txtPlaceOrderCustomerSalary").val(res.data.salary);

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function loadAllItemsToCombo() {
    $.ajax({
        url: itemUrl + "/loadAllItems",
        method: "GET",
        success: function (res) {
            let cmbItemCode = $("#txtPlaceOrderItemCode");
            cmbItemCode.empty();

            // Add Disabled Option
            cmbItemCode.append(
                $("<option></option>")
                    .attr("value", "")
                    .attr("disabled", "disabled")
                    .attr("selected", "selected")
                    .text("Select an Item Code")
            );

            // Add Item Code
            res.data.forEach(item => {
                let option = $("<option></option>")
                    .attr("value", item.code)
                    .text(item.code);
                cmbItemCode.append(option);
            });

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function loadItemDetailsToInputs() {
    let selectedItemCode = $("#txtPlaceOrderItemCode").val();

    $.ajax({
        url: itemUrl + "/searchItem/" + selectedItemCode,
        method: "GET",
        success: function (res) {
            $("#txtPlaceOrderItemDescription").val(res.data.description);
            $("#txtPlaceOrderItemUnitPrice").val(res.data.unitPrice);
            $("#txtPlaceOrderItemQtyOnHand").val(res.data.qtyOnHand);

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

$("#btnAddToCart").click(function () {

    let customerId = $("#txtPlaceOrderCustomerId").val();
    let itemCode = $("#txtPlaceOrderItemCode").val();
    let itemDescription = $("#txtPlaceOrderItemDescription").val();
    let unitPrice = parseFloat($("#txtPlaceOrderItemUnitPrice").val());
    let buyQty = parseInt($("#txtPlaceOrderBuyQty").val());
    let total = buyQty * unitPrice;

    if (!itemCode || !itemDescription || isNaN(unitPrice) || isNaN(buyQty) || !customerId) {
        errorNotification("Please fill all item details correctly");
        return;
    }

    let existingItem = cart.find(item => item.itemCode === itemCode && item.customerId === customerId);
    if (existingItem) {
        existingItem.buyQty += buyQty;
        existingItem.total = existingItem.buyQty * existingItem.unitPrice;
    } else {
        cart.push({
            customerId: customerId,
            itemCode: itemCode,
            itemDescription: itemDescription,
            unitPrice: unitPrice,
            buyQty: buyQty,
            total: total
        });
    }

    updateCartTable();
});

function updateCartTable(itemCode = null, customerId = null) {
    if (itemCode && customerId) {
        cart = cart.filter(item => item.itemCode !== itemCode || item.customerId !== customerId);
    }

    let tableBody = $("#orderTable");
    tableBody.empty();

    let total = 0;
    cart.forEach(item => {
        let row = `<tr>
            <td>${item.customerId}</td>
            <td>${item.itemDescription}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${item.buyQty}</td>
            <td>${item.total.toFixed(2)}</td>
            <td><button class="btn btn-outline-danger btn-sm" onclick="updateCartTable('${item.itemCode}', '${item.customerId}')">Remove</button></td>
        </tr>`;
        tableBody.append(row);
        total += item.total;
    });

    $("#txtPlaceOrderTotal").val(total);
}

$("#btnPlaceOrder").click(function () {

    let orderId = $("#txtPlaceOrderOrderId").val();
    let customerId = $("#txtPlaceOrderCustomerId").val();

    if (!orderId || !customerId || cart.length === 0) {
        errorNotification("Please fill all fields and add items to the cart");
        return;
    }

    let orderObj = {
        orderId: orderId,
        customerId: customerId,
        orderDetailsList: cart.map(item => ({
            itemCode: item.itemCode,
            buyQty: item.buyQty,
            total: item.total
        }))
    };

    $.ajax({
        url: placeOrderUrl + "/placeOrder",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(orderObj),
        success: function (res) {
            cart = [];  // Clear cart after successful order
            updateCartTable();
            getOrderCount();
            generateOrderId();
            loadOrderDetails();
            successNotification(res.message);
        },
        error: function (error) {
            errorNotification(error.responseJSON.message);
        }
    });
});

function loadOrderDetails() {
    $.ajax({
        url: placeOrderUrl + '/loadOrderDetails',
        method: 'GET',
        success: function (res) {
            const tableBody = $('#orderDetailsTable');
            tableBody.empty();

            res.data.forEach(function (orderDetail) {
                orderDetail.orderDetailsList.forEach(function (detail) {
                    let row = `<tr>
                                    <td>${orderDetail.orderId}</td>
                                    <td>${orderDetail.customerId}</td>
                                    <td>${detail.itemCode}</td>
                                    <td>${detail.buyQty}</td>
                                    <td>${detail.total}</td>
                                </tr>`;
                    tableBody.append(row);
                });
            });

            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}