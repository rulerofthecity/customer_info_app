$(function() {
  //get the cust data on page load
  var pageNum = '';
  var ellipsis = '...';
  var fwdSlash = '/';
  get_cust_data(pageNum);

    $('button').click(function() {
      get_cust_data(pageNum);
    });

    function get_cust_data(pageNum){
      var formData = {'query': $('input[name=query]').val()}

        $.ajax({
            url: '/filter' + pageNum,
            data: formData,
            type: 'GET',
            success: function(response) {
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
        var page_numbers = response['pages_lst'];

        var cust_data = '';
        $.each(data, function(key, value){
          cust_data += '<tr>';
          cust_data += '<td>' + value.name + '</td>';
          cust_data += '<td>' + value.mobile1 + '</td>';
          cust_data += '<td>' + value.mobile2 + '</td>';
          cust_data += '<td>' + value.mobile3 + '</td>';
          cust_data += '<td>' + value.address + '</td>';
          cust_data += '<td>' + '<a href='+ Flask.url_for('index',{'id':value.id, 'action':'edit'}) +'>Edit</a></td>';
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

        show_page_numbers(page_numbers);

    }

    $("#body_tbl").on("click","#tbody #btn_delete", function(e){
      e.preventDefault();
      if(confirm("Are you sure you want to delete this customer?")){
        var form = $(this), url = $(e.target).parents("form:first").attr('action');
        var posting = $.post(url, $(e.target).parents("form:first").serialize());
        posting.done(function(data){
          $(".message").html("Record successfully deleted!");
          if(data == false){
            alert("Unable to delete the record");
          }else{
            get_cust_data(pageNum);
          }
        });
        posting.fail(function(data){
          console.log("Failure occured while deleting the record");
        });
      }
    });

    function show_page_numbers(page_numbers){
      var new_links_box = document.createElement('div');
      new_links_box.setAttribute("id","paginationBox");

      var anchorTags = '';
      for (var i = 0; i < page_numbers.length; i++){
        var item = page_numbers[i] === null ? ellipsis : page_numbers[i] ;
        anchorTags += '<a href='+ Flask.url_for('filter') + ' id="page_num_link">'+ item +'</a> &nbsp;&nbsp;&nbsp;';
      }
      new_links_box.innerHTML = anchorTags;
      var old_links_box = document.getElementById('paginationBox');
      old_links_box.parentNode.replaceChild(new_links_box,old_links_box);
    }

    $("#datalist").on("click","#paginationBox #page_num_link", function(e){
        e.preventDefault();
        var page = fwdSlash + $(e.target).html();
        if(page != fwdSlash + ellipsis){
            get_cust_data(page);
        }
      });

});
