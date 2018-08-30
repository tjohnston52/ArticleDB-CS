let detailbook = []
  , edit_comments = [];

function process(obj) {
  for (let i in obj) {
    let child = obj[i];
    if (child === null)
      obj[i] = 'No Data Available';
    else if (typeof(child)==='object')
      process(child);
  }
}

function retrieve_article(id){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_full_article.php',
    data: {'id':id},
    dataType: 'json',
    cache: false,
    global: true,
    success: function (data) {
      if (data.status === 'ok' && data.data !== 'none') {

        console.log(data.data);
        $('#newKeyWords').val(data.data.details[0].keywords);

        process(data.data.details);

        let details = data.data.details[0]
          , categories = data.data.category
          , comments = data.data.comments
          , sources = data.data.sources
          , url = data.data.url
          , patient = data.data.patient
          , matrix = data.data.matrix
          , articles = data.data.articles
        ;

        //console.log(comments);
        print_categories(categories);
        print_details(details);
        print_comments(comments);
        print_file_sources(sources);
        print_link_sources(url);
        print_related(articles);
        print_patient(patient);
        print_matrix(matrix);

        prep_remove_file(sources);
        prep_remove_url(url);
      }else{
        toastr.error('Something bad happened. Could not retrieve article.');
      }
    }
  });
}

function prep_remove_file(sources){
  let paste = '<option value="xx">Select a File to Remove</option>';
  $.each(sources, function(){
    paste += '<option value="'+this.sid+'">'+this.friendly+' ('+this.file+')</option>';
  });
  $('#attachedFile').html(paste);
}

function prep_remove_url(url){
  let paste = '<option value="xx">Select a Link to Remove</option>';
  $.each(url, function(){
    paste += '<option value="'+this.uid+'">'+this.friendly+' ('+this.url+')</option>';
  });
  $('#attachedURL').html(paste);

}

function print_categories(categories){
  let paste = '';
  $.each(categories, function(index){
    if(index !== 0 && index !== (categories.length)){
      paste += ', ';
    }
    paste += this.Description;
  });
  $('#articleCategory').html(paste);
}

function print_details(details){
  $('#articleTitle').html(details.title);
  $('#articleAuthor').html(details.author);
  $('#articleSummary').html(details.summary);
  $('#articleDescription').html(details.desc);
  $('#articleUploadedBy').html(details.fname + ' '+details.lname);
  $('#articleIssue').html(details.issue);
  $('#articleLocation').html(details.location);
  $('#articleCountry').html(details.country);
  $('#articleKeywords').html(details.keywords);
  $('#articleUploadDate').html(formatDate(details.date.date));
  $('#ratings').html(create_ratings(parseInt(details.stars), parseInt(details.favor)));

  // dates
  $('#articlePublishDate').html(getPubDate(details.pub_month, details.pub_year));
  $('#articleDataDate').html('');
  $('#articleDataDate').append(getPubDate(details.data_start_month, details.data_start_year)+ ' - ');
  $('#articleDataDate').append(getPubDate(details.data_end_month, details.data_end_year));

}

function print_comments(comments){
  edit_comments = comments;
  let paste = '', edit = '', x = 0;
  $('.edit_comment').unbind();
  $('.delete_comment').unbind();
  $.each(comments, function(id){
    //console.log(this.uid+' / '+parseInt(localStorage.getItem('user_id')));
    if(this.uid === parseInt(localStorage.getItem('user_id'))){
      edit = '<a href="#" style="font-size: 12px;" class="edit_comment" data-comment-id="'+x+'">Edit</a>&nbsp;|&nbsp;<a href="#" style="font-size: 12px;" class="delete_comment" data-comment-id="'+x+'">Delete</a>';
    }else{
      edit = '';
    }
    paste += '<b>'+ this.fname +' '+ this.lname+'</b> <span style="font-size: 11px;">'+ formatDate(this.date.date) +'&nbsp;</span>'+edit+'<br />'+ this.text;
    if(comments.length > 0 && id < (comments.length-1)) {
      paste += '<div class="divide"></div>';
    }
    x++;
  });
  paste = (paste === '') ? 'No Data Available' : paste;
  $('#articleComments').html(paste);


  $('.edit_comment').on('click', function(e){
    e.preventDefault();
    let id = parseInt($(this).attr('data-comment-id'));

    $('#newArticleComment').val(edit_comments[id].text);
    $('#postCommentBtn').html('Update');
    $('#updateComment').val(edit_comments[id].id);
    $('#newComment').modal('show');
    $('#commentHeader').html('Edit Comment');
  });

  $('.delete_comment').on('click', function(e){
    e.preventDefault();
    //alert('delete');
    let id = parseInt($(this).attr('data-comment-id'));

    $('#deleteComment').val(id);
    $('#commentDeleteText').html(edit_comments[id].text);
    $('#commentDeleteModal').modal('show');
  });

}

