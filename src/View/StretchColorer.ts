export function getColorFromStretch(stretch : number) {
    let red = 0;
    let green = 0;
    let blue = 0;
    if(stretch >= 0) {
        red = piecewiseFnIncreasing(stretch);
        green = piecewiseFnDecreasing(stretch);
    } else {
        blue = piecewiseFnIncreasing(-stretch);
        green = piecewiseFnDecreasing(-stretch);
    }
    return getColorFromRGB(red, green, blue);

}

export function getColorFromRGB(r : number, g : number, b : number) {
    return 'rgb(' + r +',' + g + ',' + b + ')';
}

function piecewiseFnIncreasing(stretch : number) {
    if(stretch < 0.5) {
        return box(255*(2*stretch), 0, 255);
    } else  {
        return 255;
    }
}

function piecewiseFnDecreasing(stretch : number) {
    if(stretch < 0.5) {
        return 255;
    } else  {
        return box(255*(2*(1-stretch)), 0, 255);
    }
}


function box(x : number, min : number, max : number) : number {
    return Math.max(min, Math.min(max, x));
}