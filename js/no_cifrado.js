'use strict';

// divs de los resultados
var r1 = $('.widget.result[result="r1"]');
var r2 = $('.widget.result[result="r2"]');
var r3 = $('.widget.result[result="r3"]');
var r4 = $('.widget.result[result="r4"]');
var r5 = $('.widget.result[result="r5"]');
var r6 = $('.widget.result[result="r6"]');
var r7 = $('.widget.result[result="r7"]');
var r8 = $('.widget.result[result="r8"]');

// variables para los operadores
var operator1 = $('.operator[ope="1"]');
var operator2 = $('.operator[ope="2"]');
var operator3 = $('.operator[ope="3"]');
var operator4 = $('.operator[ope="4"]');
var operator5 = $('.operator[ope="5"]');
var operator6 = $('.operator[ope="6"]');
var operator7 = $('.operator[ope="7"]');
var operator8 = $('.operator[ope="8"]');

// Guardo todas las posiciones
var a_1 = $('.widget[position="a1"]');
var b_1 = $('.widget[position="b1"]');
var c_1 = $('.widget[position="c1"]');
var d_1 = $('.widget[position="d1"]');
var a_2 = $('.widget[position="a2"]');
var b_2 = $('.widget[position="b2"]');
var c_2 = $('.widget[position="c2"]');
var d_2 = $('.widget[position="d2"]');
var a_3 = $('.widget[position="a3"]');
var b_3 = $('.widget[position="b3"]');
var a_4 = $('.widget[position="a4"]');
var b_4 = $('.widget[position="b4"]');

// variable que me controlara el tiempo del cronometro
var time_interval = null; 

// Puntos
var points = 0;

// Minutos
var minutes = 0;

