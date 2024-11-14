let test = 1;
let i = 0;
function TestFunction () {
    for (i = 0; i < 1000000; i++) {
        switch (test) {
            case 1:
                test = 0;
                break;
            default:
                test = 1;
                break;
        }
        if (test == 1) test = 0;
        else test = 1;
    }
    console.log (i);
}


/*
        TestFonction(switch) *20 = 94.6 ms et 99.4 ms
        TestFonction(if else) *20 = 76.0 ms et 89.5 ms

*/
