$.fn.remove_link_item = function(id) {
  $(id).on('click', function(e){
    e.preventDefault();

    let el = $(this).attr('data-btn');
    $('#url_listing [data-id='+el+']').remove();
    artstruc['links'] = $.grep(artstruc['links'], function(e){
      return e.u_id !== parseInt(el);
    });
  });
};

let artstruc = {
  'title': null,
  'description': null,
  'summary': null,
  'category': [],
  'author': null,
  'journal': null,
  'pub_month' : null,
  'pub_year': null,
  'issue': null,
  'data_start_month': null,
  'data_end_month' : null,
  'data_start_year' : null,
  'data_end_year' : null,
  'source_country': null,
  'study_details': [], // Matrix, Participants, Sensitivity, Specificity
  'patient_details': [],
  'keywords': null,
  'comments': null,
  'rating' : null,
  'ratingFavor':null,
  'user' : localStorage.getItem('user_id')
};

let new_article_id = null;
//let new_article_id = 14;

let user_data_input = localStorage.getItem('articleData')
  , form_1 = $('#upload_form_1')
  , form_2 = $('#upload_form_2')
  , form_3 = $('#upload_form_3')
  , form_4 = $('#upload_form_4')
  , form_5 = $('#upload_form_5')
  , urlForm = $('#urlUploadForm')
  , fileForm = $('#fileUploadForm')
  , first_block = $('#First_Block_Poly')
  , second_block = $('#Second_Block_Poly')
  , third_block = $('#Third_Block_Poly')
  , fourth_block = $('#Fourth_Block_Poly')
  , fifth_block = $('#Fifth_Block_Poly');


function form_switch_pane(t_old, t_new){
  t_old.css('display','none');
  t_new.css('display','block');
}

function prog_c_switch(t_old, t_new, back){
  if(!back) {
    t_old.removeClass('cls-21');
    t_old.addClass('cls-2');

    t_new.removeClass('cls-26');
    t_new.removeClass('cls-2')
  }else{

  }
  t_new.addClass('cls-21');
}

function test_pane(x, y){
  form_switch_pane(form_1, x);
  prog_c_switch(first_block, y);
  //console.log(new_article_id);
}


// Testing panes only. Hide on publish.
//test_pane(form_2, second_block);
//test_pane(form_3, third_block);
//test_pane(form_4, fourth_block);
//test_pane(form_5, fifth_block);
// End testing


function initForm(){
  form_1.on('init.field.fv', function(e, data) {
    // data.field   --> The field name
    // data.element --> The field element
    if (data.field === 'category') {
      let $icon = data.element.data('fv.icon');
      $icon.appendTo('#alertDayIcon');
      //console.log('ok');
    }
  }).on('init.field.fv', function(e, data) {
    // data.field   --> The field name
    // data.element --> The field element
    if (data.field === 'category') {
      let $icon = data.element.data('fv.icon');
      $icon.appendTo('#alertDayIcon');
      //console.log('ok');
    }
  }).formValidation({
    // I am validating Bootstrap form
    framework: 'bootstrap',

    // Feedback icons
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // List of fields and their validation rules
    fields: {
      title: {
        validators: {
          notEmpty: {
            message: 'Title is required and cannot be empty'
          },
          stringLength: {
            min: 5,
            message: 'Title must be at least 5 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9-_;.,:®'"&%$()?\\/\]\[{}+= ]+$/,
            message: 'Title can only consist of alphanumeric and ( _ ; : \' " & % $ () . , ? \\/ [] {} + = )'
          }
        }
      },
      description: {
        validators: {
          stringLength: {
            min: 5,
            message: 'Description must be at least 5 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9-_;:.,'"&%<>$()?\\/\]\[{}+=® ]+$/,
            message: 'Description has an unaccepptable character type.'
          }
        }
      },
      category: {
        err: '#alertCheckboxes',
        validators: {
          notEmpty: {
            message: 'Please select at least one.'
          }
        }
      }
    }
  })
    .on('success.form.fv', function(e) {
      // Prevent form submission
      e.preventDefault();

      // commit
      let title = $('#title').val()
        , description = $('#description').val()
        , summary = $('.ql-editor').html()
        , category = $('.category')
        , rating = $('#articleRating').val()
        , ratingFavor = $('#articleRatingFavor').val()
      ;

      // Null these array fields to correct when a users backs up and changes
      artstruc['title'] = null;
      artstruc['description'] = null;
      artstruc['summary'] = null;
      artstruc['category'] = [];
      artstruc['rating'] = null;
      artstruc['ratingFavor'] = null;

      // Fill Array
      artstruc['title'] = title;
      artstruc['description'] = (description === '') ? null : description;
      artstruc['summary'] = (summary.trim() === '<p><br></p>') ? null : summary;
      artstruc['rating'] = rating;
      artstruc['ratingFavor'] = ratingFavor;

      console.log(artstruc['summary']);

      let i = 0;
      $.each(category, function(){
        if($(this).is(':checked')){
          artstruc['category'][i] = $(this).attr('value');
          i++;
        }
      });

      // next
      form_switch_pane(form_1, form_2);
      prog_c_switch(first_block, second_block);

  });
}
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

