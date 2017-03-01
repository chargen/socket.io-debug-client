
// that's one brutally honest filename, eh

function prepareNewCommand (type, message) {
    $('[name=eventType]').val(type);
    $('[name=eventData]').val(message).trigger('keyup');
}

function executeNewCommand (type, message) {
    prepareNewCommand(type, message);
    $('form#emitter').trigger('submit');
}

function createPreparedCommandElement (title, type, message) {
    return $(`
        <div class="row preset-command" data-type="${type}" data-message='${message}'>
            <span class="preset-command-title">${title}</span>
            <a href="#" class="preset-command-button preset-command-prepare-button">P</a>
            <a href="#" class="preset-command-button preset-command-execute-button">E</a>
        </div>
    `);
}

var preparedRequest = [
    {
        scope: 'global',
        type: 'request-animator-status',
        message: {}
    },
    {
        scope: 'global',
        type: 'switch-phase',
        message: {phase:'entry'}
    },
    {
        scope: 'global',
        type: 'whoami',
        message: {}
    },
    {
        scope: 'global',
        type: 'get-teams',
        message: {}
    },
    {
        scope: 'global',
        type: 'get-team',
        message: {team:0}
    },
    {
        scope: 'global',
        type: 'get-endpoints',
        message: {}
    },
    {
        scope: 'entry',
        type: 'place-next-participant-in-team',
        message: {
            team: 2
        }
    },
    {
        scope: 'entry',
        type: 'request-participant-status',
        message: {
            nickname: 'Nickname',
            avatar: 'avatar'
        }
    },
    {
        scope: 'entry',
        type: 'validate-participant',
        message: {
            id: '',
            validated: true
        }
    }
];

function displayPreparedCommands (scope) {
    var container = $('.push-left');
    container.html('');

    for (var i = 0; i < preparedRequest.length; i++) {
        if (preparedRequest[i].scope === 'global' || (scope && preparedRequest[i].scope === scope)) {
            container.append(preparedRequest[i].element);
        }
    }
}

function customFilterEvents (event, data) {
    if (event === 'switch-phase' || event === 'current-phase') {
        var phase = data.phase;

        displayPreparedCommands(data.phase);
    }
}

$(function () {
    var container = $('.push-left');

    for (var i = 0; i < preparedRequest.length; i++) {
        preparedRequest[i].element = createPreparedCommandElement(
            preparedRequest[i].scope + '.' + preparedRequest[i].type,
            preparedRequest[i].type,
            JSON.stringify(preparedRequest[i].message)
        );
    }

    displayPreparedCommands(null);

    function operateOnPresetCommand (presetCommandElement, operation) {
        var type = presetCommandElement.attr('data-type'),
            message = presetCommandElement.attr('data-message');

        operation(type, message);
    }

    container.on('click', '.preset-command-prepare-button', function (e) {
        var presetCommand = $(e.currentTarget).parent('.preset-command');
        operateOnPresetCommand(presetCommand, prepareNewCommand);
    });

    container.on('click', '.preset-command-execute-button', function (e) {
        var presetCommand = $(e.currentTarget).parent('.preset-command');
        operateOnPresetCommand(presetCommand, executeNewCommand);
    });
});
