$('#loginForm').formValidation({
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
        email: {
          trigger: 'blur',
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
    .on('success.form.fv', function(e) {
        // Prevent form submission
        e.preventDefault();

        let user = $('#user').val()
            , pass = $('#pass').val();

        if(user !== '' && pass !== ''){
            window.location.href = 'search.html';
        }
        //toastr.success('Successful Login');


        //console.log(name +'\n'+ dept +'\n'+ reason +'\n'+ name2 +'\n'+ dept2 +'\n');
        //console.log(mailframe);
        //console.log('First: '+fname+'\nLast: '+lname+'\nCompany: '+company+'\nEmail: '+email);


        //let target = $('#formArea');

        /*$.ajax({
            url: 'http://www.orasure.com/scripts/LiveItMailFrame.asp',
            data: {
                'nom_first': nom_fname
                , 'nom_last' : nom_lname
                , 'nom_dept' : nom_dept
                , 'lead' : lead
                , 'inspire' : inspire
                , 'value' : value
                , 'embrace' : embrace
                , 'impact' : impact
                , 'think' : think
                , 'nom_reason' : nom_reason
                , 'fname' : fname
                , 'lname' : lname
                , 'dept' : dept
            },
            type: 'POST',
            cache: false,
            global:false,
            success: function(data){
                if(data === 'ok'){
                    target.html('<p style="font-weight:bold;">Thank you for your nomination.<br />Please reload the page if you wish to nominate another person.</p>');
                    target.append('<br /><br />');
                    target.css({'padding-right':'15px', 'padding-left':'15px'});
                    toastr.success('Nomination has been successfully cast!');
                }else{
                    toastr.error('Nomination failed to submit.');
                }
            }});
*/
    });