form_2.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    author: {
      validators: {
      }
    },
    journal: {
      validators: {
      }
    },
    year: {
      validators: {
        stringLength: {
          min: 4,
          max: 4,
          message: 'Year must be 4 digits long'
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: 'Description can only consist of numeric characters'
        }
      }
    },
    issue: {
      validators: {
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // commit
    let author = $('#author').val()
      , journal = $('#journal').val()
      , pub_month = $('#pub_month').val()
      , pub_year = $('#pub_year').val()
      , issue = $('#issue').val();

    // Null these array fields to correct when a users backs up and changes
    artstruc['author'] = null;
    artstruc['journal'] = null;
    artstruc['pub_month'] = null;
    artstruc['pub_year'] = null;
    artstruc['issue'] = null;

    // Fill Array
    artstruc['author'] = (author === '') ? null : author;
    artstruc['journal'] = (journal === '') ? null : journal;
    artstruc['pub_month'] = (pub_month === 'Null') ? null : pub_month;
    artstruc['pub_year'] = (pub_year === '') ? null : pub_year;
    artstruc['issue'] = (issue === '') ? null : issue;

    //console.log(artstruc);

    // next
    form_switch_pane(form_2, form_3);
    prog_c_switch(second_block, third_block);

  });

form_3.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    start_year: {
      validators: {
        stringLength: {
          min: 4,
          max: 4,
          message: 'Year must be 4 digits long'
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: 'Description can only consist of numeric characters'
        }
      }
    },
    end_year: {
      validators: {
        stringLength: {
          min: 4,
          max: 4,
          message: 'Year must be 4 digits long'
        },
        regexp: {
          regexp: /^[0-9]+$/,
          message: 'Description can only consist of numeric characters'
        }
      }
    },
    source_country: {
      stringLength: {
        min: 3,
        message: 'Source country(s) must be at least 3 characters long'
      },
      regexp: {
        regexp: /^[a-zA-Z-_;'\\/ ]+$/,
        message: 'Source country(s) can only consist of letters and ( ; \' () - _ \\/ )'
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();
    // commit
    let data_start_month = $('#data_start_month').val()
      , data_start_year = $('#data_start_year').val()
      , data_end_month = $('#data_end_month').val()
      , data_end_year = $('#data_end_year').val()
      , source_country = $('#source_country').val();

    // Null these array fields to correct when a users backs up and changes
    artstruc['data_start_month'] = null;
    artstruc['data_start_year'] = null;
    artstruc['data_end_month'] = null;
    artstruc['data_end_year'] = null;
    artstruc['source_country'] = null;

    // Fill Array
    artstruc['data_start_month'] = (data_start_month === 'Null') ? null : data_start_month;
    artstruc['data_start_year'] = (data_start_year === '') ? null : data_start_year;
    artstruc['data_end_month'] = (data_end_month === 'Null') ? null : data_end_month;
    artstruc['data_end_year'] = (data_end_year === '') ? null : data_end_year;
    artstruc['source_country'] = (source_country === '') ? null : source_country;

    // next
    form_switch_pane(form_3, form_4);
    prog_c_switch(third_block, fourth_block);

  });

form_4.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    comments: {
      validators: {
        regexp: {
          regexp: /^[a-zA-Z0-9-/-_;.'",&%$()?\\/{}+= ]+$/,
          message: 'Keywords can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} , - + = )'
        }
      }
    },
    keywords: {
      validators: {
        regexp: {
          regexp: /^[a-zA-Z0-9-/-_;'",.&%$()?\\/\]\[{}+= ]+$/,
          message: 'Keywords can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} .  , - + = )'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // commit
    let comments = $('#comments').val()
      , keywords = $('#keywords').val();

    // Null these array fields to correct when a users backs up and changes
    artstruc['comments'] = null;
    artstruc['keywords'] = null;

    // Fill Array
    artstruc['comments'] = (comments === '') ? null : comments;
    artstruc['keywords'] = (keywords === '') ? null : keywords;

    $('#publishConfirmModal').modal('show');

    $('#upload_form_4_btn').removeAttr('disabled');
    $('#upload_form_4_btn').removeClass('disabled');

  });

$('#confirmPublishBtn').on('click', function(){
  if($.urlParam('edit') !== 'true') {
    publish_article();
  }else{
    update_article();
    //console.log(artstruc);
  }
});

function update_article(){
  console.log(artstruc);
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/update_article.php',
    data: {
        'data': artstruc
      , 'id':parseInt($.urlParam('id'))
    },
    dataType: 'json',
    cache: false,
    global:false,
    type:'POST',
    success: function(data){
      console.log(data);
      if(data.status === 'ok'){
        toastr.success('Article has been successfully updated.');
        window.location = 'article.html?id='+parseInt($.urlParam('id'));
      }else{
        toastr.error('An error occurred. Try again later.');
      }
    }});
}

function publish_article(){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/upload_article.php',
    data: {
      'data': artstruc
    },
    dataType: 'json',
    cache: false,
    global:false,
    type:'POST',
    success: function(data){
      console.log(data);
      if(data.status === 'ok'){
        toastr.success('Article has been successfully created.');
        new_article_id = data.data[0]['id'];
        //let article_id = 5;
        form_switch_pane(form_4, form_5);
        prog_c_switch(fourth_block, fifth_block);
      }else{
        toastr.error('An error occurred. Try again later.');
      }
    }});
}

