let globalSearchTerm = $('#searchTerm')
  , globalUserList = [{'user_id':'none'}]
  , scan_collections = $('#scan_collections')
  , file_set = $('#file-set')
  , category = $('#category')
  , user_name = $('#user-name')
  , collectionDDL = $('#collectionDDL')
  , calendar = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December']
  , book = []
  , search = []
  , collections = []
;

globalSearchTerm.bind('keydown', function(e){
  if(e.which === 13) {
    e.preventDefault();
    run_search();
  }
});


// Methods
$.fn.postUsers = function(){
  let post = '<option value="new">New User</option>'
    , count = 0
    , cur_id = localStorage.getItem('user_id');

  $.each(globalUserList, function(){
    if(parseInt(this.user_id) !== parseInt(cur_id)) {
      post += '<option value="' + this.user_id + '" data-id="' + count + '">' + this.fname + ' ' + this.lname + '</option>';
    }
    count++;
  });
  return this.html(post);
};

$.fn.createArticles = function(arr, page, inc){
  let place = ''
    , total_pages = Math.ceil(arr.length/inc)
    , total_records = arr.length
    , start = ((page*inc)-inc)
    , stop = (((page*inc)-1) < arr.length) ? (page*inc) : arr.length
    , records_to_show = arr.slice(start, stop)
  ;
  //console.log(arr);
  // display records
  $.each(records_to_show, function(){
    let month = ((this.PubMonth !== null) ? this.PubMonth : null)
      , year = ((this.PubYear !== null) ? this.PubYear : null)
      , pubDate = getPubDate(month, year)
      , fav = null;
    ;

    switch(this.ratingFavor){
      case 0:
        fav = 'neutral';
        break;
      case 1:
        fav = 'favorable';
        break;
      case 2:
        fav = 'unfavorable';
        break;
    }

    place += '<div class="article-element '+fav+'" data-id="'+this.id+'"><span class="article-title">'+this.title+'</span>';
    if(this.Authors !== null) {
      place += '<br/>';
      place += '<span style="font-style:italic;">by</span> <span class="article-author">' + this.Authors + '</span>';
    }
    if(pubDate !== null) {
      place += '<br/>';
      place += '<span class="article-date">' + pubDate + '</span>';
    }
      place +='</div>';
  });
  (arr.length === 0) ? 0 : (start+1)
  // Update UI for visible records shown
  $('.searchResultsInfo').html('Showing '+((arr.length === 0) ? 0 : (start+1))+' to '+stop+' of '+ total_records);

  // Pagination
  let page_x = ''
    , counter = 1
    , pagination = $('.paginating');

  while(counter <= total_pages){
    page_x += '<a href="#" class="search_pagination_page'+((counter === page)?' page_active':'')+'" data-page="'+counter+'">'+counter+'</a>';
    counter++;
  }
  pagination.html(page_x);
  pagination.pagination_listener('.search_pagination_page', 'data-page', 'article');

  return this.append(place);
};

function getPubDate(month, year){
  let pubDate = '';
  if(month !== null && month !== 'No Data Available'){
    month = calendar[parseInt(month)-1];
    pubDate += month;
  }
  if(month !== null && year !== null && month  !== 'No Data Available' && year  !== 'No Data Available'){
    pubDate += ' ';
  }
  if(year !== null && year !== 'No Data Available'){
    pubDate += year;
  }

  if((month === null && year === null) || (month === 'No Data Available' && year === 'No Data Available')){
    pubDate = 'No Date Available';
  }

  return pubDate;
}

$.fn.getFiles = function(arr, page, inc){
  //console.log('True');
  let place = ''
    , total_pages = Math.ceil(arr.length/inc)
    , total_records = arr.length
    , start = ((page*inc)-inc)
    , stop = (((page*inc)-1) < arr.length) ? (page*inc) : arr.length
    , records_to_show = arr.slice(start, stop);

  // display records
  $.each(records_to_show, function(){
    place += '<div class="article-element file-element-row" data-id="'+this.id+'" data-link="'+this.filename+'"><span class="article-title">'+this.display+this.id+'</span>';
    place += '<div class="pull-right">';
    place += '<button class="btn btn-info">View</button>';
    place += '<button class="btn btn-success">Edit</button>';
    place += '<button class="btn btn-danger removeFileBtn" data-target="#removeFileFromSystem" data-toggle="modal" data-id="'+this.id+'"><span class="glyphicon glyphicon-trash"></span></button>';
    place += '</div>';
    place += '</div>';
  });

  // Update UI for visible records shown
  $('.searchResultsInfo').html('Showing '+(start+1)+' to '+stop+' of '+ total_records);

  // Pagination
  let page_x = ''
    , counter = 1
    , pagination = $('.paginating');

  while(counter <= total_pages){
    page_x += '<a href="#" class="search_pagination_page'+((counter === page)?' page_active':'')+'" data-page="'+counter+'">'+counter+'</a>';
    counter++;
  }
  pagination.html(page_x);
  pagination.pagination_listener('.search_pagination_page', 'data-page', 'files');

  return this.append(place);
};

$.fn.getMatCat = function(arr, page, inc){
  //console.log('True');
  let place = ''
    , total_pages = Math.ceil(arr.length/inc)
    , total_records = arr.length
    , start = ((page*inc)-inc)
    , stop = (((page*inc)-1) < arr.length) ? (page*inc) : arr.length
    , records_to_show = arr.slice(start, stop);

  // display records
  $.each(records_to_show, function(){
    place += '<div class="article-element file-element-row" data-id="'+this.id+'" data-title="'+this.desc+'"><span class="article-title">'+this.desc+' ('+this.assoc+')</span>';
    place += '<div class="pull-right">';
    place += '<button class="btn btn-success matcatEditBtn" data-toggle="modal" data-target="#matcatModal" data-id="'+this.id+'">Edit</button>';
    place += '<button class="btn btn-danger matcatDelBtn" data-target="#matcatDelModal" data-toggle="modal" data-id="'+this.id+'" data-assoc="'+this.assoc+'"><span class="glyphicon glyphicon-trash"></span></button>';
    place += '</div>';
    place += '</div>';
  });

  // Update UI for visible records shown
  $('.searchResultsInfo').html('Showing '+(start+1)+' to '+stop+' of '+ total_records);

  // Pagination
  let page_x = ''
    , counter = 1
    , pagination = $('.paginating');

  while(counter <= total_pages){
    page_x += '<a href="#" class="search_pagination_page'+((counter === page)?' page_active':'')+'" data-page="'+counter+'">'+counter+'</a>';
    counter++;
  }
  pagination.html(page_x);
  pagination.pagination_listener('.search_pagination_page', 'data-page', 'files');

  return this.append(place);
};

$.fn.matcatBtnListener = function(){
  let edit = $('.matcatEditBtn')
    , del = $('.matcatDelBtn');

  edit.unbind();
  del.unbind();
  edit.on('click', function(){
    let type = $('#matcattype').val()
      , title = $('#matcatDelModalTitle')
      , id = $(this).attr('data-id')
      , name = $('.article-element[data-id="'+id+'"]').attr('data-title');

    $('#matcatID').val(id);
    $('#matcatName').val(name);
    $('#matcatPushBtn').html('Update');

    if(type === 'matrix'){
      title.html('Update Matrix Name');
    }else{
      title.html('Update Category Name');
    }
  });
  del.on('click', function(){
    let type = $('#matcattype').val()
      , title = $('#matcatDelModalTitle')
      , subtitle = $('#matcatDelSubTitle')
      , id = $(this).attr('data-id')
      , assoc = $(this).attr('data-assoc')
      , name = $('.article-element[data-id="'+id+'"] .article-title').html();

    $('#matcatDelID').val(id);
    $('#matcatDelAssoc').val(assoc);

    $('#matcatPushDelBtn').html('Confirm Delete');
    subtitle.html(name);
    if(type === 'matrix'){
      title.html('Delete Matrix Item');

    }else{
      title.html('Delete Category Item');
    }
  });
};

