'use strict';

// divs de los resultados
var r1 = $('.widget.result[result="r1"]');
var r2 = $('.widget.result[result="r2"]');
var r3 = $('.widget.result[result="r3"]');
var r4 = $('.widget.result[result="r4"]');

// variables para los operadores
var operator1 = $('.operator[ope="1"]');
var operator2 = $('.operator[ope="2"]');
var operator3 = $('.operator[ope="3"]');
var operator4 = $('.operator[ope="4"]');

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

// Carga de la página
window.onload = function(){
    
    // Inicio del Juego
    init();
        
    // hover del widget que pone el foco en el input
    $('.widget:not(.result)').unbind('mouseenter').mouseenter(function(e){
        var element = $(this);
        element.addClass("edit");
        
        element.find('.value_input').focus();
    });
    
    // cuando sale del hover
    $('.widget:not(.result)').unbind('mouseleave').mouseleave(function(e){
        var element = $(this);
        element.removeClass("edit");
        
        element.find('.value_input').blur();
    });
        
    // cuando este focus el widget
    $('.widget:not(.result)').unbind('focus').focus(function(e){
        var element = $(this);
        element.addClass("edit");
    });
        
    // cuando pierda el foco el widget
    $('.widget:not(.result)').unbind('blur').blur(function(e){
        var element = $(this);
        element.removeClass("edit");
    });
    
    // Evento cuando los input de los widgets obtinene el foco
    $('.value_input').unbind('focus').focus(function(){
        $(this).parent().parent().addClass('edit').removeClass('valid');
    });
    
    // Evento cuando los input de los widgets pierden el foco
    $('.value_input').unbind('blur').blur(function(){
        
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
    
    // Evento que me limpia todos los campos
    $('#btn_restart').unbind('click').click(function(){
        $('.widget[position]').removeClass('valid').removeAttr('data-value').find('.value_input').val('');
        // $('.operator').removeAttr('sum subtraction multiplication division');
        restart_game();
        clearInterval(time_interval);
        time();
    });
    
    // Evento que valida el juego
    $('#btn_validate').unbind('click').click(function(){
        validate_game();
    });
    
    // Evento que cambia el juego
    $('#btn_new').unbind('click').click(function(){
        $('.widget[position]').removeClass('valid').removeAttr('data-value').find('.value_input').val('');
        // $('.operator').removeAttr('sum subtraction multiplication division');
        new_game();
        clearInterval(time_interval);
        time();
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
    
};

// Funcion que se llama al momento de que la página este cargada
function init(){
    // cargo un nombre si ya se ha seleccionado
    if(localStorage.getItem('name') != null){
        $('.container_results .name').text(localStorage.getItem('name'));
        
        // Funcion que me pone los resultados
        load_results();
        time();
    }else{
        // Pido el nombre al usuario
        var name = prompt("Ingrese el nombre del jugador","player__001");
        
        if(name == "" || name == undefined){
            location.reload();
            return;
        }else{
            // cargo el nombre del usuario
            $('.container_results .name').text(name);
            
            // Guardo el nombre en un local storage
            localStorage.setItem('name', name)
            
            // Funcion que me pone los resultados
            load_results();
            time();
        }
    }
}

// Funcion que carga los resultados
function load_results(){
    // funcion que carga los numeros aleatorios
    numbers();
    
    // funcion que carga los operadores aleatoriamente
    operators_load();
    
    // funcion que suma los valores dados por los numeros aleatorios
    sum_results();
    
    // funcion que remueve algunos numeros
    remove_numbers();
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
        alert('Ingrese todos los números');
    }else{
        // hallo los operadores antes puestos
        var operators = JSON.parse(localStorage.getItem('operators'));
        
        var op_1 = (operators.ope1 == "sum") ? "+" : "*";
        var op_2 = (operators.ope2 == "sum") ? "+" : "*";
        var op_3 = (operators.ope3 == "sum") ? "+" : "*";
        var op_4 = (operators.ope4 == "sum") ? "+" : "*";
        
        // evaluo las operaciones
        var result_1 = a1 +op_1+ b1 +op_1+ c1 +op_1+ d1;
        var result_2 = a2 +op_2+ b2 +op_2+ c2 +op_2+ d2;
        var result_3 = a1 +op_3+ a2 +op_3+ a3 +op_3+ a4;
        var result_4 = b1 +op_4+ b2 +op_4+ b3 +op_4+ b4;
        
        var res1 = parseInt(r1.attr('data-value'));
        var res2 = parseInt(r2.attr('data-value'));
        var res3 = parseInt(r3.attr('data-value'));
        var res4 = parseInt(r4.attr('data-value'));

        // si todos los resultados son correctos 
        if(eval(result_1) == res1 && eval(result_2) == res2 && eval(result_3) == res3 && eval(result_4) == res4 )
            alert('¡GANASTE!');
        else
            alert('¡PERDISTE!');
            
        // btn_new.click();
    }
    
}

// funcion que cambia el juego
function new_game(){
    // obtengo los resultados antes guardados
    var data_results = JSON.parse(localStorage.getItem('data_results'));
    
    // Obtengo el resultado actual para validar que no se repita
    var current_result = JSON.parse(localStorage.getItem('current_results'));
    
    // arreglo que quedara actualizado con los resultados sin el actual
    var results = [];
    
    // recorro los resultados y guardo los que no sean iguales al actual
    data_results.forEach(function(element,index){
        if(element.first_result != current_result.first_result || element.second_result != current_result.second_result || element.third_result != current_result.third_result || element.fourth_result != current_result.fourth_result){
            results.push(element);
        }
    });
    
    var number_results = results.length - 1;
            
    // Número aleatorio entre el tamaño del array de los resultados
    var randon_number = Math.round(Math.random() * number_results);
    
    // obtengo los resultados del array aleatoriamente
    var new_result = results[randon_number];
    
    // Guardo el actual para validar cuando sea un nuevo juego
    localStorage.setItem('current_results', JSON.stringify(new_result));
    
    r1.attr('data-value', new_result.first_result);
    r2.attr('data-value', new_result.second_result);
    r3.attr('data-value', new_result.third_result);
    r4.attr('data-value', new_result.fourth_result);
    
}

// funcion que hace correr el tiempo
function time(){
    var hours = 0;
    var minutes = 2;
    var seconds = 60;
    var string_time = "";
    time_interval = setInterval(function(){
        seconds--;
        
        if(seconds < 0){
            minutes--;
            
            if(minutes < 0){
                minutes = 0;
            }
            seconds = 59;
        }
        
        if(hours < 10){
            string_time = "0"+hours+':'+minutes+":"+seconds;
            if(minutes < 10){
                string_time = "0"+hours+':0'+minutes+":"+seconds;
                if(seconds < 10){
                    string_time = "0"+hours+':0'+minutes+":0"+seconds
                }
            }else{
                string_time = "0"+hours+':'+minutes+":"+seconds;
                if(seconds < 10){
                    string_time = "0"+hours+':'+minutes+":0"+seconds
                }
            }
        }
        
        $('.container_results .time').text(string_time);
    },1000);
}

// funcion que me carga aleatoriamente los 12 numeros del tablero
function numbers(){
    // hallo los numeros aleatorios
    var rand1 = Math.round(Math.random() * 9);
    var rand2 = Math.round(Math.random() * 9);
    var rand3 = Math.round(Math.random() * 9);
    var rand4 = Math.round(Math.random() * 9);
    var rand5 = Math.round(Math.random() * 9);
    var rand6 = Math.round(Math.random() * 9);
    var rand7 = Math.round(Math.random() * 9);
    var rand8 = Math.round(Math.random() * 9);
    var rand9 = Math.round(Math.random() * 9);
    var rand10 = Math.round(Math.random() * 9);
    var rand11 = Math.round(Math.random() * 9);
    var rand12 = Math.round(Math.random() * 9);
    
    // imprimo los numeros en el dom
    $('.widget[position="a1"]').addClass('valid').attr('data-value', rand1).find('.value_input').val(rand1);
    $('.widget[position="b1"]').addClass('valid').attr('data-value', rand2).find('.value_input').val(rand2);
    $('.widget[position="c1"]').addClass('valid').attr('data-value', rand3).find('.value_input').val(rand3);
    $('.widget[position="d1"]').addClass('valid').attr('data-value', rand4).find('.value_input').val(rand4);
    $('.widget[position="a2"]').addClass('valid').attr('data-value', rand5).find('.value_input').val(rand5);
    $('.widget[position="b2"]').addClass('valid').attr('data-value', rand6).find('.value_input').val(rand6);
    $('.widget[position="c2"]').addClass('valid').attr('data-value', rand7).find('.value_input').val(rand7);
    $('.widget[position="d2"]').addClass('valid').attr('data-value', rand8).find('.value_input').val(rand8);
    $('.widget[position="a3"]').addClass('valid').attr('data-value', rand9).find('.value_input').val(rand9);
    $('.widget[position="b3"]').addClass('valid').attr('data-value', rand10).find('.value_input').val(rand10);
    $('.widget[position="a4"]').addClass('valid').attr('data-value', rand11).find('.value_input').val(rand11);
    $('.widget[position="b4"]').addClass('valid').attr('data-value', rand12).find('.value_input').val(rand12);
}

// funcion que carga aleatoriamente los operadores
function operators_load(){
    var operators = ["sum", "multiplication"];
    
    var ope1 = operators[Math.round(Math.random() * (operators.length - 1))];
    var ope2 = operators[Math.round(Math.random() * (operators.length - 1))];
    var ope3 = operators[Math.round(Math.random() * (operators.length - 1))];
    var ope4 = operators[Math.round(Math.random() * (operators.length - 1))];
    
    // Guardo los operadores en un local storage
    var operators = {
        ope1,
        ope2,
        ope3,
        ope4
    };
    
    localStorage.setItem('operators', JSON.stringify(operators));
    
    operator1.attr(ope1,'');
    operator2.attr(ope2,'');
    operator3.attr(ope3,'');
    operator4.attr(ope4,'');
    
}

// funcion que calcula el resultado final para los 4 cajones
function sum_results(){
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
    
    var op_1 = (operators.ope1 == "sum") ? "+" : "*";
    var op_2 = (operators.ope2 == "sum") ? "+" : "*";
    var op_3 = (operators.ope3 == "sum") ? "+" : "*";
    var op_4 = (operators.ope4 == "sum") ? "+" : "*";
    
    var result_1 = a1 +op_1+ b1 +op_1+ c1 +op_1+ d1;
    var result_2 = a2 +op_2+ b2 +op_2+ c2 +op_2+ d2;
    var result_3 = a1 +op_3+ a2 +op_3+ a3 +op_3+ a4;
    var result_4 = b1 +op_4+ b2 +op_4+ b3 +op_4+ b4;
    
    r1.attr('data-value', eval(result_1));
    r2.attr('data-value', eval(result_2));
    r3.attr('data-value', eval(result_3));
    r4.attr('data-value', eval(result_4));
    
}

// Funcion que quita algunos de los numeros
function remove_numbers(){
    // hallo 8 numeros aleatorios
    var n1 = Math.round(Math.random() * 12);
    var n2 = Math.round(Math.random() * 12);
    var n3 = Math.round(Math.random() * 12);
    var n4 = Math.round(Math.random() * 12);
    var n5 = Math.round(Math.random() * 12);
    var n6 = Math.round(Math.random() * 12);
    var n7 = Math.round(Math.random() * 12);
    var n8 = Math.round(Math.random() * 12);
    var n9 = Math.round(Math.random() * 12);
    var n10 = Math.round(Math.random() * 12);
    var n11 = Math.round(Math.random() * 12);
    var n12 = Math.round(Math.random() * 12);
    
    $('.widget:not(.result)').eq(n1).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n2).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n3).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n4).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n5).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n6).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n7).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n8).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n9).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n10).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n11).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    $('.widget:not(.result)').eq(n12).removeClass('valid').attr('data-value', '').find('.value_input').val('');
    
    var positions_widgets = [];
    
    // recorro todos los widgets para inactivar los que ya tienen valor
    $('.widget:not(.result) .value_input').each(function(i,e){
        // debugger
        var $e = $(e);
        if(isNaN(parseInt($e.val()))){
            // es por que n es un numero
        }else{
            // guardo los widgets que tienen algun valor
            var obj = {
                position: i,
                value: $e.val()
            };
            $e.css('display', 'none');
            positions_widgets.push(obj);
        }
    });
    
    localStorage.setItem('position_widgets', JSON.stringify(positions_widgets));
    
    console.log(positions_widgets);
}

// Funcion que resetea el juego
function restart_game(){
    var widgets_positions = JSON.parse(localStorage.getItem('position_widgets'));
    
    for(var i = 0; i < widgets_positions.length; i++)
        $('.widget[position]').eq(widgets_positions[i].position).addClass('valid').attr('data-value', widgets_positions[i].value).find('.value_input').val(widgets_positions[i].value);
}