// Carga de la página
window.onload = function(){
        
    // hover del widget que pone el foco en el input
    $('.widget:not(.result, .valid)').unbind('mouseenter').mouseenter(function(e){
        $(this).addClass("edit").find('.value_input').focus();
    });
    
    // cuando sale del hover
    $('.widget:not(.result, .valid)').unbind('mouseleave').mouseleave(function(e){
        $(this).removeClass("edit").find('.value_input').blur();
    });
        
    // cuando este focus el widget
    $('.widget:not(.result, .valid)').unbind('focus').focus(function(e){
        $(this).addClass("edit").find('.value_input').focus();
    });
        
    // cuando pierda el foco el widget
    $('.widget:not(.result, .valid)').unbind('blur').blur(function(e){
        $(this).removeClass("edit").find('.value_input').blur();
    });
    
    // Evento cuando los input de los widgets obtinene el foco
    $('.widget:not(.result, .valid) .value_input').unbind('focus').focus(function(){
        $(this).parent().parent().addClass('edit').removeClass('valid');
    });
    
    // Evento cuando los input de los widgets pierden el foco
    $('.widget:not(.result, .valid) .value_input').unbind('blur').blur(function(){
        
        var value = $(this).val();
        
        // Si no es un número o es mayor a 100 que ya tiene 3 cifras o si es menor que -99
        if(isNaN(value) || value > 99 || value < -99 || value == ""){
            $(this).parent().parent().attr('data-value', '');
            $(this).val('');
            $(this).parent().parent().removeClass('valid');
        }else {
            $(this).parent().parent().attr('data-value', value);
            $(this).parent().parent().addClass('valid');
        }
        
        // le quito al widget la clase edit
        $(this).parent().parent().removeClass('edit');
        
    });
    
    // Evento que cambia el juego
    $('#btn_new').unbind('click').click(function(){
        $('.widget[position]').removeClass('valid').removeAttr('data-value').find('.value_input').val('').css('display', 'block');
        clearInterval(time_interval);
        $('.container_results .time').css('color', 'white');
        new_game();
        audio_start.play();
        audio_background.play();
        $('#btn_validate').show();
        message('Nuevo Juego...', 2000);
    });
    
    // Evento que me limpia todos los campos
    $('#btn_restart').unbind('click').click(function(){
        $('.widget[position]').removeClass('valid').removeAttr('data-value').find('.value_input').val('');
        clearInterval(time_interval);
        $('.container_results .time').css('color', 'white');
        restart_game();
        time();
        audio_start.play();
        audio_background.play();
        $('#btn_validate').show();
        message('Reinicio del Juego...', 2000);
    });
    
    // Evento que valida el juego
    $('#btn_validate').unbind('click').click(function(){
        validate_game();
    });
    
    // evento de los operadores
    $('.operator').unbind('click').click(function(){
        // borro todas los actives de los operadores
        $('.operator').removeClass('active');
        
        // Le añado la clase active al que se le da click
        // $(this).addClass('active');
    });
    
    // Evento que cierra el menu de los operadores
    $('.menu_operators .close_menu').unbind('click').click(function(){
        setTimeout(function(){ $('.operator').removeClass('active'); },300);
    });
    
    // Evento que cambia el operador
    $('.menu_operators > div').unbind('click').click(function(){
        var operator = $(this).attr('operator');
        $(this).parent().parent().removeAttr('sum subtraction multiplication division').attr(operator, '');
    });
    
    // evento que cambia el nombre del usuario
    $('.container_results .name').unbind('click').click(function(){
        var name = prompt("Ingrese el nombre del jugador", $(this).text());
        
        if(name == "" || name == undefined){
            return;
        }else{
            // cargo el nombre del usuario
            $('.container_results .name').text(name);
            
            // Guardo el nombre en un local storage
            localStorage.setItem('name', name);
        }
    });
    
    // evento del inicio
    $('#btn_start').unbind('click').click(function(){
        var name = $('#player_name').val();
        var country = $('#player_country').val();
        var email = $('#player_email').val();
        var difficulty = $('.content_difficulty > img.active').attr('difficulty');
        var time_game = $('#time_game').val();
        
        if(name == "" || country == "" || email == "" || time_game == ""){
            return;
        }else{
            // Guardo los datos del usuario
            var data_user = {
                'name': name,
                'country': country,
                'email': email
            };
            
            minutes = parseInt(time_game - 1);
            
            // Guardo la dificultad en un localstorage
            localStorage.setItem('difficulty', difficulty);
            
            // cargo el nombre del usuario
            $('.container_results .name').text(name);
            
            // Guardo el nombre en un local storage
            localStorage.setItem('data_user', JSON.stringify(data_user));
            
            // oculto el panel principal
            $('.main_panel').css({
                '-webkit-transform':'scale(0) rotatez(360deg)',
                '-moz-transform':'scale(0) rotatez(360deg)',
                '-ms-transform':'scale(0) rotatez(360deg)',
                '-o-transform':'scale(0) rotatez(360deg)',
                'transform':'scale(0) rotatez(360deg)'
            });
            
            // muestro el panel del juego
            setTimeout(function(){
                $('.content_widgets,.container_results,.buttons').addClass('play');
            }, 800);
            
            // inicio el juego
            setTimeout(function(){
                // sonido de comenzar el juego
                audio_start.play();
                
                // Inicio del Juego
                init();
            }, 1300);
        }
    });
    
    // evento de las imagenes de la dificultad
    $('.content_difficulty > img').unbind('click').click(function(){
        var items = [
            [
                {
                    value: "",
                    text: "Seleccione el tiempo"
                },{
                    value: "5",
                    text: "5 minutos"
                },{
                    value: "10",
                    text: "10 Minutos"
                },{
                    value: "15",
                    text: "15 Minutos"
                },
            ],[
                {
                    value: "",
                    text: "Seleccione el tiempo"
                },{
                    value: "5",
                    text: "5 minutos"
                },{
                    value: "10",
                    text: "10 Minutos"
                },{
                    value: "15",
                    text: "15 Minutos"
                },{
                    value: "30",
                    text: "30 Minutos"
                },{
                    value: "60",
                    text: "60 Minutos"
                },
            ]
        ];
        
        // limpio el select del tiempo
        $('#time_game').empty();
        
        // obtengo la dificultad
        var level = $(this).attr('difficulty');
        var element = null;
        
        if(level == "player"){
            for(var i = 0; i < items[1].length; i++){
                element = items[1][i];
                $('#time_game').append('<option value="'+ element.value +'">'+ element.text +'</option>');
            }
        }else{
            for(var i = 0; i < items[0].length; i++){
                element = items[0][i];
                $('#time_game').append('<option value="'+ element.value +'">'+ element.text +'</option>');
            }
        }
        
        $('select').material_select();
        
        $('.content_difficulty > img').removeClass('active');
        $(this).addClass('active');
    });
    
    // si ya existen datos
    if(localStorage.getItem('data_user') != null){
        var data = JSON.parse(localStorage.getItem('data_user'));
        points = (data.points == undefined) ? 0 : data.points;
        $('.container_results .points').text(points);
        $('#player_name').addClass('valid').val(data.name).next().addClass('active');
        $('#player_country').val(data.country);
        $('#player_email').addClass('valid').val(data.email).next().addClass('active');
    }
    
    // le doy un drag al cuadro de resultados
    // $('.container_results').draggable();
    
    // ejecuto el metodo de materialize para los selects
    $('select').material_select();
    
    // oculto el cargador
    $('.loader').fadeOut(1500);
    
};