$('#deleteCommentBtn').on('click', function(){
  let article = $.urlParam('id')
    , comment_id = edit_comments[$('#deleteComment').val()].id
  ;
  console.log(article+' / '+comment_id);

  $.ajax({
    url: 'http://www.orasure.com/article-db/php/update_article_comments_delete.php',
    data: {
      'id': comment_id, 'article': article
    },
    dataType: 'json',
    cache: false,
    global: false,
    success: function (data) {
      console.log(data);
      if (data.status === 'ok') {
        print_comments(data.data);
        toastr.success('Comment deleted');
        $('#commentDeleteModal').modal('hide');
      } else {
        toastr.error('An error occurred. Try again later.');
      }
    }
  });
});

$('#commentBubble').on('click', function(){
  $('#updateComment').val('new');
  $('#newArticleComment').val('');
  $('#postCommentBtn').html('Post');
  $('#commentHeader').html('New Comment');
});

function print_file_sources(file){

  let paste = '';
  $.each(file, function(){
      paste += '<a href="article_files/'+this.file+'" target="_blank" data-id="'+this.sid+'">' + this.friendly + ' <span style="font-size: 10px;" class="glyphicon glyphicon-paperclip"></span></a><br />';
  });
  paste = (paste === '') ? 'No Files Available' : paste;
  $('#articleLFiles').html(paste);
}

function print_link_sources(url){

  let paste = '';
  $.each(url, function(){
    if(this.url.slice(0, 4) !== 'http' && this.url.slice(0, 5) !== 'https'){
      this.url = 'http://'+this.url;
    }
    paste += '<a href="'+this.url+'" target="_blank"  data-id="'+this.uid+'">' + this.friendly + ' <span style="font-size: 10px;" class="glyphicon glyphicon-new-window"></span></a><br />';
  });

  paste = (paste === '') ? 'No Links Available' : paste;
  $('#articleLLinks').html('<br />'+paste);
}

function print_related(article){
  let paste = '';
  $.each(article, function(){
    paste += '<li><a href="article.html?id='+this.id+'">' + this.title + '</a></li>';
  });
  paste = (paste === '') ? 'No Data Available' : '<ul>'+paste+'</ul>';
  $('#articleRelatedArticles').html(paste);
}

function print_patient(patient){
  let paste = '';
  if (patient === undefined) {
    paste = 'No Data Available';
  }else{
    paste += '<table class="patient-table-data">';
    paste += '<thead><tr><th>N=</th><th>Description</th></tr></thead><tbody>';
    $.each(patient, function(){
      let desc = (this.desc === null) ? '' : this.desc;
      paste += '<tr><td>'+this['count']+'</td><td>'+desc+'</td></tr>';
    });
    paste += '</tbody></table>';
  }
  $('#PatientData').html(paste);
}

function print_matrix(matrix){
  let paste = '';
  if (matrix === undefined) {
    paste = 'No Data Available';
  }else{
    $.each(matrix, function(){
      paste += '<table class="matrix-table-data">';
      paste += '<tr><td>Matrix</td><td colspan="2">'+this.matrix+'</td></tr>';
      if(this.comp !== null && this.comp !== undefined){
        paste += '<tr><td></td><td colspan="2">' + this.comp + '</td></tr>';
      }
      let sens_note = (this.sens_note === null) ? '' : this.sens_note
        , spec_note = (this.spec_note === null) ? '' : this.spec_note
        , sens = this.sens
        , spec = this.spec
      ;
      if(sens !== null){
        sens = parseFloat(sens) + '%';
      }else{
        sens = '';
      }
      if(spec !== null){
        spec = parseFloat(spec) + '%';
      }else{
        spec = '';
      }
      paste += '<tr><td>Sensitivity</td><td>'+sens+'</td><td>'+sens_note+'</td></tr>';
      paste += '<tr><td>Specificity</td><td>'+spec+'</td><td>'+spec_note+'</td></tr>';
      paste += '</table>';
    });
  }
  $('#MatrixData').html(paste);
}