$.fn.showCollections = function(arr){
  let place = '';
  // display records
  $.each(arr, function(index){
    place += '<div class="collection-element" data-id="'+this.id+'" data-public="'+this.public+'" data-index="'+index+'"><span class="collection-title">'+this.desc+'</span></div>';
  });

  return this.append(place);
};

function create_ratings(stars, favor) {
  let star = ''
    , color ='';
  let a = 0;
  if (stars === 0) {
    star = 'No Rating';
  }else{
    switch(favor){
      case 0:
        color = '<img src="images/greystar.png" class="ratings" />'
        break;

      case 1:
        color = '<img src="images/smallstar.png" class="ratings" />'
        break;

      case 2:
        color = '<img src="images/redstar.png" class="ratings" />'
        break;
    }

    while (a < stars) {
      star += color;
      a++;
    }
  }
  return star;
}

/**
function get_first_comment(comments) {
  let com = '';
  if (comments.length === 0) {
    com = 'No Comments';
  }else{
    com += '<b>'+ comments['user'] +'</b> <span style="font-size: 11px;">'+ comments['date'] +'</span><br />'+comments['comment'];
  }
  return com;
}

function get_comments(comments) {
  console.log(comments);
  let com = '';
  if (comments.length === 0) {
    com = 'No Comments';
  }else{
    $.each(comments, function(){
      com += '<b>'+ this['comment_user_fname'] +' '+ this['comment_user_lname']+'</b> <span style="font-size: 11px;">'+ this['comment_date'] +'</span><br />'+ this['comment_text'];
      com += '<div class="divide"></div>';
    });
  }


  return com;
}
**/

$.fn.modal_listener = function(id, attr, func, opt) {
  $(id).on('click', function(e){
    e.preventDefault();
    if(func === 'articles') {
      //console.log(parseInt($(this).attr(attr)));
      let a = parseInt($(this).attr(attr))
        , meh = $(book).filter(function(i,n){return n.id == a})
        , book_id = meh[0]['id']
        , title = meh[0]['title']
        , author = meh[0]['Authors']
        , summary = meh[0]['LongDescription']
        //, comment_date = new Date(book[a]['comment_date'].date())
        , comment_date = (meh[0]['comment_date'] !== null) ? formatDate(meh[0]['comment_date']['date']) : ''
        , comment_text = meh[0]['comment_text']
        , comment_user = meh[0]['comment_user_fname'] + ' ' + meh[0]['comment_user_lname']
        , comment = ''
        , rating = meh[0]['rating']
        , star_rating = create_ratings(rating, meh[0]['ratingFavor'])
        , month = ((meh[0].PubMonth !== null) ? meh[0].PubMonth : null)
        , year = ((meh[0].PubYear !== null) ? meh[0].PubYear : null)
        , pubDate = getPubDate(month, year)
      ;
      console.log(meh);
      //console.log(meh[0].comment_date.date);

      if (comment_text === null) {
        comment = 'No Comments';
      }else{
        comment += '<b>'+ comment_user +'</b> <span style="font-size: 11px;">'+ comment_date +'</span><br />'+comment_text;
        //console.log(comment_date);
      }
      // Load info
      $('#articleTitle').html(title);
      $('#articleAuthor').html(author);
      $('#articlePublishDate').html(pubDate);
      $('#articleSummary').html(summary);
      $('#articleComments').html(comment);
      $('#ratings').html(star_rating);
      $('#articleID').val(book_id);

      if(opt){
        //console.log($(this).attr('data-article'));
        $('#articleSubID').val($(this).attr('data-article'));
      }

      //Open
      $('#articleDetailModal').modal();

    }else if(func === 'collection'){
      let ls = $('.collection-element')
        , id = $(this).attr('data-id');

      $('#collectionEditToolbar').css('visibility', 'visible');

      ls.removeClass('collection-open');
      $(this).addClass('collection-open');
      loadCollectionArticles(id);

    }
  });
};
//xxxx
function load_articles(term, sort, order){
  let active = ($('#SimpleSearchArea').attr('data-opened') === 'true') ? 'simple' : 'advance';

  //console.log(active);

  if(sort === undefined){
    sort = 'title';
    order = '0';
  }
  //console.log(sort+' '+order);
  //console.log(term);
  if(active === 'simple') {
    if (term !== '') {
      $.ajax({
        url: 'http://www.orasure.com/article-db/php/get_articles.php',
        data: {'term': term, 'filter': sort, 'dir': order},
        dataType: 'json',
        cache: false,
        global: true,
        success: function (data) {
          //console.log(data);
          if (data.status === 'ok') {
            book = data.data;
            if(data.data.length > 0){
              getArticles(1);
              $('.articles').css('padding','0');
            }else{
              $('.articles').html('Nothing found matching your search criteria');
              $('.articles').css('padding','10px');
            }



            //$('.searchResultsInfo').html(postCollectionArticles(data.data));

            let art = $('.collection_articles');
            art.unbind('click');
            art.modal_listener('.collection-articles', 'data-article', 'articles', 'data-article');
          } else {
            toastr.error('Something Happened');
          }
        }
      });
    } else {
      getArticles();
    }
  }else if(active === 'advance'){
    //toastr.info('Advanced Search!');
    //console.log(search);
    let count = 0;
    let types = ''
      , val = ''
      , subsearch = []
      , vals = {};

    search = [];
    $.each($('.searchCatRow'), function(){
      if($(this).children('.searchCats').val() !== 'x') {
        let name = searchable[$(this).children('.searchCats').val()]['column'];
        count++;
        subsearch = [];
        $.each($(this).siblings('.addonsearch'), function(){

          if($(this).children('.searchcatval').length === 1){
            types = $(this).children('.searchcatval').attr('data-id');
            val = $(this).children('.searchcatval').val();
            if(val !== '') {
              vals = {[types]: val};
              subsearch.push(vals);
            }
          }
        });
        search.push({'name':name,subsearch});
      }

    });
    //console.log(search);
    if(count < 1){
      toastr.error('Enter searchable values');
    }else{
      //search
      //run_search(0);

      $.ajax({
        url: 'http://www.orasure.com/article-db/php/advanced_search.php',
        data: {
          'data': search, 'filter': sort, 'dir': order
        },
        dataType: 'json',
        cache: false,
        global: true,
        success: function (data) {
          console.log(data);
          if (data.status === 'ok') {
            book = data.data;
            if(data.data.length > 0){
              getArticles(1);
              $('.articles').css('padding','0');
            }else{
              $('.articles').html('Nothing found matching your search criteria');
              $('.articles').css('padding','10px');
            }
            //$('.searchResultsInfo').html(postCollectionArticles(data.data));

            let art = $('.collection_articles');
            art.unbind('click');
            art.modal_listener('.collection-articles', 'data-article', 'articles', 'data-article');
          } else {
            toastr.error('Something Happened');
          }
        }
      });

    }
  }
}

function loadCollectionArticles(id){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_my_collections_articles.php',
    data: {'id' : id},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      //console.log(data.data);
      if (data.status === 'ok') {
        book = data.data;

        $('#collections-table').html(postCollectionArticles(data.data));

        let art = $('.collection_articles');
        art.unbind('click');
        art.modal_listener('.collection-articles', 'data-id', 'articles', 'data-article');
      }else{
        toastr.error('Something Happened');
      }
    }
  });
}

function postCollectionArticles(arr){
  let table = '<table class="collection_articles">'
  if(arr.length  > 0) {
    $.each(arr, function (index) {
      if(this.Authors === null){this.Authors = 'No Author(s) Available';}
      table += '<tr class="collection-articles" data-id="' + this.id + '" data-article="' + index + '"><td>' + this.title + '<br><i>' + this.Authors + '</i></td></tr>';
    });
  }else{
    table += '<tr><td>No articles have been added</td></tr>';
  }
  table += '</table>';

  return table;
}

$.fn.pagination_listener = function(id, attr, func) {
  $(id).on('click', function(e){
    e.preventDefault();
    let el = $(this);
    if(!el.hasClass('page_active')){
      switch(func){
        case 'files':
          getFiles(el.attr(attr));
          break;

        default:
          getArticles(el.attr(attr));
      }
    }
  });
};

// Globals
let permission = localStorage.getItem('role');

