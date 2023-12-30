$(document).on('click', '#downloadapp', function(e){
    var btn = $(this)


      
    $.ajax({
        type: 'get',
        url: '/app/download',
   
        success:function(data){
      
            if(data.isValid){
                $(btn).removeAttr('disabled');
                $(btn).text('Download Now');
            
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = data.fileUrl;
                a.download = 'BDWallet.apk';
                document.body.appendChild(a);
                a.click();
                
          
            }else{
        
            }
        },
      
        err:function(req, err){
            alert(err + 'with status code' +req.statusText);
        },
      
        beforeSend:function(){
            $(btn).attr('disabled','disabled');
             $(btn).text('please wait..');
        }
    });

});

$('#validate-form').validate({
    rules:{
      name:{
        required:true,
        minlength:3,
      },
      email:{
        required:true,      
        email: true      
      },
      phone:{
        required:true,

      },
      message:{
        required:true,
        minlength:3
      }
    },
    messages:{
      name:{
        required:'This field is required.',
        minlength:'Please enter at least 3 characters.',

      },
      email:{
        required:'This field is required.',
        email:'Please enter valid email'
      },
      phone:{
        required:'This field is required.',
      },
      message:{
        required:'This field is required.',
        minlength:'Please enter at least 3 characters.',
      }
    }
  });


  $(document).on('submit','#validate-form',function(e){
    e.preventDefault();

    var btn = $('#contactSubmitBtn');
    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),

        data: {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            message: $('#message').val()
        },

        success:function(data){
        
            $(btn).removeAttr('disabled');
            $(btn).text("Send Email");
            if(data.success){
                
                $('#name').val('');
                $('#email').val('');
                $('#phone').val('');
                $('#message').val('');

                $('.contact-info').addClass('alert alert-success');
                $('.contact-info').text(data.msg);
                console.log(data.msg);
                $('.contact-info').css({'margin':'10px'});
        
                setTimeout(function(){
                  $('.contact-info').removeClass('alert alert-success');
                  $('.contact-info').text("");
                  $('.contact-info').css({'margin':'0px'});
                },10000);
              }else{
                alert('err..'+data.msg);
              }
    
        },
      
        err:function(req, err){
            $(btn).removeAttr('disabled');
            $(btn).text('Send Email');
            alert(err + 'with status code' +req.statusText);
        },
      
        beforeSend:function(){
            $(btn).attr('disabled','disabled');
             $(btn).text('please wait..');
        }
    });




});