function formatDate(date){
  let monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];

  let d = date.split(' ');
  let dat = d[0];

  date = new Date(dat);
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();
  //let hour = (date.getHours() > 12) ? date.getHours()-12 : date.getHours();
  //let sun = (date.getHours() > 12) ? 'pm' : 'am';
  //let min = date.getMinutes();
  //let sec = date.getSeconds();
  //let time = hour+':'+min+':'+sec;

  //return date;
  //return monthNames[monthIndex] +' '+ day + ', ' + year +' '+time + ' '+sun;
  return monthNames[monthIndex] +' '+ day + ', ' + year;
}

function load_article(){
  let data = detailbook[0]
    , dataDetail = data['detail']
    , title = dataDetail['title']
    , author = dataDetail['author']
    , pubDate = ((dataDetail['PubMonth'] !== null) ? dataDetail['PubMonth']+' '+dataDetail['PubYear']: dataDetail['PubYear'])
    , summary = dataDetail['summary']
    , comment = dataDetail['Comments']
    , rating =  dataDetail['rating']
    , user = dataDetail['user']
    , star_rating = create_ratings(rating)
    , resources = get_resources(data['Resources'])
    , related = get_related(data['Related_Articles'])
    , patients = get_patient_data(data['patient_data'])
    , matrix = get_matrix_data(data['matrix_data'])
    , data_date = ((dataDetail['DataDate'] === null) ? 'Not Available' : dataDetail['DataDate'])
    , issue = ((dataDetail['Issue_Information'] === null) ? 'Not Available' : dataDetail['Issue_Information'])
    , location = dataDetail['Location']
    , country = dataDetail['Source_Country']
    , keywords = dataDetail['keywords']
    , upload = dataDetail['uploaded']
    , comment_paste = ''
  ;

  if (comment.length === 0) {
    comment_paste= 'No Comments';
  }else{
    $.each(comment, function(id){
      comment_paste += '<b>'+ this['comment_user_fname'] +' '+ this['comment_user_lname']+'</b> <span style="font-size: 11px;">'+ this['comment_date'] +'</span><br />'+ this['comment_text'];
      if(id > 0) {
        comment_paste += '<div class="divide"></div>';
      }
    });
  }

  // Load info
  $('#articleTitle').html(title);
  $('#articleAuthor').html(author);
  $('#articlePublishDate').html(pubDate);
  $('#articleSummary').html(summary);
  $('#articleComments').html(comment_paste);
  $('#articleLinkedResources').html(resources);
  $('#articleRelatedArticles').html(related);
  $('#ratings').html(star_rating);
  $('#articleUploadedBy').html(user);
  $('#PatientData').html(patients);
  $('#MatrixData').html(matrix);
  $('#articleIssue').html(issue);
  $('#articleLocation').html(location);
  $('#articleCountry').html(country);
  $('#articleDataDate').html(data_date);
  $('#articleKeywords').html(keywords);
  $('#articleUploadDate').html(upload);
}

function get_resources(el){
  let post = '';
  if (el.length === 0) {
    post = 'No Comments';
  }else{
    $.each(el, function(){
      if(this['type'] === 'file') {
        post += '<a href="#" target="_blank">' + this['display'] + ' <span style="font-size: 10px;" class="glyphicon glyphicon-paperclip"></span></a><br />';
      }else{
        post += '<a href="'+this['filename']+'" target="_blank">' + this['display'] + ' <span style="font-size: 10px;" class="glyphicon glyphicon-new-window"></span></a><br />';
      }
    });
  }
  return post;
}

function get_related(el){
  let post = '';
  if (el.length === 0) {
    post = 'No Comments';
  }else{
    $.each(el, function(){
      post += '<a href="/article?id='+this['id']+'">' + this['title'] + '</a> <i>'+this['author']+'</i><br />';
    });
  }
  return post;
}

function get_patient_data(el){
  let post = '';
  if (el.length === 0) {
    post = 'No Data';
  }else{
    post += '<table class="patient-table-data">';
    post += '<thead><tr><th>N=</th><th>Description</th></tr></thead><tbody>';
    $.each(el, function(){
      post += '<tr><td>'+this['patient_count']+'</td><td>'+this['description']+'</td></tr>';
    });
    post += '</tbody></table>';
  }
  return post;
}

