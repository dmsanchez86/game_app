'use strict';

// Carga de la página
window.onload = function(){
    
    // Inicio del Juego
    init();
        
    // hover del widget que pone el foco en el input
    $('.widget').unbind('mouseenter').mouseenter(function(e){
        var element = $(this);
        element.addClass("edit");
        
        element.find('.value_input').focus();
    });
    
    // cuando sale del hover
    $('.widget').unbind('mouseleave').mouseleave(function(e){
        var element = $(this);
        element.removeClass("edit");
        
        element.find('.value_input').blur();
    });
        
    // cuando este focus
    $('.widget').unbind('focus').focus(function(e){
        var element = $(this);
        element.addClass("edit");
    });
        
    // cuando pierda el foco
    $('.widget').unbind('blur').blur(function(e){
        var element = $(this);
        element.removeClass("edit");
    });
    
    // Evento cuando los input de los widgets obtinene el foco
    $('.value_input').unbind('focus').focus(function(){
        $(this).parent().parent().addClass('edit');
    });
    
    // Evento cuando los input de los widgets pierden el foco
    $('.value_input').unbind('blur').blur(function(){
        $(this).parent().parent().removeClass('edit');
        
        var value = $(this).val();
        
        $(this).parent().parent().attr('data-value', value);
    });
    
    // Evento que me limpia todos los campos
    $('#btn_restart').unbind('click').click(function(){
        $('.widget[position]').attr('data-value', '').find('.value_input').val('');
    });
    
    // Evento que valida el juego
    $('#btn_validate').unbind('click').click(function(){
        // Guardo todas las posiciones
        var a1 = $('.widget[position="a1"]');
        var b1 = $('.widget[position="b1"]');
        var c1 = $('.widget[position="c1"]');
        var d1 = $('.widget[position="d1"]');
        var a2 = $('.widget[position="a2"]');
        var b2 = $('.widget[position="b2"]');
        var c2 = $('.widget[position="c2"]');
        var d2 = $('.widget[position="d2"]');
        var a3 = $('.widget[position="a3"]');
        var b3 = $('.widget[position="b3"]');
        var a4 = $('.widget[position="a4"]');
        var b4 = $('.widget[position="b4"]');
        
        
    });
}

// Funcion que carga los resultados
function init(){
    // Funcion que me pone los resultados
    load_results();
}

function load_results(){
    // divs de los resultados
    var r1 = $('.widget.result[result="r1"]');
    var r2 = $('.widget.result[result="r2"]');
    var r3 = $('.widget.result[result="r3"]');
    var r4 = $('.widget.result[result="r4"]');
    
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
            
            number_results = data_results.length - 1;
            
            // Número aleatorio entre el tamaño del array de los resultados
            var randon_number = Math.round(Math.random() * number_results);
            
            // obtengo los resultados del array aleatoriamente
            var results = data_results[randon_number];
            
            console.log(randon_number);
            console.log(data_results);
            console.log(number_results);
            console.log(results);
            
            r1.attr('data-value', results.first_result);
            r2.attr('data-value', results.second_result);
            r3.attr('data-value', results.third_result);
            r4.attr('data-value', results.fourth_result);
            
            
            
        }
    });
}