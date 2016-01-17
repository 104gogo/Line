function PubSub(scope, message) {
    var pubSub = $({scope: scope});

    pubSub.on(message, function(evt, o) {
        switch(o.type) {
            case 'keyupChange':
                pubSub.trigger('objChange', o);
                return;
            case 'objChange':
                pubSub.trigger('keyupChange', o);
                pubSub.trigger('objChange', o);
                return;
        }    
    });

    return pubSub;
}

function DataBinder(scope, object_id) {
    var data_attr = 'bind-' + object_id,
        message = scope + object_id + ':change';

    var pubSub = new PubSub(scope, message);

    $('.' + scope).on('change keyup', '[data-' + data_attr + ']', function(evt) {
        var $input = $(this);

        pubSub.trigger(message, {type: 'keyupChange', model_name: $input.data(data_attr), new_val: $input.val()});
    });

    pubSub.on('keyupChange', function(evt, o) {
        $('.' + scope + ' [data-' + data_attr + '=' + o.model_name + ']').each(function() {
            var $bound = $(this);

            if($bound.is('input,textarea')) {
                $bound.val(o.new_val);
            } else {
                $bound.html(o.new_val);
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
                pubSub.trigger(message, {type: 'objChange', model_name: model_name, new_val: val});
            },

            get: function() {
                return this.attributes[model_name] || '';
            }
        });
    }

    for (var i = 0, ii = props.length; i < ii; ++i) {
        defineProperty(line, props[i]);
    }

    pubSub.on('objChange', function(vet, o) {
        line.attributes[o.model_name] = o.new_val;
    });

    return line;
}