function get_matrix_data(el){
  let post = '';
  if (el.length === 0) {
    post = 'No Data';
  }else{
    $.each(el, function(){
      post += '<table class="matrix-table-data">';
      post += '<tr><td>Matrix</td><td colspan="2">'+this['Matrix']+'</td></tr>';
      if(this['Matrix_Note'] !== null){
        post += '<tr><td></td><td colspan="2">' + this['Matrix_Note'] + '</td></tr>';
      }
      post += '<tr><td>Product(s)</td><td colspan="2">'+this['Competitor_Info']+'</td></tr>';
      post += '<tr><td>Sensitivity</td><td>'+(parseFloat(this['Sensitivity'])*100)+'%</td><td>'+this['Sensitivity_Description']+'</td></tr>';
      post += '<tr><td>Specificity</td><td>'+(parseFloat(this['Specificity'])*100)+'%</td><td>'+this['Specificity_Description']+'</td></tr>';
      post += '</table>';
    });
  }
  return post;
}

$('#KeyWordUpdateBtn').on('click', function(){
  let id = $.urlParam('id')
    , keys = $('#newKeyWords').val()
  ;
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/update_article_keywords.php',
    data: {
      'id': id, 'key': keys
    },
    dataType: 'json',
    cache: false,
    global: false,
    success: function (data) {
      if (data.status === 'ok') {
        let keys = data.data[0].KeyWords;
        console.log(keys);
        if(keys === null){
          $('#articleKeywords').html('No Data Available');
          $('#newKeyWords').html(null);
        }else{
          $('#articleKeywords').html(keys);
          $('#newKeyWords').html(keys);
        }
        toastr.success('KeyWords updated successfully.');
      } else {
        toastr.error('An error occurred. Try again later.');
      }
    }
  });
});

$('#postCommentBtn').on('click', function(e){
  e.preventDefault();
  let user = localStorage.getItem('user_id')
    , page = $.urlParam('id')
    , text = $.trim($('#newArticleComment').val())
    , type = $('#updateComment')
  ;

  if(text.length  !== 0){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/update_article_comments.php',
      data: {
        'id': user, 'article': page, 'key': text, 'type':type.val()
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          print_comments(data.data);
          toastr.success('Comment submitted');
          $('#newComment').modal('hide');
          $('#newArticleComment').val('');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  }else{
    toastr.error('You must type a comment');
  }
});

$('#removeFileBtn').on('click', function(){
  let article = $.urlParam('id')
    , file = $('#attachedFile').val()
  ;
  if(file !== 'xx'){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/remove_article_file.php',
      data: {
        'article': article, 'file': file
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          print_file_sources(data.data);
          prep_remove_file(data.data);
          toastr.success('File removed');
          $('#removeFile').modal('hide');
          $('#attachedFile').val('xx');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  }else{
    toastr.error('You must select a file to remove.');
  }
});

$('#removeURLBtn').on('click', function(){
  let article = $.urlParam('id')
    , url = $('#attachedURL').val()
  ;
  if(url !== 'xx'){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/remove_article_url.php',
      data: {
        'article': article, 'url': url
      },
      dataType: 'json',
      cache: false,
      global: false,
      success: function (data) {
        if (data.status === 'ok') {
          print_link_sources(data.data);
          prep_remove_url(data.data);
          toastr.success('URL removed');
          $('#removeURL').modal('hide');
          $('#attachedURL').val('xx');
        } else {
          toastr.error('An error occurred. Try again later.');
        }
      }
    });
  }else{
    toastr.error('You must select a link to remove.');
  }
});

$('#deleteMode').on('click', function(){
  $('#deleteModal').modal('show');
});

$('#confirmDeleteBtn').on('click', function(){
  let id = $.urlParam('id');

  $.ajax({
    url: 'http://www.orasure.com/article-db/php/delete_article.php',
    data: {
      'id': id
    },
    dataType: 'json',
    cache: false,
    global: false,
    success: function (data) {
      if (data.status === 'ok') {
        localStorage.setItem('item_delete', 'yes');
        window.location.href = 'search.html';
      } else {
        toastr.error('An error occurred. Try again later.');
      }
    }
  });

});

if(localStorage.getItem('item_delete') === 'yes'){
  toastr.success('Article deleted');
  localStorage.setItem('item_delete', 'no');
}


if($('body').attr('data-title') === 'article'){retrieve_article(key);}