// Functions
function getArticles(page){
  let term = globalSearchTerm.val()
    , t = $('.articles')
    , inc = $('#page_inc').val()
    , copy = book.slice(0)
    , active = ($('#SimpleSearchArea').attr('data-opened') === 'true') ? 'simple' : 'advance'
  ;

  if(term !== '' || active === 'advance'){
    t.html('');
    t.createArticles(copy, parseInt(page), parseInt(inc));
    t.modal_listener('.article-element', 'data-id', 'articles');
  }else{
    t.html('<p>Search for something....</p>');
    $('.paginating').html('');
    $('.searchResultsInfo').html('');
  }
}

function getFiles(page){
  let t = file_set
    , inc = '15'
    , copy = file_list.slice(0);

    t.html('');
    t.getFiles(copy, parseInt(page), parseInt(inc));
    //t.modal_listener('.article-element', 'data-id', 'articles');
}

function getCollections(id){
  let term = globalSearchTerm.val()
    , t = $('.collections')
    , copy = collections.slice(0);

  if(term !== ''){
    t.html('');
    t.showCollections(copy);
    t.modal_listener('.collection-element', 'data-id', 'collection');

  }else{
    t.html('Search for something....');
    $('.paginating').html('');
    $('.searchResultsInfo').html('');
  }

  if(id !== undefined) {
    $('.collection-element[data-id="' + id + '"]').addClass('collection-open');
  }
  collectionDDL.html(createCollectionsShortcut(collections));
  add_bucket_listener();
}

function createCollectionsShortcut(arr){
  let post = '';

  post += '<li>';
  post += '<a href="#" id="createAndAddCollection" class="new_bucket" data-target="#newCollection" data-toggle="modal">New Collection</a>';
  post += '</li>';
  post += '<li class="divider"></li>';
  $.each(arr, function(){
    post += '<li>';
    post += '<a href="#" data-bucket-id="'+this.id+'" class="add_bucket">'+this.desc+'</a>';
    post += '</li>';
  });

  return post;
}

// Run Search
function run_search(num){
  let term = globalSearchTerm.val().trim();

  // Commit search term to memory
  localStorage.setItem('searchTerm', term);

  //getArticles(1);
  if(term){
    load_articles(term);
  }else{
    //toastr.error('You must submit a search term');
    $('.articles').html('You must submit a search term.');
    $('.articles').css('padding','10px');
  }

}

function toggle_permissions(permission) {
  let articles = $('#navUploadArticles')
    , account = $('#navUsers')
    , matcat = $('#navMatrix')
    , toolbar = $('#adminToolBar');
  $('.dev').css('display','none');
  $('.editor').css('display','none');

  switch (parseInt(permission)) {
    case(1):
      // Reader
      articles.remove();
      account.remove();
      matcat.remove();
      toolbar.remove();
      $('.dev').remove();
      $('.editor').remove();
      // Remove New/Edit Users
      // Remove Edit Button
      break;

    case(2):
      // Editor
      account.remove();
      $('.editor').css('display','inline-block');
      $('#deleteMode').remove();
      if($('#curPage').attr('data-page') == 'articleview'){
        toolbar.css('display', 'block');

      }
      // Remove New/Edit Users
      break;

    case(3):
      // Admin
      //articles.remove();
      //account.remove();
      //matcat.remove();
      $('.editor').css('display','inline-block');
      if($('#curPage').attr('data-page') == 'articleview'){
        toolbar.css('display', 'block');
      }
      break;

    case(4):
      // Dev
      $('.dev').css('display','inline-block');
      $('.editor').css('display','inline-block');
      if($('#curPage').attr('data-page') == 'articleview'){
        toolbar.css('display', 'block');
      }
  }
}

function loadMatCat(){
  let tar = $('#matcat')
    , type = $('#matcattype').val()
    , matcat = $('#navMatrix')
  ;
    //, matcatEditBtn = $('.matcatEditBtn');

  tar.html('');
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_mat_cat.php',
    data: {
      'type': type
    },
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data){
      if(data.status === 'ok'){
        //console.log(data.data);
        matcat = data.data;
        tar.getMatCat(matcat, 1, 15);
        //matcatEditBtn.unbind();
       tar.matcatBtnListener();
      }else{
        toastr.error('Error Happened');
      }
    }
  });

/**
  removeFileBtn.unbind('click');
  removeFileBtn.on('click', function(){
    let attr = parseInt($(this).attr('data-id'))-1;
    $('#fileConnections').html('');
    optionalFileDelete.css('display', 'block');
    if(file_list[attr]['associated'] !== null) {
      $.each(file_list[attr]['associated'], function () {
        $('#fileConnections').append(this.title + '<br />');
      });
    }else{
      optionalFileDelete.css('display', 'none');
    }
  });**/
}





$('#advanceSearchBtn').on('click', function(e){
  e.preventDefault();
});

$('#loadArticle').on('click', function(e){
  e.preventDefault();
  let att = $(this).attr('data-new')
    , id = $('#articleID').val();

  if(att === 'new'){
    window.open('article.html?id='+id);
  }else {
    window.location = 'article.html?id=' + id;
  }
});

$('.searchType').on('click', function(e){
  e.preventDefault();
  let open = $(this).attr('data-open')
    , close = $(this).attr('data-hide');

  $(open).css('display', 'block');
  $(open).attr('data-opened', true);
  $(close).css('display', 'none');
  $(close).attr('data-opened', false);

  // reset sorting
  /**
  if(open === '#AdvancedSearch'){
    $('#simpleSort').css('display','none');
  }else{
    $('#simpleSort').css('display','block');
  }
   **/
});

$(document).ready(function () {
  $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).parent().siblings().removeClass('open');
    $(this).parent().toggleClass('open');
  });

  // Check for cookies
  let dt = new Date();
  dt.setSeconds(dt.getSeconds() + 60);
  document.cookie = 'cookietest=1; expires=' + dt.toGMTString();
  let cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
  if(!cookiesEnabled){
    //cookies are not enabled
    alert('You must enable cookies to use this site.');
  }
});

// login

