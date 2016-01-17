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

    var line = {
        attributes: {},
        _binder: pubSub
    };
        
    var message = scope + uid + ':change';

    function defineProperty(obj, modleName) {
        Object.defineProperty(obj, modleName, {
            set: function(val) {
                this.attributes[modleName] = val;
                pubSub.trigger(message, [modleName, val]);
            },

            get: function() {
                return this.attributes[modleName] || '';
            }
        });
    }

    for (var i = 0, ii = props.length; i < ii; ++i) {
        defineProperty(line, props[i]);
    }

    pubSub.on(message, function(vet, attr_name, new_val) {
        line.attributes[attr_name] = new_val;
    });

    return line;
}