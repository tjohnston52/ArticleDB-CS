$.urlParam = function(name){
  let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  }
  else{
    return decodeURI(results[1]) || 0;
  }
};
//console.log($.urlParam('v'));

let key = $.urlParam('id');

let editdata = [];

let searchable = [
  {
    'id':'0'
    , 'column' : 'author'
    , 'display' : 'Authors'
    , 'fields' : [
      {
        'type-id':'author-last'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'1'
    , 'column' : 'category'
    , 'display' : 'Category'
    , 'fields' : [
      {
        'type-id':'category'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'8'
        , 'options': [
          {
            'use':'search_category'
          }
        ]
      }
    ]
  },
  {
    'id':'2'
    , 'column' : 'collection'
    , 'display' : 'Collection'
    , 'fields' : [
      {
        'type-id':'collection'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'8'
        , 'options': [
          {
            'use':'search_collections'
          }
        ]
      }
    ]
  },
  {
    'id':'3'
    , 'column' : 'datadate'
    , 'display' : 'Data Date'
    , 'fields' : [
      {
        'type-id':'dateselector'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'On'
            , 'value':'='
          }
          ,{
            'item':'Before'
            , 'value':'<='
          }
          , {
            'item':'After'
            , 'value':'>='
          }
        ]
      },
      {
        'type-id':'month'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'3'
        , 'options': [
          {
            'item':'January',
            'value':1
          }
          ,{
            'item':'February',
            'value':2
          }
          , {
            'item':'March',
            'value':3
          }
          , {
            'item':'April',
            'value':4
          }
          , {
            'item':'May',
            'value':5
          }
          , {
            'item':'June',
            'value':6
          }
          , {
            'item':'July',
            'value':7
          }
          , {
            'item':'August',
            'value':8
          }
          , {
            'item':'September',
            'value':9
          }
          , {
            'item':'October',
            'value':10
          }
          , {
            'item':'November',
            'value':11
          }
          , {
            'item':'December',
            'value':12
          }

        ]
      }
      ,{
        'type-id':'year'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'3'
      }
    ]
  },
  {
    'id':'4'
    , 'column' : 'description'
    , 'display' : 'Description'
    , 'fields' : [
      {
        'type-id':'description'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'5'
    , 'column' : 'favorability'
    , 'display' : 'Favorability'
    , 'fields' : [
      {
        'type-id':'favorability'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'8'
        , 'options': [
          {
            'item':'Favorable'
            , 'value':'1'
          }
          ,{
            'item':'Neutral'
            , 'value':'0'
          }
          , {
            'item':'Unfavorable'
            , 'value':'2'
          }
        ]
      }
    ]
  },
  {
    'id':'6'
    , 'column' : 'issue'
    , 'display' : 'Issue'
    , 'fields' : [
      {
        'type-id':'issue'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'7'
    , 'column' : 'keywords'
    , 'display' : 'KeyWords'
    , 'fields' : [
      {
        'type-id':'keys'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'8'
    , 'column' : 'location'
    , 'display' : 'Location'
    , 'fields' : [
      {
        'type-id':'location'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'9'
    , 'column' : 'matrix'
    , 'display' : 'Matrix'
    , 'fields' : [
      {
        'type-id':'operator'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'8'
        , 'options': [
          {
            'use':'search_matrix'
          }
        ]
      }
    ]
  },
  {
    'id':'10'
    , 'column' : 'patientcount'
    , 'display' : 'Patient Count'
    , 'fields' : [
      {
        'type-id':'operator'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'='
          }
          ,{
            'item':'<='
          }
          , {
            'item':'>='
          }
        ]
      }
      ,{
        'type-id':'count'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'6'
      }
    ]
  },
  {
    'id':'11'
    , 'column' : 'patientdescription'
    , 'display' : 'Patient Description'
    , 'fields' : [
      {
        'type-id':'patientdescription'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'12'
    , 'column' : 'product'
    , 'display' : 'Product'
    , 'fields' : [
      {
        'type-id':'product'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'13'
    , 'column' : 'pubdate'
    , 'display' : 'Publish Date'
    , 'fields' : [
      {
        'type-id':'dateselector'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'On'
            , 'value':'='
          }
          ,{
            'item':'Before'
            , 'value':'<='
          }
          , {
            'item':'After'
            , 'value':'>='
          }
        ]
      },
      {
        'type-id':'month'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'3'
        , 'options': [
          {
            'item':'January',
            'value':1
          }
          ,{
            'item':'February',
            'value':2
          }
          , {
            'item':'March',
            'value':3
          }
          , {
            'item':'April',
            'value':4
          }
          , {
            'item':'May',
            'value':5
          }
          , {
            'item':'June',
            'value':6
          }
          , {
            'item':'July',
            'value':7
          }
          , {
            'item':'August',
            'value':8
          }
          , {
            'item':'September',
            'value':9
          }
          , {
            'item':'October',
            'value':10
          }
          , {
            'item':'November',
            'value':11
          }
          , {
            'item':'December',
            'value':12
          }

        ]
      }
      ,{
        'type-id':'year'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'3'
      }
    ]
  },
  {
    'id':'14'
    , 'column' : 'rating'
    , 'display' : 'Rating'
    , 'fields' : [
      {
        'type-id':'operator'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'='
          }
          ,{
            'item':'<='
          }
          , {
            'item':'>='
          }
        ]
      }
      ,{
        'type-id':'rating'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'6'
        , 'options': [
          {
            'item':'0'
          }
          ,{
            'item':'1'
          }
          , {
            'item':'2'
          }
          , {
            'item':'3'
          }
          , {
            'item':'4'
          }
          , {
            'item':'5'
          }
        ]
      }
    ]
  },
  {
    'id':'15'
    , 'column' : 'sensitivity'
    , 'display' : 'Sensitivity'
    , 'fields' : [
      {
        'type-id':'operator'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'='
          }
          ,{
            'item':'<='
          }
          , {
            'item':'>='
          }
        ]
      }
      ,{
        'type-id':'sensitivity'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'6'
      }
    ]
  },
  {
    'id':'16'
    , 'column' : 'source'
    , 'display' : 'Source Country'
    , 'fields' : [
      {
        'type-id':'source'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
    'id':'17'
    , 'column' : 'specificity'
    , 'display' : 'Specificity'
    , 'fields' : [
      {
        'type-id':'operator'
        , 'kind':'select'
        , 'type':'text'
        , 'width':'2'
        , 'options': [
          {
            'item':'='
          }
          ,{
            'item':'<='
          }
          , {
            'item':'>='
          }
        ]
      }
      ,{
        'type-id':'specificity'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'6'
      }
    ]
  },
  {
    'id':'18'
    , 'column' : 'summary'
    , 'display' : 'Summary'
    , 'fields' : [
      {
        'type-id':'summary'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  },
  {
      'id':'19'
    , 'column' : 'title'
    , 'display' : 'Title'
    , 'fields' : [
      {
          'type-id':'title'
        , 'kind':'input'
        , 'type':'text'
        , 'width':'8'
      }
    ]
  }
];

/**
let book = [
  {
      'id':'001'
    , 'title':'A Long Day'
    , 'author':'John Holmes, Mark Hampton'
    , 'summary':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis. Sed ut ex non lectus vestibulum gravida quis a massa. Donec ornare massa justo, sed rutrum lacus convallis eu. Sed gravida ac metus at maximus. Duis efficitur lectus eu hendrerit cursus. In varius tempus ornare. Pellentesque aliquam tempor posuere.' +
      '<br /><br />' +
      'Vestibulum ultricies euismod ante a mollis. Phasellus vitae justo quam. Curabitur ultricies elit at tellus vestibulum, a gravida diam faucibus. Donec sed odio vitae lorem elementum commodo. In eget porta neque. Vestibulum malesuada urna in arcu venenatis varius nec quis risus. Nullam rhoncus erat quis leo ullamcorper, ac cursus lectus pharetra. Integer a dignissim libero, in efficitur leo.'
    , 'PubMonth':null
    , 'PubYear': 2010
    , 'DataDate' : null
    , 'Comments':[
        {
            'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
          , 'comment_user_fname' : 'Lisa'
          , 'comment_user_lname' :'Botteri'
          , 'comment_date' : 'April 19, 2018'
        }
      ]
    , 'rating': 5
    , 'user' : 'Taylor Johnston'
    , 'uploaded' : 'January 1, 2018'
    , 'keywords' : 'Lorem, Ipsum, Dolor, Sit, Amet, Fier, Acqui'
    , 'Location' : 'CROI 2017'
    , 'Issue_Information' : null
    , 'Source_Country' : 'Malawi, Mozambique, Madagascar'
  },
  {
      'id':'002'
    , 'title':'A Short Night'
    , 'author':'John Holmes'
    , 'PubMonth':'March'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 0
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'003'
    , 'title':'Staff of Fire'
    , 'author':'Larry Wilmore'
    , 'PubMonth':'May'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 2
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'004'
    , 'title':'Echo Park'
    , 'author':'Marie Pasternak'
    , 'PubMonth': null
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 0
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'005'
    , 'title':'The Bonfire'
    , 'author':'Stacy Lewis'
    , 'PubMonth':null
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 1
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'006'
    , 'title':'Black Hole in the Sky'
    , 'author':'James T. Marco'
    , 'PubMonth':'July'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 5
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'007'
    , 'title':'Jack Reacher'
    , 'author':'Tom Clancy'
    , 'PubMonth':'December'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 3
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'008'
    , 'title':'Jack Reacher: Last One Standing Vol I'
    , 'author':'Tom Clancy'
    , 'PubMonth':'January'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 4
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'009'
    , 'title':'Jack Reacher: Last One Standing Vol II'
    , 'author':'Tom Clancy'
    , 'PubMonth':'April'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 4
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'010'
    , 'title':'Jack Reacher: Last One Standing Vol III'
    , 'author':'Tom Clancy'
    , 'PubMonth':'June'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 3
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'011'
    , 'title':'Jack Reacher: Last One Standing Vol IV'
    , 'author':'Tom Clancy'
    , 'PubMonth':'August'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
        'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 1
    , 'user' : 'Taylor Johnston'
  },
  {
      'id':'012'
    , 'title':'Jack Reacher: Last One Standing Vol V'
    , 'author':'Tom Clancy'
    , 'PubMonth':'November'
    , 'PubYear': 2010
    , 'summary':'ABC'
    , 'Comments':[
      {
          'comment_text':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempor odio sem, et tempor risus commodo non. Mauris volutpat iaculis nisi eget facilisis. Sed sagittis auctor venenatis.'
        , 'comment_user_fname' : 'Lisa'
        , 'comment_user_lname' :'Botteri'
        , 'comment_date' : 'April 19, 2018'
      }
    ]
    , 'rating': 4
    , 'user' : 'Taylor Johnston'
  }
];

let collections = [
  {'id':'001', 'name':'My Collection', 'Articles':[book[0], book[1], book[3], book[4], book[5], book[6], book[7], book[8], book[9], book[10], book[11]]},
  {'id':'002', 'name':'Africa ST', 'Articles':[book[1], book[2]]},
  {'id':'003', 'name':'Another', 'Articles':[book[3], book[8]]},
  {'id':'004', 'name':'Pet Project', 'Articles':[book[2], book[3]]},
  {'id':'005', 'name':'Number 5', 'Articles':[book[1], book[7], book[2]]},
  {'id':'006', 'name':'US HIV', 'Articles':[book[3], book[4]]},
  {'id':'007', 'name':'OraQuick Ups', 'Articles':[book[3], book[4]]},
  {'id':'008', 'name':'OraQuick Downs', 'Articles':[book[3], book[4]]},
  {'id':'009', 'name':'Self-Test Global', 'Articles':[book[3], book[4]]},
  {'id':'010', 'name':'Oral Fluid Competitors', 'Articles':[book[3], book[4]]},
  {'id':'011', 'name':'Whole Blood Failures', 'Articles':[book[3], book[4]]},
  {'id':'012', 'name':'Bloodborne Cultures', 'Articles':[book[3], book[4]]},
  {'id':'013', 'name':'Newest II', 'Articles':[book[3], book[4]]}
];
//console.log(collections);

let searchable = [
  {'id':'0', 'column' : 'title', 'display' : 'Title', 'fields' : [{'type-id':'title', 'kind':'input', 'type':'text', 'width':'8'}]},
  {'id':'1', 'column' : 'author', 'display' : 'Authors', 'fields' : [{'type-id':'author-last', 'kind':'input', 'type':'text', 'width':'2'},{'type-id':'author-first', 'kind':'input', 'type':'text', 'width':'6'}]},
  {'id':'2', 'column' : 'specificity', 'display' : 'Specificity', 'fields' : [{'type-id':'operator', 'kind':'select', 'type':'text', 'width':'2', 'options': [{'item':'='}, {'item':'<'}, {'item':'>'}]},{'type-id':'specificity', 'kind':'input', 'type':'text', 'width':'6'}]}
];

let file_list = [
  {'id':1, 'filename':'#', 'display':'File #', 'associated':[book[1], book[2]]},
  {'id':2, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':3, 'filename':'#', 'display':'File #', 'associated':[book[1], book[2]]},
  {'id':4, 'filename':'#', 'display':'File #', 'associated':[book[1], book[2]]},
  {'id':5, 'filename':'#', 'display':'File #', 'associated':[book[1], book[2]]},
  {'id':6, 'filename':'#', 'display':'File #', 'associated':[book[1], book[2]]},
  {'id':7, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':8, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':9, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':10, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':11, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':12, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':13, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':14, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':15, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':16, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':17, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':18, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':19, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':20, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':21, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':22, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':23, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':24, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':25, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':26, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':27, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':28, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':29, 'filename':'#', 'display':'File #', 'associated':null},
  {'id':30, 'filename':'#', 'display':'File #', 'associated':null}
];

let matcat = [];
 **/