$('#loginForm').formValidation({
  // I am validating Bootstrap form
  framework: 'bootstrap',

  // Feedback icons
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  live: 'disabled',
  // List of fields and their validation rules
  fields: {
    email: {
      validators: {
        notEmpty: {
          message: 'Email is required and cannot be empty'
        },
        emailAddress: {
          message: 'The value is not a valid email address'
        }
      }
    },
    pass: {
      validators: {
        notEmpty: {
          message: 'Password is required and cannot be empty'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e, data) {
    // Prevent form submission
    e.preventDefault();

    let user = $('#email').val()
      , pass = $('#pass').val();

    $.ajax({
        url: 'http://www.orasure.com/article-db/php/login.php',
        data: {
            'user': user
            , 'pass' : pass
        },
        dataType: 'json',
        cache: false,
        global:false,
        success: function(data){
          //console.log(data);
            if(data.status === 'yes'){
              localStorage.setItem('logged', 'yes');
              localStorage.setItem('user_id', data.data[0]['user_id']);
              localStorage.setItem('role', data.data[0]['role']);
              localStorage.setItem('email', data.data[0]['email']);

              var date = new Date();
              //date.setMinutes(date.getMinutes() + 2);
              date.setDate(date.getDate() + 1);
              localStorage.setItem('session-exp', date);

              if(localStorage.getItem('redirect') === 'true'){
                let art = parseInt(localStorage.getItem('redirect-id'));
                localStorage.removeItem('redirect');
                localStorage.removeItem('redirect-id');
                window.location.href = 'article.html?id='+art;
              }else{
                window.location.href = 'search.html';
              }
            }else{
                toastr.error('Login Failed');
                $('#commence_login').removeAttr('disabled');
                $('#commence_login').removeClass('disabled');
                $('#pass').val('');
                $('#pass').focus();
            }
        }
    });
  });

$('#articleDetailModal').on('shown', function () {
  $('body').on('click', function(e) {
    e.stopPropagation();
    alert('YES');
  });
});

$('#removeArticleFromCollection').on('click', () => {

  let id = parseInt($('#articleID').val())
    , article = $('#articleSubID').val()
    , bucket = $('.collection-open').attr('data-id');

  $.ajax({
    url: 'http://www.orasure.com/article-db/php/delete-article-from-collection.php',
    data: {'article' : id, 'bucket' : bucket},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      if (data.status === 'ok') {
        toastr.success('Article Removed');
        $('#articleDetailModal').modal('hide');
        $('#collections-table').html(postCollectionArticles(data.data));
      }else{
        toastr.error('Something Happened');
      }
    }
  });
});

if(file_set.length){
  let tar = file_set
    , files = file_list
    , post = ''
    , removeFileBtn = $('.removeFileBtn')
    , optionalFileDelete = $('.optionalFileDelete');

  tar.html('');
  //$.each(files, function(){
  //  tar.append('<div class="file-item" data-id="'+this.id+'"><span class="file-title">'+this.display + this.id + '</span></div>')
  //});

  tar.getFiles(files, 1, 15);
  removeFileBtn.unbind('click');
  removeFileBtn.on('click', function(){
    let attr = parseInt($(this).attr('data-id'))-1;
    //console.log(file_list[attr]['associated']);
    $('#fileConnections').html('');
    optionalFileDelete.css('display', 'block');
    if(file_list[attr]['associated'] !== null) {
      $.each(file_list[attr]['associated'], function () {
        $('#fileConnections').append(this.title + '<br />');
      });
    }else{
      optionalFileDelete.css('display', 'none');
    }
  });
}

if($('#matcat').length) {
  loadMatCat();
}

$('input[type=file]').change(function(){
  let t = $(this).val();
  let labelText = 'File : ' + t.substr(12, t.length);
  $(this).prev('label').text(labelText);
});

if(category.length){
  let cat = category
    , paste = '<div class="col-xs-12"><span id="alertDayIcon"></span></div>';

  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_mat_cat.php',
    data: {
      'type': 'category'
    },
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data){
      if(data.status === 'ok'){
        $.each(data.data, function(){
          paste += '<div class="col-xs-12 col-sm-6 col-md-4">';
          paste += '<label>';
          paste += '<input type="checkbox" name="category" class="category" value="'+this.id+'" id="cat-1" /></label>';
          paste += '&nbsp;'+this.desc+'</div>';
        });
        $.when(
          cat.html(paste)
          //console.log('Main')
        ).then(
          initForm()
          //console.log('init')
        )
      }else{
        toastr.error('Could not load categories.');
      }
    }});
}

let matrices = $('#matrices');
if(matrices.length){
  let paste = '<option value="xx">Select a Matrix</option>';

  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_mat_cat.php',
    data: {
      'type': 'matrix'
    },
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data){
      if(data.status === 'ok'){
        $.each(data.data, function(){
          paste += '<option value="'+this.id+'" data-val="'+this.desc+'">'+this.desc+'</option>';
        });

        matrices.html(paste);
      }else{
        toastr.error('Could not load matrices.');
      }
    }});
}

$('#addDataSet').on('click', function(){
  let tar = artstruc['study_details']
    , idx = $('#matrix-index')
    , matr = $('#matrices')
    , matr_disp = $('#matrices option:selected').attr('data-val')
    , products = $('#data-set-products')
    , sens = $('#data-set-sensitivity')
    , sens_note = $('#data-set-sensitivity-notes')
    , spec = $('#data-set-specificity')
    , spec_note = $('#data-set-specificity-notes')
    , data_matrix = (matr.val() !== 'xx') ? matr_disp : null
    , data_products = (products.val() !== '') ? products.val() : null
    , data_sens = (sens.val() !== '') ? sens.val() : null
    , data_sens_note = (sens_note.val() !== '') ? sens_note.val() : null
    , data_spec = (spec.val() !== '') ? spec.val() : null
    , data_spec_note = (spec_note.val() !== '') ? spec_note.val() : null
    , set = {'id':matr.val(), 'matrix':data_matrix, 'product':data_products, 'sensitivity':data_sens, 'sensitivity_note':data_sens_note, 'specificity':data_spec, 'specificity_note':data_spec_note}
  ;
  //console.log(a);

  if(idx.val() !== 'new') {
    let id = parseInt(idx.val());
    tar[id]['id'] = matr.val();
    tar[id]['matrix'] = data_matrix;
    tar[id]['product'] = data_products;
    tar[id]['sensitivity'] = data_sens;
    tar[id]['sensitivity_note'] = data_sens_note;
    tar[id]['specificity'] = data_spec;
    tar[id]['specificity_note'] = data_spec_note;

    let canvas = $('#datasets');
    canvas.html(postMatrixData(tar));
    matrixDataEditListener();
    toastr.success('Data Updated.');
  }else {
    console.log(set);
    console.log(artstruc);
    // Push to array
    if (data_matrix !== null) {
      if (tar.push(set)) {
        toastr.success('Successfully added dataset');
        // Clean form
        matr.val('xx');
        products.val('');
        sens.val('');
        sens_note.val('');
        spec.val('');
        spec_note.val('');

        // Post to screen
        let canvas = $('#datasets');

        canvas.html(postMatrixData(tar));
        matrixDataEditListener();
      } else {
        toastr.error('Failed to add dataset');
      }
    } else {
      toastr.error('Complete the form!');
    }
  }
  //console.log(artstruc);
});

function postMatrixData(arr){
  let post = '<br />';
  $.each(arr, function (index) {
    post += '<table class="dataset-table-data matrix-data">';
    post += '<tr><td>Matrix</td><td colspan="2">' + this['matrix'] + '</td><td rowspan="4" class="tools"><button type="button" class="btn btn-success btn-block addDataSetEdit" data-index="'+index+'">Edit</button><br /><button type="button" class="btn btn-danger btn-block addDataSetDelete" data-index="'+index+'"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
    post += '<tr><td>Product(s)</td><td colspan="2">' + ((this['product'] !== null) ? this['product'] : '') + '</td></tr>';
    post += '<tr><td>Sensitivity</td><td class="percent">' + ((this['sensitivity'] !== null) ? parseFloat(this['sensitivity'])+'%' : '') + '</td><td>' + ((this['sensitivity_note'] !== null) ? this['sensitivity_note'] : '') + '</td></tr>';
    post += '<tr><td>Specificity</td><td class="percent">' + ((this['specificity'] !== null) ? parseFloat(this['specificity'])+'%' : '') + '</td><td>' + ((this['specificity_note'] !== null) ? this['specificity_note'] : '') + '</td></tr>';
    post += '</table>';
  });
  return post;
}

$('#newMatrixData').on('click', function(){
  $('#matrix-index').val('new');
  $('#matrices').val('xx');
  $('#data-set-products').val('');
  $('#data-set-sensitivity').val('');
  $('#data-set-sensitivity-notes').val('');
  $('#data-set-specificity').val('');
  $('#data-set-specificity-notes').val('');
  $('#addDataSet').html('Add');
});

function matrixDataEditListener(){

  // Edit
  $('.addDataSetEdit').unbind();
  $('.addDataSetEdit').on('click', function(){
    let id = $(this).attr('data-index')
      , tar = artstruc['study_details']
      , matr = tar[id]['id']
      , products = tar[id]['product']
      , sens = tar[id]['sensitivity']
      , sens_note = tar[id]['sensitivity_note']
      , spec = tar[id]['specificity']
      , spec_note = tar[id]['specificity_note']
    ;
    $('#matrix-index').val(id);
    $('#matrices').val(matr);
    $('#data-set-products').val(products);
    $('#data-set-sensitivity').val(sens);
    $('#data-set-sensitivity-notes').val(sens_note);
    $('#data-set-specificity').val(spec);
    $('#data-set-specificity-notes').val(spec_note);

    $('#addDataSet').html('Update');
    $('#datasetModal').modal('show');
  });

  // Delete
  $('.addDataSetDelete').unbind();
  $('.addDataSetDelete').on('click', function(){
    let id = $(this).attr('data-index')
      , j_edit = []
    ;

    $.each(artstruc['study_details'], function(index){
      if(index != id){
        j_edit.push(this)
      }
    });

    artstruc['study_details'] = j_edit;
    let canvas = $('#datasets');

    canvas.html(postMatrixData(artstruc['study_details']));
    matrixDataEditListener();

  });
}