form_5.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    titlex: {
      validators: {
        notEmpty: {
          message: 'Title is required and cannot be empty'
        },
        stringLength: {
          min: 5,
          message: 'Title must be at least 5 characters long'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9-_;:'"&%$()?\\/\]\[{}+= ]+$/,
          message: 'Title can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} + = )'
        }
      }
    },
    descriptionx: {
      validators: {
        notEmpty: {
          message: 'Description is required and cannot be empty'
        },
        stringLength: {
          min: 5,
          message: 'Description must be at least 5 characters long'
        },
        regexp: {
          regexp: /^[a-zA-Z-_;:'"&%$()?\\/\]\[{}+= ]+$/,
          message: 'Description can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} + = )'
        }
      }
    },
    summaryx: {
      validators: {
        notEmpty: {
          message: 'Required and cannot be empty'
        },
        stringLength: {
          min: 5,
          message: 'Must be more than 5 and less than 250 characters long'
        }
      }
    },
    categoryx: {
      err: '#alertCheckboxes',
      validators: {
        notEmpty: {
          message: 'Please select at least one.'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // commit
    //$('#fileConfirmModal').modal('show');
    location.reload();
    $('#upload_form_5_btn').removeAttr('disabled');
    $('#upload_form_5_btn').removeClass('disabled');
  });

$('.backBtn').on('click', function(){

  switch($(this).attr('data-id')){
    case '2':
      form_switch_pane(form_2, form_1);
      prog_c_switch(second_block, first_block);
      $('#upload_form_1_btn').attr('disabled', false).removeClass('disabled');
      break;

    case '3':
      form_switch_pane(form_3, form_2);
      prog_c_switch(third_block, second_block);
      $('#upload_form_2_btn').attr('disabled', false).removeClass('disabled');
      break;

    case '4':
      form_switch_pane(form_4, form_3);
      prog_c_switch(fourth_block, third_block);
      $('#upload_form_3_btn').attr('disabled', false).removeClass('disabled');
      break;

    case '5':
      form_switch_pane(form_5, form_4);
      prog_c_switch(fifth_block, fourth_block);
      $('#upload_form_4_btn').attr('disabled', false).removeClass('disabled');
      break;
  }
});

urlForm.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    urlFriendlyName: {
      validators: {
        notEmpty: {
          message: 'Title is required and cannot be empty'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9-_;:'"&%$()?\\/\]\[{}+= ]+$/,
          message: 'Title can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} + = )'
        }
      }
    },
    urlPath: {
      validators: {
        notEmpty: {
          message: 'Path is required and cannot be empty'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();
    let id = localStorage.getItem('user_id')
      , art_id = (new_article_id === null) ? $.urlParam('id') : new_article_id
      , path = $('#urlPath')
      , friendly = $('#urlFriendlyName')
      , url_list = $('#url_listing')
      , type = ($('#articleLLinks').length) ? 1 : 0
    ;

  // Add to db
  // Check to see if updating
  if( $('#urlEditID').val() !== 'new' && $('#urlEditID').val() !== '') {
    let url_id = $('#urlEditID').val();
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/edit_article_url.php',
      data: {
        'article': url_id, 'friendly' : friendly.val(), 'path' : path.val()
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          toastr.success('URL updated.');
          $('.row[data-id="'+url_id+'"] .urlTitle').html(''+
            '<span style="font-weight:normal;">Friendly:</span> '+friendly.val() +
            '<br />' +
            '<span style="font-weight:normal;">Path:</span> '+path.val());

          // Unlock Add
          urlForm.data('formValidation').resetForm();

          // Clean inputs for next set
          $('#urlEditID').val('new');
          $('#uploadUrlModal').modal('hide');
          friendly.val('');
          path.val('');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  }else {
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/upload_article_url.php',
      data: {
        'article': art_id, 'friendly': friendly.val(), 'path': path.val(), 'type':type
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {

          if($('#articleLLinks').length) {
            console.log(data.data);
            print_link_sources(data.data);
          }else {
            let url_id = data.data[0]['id'];
            // Update screen
            let paste = '' +
              '<div class="row url" style="background-color:#f9f9f9;margin-bottom: 2px;" data-id="' + url_id + '" data-friendly="' + friendly.val() + '" data-path="' + path.val() + '">' +
              '<div class="col-xs-10 nobtnpad urlTitle" style="font-size:14px;">' +
              '<span style="font-weight:normal;">Friendly:</span> ' + friendly.val() +
              '<br />' +
              '<span style="font-weight:normal;">Path:</span> ' + path.val() +
              '</div>' +
              '<div class="col-xs-2">' +
              '<button type="button" class="btn btn-primary nobtnpad edit-url" data-edit="' + url_id + '">' +
              '<i class="glyphicon glyphicon-edit"></i>' +
              '</button>&nbsp;' +
              '<button type="button" class="btn btn-danger nobtnpad remove-url" data-btn="' + url_id + '">' +
              '<i class="glyphicon glyphicon-minus"></i>' +
              '</button>' +
              '</div>' +
              '</div>' +
              '</div>';

            url_list.append(paste);
            //url_list.remove_link_item('[data-btn=' + id + ']');
            remove_url_listener();
            edit_url_listener();
          }
          // Toast!
          toastr.success('URL added');

          // Unlock Add
          urlForm.data('formValidation').resetForm();
          //$('#addUrl').attr('disabled', false).removeClass('disabled');

          // Clean inputs for next set
          friendly.val('');
          path.val('');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  }
});

fileForm.formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // List of fields and their validation rules
  fields: {
    fileFriendlyName: {
      validators: {
        notEmpty: {
          message: 'Title is required and cannot be empty'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9-_;:'"&%$()?\\/\]\[{}+= ]+$/,
          message: 'Title can only consist of alphanumeric and ( _ ; : \' " & % $ () ? \\/ [] {} + = )'
        }
      }
    },
    urlPath: {
      validators: {
        notEmpty: {
          message: 'Path is required and cannot be empty'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();

    let art_id = (new_article_id === null) ? $.urlParam('id') : new_article_id
      , path = $('#file1').prop('files')[0]
      , friendly = $('#fileFriendlyName')
      , doc_list = $('#doc_listing')
      , type = ($('#articleLFiles').length) ? 1 : 0
      , form_data = new FormData()
      , prev_print = ($('#prev_print').is(':checked')) ? 'yes' : 'no'
      , prev_save = ($('#prev_save').is(':checked')) ? 'yes' : 'no'
    ;

    //console.log(path);
    form_data.append('file', path);
    form_data.append('friendly', friendly.val());
    form_data.append('art_id', art_id);
    form_data.append('type', type);
    form_data.append('print', prev_print);
    form_data.append('save', prev_save);

    //console.log(prev_print);
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/upload_article_file.php',
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,
      type: 'POST',
      success: function(data){
        console.log(data.status);
        if (data.status === 'ok') {
          toastr.success('File uploaded.');
          let el = data.data[0];
          if($('#articleLFiles').length){
            print_file_sources(data.data);
          }else{
            let paste = print_file(el);
            doc_list.append(paste);
            remove_file_listener();
            previewFileListener();
          }

          el['friendly'] = friendly.val();

          // Unlock Add
          fileForm.data('formValidation').resetForm();

          // Clean inputs for next set
          $('#uploadFileModal').modal('hide');
          friendly.val('');
          $('#file1').val('');
          $('#file1label').html('Please choose a file on your computer');
        } else {
          switch(data.data){
            case 'move failed':
              toastr.error('The file could not be properly moved to the system.');
              break;
            case 'exists':
              toastr.error('This file already exists.');
              break;
            case 'file type now allowed':
              toastr.error('The file type is not allowed.');
              break;
            case 'file not uploaded':
              toastr.error('File failed to upload.');
              break;
            default:
              toastr.error('An error occurred. Try again later.');
              break;
          }

        }
      }
    });

  });

function print_file(el){
  let item = '<div class="row file" style="background-color:#f9f9f9;margin-bottom: 2px;" data-id="'+el.id+'" data-friendly="'+el.friendly+'">'+
  '<div class="col-xs-10 nobtnpad" style="font-size:14px;">'+
  '<span style="font-weight:normal;">Friendly:</span> '+el.friendly +
  '<br />' +
  '<span style="font-weight:normal;">Path:</span> '+el.name +
  '</div>'+
  '<div class="col-xs-2">'+
  '<button type="button" class="btn btn-primary nobtnpad preview-file" data-preview="'+el.name+'">'+
  '<i class="glyphicon glyphicon-eye-open"></i>'+
  '</button>&nbsp;'+
  '<button type="button" class="btn btn-primary nobtnpad edit-file" data-edit="'+el.id+'">'+
  '<i class="glyphicon glyphicon-edit"></i>'+
  '</button>&nbsp;'+
  '<button type="button" class="btn btn-danger nobtnpad remove-file" data-btn="'+el.id+'">'+
  '<i class="glyphicon glyphicon-minus"></i>'+
  '</button>'+
  '</div>'+
  '</div>'+
  '</div>';
  return item;
}

function previewFileListener(){
  $('.preview-file').unbind();
  $('.preview-file').on('click', function(){
    let file = $(this).attr('data-preview');
    window.open('http://www.orasure.com/article-db/article_files/'+file, '_blank');
  });
}

function remove_url_listener() {
  $('.remove-url').unbind();
  $('.remove-url').on('click', function () {
    let art_id = new_article_id
      , url_id = $(this).attr('data-btn');
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/delete_article_url.php',
      data: {
        'article': art_id, 'url': url_id
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          $('.url[data-id=' + url_id + ']').remove();
          // Toast!
          toastr.success('URL removed');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  });
}

function edit_url_listener() {
  $('.edit-url').unbind();
  $('.edit-url').on('click', function () {
    let art_id = new_article_id
      , url_id = $(this).attr('data-edit')
      , friendly = $('.row[data-id="'+url_id+'"]').attr('data-friendly')
      , path = $('.row[data-id="'+url_id+'"]').attr('data-path')
    ;

    $('#urlFriendlyName').val(friendly);
    $('#urlPath').val(path);
    $('#urlEditID').val(url_id);
    $('#uploadUrlModal').modal('show');

  });
}

function remove_file_listener() {
  $('.remove-file').unbind();
  $('.remove-file').on('click', function () {
    let art_id = new_article_id
      , file_id = $(this).attr('data-btn');

    $.ajax({
      url: 'http://www.orasure.com/article-db/php/delete_article_file.php',
      data: {
        'article': art_id, 'file': file_id
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          $('.file[data-id=' + file_id + ']').remove();
          // Toast!
          toastr.success('File removed.');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  });
}

//$('#addUrl').on('click', add_url);

$('#UrlAddBtn').on('click', function(){
  $('#urlEditID').val('new');
});

$('#fileNewAttach').on('click', function(e){
  e.preventDefault();
  $('#filespecified').css({'display':'block'});
  $('#fileNewAttach').css({'font-weight': 'bold', 'color':'#333'});
  $('#fileExisting').css({'display':'none'});
  $('#fileExistingAttach').css({'font-weight': 'normal', 'color':'#337ab7'});
  $('#addFile').css('display','inline-block');
  $('#addExistFile').css('display','none');
  $('#filetype').val('new');
});

$('#fileExistingAttach').on('click', function(e){
  e.preventDefault();
  $('#filespecified').css({'display':'none'});
  $('#fileNewAttach').css({'font-weight': 'normal', 'color':'#337ab7'});
  $('#fileExisting').css({'display':'block'});
  $('#fileExistingAttach').css({'font-weight': 'bold', 'color':'#333'});
  $('#addFile').css('display','none');
  $('#addExistFile').css('display','inline-block');
  $('#filetype').val('exist');
});

if($('#fileExistingList').length){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/get_files.php',
    data: {},
    dataType: 'json',
    cache: false,
    global: false,
    success: function (data) {
      if (data.status === 'ok') {
        write_files_list(data.data);
      } else {
        toastr.error('An error occurred. Could not retrieve files.');
      }
    }
  });
}

function write_files_list(arr){
  let paste = '<option value="xx" disabled selected="selected">Please select a file</option>';
  $.each(arr, function(){
      paste += '<option value="'+this.id+'" data-preview="'+this.file+'">'+this.name+'</option>';
  });
  $('#fileExistingList').html(paste);
}

$('#fileExistPreviewBtn').on('click', function(){
  let item = $('#fileExistingList')
    , select = $('#fileExistingList option:selected').attr('data-preview')
  ;

  if(item.val() !== 'xx' && item.val() !== null){
    window.open('http://www.orasure.com/article-db/article_files/'+select, '_blank');
  }else{
    toastr.error('You must select a valid file to preview.');
  }
});

$('#addExistFile').on('click', function(){
  let obj = $('#fileExistingList')
    , article_id = (new_article_id === null) ? $.urlParam('id') : new_article_id
    , type = ($.urlParam('id') === null) ? 0 : 1
  ;
  if(obj.val() !== 'xx' && obj.val() !== null) {
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/upload_article_file_existing.php',
      data: {'art':article_id, 'file':obj.val(), 'type':type},
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          if($('#articleLFiles').length){
            print_file_sources(data.data);
          }else{
            let paste = print_file(data.data[0]);
            $('#doc_listing').append(paste);
            remove_file_listener();
            previewFileListener();
          }

          obj.val('xx');
        }else{
          toastr.error('An error occurred. Could not attach file. It may already be attached.');
        }
      }
    });
  }else{
    toastr.error('You must select a valid file.');
  }
});
function get_articles(){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/get_articles_attach.php',
    data: {'art':new_article_id},
    dataType: 'json',
    cache: false,
    global: false,
    success: function (data) {
      //console.log(data.data);
      if (data.status === 'ok') {
        let paste = '<option value="xx" disabled selected="selected">Please select an article</option>';
        $.each(data.data, function(){
          if(parseInt(this.id) !== parseInt($.urlParam('id'))){
            paste += '<option value="'+this.id+'">'+this.title+'</option>';
          }
        });
        $('#articleExistingList').html(paste);
      }else{
        toastr.error('An error occurred. Could not attach file. It may already be attached.');
      }
    }
  });
}

if($('#articleExistingList').length > 0){
  get_articles();
}

function remove_article_listener() {
  $('.remove-article').unbind();
  $('.remove-article').on('click', function () {
    let art_id = new_article_id
      , old = $(this).attr('data-btn')
      , dir = $('.article[data-id="'+old+'"]').attr('data-direction');
    //console.log(art_id+'/'+old+'/'+dir);
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/delete_article_relation.php',
      data: {
        'new': art_id, 'old': old, 'relation': dir
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          $('.article[data-id=' + old + ']').remove();
          // Toast!
          toastr.success('Article relation removed.');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  });
}

$('#addExistArticle').on('click', function(){
  let el = $('#articleExistingList')
    , old = el.val()
    , html = $('#articleExistingList option:selected').html()
    , dir = $('#articleRelationship')
    , direction = dir.val()
    , relhtml = $('#articleRelationship option:selected').html()
    , article_id = (new_article_id === null) ? $.urlParam('id') : new_article_id
  ;
  if(old !== 'xx' && old !== null){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/create_article_relation.php',
      data: {
        'new': article_id, 'old': old, 'relation': direction
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          if(data.data !== 'exist') {
            if($('#articleRelatedArticles').length){
              console.log(data.data);
              print_related(data.data);
            }else {
              let paste = '' +
                '<div class="row article" style="background-color:#f9f9f9;margin-bottom: 2px;" data-id="' + old + '" data-title="' + html + '" data-direction="' + direction + '">' +
                '<div class="col-xs-10 nobtnpad urlTitle" style="font-size:14px;">' +
                '<span style="font-weight:normal;">Title:</span> ' + html +
                '<br />' +
                '<span style="font-weight:normal;">Relation:</span> ' + relhtml +
                '</div>' +
                '<div class="col-xs-2">' +
                '<button type="button" class="btn btn-primary nobtnpad edit-article" data-edit="' + old + '">' +
                '<i class="glyphicon glyphicon-edit"></i>' +
                '</button>&nbsp;' +
                '<button type="button" class="btn btn-danger nobtnpad remove-article" data-btn="' + old + '">' +
                '<i class="glyphicon glyphicon-minus"></i>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>';

              $('#article_listing').append(paste);
              //url_list.remove_link_item('[data-btn=' + id + ']');
              remove_article_listener();
              //edit_article_listener();
            }
            toastr.success('Article relation successfully created.');
            el.val('xx');
            dir.val('1');
          }else{
            toastr.info('Article relation already exists');
          }
        } else {
          toastr.error('Something went wrong. Try again.');
        }
      }
    });
  }else{
    toastr.error('You must select and article.');
  }
});

