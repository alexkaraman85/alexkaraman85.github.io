define(function(require) {

    function subtractColorsHex(a, b) {
        a = a.replace('#', '');
        // We don't expect '#' symbol in b
        var decA = parseInt(a, 16);
        var decB = parseInt(b, 16);
        var resultDec = decA - decB;
        var resultHex = Math.abs(resultDec).toString(16);
        
        return "#" + "000000".substring(0, 6 - resultHex.length) + resultHex;
    }
    
    
    return {
        subtractColorsHex: subtractColorsHex
    }
});