$('#addPatientDataSet').on('click', function(){
  let tar = artstruc.patient_details
    , idx = $('#patient-set-index')
    , count = $('#patient-set-count')
    , details = $('#patient-set-details')
    , det = ((details.val() !== '') ? details.val() : null)
    , set = {'count':count.val(), 'desc':det}
  ;
  //console.log(tar);
  // New or edit
  if(idx.val() !== 'new') {
    // Update

    tar[parseInt(idx.val())]['count'] = count.val();
    tar[parseInt(idx.val())]['desc'] = det;
    let canvas = $('#patientData');

    canvas.html(postPatientData(tar));
    patientDataEditListener();
  }else{
    // New
    // Push to array
    if (count.val() !== null) {
      if (tar.push(set)) {
        toastr.success('Successfully added dataset');
        // Clean form
        count.val('');
        details.val('');
        // Post to screen

        let canvas = $('#patientData');

        canvas.html(postPatientData(tar));
        patientDataEditListener();
      } else {
        toastr.error('Failed to add dataset');
      }
    } else {
      toastr.error('Complete the form!');
    }
  }
});

function postPatientData(arr){
  let post = '<br />';
  $.each(arr, function (index) {
    let desc = ((this.desc !== null) ? this.desc : '');
    post += '<table class="dataset-table-data patient-data">';
    post += '<tr><td>Count</td><td data-count="'+this.count+'">' + this.count + '</td><td rowspan="2" class="tools"><button type="button" class="btn btn-success btn-block addPatientDataSetEdit" data-id="'+index+'">Edit</button><br /><button type="button" class="btn btn-danger btn-block addPatientDataSetDelete" data-index="'+index+'"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
    post += '<tr><td>Description</td><td data-desc="'+desc+'">' + desc + '</td></tr>';
    post += '</table>';
  });
  return post;
}

$('#newPatientData').on('click', function(){
  $('#patient-set-index').val('new');
  $('#patient-set-count').val('');
  $('#patient-set-details').val('');
  $('#addPatientDataSet').html('Add');
});

function patientDataEditListener(){
  $('.addPatientDataSetEdit').unbind();
  $('.addPatientDataSetEdit').on('click', function(){

  let id = $(this).attr('data-id')
    , tar = artstruc['patient_details']
    , count = tar[id]['count']
    , desc = tar[id]['desc']
  ;
    $('#patient-set-index').val(id);
    $('#patient-set-count').val(count);
    $('#patient-set-details').val(desc);
    $('#addPatientDataSet').html('Update');
    $('#patientDataModal').modal('show');

  });

  // Delete
  $('.addPatientDataSetDelete').unbind();
  $('.addPatientDataSetDelete').on('click', function(){
    let id = $(this).attr('data-index')
      , j_edit = []
      , list = artstruc['patient_details']
    ;

    $.each(list, function(index){
      console.log(id);
      if(index != id){
        j_edit.push(this)
      }
    });

    artstruc.patient_details = j_edit;

    let canvas = $('#patientData');

    canvas.html(postPatientData(artstruc.patient_details));
    patientDataEditListener();
  });
}


// On-Loads
if(localStorage.getItem('searchTerm')){
  globalSearchTerm.val(localStorage.getItem('searchTerm'));
  $('#searchCategory').val(localStorage.getItem('searchCategory'));
}

// Listeners
$('#runSearch').on('click', function(e){
  e.preventDefault();
  run_search();
});



$('#storageReset').on('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('searchTerm');
  localStorage.removeItem('searchCategory');
  globalSearchTerm.val('');
  $('#searchCategory').val('any');
  $('.paginating').html('');
  $('.searchResultsInfo').html('');
  getArticles();
});

$('#searchOptions').on('click', function(e){
  e.preventDefault();
  $('#searchOptionsModal').modal();
});

$('.restartBtn').on('click', function(e){
  e.preventDefault();
  $('#restartCheck').modal();
});

// Nav listeners
$('#navLogout').on('click', function(e){
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
});

$('.file_btn').on('click', function(e){
  e.preventDefault();

  let type = $(this).attr('data-type');

  if(type === 'file'){
    //  create file input
    $('#file_upload_template').clone().appendTo('#file_canvas');
  }
  if(type === 'url'){
    // create url input
    $('#url_upload_template').clone().appendTo('#file_canvas');
  }
});

function add_bucket_listener() {
  $('.add_bucket').unbind();
  $('.add_bucket').on('click', function (e) {
    e.preventDefault();

    let bucket = $(this).attr('data-bucket-id')
      , bucket_display = $(this).html()
      , art_id = $('#articleID').val();
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/add-article-to-collection.php',
      data: {'bucket' : bucket, 'article' : art_id},
      dataType: 'json',
      cache: false,
      global:false,
      success: function(data){
        console.log(data);
        if(data.status === 'ok'){
          toastr.success('Successfully added to ' + bucket_display);
        }else if(data.status === 'exists') {
          toastr.warning('The Article already exists in this collection.');
        }else{
          toastr.error('Something bad happened.');
        }
      }});

  });
}

// login permissions
// 1 - Viewer
// 2 - Contributor
// 2 - Master
// 4 - System Administrator

// From Book.js

let search_matrix = []
  , search_category = []
  , search_collections = []
;

function preload_search(){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/search_preload.php',
    data: {
      'id': localStorage.getItem('user_id')
    },
    dataType: 'json',
    cache: false,
    global: true,
    success: function (data) {
      if (data.status === 'ok') {
        //console.log(data.data);
        search_matrix = data.data.matrix;
        search_category = data.data.category;
        search_collections = data.data.collections;
        //toastr.success('Preload Successful');
      }else{
        toastr.error('Preload Failed.');
      }
    }
  });
}


function load_cats(){
  let el = $('.searchCats');
  $.each(searchable, function(){
    $('.searchCats[data-loaded="no"]').append('<option value="'+this['id']+'" data-name="'+this['display']+'">'+this['display']+'</option>');
  });
  el.attr('data-loaded', 'yes');

  el.unbind('change');
  el.on('change', function(){
    let el = $('.searchCats')
      , idx = el.index(this)
      , target = $('.searchCatRow')
      , target_id = target[idx]
      , id = parseInt($(this).val())
      , post = '';

    //console.log(idx);

    $(this).parent().siblings('.addonsearch').remove();
    if($(this).val() !== 'x') {
      $.each(searchable[id]['fields'], function () {
        switch (this['kind']) {
          case 'input':
            post += '<div class="col-xs-' + this['width'] + ' addonsearch"><input type="text" data-id="'+this['type-id']+'" class="form-control box-style2 searchcatval" /></div>';
            break;

          case 'select':
            post += '<div class="col-xs-' + this['width'] + ' addonsearch">';
            post += '<select data-id="'+this['type-id']+'" class="form-control box-style2 searchcatval">';
            $.each(this['options'], function(){
              if(this['item']) {
                if (this['value']) {
                  post += '<option value="' + this['value'] + '">' + this['item'] + '</option>';
                } else {
                  post += '<option value="' + this['item'] + '">' + this['item'] + '</option>';
                }
              }else{
                switch(this['use']){
                  case 'search_matrix':
                    $.each(search_matrix, function(){
                      post += '<option value="' + this['MatrixID'] + '">' + this['Description'] + '</option>';
                    });
                    break;

                  case 'search_category':
                    $.each(search_category, function(){
                      post += '<option value="' + this['CategoryID'] + '">' + this['Description'] + '</option>';
                    });
                    break;

                  case 'search_collections':
                    $.each(search_collections, function(){
                      post += '<option value="' + this['BucketID'] + '">' + this['Description'] + '</option>';
                    });
                    break;
                }
              }

            });
            post += '</select></div>';
            break;
        }
      });
      post += '<div class="col-xs-1 addonsearch" style="text-align:right;"><span class="input-group-btn"><button type="button" class="btn btn-danger catdelete"><span style="top: 2px;" class="glyphicon glyphicon-trash"></span></button></span></div>';
      $(post).insertAfter(target_id);
    }

    // delete listener
    create_delete_listener();
  });
}

