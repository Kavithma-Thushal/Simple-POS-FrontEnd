/**
 * @author : Kavithma Thushal
 * @project : Spring-Boot-POS
 * @since : 7:05 AM - 6/18/2024
 **/

$(document).ready(function () {
    getCustomerCount();
    getItemCount();
    getOrderCount();
});

function getCustomerCount() {
    $.ajax({
        url: customerUrl + "/getCustomerCount",
        method: "GET",
        success: function (res) {
            $("#customerCount").text(res.data);
            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function getItemCount() {
    $.ajax({
        url: itemUrl + "/getItemCount",
        method: "GET",
        success: function (res) {
            $("#itemCount").text(res.data);
            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function getOrderCount() {
    $.ajax({
        url: placeOrderUrl + "/getOrderCount",
        method: "GET",
        success: function (res) {
            $("#orderCount").text(res.data);
            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}