// Funcion que se llama al momento de que la página este cargada
function init(){
    
    message('Inicio del Juego...', 2000);
    
    // Funcion que me pone los resultados
    load_results();
}

// Funcion que carga los resultados
function load_results(){
    audio_background.play();
    
    // funcion que carga los numeros aleatorios
    numbers();
    
    // funcion que carga los operadores aleatoriamente
    operators_load();
    
    // funcion que suma los valores dados por los numeros aleatorios
    sum_results();
    
    // funcion que remueve algunos numeros
    remove_numbers();
    
    time();
}

// funcion que valida si el juego es correcto o incorrecto
function validate_game(){
    // obtengo todos los resultados de los cuadros
    var a1 = parseInt(a_1.attr('data-value'));
    var b1 = parseInt(b_1.attr('data-value'));
    var c1 = parseInt(c_1.attr('data-value'));
    var d1 = parseInt(d_1.attr('data-value'));
    var a2 = parseInt(a_2.attr('data-value'));
    var b2 = parseInt(b_2.attr('data-value'));
    var c2 = parseInt(c_2.attr('data-value'));
    var d2 = parseInt(d_2.attr('data-value'));
    var a3 = parseInt(a_3.attr('data-value'));
    var b3 = parseInt(b_3.attr('data-value'));
    var a4 = parseInt(a_4.attr('data-value'));
    var b4 = parseInt(b_4.attr('data-value'));
    
    // valida si inserto numeros en todos los campos
    if(isNaN(a1) || isNaN(a2) || isNaN(a3) || isNaN(a4) || isNaN(b1) || isNaN(b2) || isNaN(b3) || isNaN(b4) || isNaN(c1) || isNaN(c2) || isNaN(d1) || isNaN(d2)){
        audio_incorrect.play();
    }else{
        // hallo los operadores antes puestos
        var operators = JSON.parse(localStorage.getItem('operators'));
        
        var op_1 = (operators[0].ope1 == "sum") ? "+" : "-";
        var op_2 = (operators[0].ope2 == "sum") ? "+" : "-";
        var op_3 = (operators[0].ope3 == "sum") ? "+" : "-";
        var op_4 = (operators[0].ope4 == "sum") ? "+" : "-";
        var op_5 = (operators[1].ope5 == "multiplication") ? "*" : "/";
        var op_6 = (operators[1].ope6 == "multiplication") ? "*" : "/";
        var op_7 = (operators[1].ope7 == "multiplication") ? "*" : "/";
        var op_8 = (operators[1].ope8 == "multiplication") ? "*" : "/";
        
        // evaluo las operaciones
        var result_1 = a1 +op_1+ b1 +op_1+ c1 +op_1+ d1;
        var result_2 = a2 +op_2+ b2 +op_2+ c2 +op_2+ d2;
        var result_3 = a1 +op_3+ a2 +op_3+ a3 +op_3+ a4;
        var result_4 = b1 +op_4+ b2 +op_4+ b3 +op_4+ b4;
        var result_5 = a3 +op_5+ b3;
        var result_6 = a4 +op_6+ b4;
        var result_7 = c1 +op_7+ c2;
        var result_8 = d1 +op_8+ d2;
        
        // valores de los cuadros de los resultados
        var res1 = parseFloat(r1.attr('data-value'));
        var res2 = parseFloat(r2.attr('data-value'));
        var res3 = parseFloat(r3.attr('data-value'));
        var res4 = parseFloat(r4.attr('data-value'));
        var res5 = parseFloat(r5.attr('data-value'));
        var res6 = parseFloat(r6.attr('data-value'));
        var res7 = parseFloat(r7.attr('data-value'));
        var res8 = parseFloat(r8.attr('data-value'));
        
        // hallo los resultados finales con su respectiva evaluacion
        var final_r1 = (!isNaN(eval(result_1)) && eval(result_1).toString().indexOf('.') != -1) ? eval(result_1).toFixed(1) : eval(result_1);
        var final_r2 = (!isNaN(eval(result_2)) && eval(result_2).toString().indexOf('.') != -1) ? eval(result_2).toFixed(1) : eval(result_2);
        var final_r3 = (!isNaN(eval(result_3)) && eval(result_3).toString().indexOf('.') != -1) ? eval(result_3).toFixed(1) : eval(result_3);
        var final_r4 = (!isNaN(eval(result_4)) && eval(result_4).toString().indexOf('.') != -1) ? eval(result_4).toFixed(1) : eval(result_4);
        var final_r5 = (!isNaN(eval(result_5)) && eval(result_5).toString().indexOf('.') != -1) ? eval(result_5).toFixed(1) : eval(result_5);
        var final_r6 = (!isNaN(eval(result_6)) && eval(result_6).toString().indexOf('.') != -1) ? eval(result_6).toFixed(1) : eval(result_6);
        var final_r7 = (!isNaN(eval(result_7)) && eval(result_7).toString().indexOf('.') != -1) ? eval(result_7).toFixed(1) : eval(result_7);
        var final_r8 = (!isNaN(eval(result_8)) && eval(result_8).toString().indexOf('.') != -1) ? eval(result_8).toFixed(1) : eval(result_8);

        // si todos los resultados son correctos 
        if(final_r1 == res1 && final_r2 == res2 && final_r3 == res3 && final_r4 == res4  && final_r5 == res5 && final_r6 == res6 && final_r7 == res7 && final_r8 == res8){
            audio_background.pause();
            audio_win.play();
            message('¡GANASTE!', 5000);
            points++; // incremento los puntos
            var data_user = JSON.parse(localStorage.getItem('data_user')); // obtengo la informacion del usuario
            data_user.points = points;
            localStorage.setItem('data_user', JSON.stringify(data_user)); // actualizo
            $('.container_results .points').text(points);
        }else{
            audio_background.pause();
            audio_incorrect.play();
            message('¡PERDISTE!', 5000);
        }
        
        $('#btn_validate').hide();
    }
    
}