if(typeof searchable !== 'undefined'){
  load_cats();
}

function create_delete_listener(){
  let el = $('.catdelete');
  el.unbind('click');
  el.on('click', function() {
    //var idx = $('.catdelete').index(this);
    let idx = $(this).closest('.cat').index('.cat');
    $('.cat')[(idx)].remove();
  });
}

function create_adv_search(){
  let post = '';

  post += '<div style="padding-left :0; padding-right: 0; margin-bottom: 10px;" class="row cat">';
  post += '<div class="col-xs-12">';
  post += '<div class="row">';
  post += '<div class="col-xs-3 searchCatRow">';
  post += '<select data-loaded="no" class="form-control box-style2 searchCats">';
  post += '<option value="x" data-id="0">Please Choose</option>';
  post += '</select></div></div></div></div>';
  return post;
}

function add_new_line(){
  let hold = 'yes';
  $.each($('.searchCats'), function(){
    if($(this).val() === 'x'){
      hold = 'no';
    }
  });

  if(hold !== 'no') {
    let post = create_adv_search();

    //console.log(post);
    $(post).insertBefore('#bottomAdvSearch');
    load_cats();
    create_delete_listener();
  }else{
    toastr.error('Unable to add new filter while unused filters are present.');
  }
}

$('#runAdvancedSearch').on('click', function(){
  load_articles();
});

function createUser(){
  let type = $('#user-name')
    , fname = $('#user_first_name')
    , lname = $('#user_last_name')
    , email = $('#user_email')
    , role = $('#user-role')
    , pass = $('#user_pass')
    , pass2 = $('#user_retype_pass');

  if(type.val() === 'new'){
    // New user

    if(pass.val() === pass2.val() && (pass.val() !== '' && pass2.val() !== '' && fname.val() !== '' && lname.val() !== '' && email.val() !== '' && role.val() !== 'xx')){

      //console.log(fname+' / '+lname+' / '+email+' / '+role+' / '+pass+' / '+pass2)
      $.ajax({
        url: 'http://www.orasure.com/article-db/php/create-user-new.php',
        data: {
          'email': email.val()
          , 'pass' : pass.val()
          , 'fname' : fname.val()
          , 'lname' : lname.val()
          , 'role' : role.val()
        },
        dataType: 'json',
        cache: false,
        global:false,
        success: function(data){
          if(data.status === 'ok'){
            toastr.success('New user has been created.');
            // update user_list
            globalUserList = data.data;
            $('#user-name').postUsers();
            type.val('new');
            fname.val('');
            lname.val('');
            email.val('');
            role.val('xx');
            pass.val('');
            pass2.val('');

          }else{
            toastr.error('Nomination failed to submit.');
          }
        }});
    }else{
      if(pass.val() !== pass2.val()){
        toastr.error('Passwords must match!');
      }
      if(pass.val() === '' || pass2.val() === ''){
        toastr.error('Passwords cannot be blank!');
      }
      if(role.val() === 'xx'){
        toastr.error('You must select a role!');
      }
      if(email.val() === ''){
        toastr.error('Email cannot be empty!');
      }
      if(lname.val() === ''){
        toastr.error('Last name cannot be empty!');
      }
      if(fname.val() === ''){
        toastr.error('First name cannot be empty!');
      }

      pass.val('');
      pass2.val('');
    }

  // Not New then Update
  }else{
    // Update
    let id = type.val();
    if(pass.val() === '' && pass2.val() === '') {
      $.ajax({
        url: 'http://www.orasure.com/article-db/php/create-user-update-nopass.php',
        data: {
            'id': type.val()
          ,'email': email.val()
          , 'fname': fname.val()
          , 'lname': lname.val()
          , 'role': role.val()
        },
        dataType: 'json',
        cache: false,
        global: true,
        success: function (data) {
          if (data.status === 'ok') {
            toastr.success('User updated.');
            // update user_list
            globalUserList = data.data;
            $('#user-name').postUsers().val(id);
            show_user_data();

          }else{
            toastr.error('User failed to update.');
          }
        }
      });
    }else if(pass.val() !== '' && pass2.val() !== '' && pass.val() === pass2.val()){
      // update with pass
      $.ajax({
        url: 'http://www.orasure.com/article-db/php/create-user-update-withpass.php',
        data: {
            'id': type.val()
          , 'email': email.val()
          , 'pass':pass.val()
          , 'fname': fname.val()
          , 'lname': lname.val()
          , 'role': role.val()
        },
        dataType: 'json',
        cache: false,
        global: true,
        success: function (data) {
          if (data.status === 'ok') {
            toastr.success('User updated.');
            // update user_list
            globalUserList = data.data;
            $('#user-name').postUsers().val(type.val);
            show_user_data();

          } else {
            toastr.error('User failed to update.');
          }
        }
      });
    }else{
      // has errors
      toastr.error('There are errors');
    }
  }
}

$('#createUserBtn').on('click', function(){
  createUser();
});

if(user_name.length){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/create-user-load.php',
    data: {},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data){
      if(data.status === 'ok'){
        //toastr.success('Loaded');
        // update user_list
        //console.log(data.data);
        globalUserList = data.data;
        $('#user-name').postUsers();
      }else{
        toastr.error('Failed to load.');
      }
    }});
}

user_name.on('change', function(){
  show_user_data();
});

function show_user_data(){
  let fname = $('#user_first_name')
    , lname = $('#user_last_name')
    , email = $('#user_email')
    , role = $('#user-role')
    , pass = $('#user_pass')
    , pass2 = $('#user_retype_pass')
    , users = globalUserList
    , createBtn = $('#createUserBtn')
    , statusToggle = $('#statusToggle')
    , statusToggleBtn = $('#statusToggleBtn')
    , statusText = $('#statusText')
    , passNote = $('.pass-note')
  ;

  if($('#user-name').val() !== 'new'){
    //$('#userDelete').css('display','block');
    createBtn.html('Update');

    let idx = $('#user-name option:selected').attr('data-id')
      , status = users[idx]['active'];
    fname.val(users[idx]['fname']);
    lname.val(users[idx]['lname']);
    email.val(users[idx]['email']);
    role.val(users[idx]['role']);
    statusToggle.css('display', 'block');
    passNote.css('display','block');
    if(parseInt(status) === 1){
      statusToggleBtn.removeClass('btn-success');
      statusToggleBtn.addClass('btn-danger');
      statusToggleBtn.html('Deactivate');
      statusText.html('Active');
      statusText.css({'background-color':'#5cb85c', 'display': 'block'});
      statusToggleBtn.attr('data-id', status);

    }else{
      statusToggleBtn.removeClass('btn-danger');
      statusToggleBtn.addClass('btn-success');
      statusToggleBtn.html('Activate');
      statusText.html('Inactive');
      statusText.css({'background-color':'#d9534f', 'display': 'block'});
      statusToggleBtn.attr('data-id', status);

    }
  }else{
    $('#userDelete').css('display','none');
    createBtn.html('Create');
    fname.val('');
    lname.val('');
    email.val('');
    pass.val('');
    pass2.val('');
    role.val('new');
    statusToggle.css('display', 'none');
    statusText.css('display', 'none');
    passNote.css('display','none');
  }
}

$('#statusToggleBtn').on('click', function(){
  let status = (parseInt($(this).attr('data-id')) === 1) ? 0 : 1
    , u_id = $('#user-name').val()
    , idx = $('#user-name option:selected').attr('data-id')
    , statusToggleBtn = $('#statusToggleBtn')
    , statusText = $('#statusText');
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/create-user-toggle-status.php',
    data: {'id' : u_id, 'status': status},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data){
      if(data.status === 'ok'){
        if(status === 1){
          statusToggleBtn.removeClass('btn-success');
          statusToggleBtn.addClass('btn-danger');
          statusToggleBtn.html('Deactivate');
          statusText.html('Active');
          statusText.css({'background-color':'#5cb85c', 'display': 'block'});
          statusToggleBtn.attr('data-id', status);
          toastr.success(' User successfully Activated');
        }else{
          statusToggleBtn.removeClass('btn-danger');
          statusToggleBtn.addClass('btn-success');
          statusToggleBtn.html('Activate');
          statusText.html('Inactive');
          statusText.css({'background-color':'#d9534f', 'display': 'block'});
          statusToggleBtn.attr('data-id', status);
          toastr.success('User successfully Dectivated');
        }
        globalUserList = data.data;
        $('#user-name').postUsers().val(u_id);
        //$('#user-name').val(u_id);
        show_user_data();

      }else{
        toastr.error('Unable to complete the action at this time.');
      }
    }});
});

