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
                show_data_in_table(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function show_data_in_table(response){
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
          cust_data += '<td>' + '<a href='+ Flask.url_for('index',{'id':value.id, 'action':'edit'}) +'>Edit</a></td>';
          // cust_data += '<td>' + '<a id="btn_delete" class="btn_delete" href='+ Flask.url_for('search',{'id':value.id, 'action':'delete'}) +'>Delete</a></td>';
          cust_data += '<td>' +
          '<form id="frm_delete" action="'+ Flask.url_for('delete_cust') +'" method="post" role="form">' +
            '<input type="hidden" name="id_to_delete" id="id_to_delete" value="'+ value.id + '">' +
            '<a href="#" id="btn_delete">Delete</a>' +
          '</form>' + '</td>';
          cust_data += '</tr>';
        });
        new_tbody.innerHTML = cust_data;
        var old_tbody = document.getElementById('tbody');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
    }

    // $("#tbody").on("click","#btn_delete", function(e){
    //   e.preventDefault();
    //   console.log("hello");
    //   alert("Are you sure you want to delete this customer?");
    // });

    $("#body_tbl").on("click","#tbody #btn_delete", function(e){
      e.preventDefault();
      if(confirm("Are you sure you want to delete this customer?")){
        console.log("Yes");

        var form = $(this), url = $(e.target).parents("form:first").attr('action');
        var posting = $.post(url, $(e.target).parents("form:first").serialize());
        posting.done(function(data){
          // alert("success " + data);
          $(".result").html(data);
          if(data == false){
            alert("Unable to delete");
          }else{
            get_cust_data();
          }
        });
        posting.fail(function(data){
          alert("Fail");
        });


        // var hrefVals = $("#btn_delete").attr("href");
        // $(e.target).parents("form:first").submit();
        // console.log(hrefVals);

        // var value = $('#id_to_delete').val();
        // console.log(value);

        // $(e.target).parents("form:first").submit();


        // $(e.target).parents("form:first").submit(
        //   function(){
        //     console.log("going for ajax...");

            // var $form = $( this ),
            //     term = $form.find( "input[name='id_to_delete']" ).val(),
            //     url = $form.attr( "action" );
            // var posting = $.post( url, { id_to_delete : term } );
            //
            // posting.done(function( data ) {
            //   var content = $( data ).find( "#content" );
            //   $( "#result" ).empty().append( content );
            // });

            // $.ajax({
            //     type: 'POST',
            //     url: '/delete_cust',
            //     data: $(this).serialize(),
            //     success: function(response) {
            //         console.log(response);
            //         $(".boxContentId").html(response);
            //         // show_data_in_table(response);
            //         get_cust_data();
            //     },
            //     error: function(error) {
            //         console.log(error);
            //     }
            // });
          // });

      }
      else{
        console.log("No");
      }

      // console.log("hello");
      // alert("success");
    });

});
