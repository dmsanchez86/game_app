'use strict';

// divs de los resultados
var r1 = $('.widget.result[result="r1"]');
var r2 = $('.widget.result[result="r2"]');
var r3 = $('.widget.result[result="r3"]');
var r4 = $('.widget.result[result="r4"]');

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
        $(this).parent().parent().addClass('edit');
    });
    
    // Evento cuando los input de los widgets pierden el foco
    $('.value_input').unbind('blur').blur(function(){
        
        var value = $(this).val();
        
        // Si no es un número o es mayor a 100 que ya tiene 3 cifras o si es menor que -99
        if(isNaN(value) || value > 99 || value < -99){
            $(this).parent().parent().attr('data-value', '');
            $(this).val('');
        }else {
            $(this).parent().parent().attr('data-value', value);
        }
        
        // le quito al widget la clase edit
        $(this).parent().parent().removeClass('edit');
        
    });
    
    // Evento que me limpia todos los campos
    $('#btn_restart').unbind('click').click(function(){
        $('.widget[position]').removeAttr('data-value').find('.value_input').val('');
        $('.operator').removeAttr('sum subtraction multiplication division');
    });
    
    // Evento que valida el juego
    $('#btn_validate').unbind('click').click(function(){
        validate_game();
    });
    
    // Evento que cambia el juego
    $('#btn_new').unbind('click').click(function(){
        $('.widget[position]').removeAttr('data-value').find('.value_input').val('');
        $('.operator').removeAttr('sum subtraction multiplication division');
        new_game();
    });
    
    // evento de los operadores
    $('.operator').unbind('click').click(function(){
        // borro todas los actives de los operadores
        $('.operator').removeClass('active');
        
        // Le añado la clase active al que se le da click
        $(this).addClass('active');
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
    // Funcion que me pone los resultados
    load_results();
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
    
    var a1 = $('.widget[position="a1"]').attr('data-value');
    var b1 = $('.widget[position="b1"]').attr('data-value');
    var c1 = $('.widget[position="c1"]').attr('data-value');
    var d1 = $('.widget[position="d1"]').attr('data-value');
    var a2 = $('.widget[position="a2"]').attr('data-value');
    var b2 = $('.widget[position="b2"]').attr('data-value');
    var c2 = $('.widget[position="c2"]').attr('data-value');
    var d2 = $('.widget[position="d2"]').attr('data-value');
    var a3 = $('.widget[position="a3"]').attr('data-value');
    var b3 = $('.widget[position="b3"]').attr('data-value');
    var a4 = $('.widget[position="a4"]').attr('data-value');
    var b4 = $('.widget[position="b4"]').attr('data-value');
    
    // valida si inserto numeros en todos los campos
    if(a1 == undefined || a2 == undefined || a3 == undefined || a4 == undefined || b1 == undefined || b2 == undefined || b3 == undefined || b4 == undefined || c1 == undefined || c2 == undefined || d1 == undefined || d2 == undefined){
        alert('Ingrese todos los números');
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
