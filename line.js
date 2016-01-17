function DataBinder(scope, object_id) {
    var pubSub = $({scope: scope});

    var data_attr = 'bind-' + object_id,
        message = scope + object_id + ':change';

    $('.' + scope).on('change keyup', '[data-' + data_attr + ']', function(evt) {
        var $input = $(this);

        pubSub.trigger(message, [$input.data(data_attr), $input.val()]);
    });

    pubSub.on(message, function(evt, prop_name, new_val) {
 
        $('.' + scope + ' [data-' + data_attr + '=' + prop_name + ']').each(function() {
            var $bound = $(this);

            if($bound.is('input')) {
                $bound.val(new_val);
            } else {
                $bound.html(new_val);
            }
        });
    });

    return pubSub;
}

function Line(scope, props) {
    var uid = 'modle';
    var pubSub = new DataBinder(scope, uid);
    var message = scope + uid + ':change';

    var line = {
        attributes: {},

        set: function(modleName, val) {
            this.attributes[modleName] = val;
            pubSub.trigger(message, [modleName, val]);
        },

        get: function(modleName) {
            return this.attributes[modleName] || '';
        },

        _binder: pubSub
    };

    pubSub.on(message, function(vet, attr_name, new_val) {
        line.attributes[attr_name] = new_val;
    });

    return line;
}