let editmode = $.urlParam('edit')
, editid = parseInt($.urlParam('id'));

$(document).ready(function(){
  if(editmode === 'true'){

    $('#upload_form_4_btn').html('Update');
    $('#Fifth_Block').css('display','none');
    $('#editmodeUpdate').html('Are you sure you want to update your article?');
    $('#confirmPublishBtn').html('Update');

    //console.log('Mode: '+editmode+' ID: '+editid);
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/get_edit_article.php',
      data: {
        'id': editid
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        editdata = data.data;
        //console.log(data.data);
        // fill artstruc
        artstruc.title = editdata.details[0].title;
        artstruc.author = editdata.details[0].author;
        artstruc.data_start_month = editdata.details[0].data_start_month;
        artstruc.data_start_year = editdata.details[0].data_start_year;
        artstruc.data_end_month = editdata.details[0].data_end_month;
        artstruc.data_end_year = editdata.details[0].data_end_year;
        artstruc.description = editdata.details[0].desc;
        artstruc.issue = editdata.details[0].issue;
        artstruc.journal = editdata.details[0].location;
        artstruc.keywords = editdata.details[0].keywords;
        artstruc.pub_month = editdata.details[0].pub_month;
        artstruc.pub_year = editdata.details[0].pub_year;
        artstruc.rating = editdata.details[0].stars;
        artstruc.ratingFavor = editdata.details[0].favor;
        artstruc.source_country = editdata.details[0].country;
        artstruc.summary = editdata.details[0].summary;

        artstruc.category = editdata.category;
        artstruc.patient_details = (!editdata.patient)?[]:editdata.patient;
        artstruc.study_details = (!editdata.matrix)? []:editdata.matrix;

        $('#comments').css({'background-color':'#aaa', 'cursor':'not-allowed'}).attr('readonly',true);

        //console.log(data);
        //console.log(artstruc);

        // Panel 1
        $(document).ready(function(){
          $('#title').val(editdata.details[0].title);
          $('#description').val(editdata.details[0].desc);
          $('#editor .ql-editor').html(editdata.details[0].summary);
          console.log(editdata.category);
          $.each(editdata.category, function(){
            //console.log(this.CategoryID);
            $('.category[value="'+this.CategoryID+'"]').prop('checked', true);
          });
          $('#articleRatingFavor').val(editdata.details[0].favor);
          $('#articleRating').val(editdata.details[0].stars);

          // Panel 2
          $('#author').val(editdata.details[0].author);
          $('#journal').val(editdata.details[0].location);
          editdata.details[0].pub_month =(editdata.details[0].pub_month == null)? 'Null':parseInt(editdata.details[0].pub_month);
          $('#pub_month').val(editdata.details[0].pub_month);
          $('#pub_year').val(editdata.details[0].pub_year);
          $('#issue').val(editdata.details[0].issue);

          // Panel 3
          editdata.details[0].data_start_month =(editdata.details[0].data_start_month == null)? 'Null':parseInt(editdata.details[0].data_start_month);
          $('#data_start_month').val(editdata.details[0].data_start_month);
          $('#data_start_year').val(editdata.details[0].data_start_year);
          editdata.details[0].data_end_month =(editdata.details[0].data_end_month == null)? 'Null':parseInt(editdata.details[0].data_end_month);
          $('#data_end_month').val(editdata.details[0].data_end_month);
          $('#data_end_year').val(editdata.details[0].data_end_year);
          $('#source_country').val(editdata.details[0].country);

          $('#patientData').html(postPatientData(editdata.patient));
          patientDataEditListener();


          $('#datasets').html(postMatrixData(editdata.matrix));
          matrixDataEditListener();

          // Panel 4

          $('#keywords').val(editdata.details[0].keywords);
        });

        //console.log(artstruc);
      }
    });
  }
});

$('#articleExistPreviewBtn').on('click', function(){
  let id = $('#articleExistingList').val();
  console.log(id);
  if(id !== null){
    window.open('article.html?id='+id);
  }else{
    toastr.error('You must select an article to preview.');
  }

});