let saveOwnAccount = $('#saveOwnAccount');


$('#myAccount').formValidation({
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
    fname: {
      validators: {
        notEmpty: {
          message: 'First Name is required and cannot be empty'
        },
        regexp: {
          regexp: /^[a-zA-Z-]+$/,
          message: 'Last Name can only consist of alphabetical characters'
        }
      }
    },
    lname: {
      validators: {
        notEmpty: {
          message: 'Last Name is required and cannot be empty'
        },
        regexp: {
          regexp: /^[a-zA-Z-]+$/,
          message: 'Last Name can only consist of alphabetical characters'
        }
      }
    },
    email: {
      validators: {
        emailAddress: {
          message: 'This is not a valid email address format'
        },
        notEmpty: {
          message: 'Email is required and cannot be empty'
        }
      }
    },
    password: {
      validators: {
        stringLength: {
          min: 5,
          message: 'Title must be at least 5 characters long'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9-%$#@!]+$/,
          message: 'Title can only consist of alphanumeric and ( % $ # @ !)'
        }
      }
    },
    retype: {
      validators: {
        stringLength: {
          min: 5,
          message: 'Title must be at least 5 characters long'
        },
        regexp: {
          regexp: /^[a-zA-Z0-9-%$#@!]+$/,
          message: 'Title can only consist of alphanumeric and ( % $ # @ !)'
        }
      }
    }
  }
})
  .on('success.form.fv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // commit
    let id = localStorage.getItem('user_id')
      , fname = $('#user_first_name')
      , lname = $('#user_last_name')
      , email = $('#user_email')
      , pass = $('#user_pass').val()
      , retype = $('#user_retype_pass').val()
      , data = {'id':id, 'fname':fname.val(), 'lname':lname.val(), 'email':email.val(), 'pass':pass};

    if(pass === '' && retype === ''){
      // Assume No Pass Update
      toastr.success('Update Without Pass');
      $.ajax({
        url: 'http://www.orasure.com/article-db/php/update_my_data-nopass.php',
        data: data,
        dataType: 'json',
        cache: false,
        global:false,
        success: function(data) {
          if (data.status === 'ok') {
            let field = $('#myAccount');
            $('#user_first_name').val(data.data[0]['fname']);
            $('#user_last_name').val(data.data[0]['lname']);
            $('#user_email').val(data.data[0]['email']);
            field.formValidation('revalidateField', 'fname');
            field.formValidation('revalidateField', 'lname');
            field.formValidation('revalidateField', 'email');
            toastr.success('Data was successfully updated!');
          }else{
            toastr.error('Something Bad Happened!');
          }
        }
      });
    }else{
      // Assume Pass Update
      //Check Pass
      if(pass === retype){
        // update with pass
        $.ajax({
          url: 'http://www.orasure.com/article-db/php/update_my_data-withpass.php',
          data: data,
          dataType: 'json',
          cache: false,
          global:false,
          success: function(data) {
            if (data.status === 'ok') {
              let field = $('#myAccount');
              $('#user_first_name').val(data.data[0]['fname']);
              $('#user_last_name').val(data.data[0]['lname']);
              $('#user_email').val(data.data[0]['email']);
              $('#user_pass').val('');
              $('#user_retype_pass').val('');
              field.formValidation('revalidateField', 'fname');
              field.formValidation('revalidateField', 'lname');
              field.formValidation('revalidateField', 'email');
              toastr.success('Data was successfully updated!');
            }else{
              toastr.error('Something Bad Happened!');
            }
          }
        });
      }else{
        // assume pass error
        toastr.error('Passwords do not match or other errors are present.');
      }
    }
  });


if(saveOwnAccount.length){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_my_data.php',
    data: {'id' : localStorage.getItem('user_id')},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      if (data.status === 'ok') {
        let field = $('#myAccount');
        $('#user_first_name').val(data.data[0]['fname']);
        $('#user_last_name').val(data.data[0]['lname']);
        $('#user_email').val(data.data[0]['email']);
        field.formValidation('revalidateField', 'fname');
        field.formValidation('revalidateField', 'lname');
        field.formValidation('revalidateField', 'email');
      }else{
        toastr.error('Something Happened');
      }
    }
  });
}

$('#matcatToModal').on('click', function(){
  let type = $('#matcattype').val()
    , title = $('#matcatModalTitle');

  $('#matcatID').val('new');
  $('#matcatName').val('');
  $('#matcatPushBtn').html('Create');

  if(type === 'matrix'){
    title.html('New Matrix');
  }else{
    title.html('New Category');
  }
});

$('#matcatPushBtn').on('click', function(){
  let type = $('#matcattype').val()
    , id = $('#matcatID').val()
    , name = $('#matcatName').val()
    , tar = $('#matcat')
    , matcat = ''
  ;

  if(name !== ''){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/matcat_credit.php',
      data: {'type': type, 'id': id, 'name': name},
      dataType: 'json',
      cache: false,
      global:false,
      success: function(data) {
        if (data.status === 'ok') {
          // reload items
          tar.html('');
          if(id === 'new'){
            toastr.success(name+' has been created!');
          }else{
            toastr.success(name+' has been updated!');
          }
          matcat = data.data;
          tar.getMatCat(matcat, 1, 15);
          //matcatEditBtn.unbind();
          tar.matcatBtnListener();

          $('#matcatModal').modal('hide');
        }else{
          toastr.error('Something Happened');
        }
      }
    });

  }else{
    toastr.error('Cannot be blank!');
  }
});

$('#matcatPushDelBtn').on('click', function(){
  let type = $('#matcattype').val()
    , id = $('#matcatDelID').val()
    , tar = $('#matcat')
    , assoc = parseInt($('#matcatDelAssoc').val())
    , matcat = ''
  ;

  //(assoc);
  if(assoc === 0){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/matcat_delete.php',
      data: {'type': type, 'id': id},
      dataType: 'json',
      cache: false,
      global: true,
      success: function (data) {
        if (data.status === 'ok') {
          // reload items
          toastr.success('Successfully deleted!');
          tar.html('');
          matcat = data.data;
          tar.getMatCat(matcat, 1, 15);
          tar.matcatBtnListener();
          $('#matcatDelModal').modal('hide');
        } else {
          toastr.error('Something Happened');
        }
      }
    });
  }else{
    toastr.error('This cannot be deleted. Item is critical.');
  }
});

if(scan_collections.length){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_my_collections.php',
    data: {'id' : localStorage.getItem('user_id')},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      //console.log(data.data);
      if (data.status === 'ok') {
        collections = data.data;
        getCollections();
      }else{
        toastr.error('Something Happened');
      }
    }
  });
}
// #newCollection
$('#CollectionCreateBtn').on('click', function(){
  $('#edit_art_id').val('new');
  $('#newCollectionName').val('');
  $('#isGlobal').val(0);
  $('#createNewCollectionBtn').html('Create');
  $('#newCollection').modal('show');
});

$('#CollectionEditBtn').on('click', function(){
  let tar = $('.collection-open')
    , index = tar.attr('data-index')
    , tar_id = collections[index]['id']
    , global = collections[index]['public']
    , name = collections[index]['desc'];

  $('#edit_art_id').val(tar_id);
  $('#newCollectionName').val(name);
  $('#isGlobal').val(global);

  $('#createNewCollectionBtn').html('Update');

  $('#newCollection').modal('show');
});


// Create new Collection

