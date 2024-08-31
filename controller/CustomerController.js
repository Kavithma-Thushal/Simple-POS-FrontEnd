const customerUrl = "http://localhost:8080/api/v1/customer";

$(document).ready(function () {
    generateCustomerId();
    loadAllCustomers();
});

$("#btnSaveCustomer").click(function () {

    let id = $("#txtCustomerId").val();
    let name = $("#txtCustomerName").val();
    let address = $("#txtCustomerAddress").val();
    let salary = $("#txtCustomerSalary").val();

    let customerObj = {
        id: id,
        name: name,
        address: address,
        salary: salary
    };

    $.ajax({
        url: customerUrl + "/saveCustomer",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(customerObj),
        success: function (res) {
            loadAllCustomers();
            successNotification(res.message);
        },
        error: function (error) {
            loadAllCustomers();
            errorNotification(error.responseJSON.message);
        }
    });
});

$("#btnSearchCustomer").click(function () {
    let searchId = $("#txtSearchCustomer").val();

    $.ajax({
        url: customerUrl + "/searchCustomer/" + searchId,
        method: "GET",
        success: function (res) {
            $("#customerTable").empty();
            let row = `<tr>
                    <td>${res.data.id}</td>
                    <td>${res.data.name}</td>
                    <td>${res.data.address}</td>
                    <td>${res.data.salary}</td>
                </tr>`;
            $("#customerTable").append(row);
            loadAllCustomers();
            console.log(res.message);
        },
        error: function (error) {
            loadAllCustomers();
            errorNotification(error.responseJSON.message);
        }
    });
});

$("#btnUpdateCustomer").click(function () {

    let id = $("#txtCustomerId").val();
    let name = $("#txtCustomerName").val();
    let address = $("#txtCustomerAddress").val();
    let salary = $("#txtCustomerSalary").val();

    let customerObj = {
        id: id,
        name: name,
        address: address,
        salary: salary
    };

    $.ajax({
        url: customerUrl + "/updateCustomer",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(customerObj),
        success: function (res) {
            loadAllCustomers();
            successNotification(res.message);
        },
        error: function (error) {
            loadAllCustomers();
            errorNotification(error.responseJSON.message);
        }
    });
});

$("#btnDeleteCustomer").click(function () {
    let deleteId = $("#txtCustomerId").val();

    $.ajax({
        url: customerUrl + "/deleteCustomer/" + deleteId,
        method: "DELETE",
        success: function (res) {
            loadAllCustomers();
            successNotification(res.message);
        },
        error: function (error) {
            loadAllCustomers();
            errorNotification(error.responseJSON.message);
        }
    });
});

$('#btnLoadAllCustomers').click(function () {
    loadAllCustomers();
});

$('#btnResetCustomer').click(function () {
    loadAllCustomers();
});

function loadAllCustomers() {
    $.ajax({
        url: customerUrl + "/loadAllCustomers",
        method: "GET",
        success: function (res) {
            $('#customerTable').empty();

            res.data.forEach(customer => {
                let id = customer.id;
                let name = customer.name;
                let address = customer.address;
                let salary = customer.salary;

                let row = `<tr>
                            <td>${id}</td>
                            <td>${name}</td>
                            <td>${address}</td>
                            <td>${salary}</td>
                        </tr>`;
                $("#customerTable").append(row);
            });

            getCustomerCount();
            generateCustomerId();
            customerValidation();
            resetCustomerBorders();
            customerTableListener();
            clearCustomerInputs();
            console.log(res.message);

        }, error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function generateCustomerId() {
    $.ajax({
        url: customerUrl + "/generateCustomerId",
        method: "GET",
        success: function (res) {
            let lastCustomerId = res.data;
            let parts = lastCustomerId.split('-');
            let prefix = parts[0];
            let number = parseInt(parts[1]) + 1;
            let newCustomerId = prefix + '-' + number.toString().padStart(3, '0');
            $("#txtCustomerId").val(newCustomerId);
            console.log(res.message);
        },
        error: function (error) {
            console.log(error.responseJSON.message);
        }
    });
}

function customerTableListener() {
    $("#customerTable>tr").on("click", function () {
        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let address = $(this).children().eq(2).text();
        let salary = $(this).children().eq(3).text();

        $("#txtCustomerId").val(id);
        $("#txtCustomerName").val(name);
        $("#txtCustomerAddress").val(address);
        $("#txtCustomerSalary").val(salary);

        $("#btnUpdateCustomer").prop("disabled", false);
        $("#btnDeleteCustomer").prop("disabled", false);
    });
}

function clearCustomerInputs() {
    $("#txtSearchCustomer").val("");
    $("#txtCustomerId").val("");
    $("#txtCustomerName").val("");
    $("#txtCustomerAddress").val("");
    $("#txtCustomerSalary").val("");

    $("#btnSaveCustomer").prop("disabled", true);
    $("#btnUpdateCustomer").prop("disabled", true);
    $("#btnDeleteCustomer").prop("disabled", true);
}