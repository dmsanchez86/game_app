'use strict';

// divs de los resultados
var r1 = $('.widget.result[result="r1"]');
var r2 = $('.widget.result[result="r2"]');
var r3 = $('.widget.result[result="r3"]');
var r4 = $('.widget.result[result="r4"]');

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
        $('.operator').removeAttr('sum subtraction multiplication division');
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
        $('.operator').removeAttr('sum subtraction multiplication division');
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
    
    var data_results = {};
    var number_results = 0;
    
    // ajax que me trae los resultados
    $.ajax({
        url: "js/results.json",
        type: "POST",
        data: null,
        dataType: "json",
        asyn: false,
        success: function(response){
            data_results = response.data;
            
            // Guardo la informacion en un local storage para no volver a hacer el llamdo ajax
            localStorage.setItem('data_results', JSON.stringify(data_results));
            
            number_results = data_results.length - 1;
            
            // Número aleatorio entre el tamaño del array de los resultados
            var randon_number = Math.round(Math.random() * number_results);
            
            // obtengo los resultados del array aleatoriamente
            var results = data_results[randon_number];
            
            // Guardo el actual para validar cuando sea un nuevo juego
            localStorage.setItem('current_results', JSON.stringify(results));
            
            r1.attr('data-value', results.first_result);
            r2.attr('data-value', results.second_result);
            r3.attr('data-value', results.third_result);
            r4.attr('data-value', results.fourth_result);
            
        }
    });
}

// funcion que valida si el juego es correcto o incorrecto
function validate_game(){
    // Guardo todas las posiciones
    
    var a1 = parseInt($('.widget[position="a1"]').attr('data-value'));
    var b1 = parseInt($('.widget[position="b1"]').attr('data-value'));
    var c1 = parseInt($('.widget[position="c1"]').attr('data-value'));
    var d1 = parseInt($('.widget[position="d1"]').attr('data-value'));
    var a2 = parseInt($('.widget[position="a2"]').attr('data-value'));
    var b2 = parseInt($('.widget[position="b2"]').attr('data-value'));
    var c2 = parseInt($('.widget[position="c2"]').attr('data-value'));
    var d2 = parseInt($('.widget[position="d2"]').attr('data-value'));
    var a3 = parseInt($('.widget[position="a3"]').attr('data-value'));
    var b3 = parseInt($('.widget[position="b3"]').attr('data-value'));
    var a4 = parseInt($('.widget[position="a4"]').attr('data-value'));
    var b4 = parseInt($('.widget[position="b4"]').attr('data-value'));
    
    // valida si inserto numeros en todos los campos
    if(isNaN(a1) || isNaN(a2) || isNaN(a3) || isNaN(a4) || isNaN(b1) || isNaN(b2) || isNaN(b3) || isNaN(b4) || isNaN(c1) || isNaN(c2) || isNaN(d1) || isNaN(d2)){
        alert('Ingrese todos los números');
    }else{
        var result_1 = a1 + b1 + c1 + d1;
        var result_2 = a2 + b2 + c2 + d2;
        var result_3 = a1 + a2 + a3 + a4;
        var result_4 = b1 + b2 + b3 + b4;
        
        var res1 = parseInt(r1.attr('data-value'));
        var res2 = parseInt(r2.attr('data-value'));
        var res3 = parseInt(r3.attr('data-value'));
        var res4 = parseInt(r4.attr('data-value'));
        
        if(result_1 == res1 && result_2 == res2 && result_3 == res3 && result_4 == res4 )
            alert('¡GANASTE!');
        else
            alert('¡PERDISTE!');
            
        btn_new.click();
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