function createNewCollection(){
  let tar = $('#newCollectionName')
    , name = tar.val()
    , global = $('#isGlobal');

  //console.log(name + ' ' + global.val());
  if(name !== ''){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/create-collection-new.php',
      data: {'id' : localStorage.getItem('user_id'), 'name' : name, 'global' : global.val()},
      dataType: 'json',
      cache: false,
      global:false,
      success: function(data) {
        //console.log(data.data);
        if (data.status === 'ok') {
          $('#newCollection').modal('hide');
          tar.val('');
          global.val(0);
          toastr.success('Collection Created');
          collections = data.data;
          getCollections();
        }else{
          toastr.error('Something Happened');
        }
      }
    });
  }else{
    toastr.error('You must give it a name!');
  }
}

function updateCollection(){
  let id = $('#edit_art_id')
    , name = $('#newCollectionName')
    , global = $('#isGlobal')
    , active = $('.collection-open').attr('data-id');

  if(name.val() !== ''){
    $.ajax({
      url: 'http://www.orasure.com/article-db/php/update-my-collection.php',
      data: {'id' : id.val(), 'name' : name.val(), 'global' : global.val(), 'user_id': localStorage.getItem('user_id')},
      dataType: 'json',
      cache: false,
      global:false,
      success: function(data) {
        if (data.status === 'ok') {
          $('#newCollection').modal('hide');
          id.val('');
          name.val('');
          global.val(0);
          toastr.success('Collection updated');
          collections = data.data;
          getCollections(active);
        }else{
          toastr.error('Something Happened');
        }
      }
    });
  }else{
    toastr.error('You must give it a name!');
  }
}

function createCollectionAddArticle(art, name, global, user){
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/create-collection-add-article.php',
    data: {'art' : parseInt(art), 'name' : name, 'global' : parseInt(global), 'user_id': parseInt(user)},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      //console.log(data);
      if (data.status === 'ok') {
        toastr.success('New collection created and article has been added');
        collections = data.data;
        getCollections();
      }else{
        toastr.error('Something Happened');
      }
    }
  });
}

$('#createNewCollectionBtn').on('click', function(){
  let type = $('#edit_art_id').val()
  if(type !== 'new' && type !== 'new2'){
    // update
    updateCollection();
  }else if(type === 'new2') {
    //toastr.info('Create AND Add');
    let art = $('#articleID')
      , name = $('#newCollectionName')
      , global = $('#isGlobal')
      , user = localStorage.getItem('user_id');
      createCollectionAddArticle(art.val(), name.val(), global.val(), user);
  }else{
    // or create
    createNewCollection();
  }
});

$('#deleteCollectionSureBtn').on('click', function(){
  let idx = $('.collection-open').attr('data-index');
  $('#deleteCollectionTitle').html(collections[idx]['desc']);
  $('#collection_delete_id').val(collections[idx]['id'])
});

$('#deleteCollectionYes').on('click', function(){
  let id = $('#collection_delete_id');
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/delete-collection.php',
    data: {'id' : id.val(), 'user_id': localStorage.getItem('user_id')},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      if (data.status === 'ok') {
        $('#deleteCollectionSure').modal('hide');
        $('#collectionEditToolbar').css('visibility', 'hidden');
        $('#collections-table').html('');
        toastr.success('Deleted');
        collections = data.data;
        getCollections();
      }else{
        toastr.error('Something Happened');
      }
    }
  });
});

if(collectionDDL.length) {
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_my_collections.php',
    data: {'id' : localStorage.getItem('user_id')},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      if (data.status === 'ok') {
        collections = data.data;
        getCollections();
        $('#createAndAddCollection').unbind();
        $('#createAndAddCollection').on('click', function(){
          $('#edit_art_id').val('new2');
        });
      }else{
      }
    }
  });
}

var now = new Date();
now.setDate(now.getDate());
var exp = new Date(localStorage.getItem('session-exp'));

//console.log(now +' / '+exp);

// check login status

// Check expiration cookie


// Double Check IsLogged

  if ($('body').attr('data-title') !== 'login' && localStorage.getItem('logged') !== 'yes') {
    // Not Logged
    let red = $.urlParam('redirect'),
      id = $.urlParam('id');
    if (red === 'true') {
      localStorage.setItem('redirect', 'true');
      localStorage.setItem('redirect-id', id);
    }
    window.location.href = 'index.html';

  } else {

    // Logged now check expiration cookie
    if(now < exp) {
      $('#userLoginEmail').html(localStorage.getItem('email'));
      // if login page redirect to home

      // reset expiration
      var date = new Date();
      //date.setMinutes(date.getMinutes() + 2);
      date.setDate(date.getDate() + 1);
      localStorage.setItem('session-exp', date);

      // If on login and valid exp, move to search
      if ($('body').attr('data-title') === 'login' && localStorage.getItem('logged') === 'yes') {
        window.location.href = 'search.html';
      }
    }else{
      if($('body').attr('data-title') !== 'login') {
        localStorage.clear();
        let red = $.urlParam('redirect'),
          id = $.urlParam('id');

        if (red === 'true') {
          localStorage.setItem('redirect', 'true');
          localStorage.setItem('redirect-id', id);
        }
        window.location.href = 'index.html';
      }

    }
  }


$('.sort').on('click', function(e){
  e.preventDefault();

  let sort = $(this).attr('data-sort')
    , order = parseInt($(this).attr('data-order'))
  ;

  $('.sort').attr('data-order', '0');
  $('.sort').children('.order').html('');
  $('.sort').removeClass('btn-primary');
  $('.sort').addClass('btn-default');
  $('.sort[data-sort="'+sort+'"]').addClass('btn-primary');
  $('.sort[data-sort="'+sort+'"]').addClass('btn-primary');

  let asc = '&nbsp;<span style="font-weight:normal; font-size: 10px;" class="glyphicon glyphicon-chevron-down"></span>'
    , desc = '&nbsp;<span style="font-weight:normal; font-size: 10px;" class="glyphicon glyphicon-chevron-up"></span>';

  if(order === 'none'){order = '0';}

  switch(order){
    case 0:
      $(this).children('.order').html(asc);
      $(this).attr('data-order', '1');
      break;
    case 1:
      $(this).children('.order').html(desc);
      $(this).attr('data-order', '0');
      break;
  }

  let term = localStorage.getItem('searchTerm')
  load_articles(term, sort, order);
});

$('#ArticleFiles').on('click', function(e){
  e.preventDefault();
  $('#ArticleFiles').addClass('no-link');
  $('#ArticleLinks').removeClass('no-link');
  $('#urlUploadForm').css('display','none');
  $('#urlUploadFooter').css('display','none');
  $('#fileUploadForm').css('display','block');
  $('#fileUploadFooter').css('display','block');
});

$('#ArticleLinks').on('click', function(e){
  e.preventDefault();
  $('#ArticleLinks').addClass('no-link');
  $('#ArticleFiles').removeClass('no-link');
  $('#fileUploadForm').css('display','none');
  $('#fileUploadFooter').css('display','none');
  $('#urlUploadForm').css('display','block');
  $('#urlUploadFooter').css('display','block');
});

$('#editMode').on('click', function(){
  window.location = ('upload.html?edit=true&id='+key);
});

$( document ).ajaxError(function( event, request, settings ) {
  toastr.error('An Error Occured. Please Notify the Administrator');
});

$(document).ready(function(){
  toggle_permissions(permission);
});

$('.pdfjs').bind('contextmenu', function(e) {
  return false;
});

function loadPDF(){
  var doc = $.urlParam('id');
  $.ajax({
    url: 'http://www.orasure.com/article-db/php/load_source_file.php',
    data: {'id' : doc},
    dataType: 'json',
    cache: false,
    global:false,
    success: function(data) {
      console.log(data);
      if (data.status === 'ok') {
        var file = 'http://www.orasure.com/article-db/article_files/'+data.data[0].Filename;
        window.PDFJS.webViewerLoad();
        window.PDFViewerApplication.open(file);
        $('.bookmark').remove();
        $('.openFile').remove();

        if(data.data[0].allow_print === 'no'){
          $('.print').remove();
        }
        if(data.data[0].allow_save === 'no'){
          $('.download').remove();
        }
      }else{
        toastr.error('An error loading the file occured or the file does not exist.');
      }
    }
  });
  //.download, .print, .viewbookmark, .openFile{display:none;}
}