// funcion que cambia el juego
function new_game(){
    // Funcion que me pone los resultados
    load_results();
}

// funcion que hace correr el tiempo
function time(){
    var seconds = 60;
    var string_time = "";
    
    time_interval = setInterval(function(){
        seconds--;
        
        string_time = "00:"+minutes+":"+seconds;
        
        if(seconds < 0){
            minutes--;
            
            // el tiempo se acaba
            if(minutes < 0){
                audio_background.pause();
                clearInterval(time_interval);
                audio_incorrect.play();
                $('.container_results .time').css('color', 'white');
                string_time = "00:00:00";
                $('.container_results .time').text(string_time);
                $('#btn_validate').hide();
                message('¡El juego ha terminado!', 10000);
            }
            seconds = 59;
        }else{
            if(minutes < 10){
                string_time = "00:0"+minutes+":"+seconds;
                if(seconds < 10)
                    string_time = "00:0"+minutes+":0"+seconds
            }else{
                string_time = "00:"+minutes+":"+seconds;
                if(seconds < 10)
                    string_time = "00:"+minutes+":0"+seconds
            }
        }
        
        if(minutes < 1){ // si el tiempo es menor a 1 minuto
            $('.container_results .time').css('color', '#E53935');
        }
        
        $('.container_results .time').text(string_time);
    },1000);
}



