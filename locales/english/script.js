function close() {
    $.post('http://rcore_clothes/close', JSON.stringify({}));
    $('#saveOutfit').modal('hide');
    $('#paymentType').modal('hide');
}

function sendUpdate(comp, direction) {
    $.post('http://rcore_clothes/change', JSON.stringify({
        comp: comp,
        dir: direction
    }), function (data) {
        app.components = data.comp;
        app.price = data.price;
    });
}

function rotate(dir) {
    $.post('http://rcore_clothes/rotate', JSON.stringify({
        dir: dir
    }));
}

function payment(type) {
    if(!app.paid)
    {
        if(!app.saving)
        {
            $.post('http://rcore_clothes/buyClothes', JSON.stringify({type: "cash"}), function (data) {
                if(data.status) {
                    close();
                }
            });
        }
        else
        {
            $.post('http://rcore_clothes/buyClothes', JSON.stringify({type: "cash"}), function (data) {
                if(data.status) {
                    $('#saveOutfit').modal('show');
                }
            });
        }
    }
    else
    {
        if(!app.saving)
        {
            $.post('http://rcore_clothes/buyClothes', JSON.stringify({type: type}), function (data) {
                if(data.status) {
                    close();
                }
            });
        }else{
            $.post('http://rcore_clothes/buyClothes', JSON.stringify({type: type}), function (data) {
                if(data.status) {
                    $('#saveOutfit').modal('toggle');
                }
            });
        }
    }
}

function save() {
    $.post('http://rcore_clothes/save', JSON.stringify({
        label: $('#label').val()
    }), function (data) {
        if(data.status) {
            $('#saveOutfit').modal('hide');
            close()
        }
    });
}


var app = new Vue({
    el: '#app',
    paid: true,
    saving: true,
    data: {
        visible: false,
        components: [
        ],
        outfits: [
        ],
        price: 0,
        trans: {
            title: 'Clothes shop',
            buy: 'Buy clothes',
            getFree: 'Free',
            cancel: 'Cancel',
            rotate: 'Turn around',
            save: {
                title: 'Do you want save clothes?',
                desc: 'If you save your clothes your clothes will appear in your housing or motel rooms.',
                placeholder: 'My new clothes name',
                save: 'Save',
                dontSave: 'Dont save',
                saved: 'Your saved clothes',
                saved_desc: 'Using the same name / clicking on the saved clothes, you will overwrite your saved clothes with the currently purchased ones.'
            },
            payment: {
                title: 'Preferred payment method?',
                desc: 'How would you like to pay?',
                cash: 'Cash',
                card: 'Card',
            }
        }
    },
    methods: {
        dontSave: function () {
            $('#saveOutfit').modal('hide');
            close();
        },
        minus: function (comp, it) {
            if (comp.current <= comp.from) {
                comp.current = comp.to;
            } else {
                comp.current = comp.current - 1
            }
            comp.current = Number(comp.current);
            this.components[it] = comp
            sendUpdate(comp, 'left')
        },
        minusTen: function (comp, it) {
            if (comp.current-9 <= comp.from) {
                comp.current = comp.to;
            } else {
                comp.current = comp.current - 10
            }
            comp.current = Number(comp.current);
            this.components[it] = comp;
            sendUpdate(comp, 'left')
        },
        plus: function (comp, it) {
            if (comp.current >= comp.to) {
                comp.current = comp.from;
            } else {
                comp.current = comp.current + 1
            }
            comp.current = Number(comp.current);
            this.components[it] = comp;
            sendUpdate(comp, 'right')
        },
        plusTen: function (comp, it) {
            if (comp.current+9 >= comp.to) {
                comp.current = comp.from;
            } else {
                comp.current = comp.current + 10
            }
            comp.current = Number(comp.current);
            this.components[it] = comp;
            sendUpdate(comp, 'right')
        },
        change: function(comp, it){
            if (comp.current >= comp.to) {
                comp.current = comp.from;
            }
            if(comp.current < comp.from){
                comp.current = comp.from;
            }
            comp.current = Number(comp.current);
            this.components[it] = comp;
            sendUpdate(comp, 'right')
        },
        rightRotate: function () {
            rotate('right')
        },
        leftRotate: function () {
            rotate('left')
        },
        buy: function () {
            if(!this.paid){
                payment("cash");
                }else{
                $('#paymentType').modal('toggle');
            }
        },
        selectPayment: function (type) {
            $('#paymentType').modal('hide');
            payment(type)
        },
        close: function () {
            close()
        },
        save: function (){
            save()
        },
        selectOutfit: function(label){
            $('#label').val(label);
        }
    }
});

$(function () {
    //https://keycode.info/
    var closeKeys = [27];
    var rotationleft     = [65, 100, 37]; //A, N4, ARROW_LEFT
    var rotationright    = [68, 102, 39]; //D, N6, ARROW_RIGHT

    window.addEventListener("message", function (event) {
        var item = event.data;
        if (item.type === "ui") {
            if (item.state === true) {
                app.visible = true;
                app.components = item.value;
                app.outfits = item.outfits;
                app.paid = item.paid;
                app.saving = item.saving;
            } else {
                app.visible = false;
                $('#saveOutfit').modal('hide');
                $('#paymentType').modal('hide');
            }
        }
    });

    $(document.body).bind("keyup", function (key) {
        if (closeKeys.includes(key.which)) {
            app.visible = false
            close()
        } else if (rotationleft.includes(key.which)) {
            rotate('left')
        } else if (rotationright.includes(key.which)) {
            rotate('right')
        }
    });

});
