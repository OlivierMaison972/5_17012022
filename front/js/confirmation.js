function displayOrderId(){

    let params = new URL(document.location).searchParams;
    let id = params.get("id");

    document.getElementById("orderId").innerText = id;
};
displayOrderId();