var arr = [];

function shuffle()
{
    
    var d = [
    
      {
        a1 : 11, 
        b1 : 12,
        c1 : 6,
        d1 : 9,
        a2 : 10,
        b2 : 5,
        c2 : 1,
        d2 : 3,
        a3 : 7,
        b3 : 4,
        a4 : 8,
        b4 : 2,
      }
      ,
      {
        a1 : 7, 
        b1 : 11,
        c1 : 8,
        d1 : 4,
        a2 : 10,
        b2 : 1,
        c2 : 6,
        d2 : 2,
        a3 : 12,
        b3 : 5,
        a4 : 9,
        b4 : 3,
      }
      ,
      {
        a1 : 10, 
        b1 : 9,
        c1 : 7,
        d1 : 12,
        a2 : 11,
        b2 : 1,
        c2 : 3,
        d2 : 6,
        a3 : 5,
        b3 : 2,
        a4 : 8,
        b4 : 4,
      }
      ,
      {
        a1 : 6, 
        b1 : 10,
        c1 : 12,
        d1 : 8,
        a2 : 11,
        b2 : 2,
        c2 : 5,
        d2 : 4,
        a3 : 7,
        b3 : 1,
        a4 : 9,
        b4 : 3,
      }
      ,
      {
        a1 : 8, 
        b1 : 10,
        c1 : 9,
        d1 : 12,
        a2 : 11,
        b2 : 2,
        c2 : 5,
        d2 : 4,
        a3 : 7,
        b3 : 6,
        a4 : 3,
        b4 : 1,
      }
      ,
      {
        a1 : 7, 
        b1 : 10,
        c1 : 6,
        d1 : 12,
        a2 : 9,
        b2 : 2,
        c2 : 4,
        d2 : 3,
        a3 : 8,
        b3 : 5,
        a4 : 11,
        b4 : 1,
      }
      ,
      {
        a1 : 9, 
        b1 : 10,
        c1 : 6,
        d1 : 12,
        a2 : 11,
        b2 : 5,
        c2 : 4,
        d2 : 2,
        a3 : 7,
        b3 : 3,
        a4 : 8,
        b4 : 1,
      }
      ,
      {
        a1 : 9, 
        b1 : 10,
        c1 : 8,
        d1 : 12,
        a2 : 11,
        b2 : 4,
        c2 : 5,
        d2 : 2,
        a3 : 7,
        b3 : 3,
        a4 : 6,
        b4 : 1,
      }
      ,
      {
        a1 : 7, 
        b1 : 11,
        c1 : 10,
        d1 : 9,
        a2 : 12,
        b2 : 4,
        c2 : 5,
        d2 : 3,
        a3 : 2,
        b3 : 6,
        a4 : 8,
        b4 : 1,
      }
        ,
      {
        a1 : 8, 
        b1 : 10,
        c1 : 7,
        d1 : 11,
        a2 : 9,
        b2 : 2,
        c2 : 5,
        d2 : 1,
        a3 : 6,
        b3 : 4,
        a4 : 12,
        b4 : 3,
      }
      ,
      {
        a1 : 7, 
        b1 : 12,
        c1 : 10,
        d1 : 9,
        a2 : 11,
        b2 : 1,
        c2 : 2,
        d2 : 3,
        a3 : 6,
        b3 : 5,
        a4 : 8,
        b4 : 4,
      }
      ,
      {
        a1 : 8, 
        b1 : 12,
        c1 : 7,
        d1 : 9,
        a2 : 11,
        b2 : 4,
        c2 : 3,
        d2 : 1,
        a3 : 6,
        b3 : 2,
        a4 : 10,
        b4 : 5,
      }
      ,
      {
        a1 : 9, 
        b1 : 10,
        c1 : 7,
        d1 : 8,
        a2 : 12,
        b2 : 5,
        c2 : 4,
        d2 : 1,
        a3 : 11,
        b3 : 2,
        a4 : 6,
        b4 : 3,
      }
      ,
      {
        a1 : 11, 
        b1 : 7,
        c1 : 9,
        d1 : 8,
        a2 : 10,
        b2 : 1,
        c2 : 5,
        d2 : 4,
        a3 : 6,
        b3 : 3,
        a4 : 12,
        b4 : 2,
      }
      ,
      {
        a1 : 11, 
        b1 : 10,
        c1 : 5,
        d1 : 6,
        a2 : 9,
        b2 : 2,
        c2 : 4,
        d2 : 3,
        a3 : 8,
        b3 : 7,
        a4 : 12,
        b4 : 1,
      }
      ,
      {
        a1 : 11, 
        b1 : 10,
        c1 : 5,
        d1 : 6,
        a2 : 9,
        b2 : 2,
        c2 : 4,
        d2 : 3,
        a3 : 8,
        b3 : 7,
        a4 : 12,
        b4 : 1,
      }
      ,
      {
        a1 : 9, 
        b1 : 11,
        c1 : 5,
        d1 : 8,
        a2 : 12,
        b2 : 6,
        c2 : 3,
        d2 : 2,
        a3 : 7,
        b3 : 4,
        a4 : 10,
        b4 : 1,
      }
      ,
      {
        a1 : 11, 
        b1 : 7,
        c1 : 9,
        d1 : 8,
        a2 : 10,
        b2 : 1,
        c2 : 5,
        d2 : 4,
        a3 : 6,
        b3 : 3,
        a4 : 12,
        b4 : 1,
      }
      ,
      {
        a1 : 12, 
        b1 : 11,
        c1 : 8,
        d1 : 4,
        a2 : 10,
        b2 : 3,
        c2 : 5,
        d2 : 2,
        a3 : 9,
        b3 : 7,
        a4 : 6,
        b4 : 1,
      }
      ,
      {
        a1 : 9, 
        b1 : 11,
        c1 : 6,
        d1 : 12,
        a2 : 10,
        b2 : 3,
        c2 : 4,
        d2 : 2,
        a3 : 5,
        b3 : 7,
        a4 : 8,
        b4 : 1,
      }
    ];
    
    

    var n = Math.round(Math.random() * (19 - 0) + 0);
    
    if(ultimo != n){
        ultimo = n;
    }
    else{
        n = Math.round(Math.random() * (19 - 0) + 0);
    }
    
    arr = d[n];
  
}

