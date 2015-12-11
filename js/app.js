// Carga de la página
window.onload = function(){
        
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
}