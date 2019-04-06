$(function() {
  //get the cust data on page load
  get_cust_data();

    $('button').click(function() {
      get_cust_data();
    });

    function get_cust_data(){
      var formData = {'query': $('input[name=query]').val()}

        $.ajax({
            url: '/filter',
            data: formData,
            type: 'GET',
            success: function(response) {
                console.log(response);
                //document.getElementById("customer_details_table").innerHTML = response;

                show_data_in_table(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function show_data_in_table(response){

        // var tbody = document.getElementById("customer_details_tbody");
        // var data = jQuery.parseJSON(response);
        // var data = JSON.stringify(response);
        var new_tbody = document.createElement('tbody');
        new_tbody.setAttribute("id","tbody");
        var data = response['json_list'];

        var cust_data = '';
        $.each(data, function(key, value){
          cust_data += '<tr>';
          cust_data += '<td>' + value.name + '</td>';
          cust_data += '<td>' + value.mobile1 + '</td>';
          cust_data += '<td>' + value.mobile2 + '</td>';
          cust_data += '<td>' + value.mobile3 + '</td>';
          cust_data += '<td>' + value.address + '</td>';
          cust_data += '</tr>';
          // $('#tbody').append(cust_data);
          // $('#tbody').append(cust_data);

        });

        new_tbody.innerHTML = cust_data;

        var old_tbody = document.getElementById('tbody');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

        // cust_data += '</tbody>';
        // alert(cust_data);
        // $('#customer_details_tbody').append(cust_data);
        // $('#customer_details_tbody').innerHTML = '';
        // $('#customer_details_tbody').innerHTML = cust_data;
        // alert(data);
        // var data1 = jQuery.parseJSON(data);
        // alert(data1);

        // for(var i = 0; i < data.length; ++i){
        //   console.log(data[i]['name']);
        //   var tr = tbody.insertRow();
        //   for(var j = 0; j < data[i].length; ++j){
        //     var td = tr.insertCell();
        //     td.appendChild(document.createTextNode(data[i][j].toString()));
        //   }
        // }
        //
        // var tbl = document.getElementById("customer_details_table");
        // tbl.innerHTML = "";
        // tbl.innerHTML = tbody;

        // var arr = data[0];
        // alert(arr);
        // console.log(response[0]);
        // console.log(response.length);
        // console.log(response[0]["name"]);
        // for(var i = 0; i < response.length; ++i){
        //   console.log(response[i]["name"]);
          // var tr = tbody.insertRow();
          // for(var j = 0; j < response[i].length; ++j){
          //     // var td = tr.insertCell();
          //     console.log(response[i][j]);
          //     // td.appendChild(document.createTextNode(response[i][j].toString()));
          // }
        // }
        // var tbl = document.getElementById("customer_details_table");
        // tbl.innerHTML = "";
        // tbl.innerHTML = tbody;
        //
        // var customer_data = '';
        // for(i in response){
        //   customer_data += '<tr>';
        //   customer_data += '<td>' + i.name + '</td>';
        //   customer_data += '<td>' + i.mobile1 + '</td>';
        //   customer_data += '<td>' + i.mobile2 + '</td>';
        //   customer_data += '<td>' + i.mobile3 + '</td>';
        //   customer_data += '<td>' + i.address + '</td>';
        //   customer_data += '</tr>';
        // }
        // var tbody = document.getElementById("customer_details_tbody");
        // tbody.innerHTML = "";
        // tbody.innerHTML = customer_data;

        // $.each(response, function(){
        //   var table_row = table_body.insertRow();
        //   $.each(this, function(key, value){
        //     var cell = table_row.insertCell();
        //     cell.appendChild(document.createTextNode(value.toString()));
        //     // customer_data += '<tr>';
        //     // customer_data += '<td>' +value.name + '</td>';
        //     // customer_data += '<td>' +value.mobile1 + '</td>';
        //     // customer_data += '<td>' +value.mobile2 + '</td>';
        //     // customer_data += '<td>' +value.mobile3 + '</td>';
        //     // customer_data += '<td>' +value.address + '</td>';
        //     // customer_data += '</tr>';
        //   });
        // })
        // $("#customer_details").appendChild(table_body);
/*
        $.each(response, function(key, value){
          customer_data += '<tr>';
          customer_data += '<td>' +value.name + '</td>';
          customer_data += '<td>' +value.mobile1 + '</td>';
          customer_data += '<td>' +value.mobile2 + '</td>';
          customer_data += '<td>' +value.mobile3 + '</td>';
          customer_data += '<td>' +value.address + '</td>';
          customer_data += '</tr>';
        });
*/
        // $('#customer_details').append(customer_data);
        // $("#customer_details").innerHTML = customer_data;
    }

});