var ultimo = 0;



// funcion que me carga aleatoriamente los 12 numeros del tablero
function numbers(){
    
    

    shuffle();
    /*
   rand4 = Math.round(Math.random() * (rand4 - 1) + 1);  
   
   //if pair
  
   
   if(rand4 % 2 != 0 && rand8 % 2 == 0){
       rand8++;
   }*/
   
    
    // imprimo los numeros en el dom
    $('.widget[position="a1"]').addClass('valid').attr('data-value', arr["a1"]).find('.value_input').val(arr["a1"]);
    $('.widget[position="b1"]').addClass('valid').attr('data-value', arr["b1"]).find('.value_input').val(arr["b1"]);
    $('.widget[position="c1"]').addClass('valid').attr('data-value', arr["c1"]).find('.value_input').val(arr["c1"]);
    $('.widget[position="d1"]').addClass('valid').attr('data-value', arr["d1"]).find('.value_input').val(arr["d1"]);
    $('.widget[position="a2"]').addClass('valid').attr('data-value', arr["a2"]).find('.value_input').val(arr["a2"]);
    $('.widget[position="b2"]').addClass('valid').attr('data-value', arr["b2"]).find('.value_input').val(arr["b2"]);
    $('.widget[position="c2"]').addClass('valid').attr('data-value', arr["c2"]).find('.value_input').val(arr["b2"]);
    $('.widget[position="d2"]').addClass('valid').attr('data-value', arr["d2"]).find('.value_input').val(arr["d2"]);
    $('.widget[position="a3"]').addClass('valid').attr('data-value', arr["a3"]).find('.value_input').val(arr["a3"]);
    $('.widget[position="b3"]').addClass('valid').attr('data-value', arr["b3"]).find('.value_input').val(arr["b3"]);
    $('.widget[position="a4"]').addClass('valid').attr('data-value', arr["a4"]).find('.value_input').val(arr["a4"]);
    $('.widget[position="b4"]').addClass('valid').attr('data-value', arr["b4"]).find('.value_input').val(arr["b4"]);
}

