function DataBinder(scope, object_id) {
    var pubSub = $({scope: scope});

    var data_attr = 'bind-' + object_id,
        message = scope + object_id + ':change';

    $('.' + scope).on('change keyup', '[data-' + data_attr + ']', function(evt) {
        var $input = $(this);

        pubSub.trigger(message, [$input.data(data_attr), $input.val(), 'html']);
    });

    pubSub.on(message, function(evt, model_name, new_val, isFrom) {
        if(isFrom == 'html') return;
 
        $('.' + scope + ' [data-' + data_attr + '=' + model_name + ']').each(function() {
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
    var uid = 'model';
    var pubSub = new DataBinder(scope, uid);

    var line = {
        attributes: {},
        _binder: pubSub
    };
        
    var message = scope + uid + ':change';

    function defineProperty(obj, model_name) {
        Object.defineProperty(obj, model_name, {
            set: function(val) {
                this.attributes[model_name] = val;
                pubSub.trigger(message, [model_name, val]);
            },

            get: function() {
                return this.attributes[model_name] || '';
            }
        });
    }

    for (var i = 0, ii = props.length; i < ii; ++i) {
        defineProperty(line, props[i]);
    }

    pubSub.on(message, function(vet, model_name, new_val) {
        line.attributes[model_name] = new_val;
    });

    return line;
}