// funcion que carga aleatoriamente los operadores
function operators_load(){
    // var operators = [["sum", "subtraction"],["multiplication", "division"]];
    
    // hallo aleatoriamente los operadores
    var ope1 = "sum";
    var ope2 = "subtraction";
    var ope3 = "sum";
    var ope4 = "subtraction";
    var ope5 = "multiplication";
    var ope6 = "division";
    var ope7 = "multiplication";
    var ope8 = "division";
    
    // Guardo los operadores en un local storage
    var operators = [{
        ope1,
        ope2,
        ope3,
        ope4
    },{
        ope5,
        ope6,
        ope7,
        ope8
    }];
    
    localStorage.setItem('operators', JSON.stringify(operators));
    
    // pongo los operadores
    operator1.removeAttr('sum multiplication division subtraction').attr(ope1,'');
    operator2.removeAttr('sum multiplication division subtraction').attr(ope2,'');
    operator3.removeAttr('sum multiplication division subtraction').attr(ope3,'');
    operator4.removeAttr('sum multiplication division subtraction').attr(ope4,'');
    operator5.removeAttr('sum multiplication division subtraction').attr(ope5,'');
    operator6.removeAttr('sum multiplication division subtraction').attr(ope6,'');
    operator7.removeAttr('sum multiplication division subtraction').attr(ope7,'');
    operator8.removeAttr('sum multiplication division subtraction').attr(ope8,'');
    
}

// funcion que calcula el resultado final para los 8 cajones de los resultados
function sum_results(){
    // variables
    var a1 = parseInt(a_1.attr('data-value'));
    var b1 = parseInt(b_1.attr('data-value'));
    var c1 = parseInt(c_1.attr('data-value'));
    var d1 = parseInt(d_1.attr('data-value'));
    var a2 = parseInt(a_2.attr('data-value'));
    var b2 = parseInt(b_2.attr('data-value'));
    var c2 = parseInt(c_2.attr('data-value'));
    var d2 = parseInt(d_2.attr('data-value'));
    var a3 = parseInt(a_3.attr('data-value'));
    var b3 = parseInt(b_3.attr('data-value'));
    var a4 = parseInt(a_4.attr('data-value'));
    var b4 = parseInt(b_4.attr('data-value'));
    
    // hallo los operadores antes puestos
    var operators = JSON.parse(localStorage.getItem('operators'));
    
    // los cambios por sus operadores respectivos
    var op_1 = (operators[0].ope1 == "sum") ? "+" : "-";
    var op_2 = (operators[0].ope2 == "sum") ? "+" : "-";
    var op_3 = (operators[0].ope3 == "sum") ? "+" : "-";
    var op_4 = (operators[0].ope4 == "sum") ? "+" : "-";
    var op_5 = (operators[1].ope5 == "multiplication") ? "*" : "/";
    var op_6 = (operators[1].ope6 == "multiplication") ? "*" : "/";
    var op_7 = (operators[1].ope7 == "multiplication") ? "*" : "/";
    var op_8 = (operators[1].ope8 == "multiplication") ? "*" : "/";
    
    // calculo los resultados a evaluar
    var result_1 = a1 +op_1+ b1 +op_1+ c1 +op_1+ d1;
    var result_2 = a2 +op_2+ b2 +op_2+ c2 +op_2+ d2;
    var result_3 = a1 +op_3+ a2 +op_3+ a3 +op_3+ a4;
    var result_4 = b1 +op_4+ b2 +op_4+ b3 +op_4+ b4;
    var result_5 = a3 +op_5+ b3;
    var result_6 = a4 +op_6+ b4;
    var result_7 = c1 +op_7+ c2;
    var result_8 = d1 +op_8+ d2;
    
    // imprimo los resultados con eval() y toFixed() para limitar los decimales cuando es division
    r1.attr('data-value', (!isNaN(eval(result_1)) && eval(result_1).toString().indexOf('.') != -1) ? eval(result_1).toFixed(1) : eval(result_1));
    r2.attr('data-value', (!isNaN(eval(result_2)) && eval(result_2).toString().indexOf('.') != -1) ? eval(result_2).toFixed(1) : eval(result_2));
    r3.attr('data-value', (!isNaN(eval(result_3)) && eval(result_3).toString().indexOf('.') != -1) ? eval(result_3).toFixed(1) : eval(result_3));
    r4.attr('data-value', (!isNaN(eval(result_4)) && eval(result_4).toString().indexOf('.') != -1) ? eval(result_4).toFixed(1) : eval(result_4));
    r5.attr('data-value', (!isNaN(eval(result_5)) && eval(result_5).toString().indexOf('.') != -1) ? eval(result_5).toFixed(1) : eval(result_5));
    r6.attr('data-value', (!isNaN(eval(result_6)) && eval(result_6).toString().indexOf('.') != -1) ? eval(result_6).toFixed(1) : eval(result_6));
    r7.attr('data-value', (!isNaN(eval(result_7)) && eval(result_7).toString().indexOf('.') != -1) ? eval(result_7).toFixed(1) : eval(result_7));
    r8.attr('data-value', (!isNaN(eval(result_8)) && eval(result_8).toString().indexOf('.') != -1) ? eval(result_8).toFixed(1) : eval(result_8));
    
}

// Funcion que quita algunos de los numeros dependiendo del nivel escogido
function remove_numbers(){
    // obtengo la nivel seleccionado
    var level = localStorage.getItem('difficulty');
    
    var position = 0;
    var num = [];
    
    // posibles posiciones para el modo intermedio
    var positions_intermediate = [
        [0,1,3,4,5,6,8,11],
        [0,1,2,4,5,7,9,10],
        [1,2,3,4,6,7,9,10],
        [0,2,3,5,6,7,8,11],
        [0,1,2,3,8,9,10,11],
        [0,2,3,4,6,7,8,10],
        [0,1,2,4,5,7,8,11],
    ];
    
    // posibles posiciones para el modo principiante
    var positions_beginner = [
        [0,3,5,6,8,11],
        [1,3,4,6,9,10],
        [1,2,4,7,9,10],
        [0,6,7,9,10],
        [0,2,5,7,8,11],
    ];
    
    // si escoge jugador se borran todos los tableros
    if(level == "player"){
        $('.widget:not(.result)').removeClass('valid').attr('data-value', '').find('.value_input').val('');
    }else if(level == "intermediate"){
        position = Math.round(Math.random() * (positions_intermediate.length - 1));
        num = positions_intermediate[position];
        
        for(var i = 0; i < num.length; i++)
            $('.widget:not(.result)').eq(num[i]).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    }else{
        position = Math.round(Math.random() * (positions_beginner.length - 1));
        num = positions_beginner[position];
        
        for(var i = 0; i < num.length; i++)
            $('.widget:not(.result)').eq(num[i]).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    }
    
    var positions_widgets = [];
    
    // recorro todos los widgets para inactivar los que ya tienen valor
    $('.widget:not(.result) .value_input').each(function(i,e){
        
        var $e = $(e);
        if(isNaN(parseInt($e.val()))){
            // es por que n es un numero
        }else{
            // guardo los widgets que tienen algun valor
            var obj = {
                position: i,
                value: (parseInt($e.val()) == 0) ? 1 : $e.val()
            };
            $e.css('display', 'none'); // oculto el input para que no pueda cambiar al valor
            positions_widgets.push(obj); // añado los items al array para poder que se implemente el modo reiniciar
        }
    });
    
    // guardo las posiciones en un localstorage
    localStorage.setItem('position_widgets', JSON.stringify(positions_widgets));
}

// Funcion que resetea el juego
function restart_game(){
    var widgets_positions = JSON.parse(localStorage.getItem('position_widgets'));
    
    for(var i = 0; i < widgets_positions.length; i++)
        $('.widget[position]').eq(widgets_positions[i].position).addClass('valid').attr('data-value', widgets_positions[i].value).find('.value_input').val(widgets_positions[i].value);
}

// funcion que despliega mensajes con el toast de materialize
function message(text, duration){
    Materialize.toast(text, duration);
}